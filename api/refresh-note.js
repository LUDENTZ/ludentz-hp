// Vercel Serverless Function — GET /api/refresh-note
// Vercel Cronから毎日呼ばれ、Deploy Hookを叩いて再デプロイをトリガーする。
// 再デプロイ時のビルドで scripts/fetch-note-feed.mjs がnoteのRSSを再取得するため、
// トップページの実践ログ一覧が1日1回自動更新される。
//
// Required env vars:
//   NOTE_DEPLOY_HOOK_URL — Vercelダッシュボード > Settings > Git > Deploy Hooks で作成したURL
// Optional:
//   CRON_SECRET — 設定するとVercel Cron以外からの呼び出しを拒否する（推奨）

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers['authorization'] !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const hook = process.env.NOTE_DEPLOY_HOOK_URL;
  if (!hook) {
    return res.status(200).json({ triggered: false, reason: 'NOTE_DEPLOY_HOOK_URL not set' });
  }

  const response = await fetch(hook, { method: 'POST' });
  return res.status(200).json({ triggered: response.ok });
}
