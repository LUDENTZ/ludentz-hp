const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

const dashboardUrl = process.env.DASHBOARD_DEMO_URL || 'http://127.0.0.1:3010';
const outputDir = path.resolve(__dirname, '../public/media/ad-operations-dashboard');

const adsRows = Array.from({ length: 30 }, (_, index) => {
  const date = new Date('2026-08-12T00:00:00+09:00');
  date.setDate(date.getDate() - index);
  const impressions = 118 + ((index * 37) % 210);
  const clicks = 5 + ((index * 7) % 18);
  const conversions = index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0;
  return {
    date: date.toISOString().slice(0, 10),
    platform: 'google',
    campaign_id: 'demo-campaign',
    campaign_name: '広告運用AX｜デモ',
    impressions,
    clicks,
    cost: clicks * (620 + ((index * 29) % 230)),
    conversions,
  };
});

const searchRows = [
  ['広告レポート 自動化', '広告運用 自動化', 186, 17, 12640, 2, 'KW追加候補', 'CV 2件。独立KW化の余地を確認'],
  ['google広告 レポート ツール', '広告レポート ツール', 142, 11, 8240, 1, 'KW追加候補', 'CV 1件。検索意図とLPの一致が高い'],
  ['広告代理店 求人', '広告運用 自動化', 38, 4, 2860, 0, '除外候補', '採用意図のためサービス対象外'],
  ['広告運用 ai エージェント', '広告運用 AI', 104, 8, 6940, 0, '訴求確認', '表示・クリックあり。広告文で実装範囲を明示'],
].map(([searchTerm, keywordText, impressions, clicks, cost, conversions, decision, reason]) => ({
  campaignId: 'demo-campaign', campaignName: '広告運用AX｜デモ', adGroupId: 'demo-ad-group',
  adGroupName: '広告運用AX支援', searchTerm, keywordText, matchType: 'PHRASE',
  impressions, clicks, cost, conversions, decision, reason,
}));

const overallInsight = {
  adGroupId: 'demo-ad-group',
  adGroupName: '広告運用AX支援',
  hasData: true,
  status: 'active',
  bottleneck: '高意図の検索語句を十分に拾えていない',
  evidence: '470表示 / 40クリック / CV 3件 / CTR 8.5%',
  bottleneckAction: 'CVが発生した検索意図に近いフレーズ一致KWを2語追加し、7日後に再評価します。',
  tendency: '反応語句：「広告レポート 自動化」「google広告 レポート ツール」。LPとの一致度：高い。',
  interpretation: '抽象的なAI活用より、レポート作成や広告運用の自動化という具体業務から課題を認識しています。',
  action: '広告文でもレポート自動化を入口にし、分析から改善実装まで一気通貫で支援することを明示します。',
  caution: 'デモデータ。実案件では期間と母数を確認して判断します。',
  landingPage: { finalUrl: 'https://ludentz.net/service/ad-operations-ax', offerName: '広告運用AX支援' },
  proposal: {
    proposalKey: 'demo:expand-keywords', actionType: 'push_keywords',
    summary: '成果につながるフレーズ一致KWを2語追加',
    rationale: 'CVが発生した検索意図に近い語へ限定し、小さく配信範囲を広げます。',
    items: [
      { keyword: '広告レポート 自動化', matchType: 'PHRASE' },
      { keyword: 'google広告 レポート ツール', matchType: 'PHRASE' },
    ],
  },
  pastDecisions: [],
};

const rsa = {
  adId: 'demo-rsa', status: 'ENABLED', primaryStatus: 'ELIGIBLE', approvalStatus: 'APPROVED', reviewStatus: 'REVIEWED',
  contentHash: 'demo-content-hash', finalUrls: ['https://ludentz.net/service/ad-operations-ax'],
  headlines: [
    '広告運用をAI前提に再設計', '広告レポート作成を自動化', '入稿・分析・改善をAIに', '広告運用の属人化を解消',
    'AIで広告運用工数を削減', '運用改善は人が最終承認', '広告データを施策へ変える', 'LUDENTZの広告運用AX',
  ].map((text) => ({ text })),
  descriptions: [
    '広告データの取得からレポート、分析、改善提案までを一つの業務システムとして構築します。',
    'Google広告・Meta広告の運用業務を分解し、AIと人の役割を再設計します。',
  ].map((text) => ({ text })),
};

async function fulfillJson(route, body, status = 200) {
  await route.fulfill({ status, contentType: 'application/json; charset=utf-8', body: JSON.stringify(body) });
}

async function moveCursor(page, locator, label) {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.evaluate(({ x, y, label }) => {
    const cursor = document.querySelector('#demo-cursor');
    const caption = document.querySelector('#demo-caption');
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    caption.textContent = label;
    caption.classList.add('show');
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2, label });
  await page.waitForTimeout(1200);
}

async function captureStill(page, name) {
  await page.screenshot({ path: path.join(outputDir, name), type: 'png' });
}

(async () => {
  await fs.mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: outputDir, size: { width: 1440, height: 900 } },
    extraHTTPHeaders: { Authorization: `Basic ${Buffer.from('demo:demo').toString('base64')}` },
  });
  const page = await context.newPage();

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === '/api/ads') return fulfillJson(route, {
      rows: adsRows,
      start: adsRows.at(-1).date,
      end: adsRows[0].date,
      latestDataDate: adsRows[0].date,
      syncedAt: '2026-08-13T00:10:00.000Z',
      syncStatus: 'normal', updatedAt: '2026-08-13T00:10:00.000Z',
    });
    if (url.pathname === '/api/insights/numeric') return fulfillJson(route, { persisted: true, insight: null });
    if (url.pathname === '/api/search-terms') return fulfillJson(route, {
      rows: searchRows, start: '2026-07-14', end: '2026-08-12', source: 'bigquery', overallInsights: [overallInsight],
    });
    if (url.pathname === '/api/insights/search-terms') return fulfillJson(route, { persisted: true });
    if (url.pathname === '/api/google-ads/rsas') return fulfillJson(route, { connected: true, ads: [rsa] });
    if (url.pathname === '/api/actions/latest') return fulfillJson(route, {});
    if (url.pathname.endsWith('/validate')) return fulfillJson(route, { valid: true });
    if (url.pathname.endsWith('/revise')) return fulfillJson(route, { proposal: { changes: [] } });
    if (url.pathname === '/api/insights/decisions') return fulfillJson(route, { actionId: 'demo-action', actionStatus: 'awaiting_confirmation' });
    if (/^\/api\/actions\/[^/]+\/execute$/.test(url.pathname)) {
      const post = request.postDataJSON();
      if (post.confirmation === 'UPDATE_RSA') return fulfillJson(route, {
        verification: {
          matched: true, expectedAssets: 13, matchedAssets: 13,
          missingHeadlines: [], missingDescriptions: [], unexpectedHeadlines: [], unexpectedDescriptions: [],
          primaryStatus: 'ELIGIBLE', reviewStatus: 'REVIEWED', approvalStatus: 'APPROVED',
          verifiedAt: '2026-08-13T00:12:00.000Z',
        },
      });
      return fulfillJson(route, { success: true });
    }
    return fulfillJson(route, {});
  });

  await page.goto(dashboardUrl, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `
    body { overflow-x: hidden; }
    nextjs-portal { display: none !important; }
    #demo-cursor { position: fixed; z-index: 99999; left: -13px; top: -13px; width: 26px; height: 26px; border-radius: 50%; background: rgba(36,107,253,.2); border: 2px solid #246bfd; pointer-events: none; transform: translate(-100px,-100px); transition: transform 1s cubic-bezier(.22,.75,.28,1); box-shadow: 0 5px 18px rgba(36,107,253,.28); }
    #demo-cursor::after { content:''; position:absolute; inset:7px; border-radius:50%; background:#246bfd; }
    #demo-caption { position: fixed; left: 32px; bottom: 28px; z-index: 99998; background:#111317; color:white; border-radius:10px; padding:12px 18px; font-size:16px; font-weight:700; opacity:0; transform:translateY(8px); transition:.35s; box-shadow:0 10px 30px rgba(0,0,0,.18); }
    #demo-caption.show { opacity:1; transform:none; }
  ` });
  await page.evaluate(() => {
    const cursor = document.createElement('div'); cursor.id = 'demo-cursor'; document.body.append(cursor);
    const caption = document.createElement('div'); caption.id = 'demo-caption'; document.body.append(caption);
  });

  await page.waitForTimeout(1800);
  await captureStill(page, 'poster.png');

  const searchTab = page.getByRole('button', { name: '検索語句' });
  await moveCursor(page, searchTab, '検索語句とLPを横断して分析');
  await searchTab.click();
  await page.waitForTimeout(1800);
  await captureStill(page, 'email-frame-01.png');

  const insightPanel = page.getByRole('heading', { name: 'LP別インサイト' });
  await insightPanel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await captureStill(page, 'email-frame-02.png');

  const adoptKeyword = page.locator('.proposal-box .decision-actions button').filter({ hasText: '採用' }).first();
  await moveCursor(page, adoptKeyword, 'AIの提案を人が承認');
  await adoptKeyword.click();
  await page.waitForTimeout(1200);

  const executeKeyword = page.getByRole('button', { name: /Google広告へ2語を追加/ });
  await moveCursor(page, executeKeyword, '承認した変更だけGoogle広告へ反映');
  await executeKeyword.click();
  await page.waitForTimeout(1700);
  await captureStill(page, 'email-frame-03.png');

  const rsaCard = page.locator('.rsa-improvement');
  await rsaCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const adoptRsa = rsaCard.locator('.decision-actions button').filter({ hasText: '採用' });
  await moveCursor(page, adoptRsa, '検索意図を広告文の改善案へ');
  await adoptRsa.click();
  await page.waitForTimeout(1100);

  const executeRsa = rsaCard.getByRole('button', { name: '変更セットを反映' });
  await moveCursor(page, executeRsa, '実行後はGoogle広告から再取得して照合');
  await executeRsa.click();
  await page.waitForTimeout(2400);
  await captureStill(page, 'email-frame-04.png');

  const video = page.video();
  await context.close();
  await browser.close();
  const recordedPath = await video.path();
  const finalVideoPath = path.join(outputDir, 'dashboard-demo.webm');
  await fs.rm(finalVideoPath, { force: true });
  await fs.rename(recordedPath, finalVideoPath);
  console.log(outputDir);
})();
