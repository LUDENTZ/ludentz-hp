import App from './App';
import MarketingAxArticlePage from './pages/MarketingAxArticlePage';
import AdOperationsArticlePage from './pages/AdOperationsArticlePage';
import CostArticlePage from './pages/CostArticlePage';
import ComparisonArticlePage from './pages/ComparisonArticlePage';
import BusinessDevelopmentPage from './pages/BusinessDevelopmentPage';
import BusinessGrowthPage from './pages/BusinessGrowthPage';
import AxConsultingPage from './pages/AxConsultingPage';
import AdOperationsAxPage from './pages/AdOperationsAxPage';
import ProspectingAxPage from './pages/ProspectingAxPage';
import PublishingAxPage from './pages/PublishingAxPage';

export const SITE_URL = 'https://ludentz.net';

export const routes = [
  {
    path: '/',
    component: App,
    file: 'index.html',
    seo: {
      title: "LUDENTZ — Let's shape what's next",
      description:
        'LUDENTZは、東京を拠点とするスタジオです。新規事業開発・AXコンサルティング・自社事業の三つの軸で、先端を走ります。',
    },
  },
  {
    path: '/marketing-ax',
    component: MarketingAxArticlePage,
    file: 'marketing-ax/index.html',
    seo: {
      title:
        'マーケティングAXとは？DXとの違い・進め方・費用相場まで【定義と実践ガイド】 | LUDENTZ',
      description:
        'マーケティングAX（AIトランスフォーメーション）とは、マーケティング業務をAI前提に再設計する取り組み。DXとの違い、広告運用など領域別の進め方、3つの実装パターン、費用相場までを支援会社が解説します。',
      canonical: 'https://ludentz.net/marketing-ax/',
    },
    og: {
      kicker: 'KNOWLEDGE',
      lines: ['マーケティングAXとは？', 'DXとの違い・進め方・', '費用相場まで'],
    },
  },
  {
    path: '/marketing-ax/ad-operations',
    component: AdOperationsArticlePage,
    file: 'marketing-ax/ad-operations/index.html',
    seo: {
      title:
        '広告運用AXとは？運用型広告の業務をAI前提に再設計する方法【7領域の実装マップ付き】 | LUDENTZ',
      description:
        '広告運用AXとは、提案資料・入稿・レポーティング・運用改善など運用型広告の業務をAI前提に再設計する取り組み。媒体AI（P-MAX等）との違い、7領域の実装マップ、進め方、よくある失敗までを支援会社が解説します。',
    },
    og: {
      kicker: 'KNOWLEDGE',
      lines: ['広告運用AXとは？', '7領域の実装マップ付き'],
    },
  },
  {
    path: '/marketing-ax/cost',
    component: CostArticlePage,
    file: 'marketing-ax/cost/index.html',
    seo: {
      title:
        'マーケティングAX・広告運用のAI化にかかる費用相場は？支援タイプ別の料金と選び方 | LUDENTZ',
      description:
        'マーケティングAX・広告運用のAI化にかかる費用相場を解説。助言型は月20万円前後〜、伴走型は月50万〜200万円、ツール導入のみは月数万円〜。価格を決める4つの変数と費用対効果の考え方まで、料金を公開するLUDENTZが解説します。',
    },
    og: {
      kicker: 'KNOWLEDGE',
      lines: ['AX支援の費用相場は？', '支援タイプ別の料金と選び方'],
    },
  },
  {
    path: '/marketing-ax/comparison',
    component: ComparisonArticlePage,
    file: 'marketing-ax/comparison/index.html',
    seo: {
      title:
        '広告運用は内製と外注どっちがいい？AI時代の第三の選択肢「AX支援」まで徹底比較 | LUDENTZ',
      description:
        '広告運用の内製・外注それぞれのメリットとデメリットを整理し、AI時代の第三の選択肢「AX支援」まで徹底比較。コスト構造・ノウハウ蓄積・属人化リスクの比較表と、3つの問いでわかる選び方を解説します。',
    },
    og: {
      kicker: 'KNOWLEDGE',
      lines: ['内製 vs 外注 vs AX支援', '広告運用の選び方'],
    },
  },
  {
    path: '/service/business-development',
    component: BusinessDevelopmentPage,
    file: 'service/business-development/index.html',
    og: {
      kicker: 'SERVICE — 新規事業開発',
      lines: ['AIプロダクトで、', '次の柱をつくる。'],
    },
    seo: {
      title: '新規事業開発 — LUDENTZ',
      description:
        '中小企業の既存事業資産をもとに、AI × バーティカル（特定領域特化）の新規事業を設計・開発・検証。次の柱づくりを伴走します。',
    },
  },
  {
    path: '/service/business-growth',
    component: BusinessGrowthPage,
    file: 'service/business-growth/index.html',
    og: {
      kicker: 'SERVICE — 新規事業グロース支援',
      lines: ['立ち上がった事業を、', '成長の軌道へ。'],
    },
    seo: {
      title: '新規事業グロース支援 — LUDENTZ',
      description:
        '立ち上がった新規事業を、売上成長の軌道へ。GTM設計から営業・マーケの型づくりまで、再現性のある成長を伴走支援します。',
    },
  },
  {
    path: '/service/ax-consulting',
    component: AxConsultingPage,
    file: 'service/ax-consulting/index.html',
    og: {
      kicker: 'SERVICE — MARKETING AX',
      lines: ['マーケの業務プロセスを、', 'AI前提に再設計。'],
    },
    seo: {
      title: 'Marketing AX — LUDENTZ',
      description:
        'マーケの業務プロセスを、AI前提に再設計。広告運用・新規開拓・情報発信の実務をAIエージェント化し、現場に定着するまで設計から実装まで伴走します。',
    },
  },
  {
    path: '/service/ad-operations-ax',
    component: AdOperationsAxPage,
    file: 'service/ad-operations-ax/index.html',
    og: {
      kicker: 'MARKETING AX — 広告運用AX',
      lines: ['広告運用の実務を、', 'AIエージェントに。'],
    },
    seo: {
      title: '広告運用AX — LUDENTZ',
      description:
        '提案資料・レポーティング・入稿・運用改善まで、広告運用の実務を7領域でAIエージェント化。人はレビューと承認に集中できる体制へ変えていきます。',
    },
  },
  {
    path: '/service/prospecting-ax',
    component: ProspectingAxPage,
    file: 'service/prospecting-ax/index.html',
    og: {
      kicker: 'MARKETING AX — 新規開拓AX',
      lines: ['新規開拓を、', '止まらない仕組みに。'],
    },
    seo: {
      title: '新規開拓AX — LUDENTZ',
      description:
        'ターゲットリスト作成から文面生成、送信、返信対応まで。新規開拓を一本のパイプラインとして自動化し、人は商談に集中できる体制へ変えていきます。',
    },
  },
  {
    path: '/service/publishing-ax',
    component: PublishingAxPage,
    file: 'service/publishing-ax/index.html',
    og: {
      kicker: 'MARKETING AX — 情報発信AX',
      lines: ['発信を、', '続けられる体制に。'],
    },
    seo: {
      title: '情報発信AX — LUDENTZ',
      description:
        '事例記事・オウンドメディア・社内報まで。素材の集約から初稿生成、配信・多面展開までAIエージェント化し、続けられる発信体制をつくります。',
    },
  },
];

export function canonicalFor(route) {
  if (route.seo?.canonical) return route.seo.canonical;
  return route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
}

// og付きルートのOG画像パス。scripts/og-images.mjs が生成し、prerenderが<head>に差し込む
export function ogImagePathFor(route) {
  if (!route.og) return null;
  return `/assets/og/${route.path.slice(1).replace(/\//g, '-')}.png`;
}

export function findRoute(pathname = '/') {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return routes.find((route) => route.path === normalizedPath) ?? routes[0];
}
