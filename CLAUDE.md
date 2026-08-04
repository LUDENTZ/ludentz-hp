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

## note実践ログ連携

- 実践ログ（トップKnowledge内＋/service/ad-operations-ax）はnoteのRSS由来の最新6件を表示する。対象は2アカウント: `marketing_ax`（表示ラベル: LUDENTZ）と `yyy_018`（小林・共同創業者）。アカウント追加時は `scripts/fetch-note-feed.mjs` の `FEEDS` と `src/components/PracticeLog.jsx` の `ACCOUNTS` を揃えて更新する
- `npm run build` の先頭で `scripts/fetch-note-feed.mjs` が全RSSを取得し `src/data/note-feed.json` を更新（片方失敗はそのアカウント分だけ既存維持、全失敗はスナップショット維持でビルドは通る。ローカルはネットワーク制限で失敗するのが正常）
- 自動反映: GitHub Actions（`.github/workflows/refresh-note-feed.yml`、6時間ごと）がRSSを取得し、記事に変化があれば `note-feed.json` をmainにpush → Vercelが自動デプロイ。手動で即時反映したいときはActionsの workflow_dispatch 実行か、mainへの空コミットでよい
- Vercel Cron（`/api/refresh-note`、毎日 21:00 UTC）は補助経路として残置。環境変数 `NOTE_DEPLOY_HOOK_URL` 未設定なら何もしない

## デザイン

- 新しいスタイルを発明せず、`src/styles/index.css` の既存トークン（`--paper` / `--ink-*` / `--font-ja-mincho` / `--font-mono` / `--border-subtle` 等）とコンポーネントを再利用する
- 写真はサイト標準のモノクロ処理 `filter: grayscale(100%) contrast(1.08)` を適用する
- 注意: `public/assets/person-k.png` は大平、`person-o.png` は小林（ファイル名と人物が逆）

## 運用

- 開発はfeatureブランチ → プレビュー確認 → ユーザー承認後に `main` へマージ（`main` へのpushが本番反映）
- `/service/*` はインデックス許可済み。noindexを再導入しないこと（vercel.jsonのヘッダーだけでなく、`src/main.jsx` 等でのクライアント側メタタグ注入も禁止。GooglebotはJSレンダリング後のDOMを見るため、JS注入のnoindexもインデックス除外の原因になる——2026年7月に実際に発生）
