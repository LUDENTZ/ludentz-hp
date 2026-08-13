import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '..');
const distDir = path.join(rootDir, 'dist');
const serverEntry = path.join(distDir, 'server', 'entry-server.js');

const { render, routes, canonicalFor, ogImagePathFor, SITE_URL } = await import(
  pathToFileURL(serverEntry).href
);
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
  const ogTitle = route.og?.title || title;
  const ogDescription = route.og?.description || description;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const ot = escapeHtml(ogTitle);
  const od = escapeHtml(ogDescription);
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
      `<meta property="og:title" content="${ot}" />`
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?" \/>/,
      `<meta property="og:description" content="${od}" />`
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
      `<meta name="twitter:title" content="${ot}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[\s\S]*?" \/>/,
      `<meta name="twitter:description" content="${od}" />`
    )
    .replace(
      /<meta name="twitter:image:alt" content="[\s\S]*?" \/>/,
      `<meta name="twitter:image:alt" content="${t}" />`
    );
}

// og設定を持つルートはページ固有のOG画像（scripts/og-images.mjsで生成・コミット済み）に差し替える
function applyOgImage(html, route) {
  const ogPath = ogImagePathFor(route);
  if (!ogPath) return html;
  const url = `${SITE_URL}${ogPath}`;
  return html
    .replace(
      /<meta property="og:image" content="[\s\S]*?" \/>/,
      `<meta property="og:image" content="${url}" />`
    )
    .replace(
      /<meta name="twitter:image" content="[\s\S]*?" \/>/,
      `<meta name="twitter:image" content="${url}" />`
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
    html = applyOgImage(html, route);
    const outputPath = path.join(distDir, route.file);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html);
  })
);

// sitemap.xml — 全ルートのcanonical URLを列挙する
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${canonicalFor(route)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;
await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
