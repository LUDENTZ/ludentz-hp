import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import AxIntro from '../components/AxIntro';
import AxHeroLines from '../components/AxHeroLines';
import AxServiceModel from '../components/AxServiceModel';
import AxStack from '../components/AxStack';
import AxPricing from '../components/AxPricing';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const approachSteps = [
  {
    number: '01',
    title: '既存業務の棚卸し',
    body: 'すべての業務を工程レベルで洗い出し、工数・頻度・AI適性の観点でマッピング。どこに変革のインパクトがあるかを可視化します。',
  },
  {
    number: '02',
    title: '強みが活きる業務から、AI前提へ',
    body: '現場の強みが活き、かつインパクトの大きい業務から順に、AIエージェントを前提とした業務プロセスへ再設計・実装。人はレビューと承認に集中する体制へ移行します。',
  },
];

const categories = [
  {
    href: '/service/ad-operations-ax',
    number: '01',
    label: '広告運用AX',
    body: '提案資料・レポーティング・入稿・運用改善まで、広告運用の実務をAIエージェント化。人はレビューと承認に集中する。',
  },
  {
    href: '/service/prospecting-ax',
    number: '02',
    label: '新規開拓AX',
    body: 'リスト作成から文面生成、送信、返信対応まで。フォーム・メール・手紙・FAX・テレアポ（検証中）を自動で回し、人は商談に集中する。',
  },
  {
    href: '/service/publishing-ax',
    number: '03',
    label: '情報発信AX',
    body: '事例記事・オウンドメディア・社内報まで。素材を投げれば初稿まで自動で仕上がり、人は最終調整に集中する。',
  },
];

export default function AxConsultingPage() {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.body.dataset.lang = DEFAULTS.lang;
    document.body.classList.toggle('dark', DEFAULTS.theme === 'dark');
    document.body.classList.add('intensity-' + DEFAULTS.intensity);
  }, []);

  const scrollTo = (id) => {
    if (id === 'top') {
      window.location.href = '/';
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const openContact = (source) => {
    trackEvent('contact_click', {
      page_path: window.location.pathname,
      source,
    });
    setModal(true);
  };

  return (
    <div className="business-page">
      <Nav onContact={() => openContact('nav')} onScrollTo={scrollTo} />

      <main>
        <section className="business-hero" id="top">
          <AxHeroLines />
          <div className="business-hero-layout">
            <div className="business-hero-copy">
              <div className="business-hero-meta">
                <span>001</span>
                <span>Marketing AX</span>
                <span>AI × Marketing</span>
              </div>
              <h1 className="business-title business-title--long">
                <span className="nowrap">マーケの業務プロセスを、</span><span className="nowrap">AI前提に再設計。</span>
              </h1>
              <p className="business-lead">
                ツールの導入で終わらせません。既存業務を棚卸しし、現場の強みが活きる領域からAI前提の業務プロセスへ。組織に定着するまで、設計から実装まで伴走します。
              </p>
            </div>

            <aside className="business-hero-panel" aria-label="進め方">
              <span className="business-hero-panel-label">進め方は2ステップ</span>
              <ul className="business-hero-paths">
                {approachSteps.map((step) => (
                  <li className="business-hero-path" key={step.number}>
                    <span className="business-hero-path-num">{step.number}</span>
                    <div className="business-hero-path-body">
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <AxIntro />

        <AxServiceModel />

        <section className="business-band ax-categories">
          <div className="business-section-head">
            <p className="business-kicker">CATEGORIES</p>
            <h2>いま提供している、3つのAX。</h2>
            <p className="business-section-copy">マーケの獲得・営業・発信の実務から着手します。詳細は各ページをご覧ください。</p>
          </div>
          <div className="pillar-service-links ax-category-links" aria-label="Marketing AXのカテゴリ">
            {categories.map((category) => (
              <a className="pillar-service-link" href={category.href} key={category.href}>
                <span className="pillar-service-num">{category.number}</span>
                <span className="pillar-service-main">
                  <strong>{category.label}</strong>
                  <small>{category.body}</small>
                </span>
                <span className="pillar-service-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>

        <AxStack />

        <AxPricing />

        <CTA />
      </main>

      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
