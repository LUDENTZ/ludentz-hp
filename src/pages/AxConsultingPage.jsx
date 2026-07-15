import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
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

const plans = [
  {
    name: '助言のみ',
    label: 'ADVISORY',
    price: '月20万円〜',
    body: 'AI活用方針の助言・壁打ちを中心としたプラン（実働なし）。',
  },
  {
    name: '伴走支援',
    label: 'HANDS-ON',
    price: '月50万円〜200万円',
    body: '週次MTGと実行支援。支援範囲は内容に応じて調整します。',
  },
];

const marketingUseCases = [
  { number: '01', title: '営業提案資料', before: '約6〜8時間', after: '約30分', badge: '工数 約90%削減' },
  { number: '02', title: '定例資料', before: '約3〜4時間', after: '約15分', badge: '工数 約92%削減' },
  { number: '03', title: 'レポーティング', before: '1〜2時間×社数', after: 'ほぼゼロ', badge: '完全自動化' },
  { number: '04', title: 'バナー生成', before: '約2〜3時間', after: '数十分で10案', badge: '工数 約85%削減' },
  { number: '05', title: '動画生成', before: '数日〜数週間', after: '1時間以内', badge: '※検証フェーズ推奨' },
  { number: '06', title: '入稿・構築', before: '約8〜16時間', after: '2〜3時間', badge: '工数 約75%削減' },
  { number: '07', title: '運用改善', before: '約2〜3時間', after: '週30分', badge: '工数 約80%削減' },
  { number: '08', title: '事例記事作成', before: '約8〜12時間', after: '1〜2時間', badge: '工数 約85%削減' },
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
                <span>マーケティングAX</span>
                <span>Marketing AX</span>
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

        <section className="business-band ax-solution">
          <div className="business-section-head">
            <p className="business-kicker">SOLUTION</p>
            <h2>棚卸しから始め、インパクトの大きい業務から変える。</h2>
            <p className="business-section-copy">いきなりの全社改革ではなく、効果の見える領域から着実にAI前提へ作り変えます。</p>
          </div>
          <div className="ax-step-grid">
            {approachSteps.map((step) => (
              <article className="ax-step" key={step.number}>
                <span className="ax-step-num">STEP {step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
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

        <section className="business-band ax-pricing">
          <div className="business-section-head">
            <p className="business-kicker">PRICING</p>
            <h2>まず助言から。実行フェーズで伴走へ。</h2>
            <p className="business-section-copy">状況に合わせて、助言のみ／実行まで踏み込む伴走支援の2段階でご提供します。</p>
          </div>
          <div className="ax-plan-grid">
            {plans.map((plan) => (
              <article className="ax-plan" key={plan.name}>
                <span className="ax-plan-label">{plan.label}</span>
                <h3 className="ax-plan-name">{plan.name}</h3>
                <strong className="ax-plan-price">{plan.price}</strong>
                <p className="ax-plan-body">{plan.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="business-band ax-usecase">
          <div className="business-section-head">
            <p className="business-kicker">USE CASE</p>
            <h2>事例：広告運用 × AIエージェント。</h2>
            <p className="business-section-copy">広告運用AXでは、広告運用まわりの実務を8領域×工程レベルに分解し、AIエージェント化。人はレビューと承認に集中できる体制に変えていきます。</p>
          </div>
          <div className="ax-usecase-grid">
            {marketingUseCases.map((useCase) => (
              <article className="ax-usecase-card" key={useCase.number}>
                <span className="ax-usecase-num">{useCase.number}</span>
                <h3>{useCase.title}</h3>
                <div className="ax-usecase-flow">
                  <div>
                    <small>Before</small>
                    <span>{useCase.before}</span>
                  </div>
                  <span className="ax-usecase-arrow" aria-hidden="true">→</span>
                  <div>
                    <small>After</small>
                    <span>{useCase.after}</span>
                  </div>
                </div>
                <p className="ax-usecase-badge">{useCase.badge}</p>
              </article>
            ))}
          </div>
          <div className="ax-usecase-notes">
            <div className="ax-usecase-stages">
              <span>人の関与は3段階</span>
              <ul>
                <li>完全自動：レポーティング</li>
                <li>AI一気通貫 × レビュー：資料・クリエイティブ</li>
                <li>AI提案 × 承認実行：入稿・運用改善</li>
              </ul>
            </div>
            <p className="ax-usecase-disclaimer">※ 工数は業界一般の目安です。導入時は御社の実測値でBeforeを置き換え、効果を測定します。</p>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
