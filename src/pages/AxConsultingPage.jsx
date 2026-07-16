import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import AxServiceModel from '../components/AxServiceModel';
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
    title: 'インパクトの高い業務からAI前提へ',
    body: '効果の大きい業務から順に、AIエージェントを前提とした業務プロセスへ再設計・実装。人はレビューと承認に集中する体制へ移行します。',
  },
];

const commonIssues = [
  {
    number: '01',
    title: '導入したツールが、現場の業務プロセスに組み込まれない。',
    body: '単発のツール導入で終わり、日々の仕事のやり方は変わらないまま。',
  },
  {
    number: '02',
    title: '何から着手すべきか、優先順位を判断できる人材が社内にいない。',
    body: 'AIに詳しい人材が不足し、投資対効果の見極めができず着手が遅れる。',
  },
  {
    number: '03',
    title: '個別業務の自動化で止まり、事業構造レベルの変革に至らない。',
    body: '部署単位の部分最適にとどまり、全社的な競争力の底上げにつながらない。',
  },
];

const categories = [
  {
    href: '/service/ad-operations-ax',
    number: '01',
    label: '広告運用AX',
    body: '提案資料・レポーティング・入稿・運用改善まで、広告運用の実務を8領域で自動化する。',
  },
  {
    href: '/service/prospecting-ax',
    number: '02',
    label: '新規開拓AX',
    body: 'リスト作成から文面生成、送信、返信対応まで。フォーム・メール・手紙・FAX・テレアポ（検証中）を自動で回す。',
  },
  {
    href: '/service/publishing-ax',
    number: '03',
    label: '情報発信AX',
    body: '事例記事・オウンドメディア・社内報まで。素材を投げれば初稿まで自動で仕上がる発信体制をつくる。',
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
                ツールの導入で終わらせません。既存業務を棚卸しし、インパクトの大きい領域からAI前提の業務プロセスへ。組織に定着するまで、設計から実装まで伴走します。
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

        <section className="business-band ax-issues">
          <div className="business-section-head">
            <p className="business-kicker">はじめに</p>
            <h2>AIは、ツールを入れただけでは定着しない。</h2>
            <p className="business-section-copy">多くの企業で、AI活用は部署ごとの単発導入にとどまり、事業の成果につながっていません。全社共通の課題として、ほぼ同じ壁に突き当たります。</p>
          </div>
          <div className="business-issue-grid">
            {commonIssues.map((issue) => (
              <article key={issue.number}>
                <span>{issue.number}</span>
                <h3>{issue.title}</h3>
                <p>{issue.body}</p>
              </article>
            ))}
          </div>
        </section>

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

        <section className="business-band ax-principle">
          <div className="business-section-head">
            <p className="business-kicker">DESIGN PRINCIPLE</p>
            <h2>AIと業務の間に、自社システムを挟まない。</h2>
            <p className="business-section-copy">「手元のAIの直接利用」と「純正機能での自動化」を設計の中心に置きます。作り込むほど、システムはむしろ脆くなります。</p>
          </div>
          <div className="ax-principle-compare">
            <article className="ax-principle-card ax-principle-card--good">
              <span className="ax-principle-mark" aria-hidden="true">○</span>
              <h3>手元のAIで、そのまま完結させる</h3>
              <p>AIが広告APIから直接データを取得し、異常検知・コメント生成・Slack配信まで実行。<strong>作り込みはゼロ</strong>。モデルが賢くなるほど、示唆の質は勝手に上がります。</p>
            </article>
            <article className="ax-principle-card ax-principle-card--bad">
              <span className="ax-principle-mark" aria-hidden="true">×</span>
              <h3>「AIレポートSaaS」を自社開発する</h3>
              <p>ダッシュボードを作り、裏で各媒体のスクレイピング・集計・LLMのパイプラインを組んで保守し続ける。<strong>出てくるレポートは同じ</strong>なのに、開発費・保守費・改修待ちを抱え込むだけです。</p>
            </article>
          </div>
          <p className="ax-principle-caption">同じ「週次レポートが届く」という価値の比較です。自社レイヤーを1枚挟むほど、システムは逆に脆くなります。</p>
          <p className="ax-principle-statement">自社システムを挟んだ瞬間、会社のAI能力の上限が「自社システムの保守速度」に律速される。</p>
          <div className="ax-principle-exception">
            <span>例外 — 薄く挟むべきレイヤー</span>
            <p>統制・決定性・独自データが要るところだけ、薄く挟みます。挟むのは「純正機能の再実装」ではなく、<strong>AIに任せきれない判断</strong>（権限・承認・監査、数値の決定的な検証）だけ。<strong>再実装は挟まず、統制と決定性は挟む</strong>——これがLUDENTZの線引きです。</p>
          </div>
        </section>

        <AxPricing />

        <CTA />
      </main>

      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
