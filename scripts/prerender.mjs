import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '..');
const distDir = path.join(rootDir, 'dist');
const serverEntry = path.join(distDir, 'server', 'entry-server.js');

const { render, routes, canonicalFor } = await import(pathToFileURL(serverEntry).href);
const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Rewrite the per-page <head> tags (title, description, canonical, OG, Twitter)
// so search engines and crawlers see each route as a distinct document rather
// than a duplicate of the homepage.
function applySeo(html, route) {
  const { title, description } = route.seo;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const url = escapeHtml(canonicalFor(route));

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(
      /<meta name="description" content="[\s\S]*?" \/>/,
      `<meta name="description" content="${d}" />`
    )
    .replace(
      /<link rel="canonical" href="[\s\S]*?" \/>/,
      `<link rel="canonical" href="${url}" />`
    )
    .replace(
      /<meta property="og:title" content="[\s\S]*?" \/>/,
      `<meta property="og:title" content="${t}" />`
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?" \/>/,
      `<meta property="og:description" content="${d}" />`
    )
    .replace(
      /<meta property="og:url" content="[\s\S]*?" \/>/,
      `<meta property="og:url" content="${url}" />`
    )
    .replace(
      /<meta property="og:image:alt" content="[\s\S]*?" \/>/,
      `<meta property="og:image:alt" content="${t}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[\s\S]*?" \/>/,
      `<meta name="twitter:title" content="${t}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[\s\S]*?" \/>/,
      `<meta name="twitter:description" content="${d}" />`
    )
    .replace(
      /<meta name="twitter:image:alt" content="[\s\S]*?" \/>/,
      `<meta name="twitter:image:alt" content="${t}" />`
    );
}

await Promise.all(
  routes.map(async (route) => {
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${render(route.path)}</div>`
    );
    if (route.seo) {
      html = applySeo(html, route);
    }
    const outputPath = path.join(distDir, route.file);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html);
  })
);
