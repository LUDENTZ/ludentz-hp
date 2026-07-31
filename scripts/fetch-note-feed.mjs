// noteのRSSを取得して src/data/note-feed.json に保存する（ビルドの先頭で実行）
//
// - 取得成功: 最新6件を上書き保存（Knowledgeセクションが静的HTMLとして描画する）
// - 取得失敗: 既存のスナップショットを保持し、ビルドは失敗させない
//   （ローカル環境ではネットワーク制限で失敗することがあるが、Vercelビルドでは取得できる）
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(dirname, '..', 'src', 'data', 'note-feed.json');

const FEED_URL = 'https://note.com/marketing_ax/rss';
const MAX_ITEMS = 6;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

const stripCdata = (value) =>
  value
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

try {
  const res = await fetch(FEED_URL, {
    headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, MAX_ITEMS)
    .map((match) => {
      const block = match[1];
      const pick = (tag) => {
        const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
        return m ? stripCdata(m[1]) : '';
      };
      const thumbnail =
        block.match(/<media:thumbnail[^>]*>([\s\S]*?)<\/media:thumbnail>/)?.[1]?.trim() ||
        block.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ||
        null;
      const pubDate = pick('pubDate');
      return {
        title: pick('title'),
        url: pick('link'),
        date: pubDate ? new Date(pubDate).toISOString().slice(0, 10) : null,
        thumbnail,
      };
    })
    .filter((item) => item.title && item.url);

  if (items.length === 0) throw new Error('no items parsed');

  await fs.writeFile(
    outFile,
    JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2) + '\n'
  );
  console.log(`note-feed: ${items.length} items saved`);
} catch (error) {
  console.warn(`note-feed: fetch failed (${error.message}) — keeping existing snapshot`);
}
