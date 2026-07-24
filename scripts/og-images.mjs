// OG画像ジェネレーター
//
// routes.jsx の og 設定（kicker + lines）からデザイントークン準拠の
// 1200×630カードをChromiumでレンダリングし、public/assets/og/ にPNGを書き出す。
// 生成物はコミットする運用（Vercelビルドではこのスクリプトは走らない）。
//
// 使い方:
//   npm run build   （先にdist/server/entry-server.jsが必要）
//   npm run og
//   生成されたPNGを確認してコミット
//
// Chromiumの場所は環境変数 OG_CHROMIUM で上書き可能。
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '..');
const serverEntry = path.join(rootDir, 'dist', 'server', 'entry-server.js');
const outDir = path.join(rootDir, 'public', 'assets', 'og');

const CHROMIUM =
  process.env.OG_CHROMIUM || '/opt/pw-browsers/chromium';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

const { routes, ogImagePathFor } = await import(pathToFileURL(serverEntry).href);
const targets = routes.filter((route) => route.og);
if (targets.length === 0) {
  console.log('og-images: no routes with og config, nothing to do');
  process.exit(0);
}

// ── Google Fontsを使用グリフだけ取得してdata URIで埋め込む ──
const glyphs = new Set(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,—–-·/?！？。、'
);
for (const route of targets) {
  if (route.og.svgSource) continue;
  for (const c of route.og.kicker + route.og.lines.join('')) glyphs.add(c);
}
const text = [...glyphs].join('');

async function fetchText(url, binary = false) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
}

const families = {
  mincho: 'Zen+Old+Mincho:wght@700;900',
  mono: 'JetBrains+Mono:wght@400;500',
  display: 'Red+Hat+Display:ital,wght@1,900',
};
let fontCss = '';
for (const family of Object.values(families)) {
  let css = await fetchText(
    `https://fonts.googleapis.com/css2?family=${family}&display=swap&text=${encodeURIComponent(text)}`
  );
  const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map((m) => m[1]))];
  for (const url of urls) {
    const buf = await fetchText(url, true);
    const format = url.endsWith('.woff2') ? 'woff2' : 'truetype';
    css = css.split(`url(${url})`).join(`url(data:font/${format};base64,${buf.toString('base64')})`);
  }
  fontCss += css + '\n';
}

// ── カードHTML（サイトのトークン: paper #FAFAF8 / ink #0A0A0A / mincho / mono） ──
function cardHtml(og) {
  const lines = og.lines
    .map((line) => `<span>${line}</span>`)
    .join('');
  return `<!doctype html><meta charset="utf-8">
<style>
${fontCss}
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #FAFAF8; }
.card {
  width: 100%;
  height: 100%;
  padding: 26px;
}
.frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #0A0A0A;
  padding: 56px 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  letter-spacing: 0.14em;
  color: #5C5C58;
}
.title {
  display: grid;
  gap: 6px;
  font-family: 'Zen Old Mincho', serif;
  font-weight: 900;
  font-size: 76px;
  line-height: 1.28;
  letter-spacing: 0.01em;
  color: #0A0A0A;
}
.foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.wordmark {
  font-family: 'Red Hat Display', sans-serif;
  font-style: italic;
  font-weight: 900;
  font-size: 40px;
  letter-spacing: 0.01em;
  color: #0A0A0A;
}
.url {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  letter-spacing: 0.1em;
  color: #5C5C58;
}
</style>
<div class="card">
  <div class="frame">
    <div class="kicker">${og.kicker}</div>
    <div class="title">${lines}</div>
    <div class="foot">
      <span class="wordmark">LUDENTZ</span>
      <span class="url">ludentz.net</span>
    </div>
  </div>
</div>`;
}

// og.svgSource 指定ルートは、テキストカードの代わりにそのSVGを1200×630に敷いてPNG化する
async function svgHtml(svgPath) {
  const svg = await fs.readFile(path.join(rootDir, svgPath));
  const dataUri = `data:image/svg+xml;base64,${svg.toString('base64')}`;
  return `<!doctype html><meta charset="utf-8">
<style>* { margin: 0; } body { width: 1200px; height: 630px; background: #FAFAF8; display: grid; place-items: center; }
img { max-width: 100%; max-height: 100%; }</style>
<img src="${dataUri}" height="630">`;
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROMIUM });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const route of targets) {
  const html = route.og.svgSource ? await svgHtml(route.og.svgSource) : cardHtml(route.og);
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(rootDir, 'public', ogImagePathFor(route).slice(1));
  await page.screenshot({ path: file });
  console.log('og-images:', path.relative(rootDir, file));
}
await browser.close();
