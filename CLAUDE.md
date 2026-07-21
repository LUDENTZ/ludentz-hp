# LUDENTZ サイト (ludentz.net)

React 18 + Vite 6。SSRプレレンダリングで全ルートを静的HTML化し、Vercelが `main` を自動デプロイする。

## ビルド

- `npm run build` — vite build → SSRバンドル → `scripts/prerender.mjs`（ページ本体・ページ固有`<head>`・sitemap.xml を生成）
- `npm run og` — `scripts/og-images.mjs` でOG画像を生成（要ビルド済み `dist/server/`。Chromiumパスは環境変数 `OG_CHROMIUM`、既定 `/opt/pw-browsers/chromium`）

## ページ追加・改題時のルール（必須）

1. `src/routes.jsx` にルートを追加する。必ず以下を揃える：
   - `path` / `component` / `file`
   - `seo: { title, description }` — ページ固有にする。canonicalを既定（`SITE_URL + path`）から変える場合のみ `seo.canonical` を指定
   - `og: { kicker, lines }` — OG画像カードの表示テキスト。`lines` は表示用の短い見出し（SEO titleより短くてよい）
2. **`npm run build && npm run og` を実行し、生成された `public/assets/og/*.png` をコミットする。** OG画像は生成物をコミットする運用（Vercelビルドではブラウザが使えないため、ビルド時生成はしない）
3. `npm run build` をもう一度実行し、`dist/<page>/index.html` の title / canonical / description / og:image がページ固有になっていることを確認する
4. sitemap.xml はprerenderが `routes` から自動生成するので手作業不要

タイトルや `og.lines` を変更したときも `npm run og` の再実行とPNGの再コミットが必要。

## デザイン

- 新しいスタイルを発明せず、`src/styles/index.css` の既存トークン（`--paper` / `--ink-*` / `--font-ja-mincho` / `--font-mono` / `--border-subtle` 等）とコンポーネントを再利用する
- 写真はサイト標準のモノクロ処理 `filter: grayscale(100%) contrast(1.08)` を適用する
- 注意: `public/assets/person-k.png` は大平、`person-o.png` は小林（ファイル名と人物が逆）

## 運用

- 開発はfeatureブランチ → プレビュー確認 → ユーザー承認後に `main` へマージ（`main` へのpushが本番反映）
- `/service/*` はインデックス許可済み。vercel.json にnoindexを再導入しないこと
