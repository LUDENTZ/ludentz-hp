// noteのRSSを取得して src/data/note-feed.json に保存する（ビルドの先頭で実行）
//
// - 複数アカウント対応: 各フィードの取得結果に account を付けてマージし、日付降順で最新6件を保存
// - あるフィードだけ取得失敗: そのアカウント分は既存スナップショットの記事を保持
// - 全フィード取得失敗: スナップショットを丸ごと保持し、ビルドは失敗させない
//   （ローカル環境ではネットワーク制限で失敗することがあるが、Vercelビルド・GitHub Actionsでは取得できる）
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(dirname, '..', 'src', 'data', 'note-feed.json');

const FEEDS = [
  { account: 'marketing_ax', rss: 'https://note.com/marketing_ax/rss' },
  { account: 'yyy_018', rss: 'https://note.com/yyy_018/rss' },
];
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

const fetchFeed = async ({ account, rss }) => {
  const res = await fetch(rss, {
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
        account,
        title: pick('title'),
        url: pick('link'),
        date: pubDate ? new Date(pubDate).toISOString().slice(0, 10) : null,
        thumbnail,
      };
    })
    .filter((item) => item.title && item.url);

  if (items.length === 0) throw new Error('no items parsed');
  return items;
};

let existing = { items: [] };
try {
  existing = JSON.parse(await fs.readFile(outFile, 'utf8'));
} catch {
  // スナップショットが無ければ空から始める
}
// 旧形式（accountなし）のスナップショットは marketing_ax として扱う
const existingItems = (existing.items || []).map((item) => ({
  account: 'marketing_ax',
  ...item,
}));

let fetchedAny = false;
const merged = [];
for (const feed of FEEDS) {
  try {
    const items = await fetchFeed(feed);
    merged.push(...items);
    fetchedAny = true;
    console.log(`note-feed: ${feed.account} ${items.length} items fetched`);
  } catch (error) {
    const kept = existingItems.filter((item) => item.account === feed.account);
    merged.push(...kept);
    console.warn(
      `note-feed: ${feed.account} fetch failed (${error.message}) — keeping ${kept.length} snapshot items`
    );
  }
}

if (!fetchedAny || merged.length === 0) {
  console.warn('note-feed: nothing fetched — keeping existing snapshot');
} else {
  const items = merged
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, MAX_ITEMS);
  // 記事に変化がなければ書き換えない（GitHub Actionsの定期実行で空コミットが生まれないように）
  if (JSON.stringify(items) === JSON.stringify(existing.items || [])) {
    console.log('note-feed: no changes');
  } else {
    await fs.writeFile(
      outFile,
      JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2) + '\n'
    );
    console.log(`note-feed: ${items.length} items saved`);
  }
}
