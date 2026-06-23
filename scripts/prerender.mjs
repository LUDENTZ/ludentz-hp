import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '..');
const distDir = path.join(rootDir, 'dist');
const serverEntry = path.join(distDir, 'server', 'entry-server.js');

const { render, routes } = await import(pathToFileURL(serverEntry).href);
const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

await Promise.all(
  routes.map(async (route) => {
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${render(route.path)}</div>`
    );
    const outputPath = path.join(distDir, route.file);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html);
  })
);
