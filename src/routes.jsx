import App from './App';
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
    path: '/service/business-development',
    component: BusinessDevelopmentPage,
    file: 'service/business-development/index.html',
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
    seo: {
      title: '情報発信AX — LUDENTZ',
      description:
        '事例記事・オウンドメディア・社内報まで。素材の集約から初稿生成、配信・多面展開までAIエージェント化し、続けられる発信体制をつくります。',
    },
  },
];

export function canonicalFor(route) {
  return route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
}

export function findRoute(pathname = '/') {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return routes.find((route) => route.path === normalizedPath) ?? routes[0];
}
