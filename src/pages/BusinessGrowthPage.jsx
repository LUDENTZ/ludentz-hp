import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const growthStages = [
  {
    number: '01',
    label: '0→1',
    title: '新規事業開発支援',
    status: '別サービス',
    body: '構想、仮説検証、MVP、初期顧客獲得まで。まだ事業として立ち上がっていない段階。',
    href: '/service/business-development',
  },
  {
    number: '02',
    label: '1→10',
    title: '新規事業グロース支援',
    status: '対象',
    body: '初期顧客やPoCはあるが、PMFにはまだ届いていない段階。売上成長の再現性を作るフェーズ。',
  },
  {
    number: '03',
    label: '10→100',
    title: 'スケール支援',
    status: '対象外',
    body: 'PMF後に、組織・採用・チャネル・オペレーションを拡張していく段階。今回の支援範囲には含みません。',
  },
];

const growthIssues = [
  {
    number: '01',
    title: '初期顧客はいるが、再現性のある売り方になっていない。',
    body: '紹介・個別対応・特定メンバーの属人営業に依存し、次の顧客獲得が読みづらい状態。',
  },
  {
    number: '02',
    title: 'プロダクト改善と営業活動が分断されている。',
    body: '商談で得た示唆が機能改善に戻らず、改善が売上につながっているか判断しにくい状態。',
  },
  {
    number: '03',
    title: 'KPIはあるが、打ち手の優先順位に落ちていない。',
    body: 'リード、商談、受注、継続の数字は見ているものの、どこを変えれば伸びるかが曖昧な状態。',
  },
];

const talkTimings = [
  {
    number: '01',
    title: 'PoC・初期導入を、有償化につなげたい',
    body: '初期利用は始まっているが、誰がなぜ払うのか、どの条件なら本導入に進むのかを見極めたいタイミング。',
  },
  {
    number: '02',
    title: '営業・提案の型を作りたい',
    body: '初期受注や商談はある一方で、ターゲット、訴求、提案資料、商談プロセスが属人化しているタイミング。',
  },
  {
    number: '03',
    title: '顧客獲得の起点を見極めたい',
    body: '紹介、アウトバウンド、広告、既存顧客接点など、どのチャネルに投資すべきか判断したいタイミング。',
  },
  {
    number: '04',
    title: 'PMFに近づく優先順位を決めたい',
    body: '顧客の反応はあるが、プロダクト、価格、チャネルのどこを変えれば前に進むか判断したいタイミング。',
  },
];

const supportAreas = [
  {
    title: 'GTM / Sales',
    ja: 'GTM・営業設計',
    body: 'ICP、訴求、価格、営業資料、商談プロセスを設計し、顧客獲得の再現性を高めます。',
  },
  {
    title: 'Marketing Test',
    ja: 'マーケティング検証',
    body: 'LP、広告、フォーム、ウェビナー、アウトバウンド等を小さく検証し、獲得チャネルを見極めます。',
  },
  {
    title: 'Product Growth',
    ja: 'プロダクト改善',
    body: '顧客ヒアリングと利用データをもとに、導入価値、オンボーディング、利用頻度に効く改善を進めます。',
  },
  {
    title: 'KPI Operation',
    ja: 'KPI運用',
    body: '追うべきKPIを絞り、週次で数字と行動を接続。事業会議が報告で終わらない状態を作ります。',
  },
];

const dashboardFunnels = [
  ['01', 'リード獲得', '128件', '150件', 'Good', 85, ['CPA 1.8万円'], '資料請求を中心に、ウェビナーと既存顧客紹介からの流入は順調', ['ターゲット定義', 'チャネル別CPA', 'LP訴求', 'フォーム離脱']],
  ['02', '商談', '45件', '40件', 'Good', 100, ['商談化率 35%', '提案数 28件'], '資料請求後の追客と商談設定は問題ない水準で推移', ['追客導線', '商談予約CTA', '初回訴求', '日程調整']],
  ['03', '受注', '8件', '18件', 'Bottleneck', 44, ['受注率 18%'], '競合比較で必要機能が不足し、最終選定で負けている', ['競合比較', '必須機能', '決裁者訴求', 'ROI説明']],
  ['04', '受注金額', '420万円', '900万円', 'Watch', 47, ['月額35万円', '契約期間12か月'], '受注数が伸びず、初期契約金額が目標に届いていない', ['プラン設計', '契約期間', '単価設計', '全社展開']],
  ['05', 'LTV金額', '420万円', '900万円', 'Bottleneck', 47, ['アップセル 0円', '初年度解約'], '競合より弱い機能を無理に売っているため、初期契約期間で離脱されLTVが伸びていない', ['オンボーディング', '利用定着', '解約理由', '更新前提案']],
];

const dashboardMoves = [
  ['受注できない理由', '直近5商談中3社から、競合各社が提供している議事録後のタスク化・CRM連携機能を自社が提供できていない点を指摘された。横並びの比較で負けていることがわかった。', ['タスク化機能の要件化', 'CRM連携の優先度上げ', '比較表の訴求修正']],
  ['改善後に検証すること', '商談と解約理由をプロダクト改善へ戻し、次の提案で「比較される機能差」が受注率とLTVにどう効くかを検証する。', ['受注率の週次確認', '継続率の確認', '導入後活用シナリオ']],
];

const growthExperts = [
  {
    image: '/assets/person-k.png',
    nameImage: '/assets/person-o-name.png',
    nameClass: 'business-name-img--o',
    role: 'Growth / AI Product',
    body: '上場企業十数社の新規事業開発を支援。起業したPR会社を14期運営し、売却した経験を持ち、戦略立案からAIエージェント開発、運用型広告まで一気通貫で支援します。',
    strengths: ['GTM・広告検証', 'AIプロダクト企画', '事業改善ロードマップ'],
  },
  {
    image: '/assets/person-o.png',
    nameImage: '/assets/person-k-name.png',
    nameClass: 'business-name-img--k',
    role: 'Business Development / Sales',
    body: '上場企業十数社の新規事業開発を支援。自ら人材・不動産・M&A仲介の3事業を立ち上げた経験を持ち、顧客インタビューから営業戦略まで伴走します。',
    strengths: ['顧客検証', '営業戦略・商談設計', 'ピボット判断'],
  },
];

const growthTrackRecords = [
  ['9', '社', '累計伴走実績'],
  ['7', '社', 'うち上場企業'],
];

const growthTrackCases = [
  ['リース会社', '既存顧客網を活用した新サービス開発', ['上場']],
  ['電子機器メーカー', '自社製品を活かした新サービス開発', ['上場']],
  ['顧客接点インフラ企業', '既存サービスを統合した新サービス開発', ['上場']],
  ['不動産デベロッパー', '個人投資家向け収益管理ツール開発', ['中堅']],
  ['人材会社', '接客特化スキマバイトサービス開発', ['中堅']],
  ['交通インフラ会社', '農業領域の新規事業開発', ['上場']],
];

const contractSteps = [
  {
    title: '初回相談・現状診断',
    term: '無料 / 60分',
    body: '事業の現状、初期顧客、売上・商談状況、いまボトルネックになっている論点を伺い、1→10支援の対象になりそうかを確認します。',
  },
  {
    title: '支援提案',
    term: '提案MTG',
    body: '扱うべき主要論点、支援体制、期間、費用感をご提案します。具体的な3か月の実行計画は契約後に共同で設計します。',
  },
  {
    title: '契約・開始',
    term: 'Kickoff',
    body: '契約後、キックオフを行い、週次の進行リズムと最初の実行タスクを決めます。',
  },
];

const growthPlans = [
  {
    name: 'アドバイザリー',
    label: 'ADVISORY PLAN',
    price: '30万円',
    total: '3か月総額目安 90万円',
    body: '週1回の定例を中心に、ファネルのボトルネックと商談インサイトを見ながら論点整理・優先順位・次アクションを助言します。',
    items: ['週1回1hMTG', '戦略助言・壁打ち', '実働なし'],
  },
  {
    name: 'スタンダード',
    label: 'STANDARD PLAN',
    price: '100万円',
    total: '3か月総額目安 300万円',
    body: 'LUDENTZがPMとして入り、クライアント担当者と一緒にGTM・営業資料・検証施策を具体化します。',
    items: ['週1定例＋Slack', 'GTM・営業設計', '施策設計・実行伴走'],
    recommended: true,
  },
  {
    name: 'プレミアム',
    label: 'PREMIUM PLAN',
    price: '200万円',
    total: '3か月総額目安 600万円',
    body: 'LUDENTZが専任チームとして深く入り、戦略・営業・マーケ・プロダクト改善まで高密度に伴走します。',
    items: ['週1〜2定例＋Slack', '専任チーム稼働', '横断的な改善伴走'],
  },
];

const pricingNotes = [
  {
    title: '標準期間',
    body: '初期スコープは3か月を標準期間として設計します。',
  },
  {
    title: '継続判断',
    body: '継続・縮小・上位プランへの切り替えは、各PJの状況・成果・社内体制を踏まえて個別に判断します。',
  },
  {
    title: 'テスト発注',
    body: '本格支援前に、1か月の与件整理のみで発注いただくことも可能です。',
  },
];

const deliverables = [
  ['GROWTH LOOP', 'グロース改善ループ', '売上成長のボトルネック、商談で得た購買されない理由、次の打ち手を接続。営業・マーケ・プロダクトが同じ前提で改善できる状態にします。'],
  ['GTM ASSETS', '営業・マーケ資料', 'ターゲットリスト、営業資料、LP、広告・メール文面など、実行に必要な素材を整えます。'],
  ['LEARNING LOG', '顧客反応・検証ログ', '商談、利用、ヒアリング、施策結果から得た示唆を蓄積し、次の営業・プロダクト改善に接続できる状態にします。'],
];

export default function BusinessGrowthPage() {
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
    <div className="business-page growth-page">
      <Nav onContact={() => openContact('nav')} onScrollTo={scrollTo} />

      <main>
        <section className="growth-hero" id="top">
          <div className="growth-hero-layout">
            <div className="growth-hero-copy">
              <div className="business-hero-meta">
                <span>002</span>
                <span>新規事業グロース支援</span>
                <span>1→10 Growth</span>
              </div>
              <h1 className="growth-title">
                <span>新規事業</span>
                <span>グロース支援</span>
              </h1>
              <p className="growth-lead">立ち上がった新規事業を、売上成長の軌道へ。</p>
              <p className="growth-copy">
                すでに顧客内で立ち上がっているプロジェクトに対して、戦略の再設計、GTM、営業実行、マーケティング検証、プロダクト改善、KPI運用までを一気通貫で伴走します。
              </p>
            </div>

          </div>

          <div className="business-marquee">
            <div className="track">
              <span>GTM再設計</span>
              <span>営業実行伴走</span>
              <span>KPI運用</span>
              <span>プロダクト改善</span>
              <span>マーケティング検証</span>
              <span>顧客反応の回収</span>
            </div>
          </div>
        </section>

        <section className="business-band growth-scope">
          <div className="business-section-head">
            <p className="business-kicker">SCOPE DEFINITION</p>
            <h2>0→1でも、10→100でもない。対象はその中間です。</h2>
            <p className="business-section-copy">立ち上がった新規事業が、PMFに近づくための売上検証・顧客獲得・改善運用に集中します。</p>
          </div>
          <div className="growth-stage-map" aria-label="支援スコープ">
            {growthStages.map((stage) => {
              const content = (
                <>
                  <span>{stage.number}</span>
                  <strong>{stage.label}</strong>
                  <small>{stage.status}</small>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                  {stage.href && <em>LPを見る →</em>}
                </>
              );

              return stage.href ? (
                <a className="growth-stage-link" href={stage.href} key={stage.label}>
                  {content}
                </a>
              ) : (
                <article className={stage.status === '対象' ? 'is-active' : ''} key={stage.label}>
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section className="business-band growth-problem">
          <div className="business-section-head">
            <p className="business-kicker">WHY 1→10 STOPS</p>
            <h2>PMFに届く前、多くのPJは「売上の再現性」で止まる。</h2>
            <p className="business-section-copy">アイデアの良し悪しではなく、顧客獲得・改善・KPI運用が接続されていないことが、1→10のボトルネックになります。</p>
          </div>
          <div className="business-issue-grid">
            {growthIssues.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="business-problem-statement growth-statement">
            <strong>1→10支援では、PMF後の拡大ではなく、PMFに近づくための実行サイクルを一緒に回します。</strong>
            <p>ターゲット、訴求、営業、マーケティング、プロダクト改善、KPIを分断せず、週次で検証しながら勝ち筋を作ります。</p>
          </div>
        </section>

        <section className="business-band business-fit growth-fit">
          <div className="business-section-head">
            <p className="business-kicker">WHEN TO TALK</p>
            <h2>相談すべきタイミング</h2>
            <p className="business-section-copy">顧客・プロダクト・営業活動のいずれかがすでに存在し、PMFにはまだ届いていない。そんな状態で、次の一手を決めたいときにご相談ください。</p>
          </div>
          <div className="business-fit-cards growth-fit-cards">
            {talkTimings.map((item) => (
              <article className="business-fit-card" key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="business-band growth-structure">
          <div className="business-section-head">
            <p className="business-kicker">SOLUTION</p>
            <h2>戦略・営業・プロダクト改善を分断せず、売上成長の実行サイクルを作ります。</h2>
            <p className="business-section-copy">PMF前の1→10では、営業だけ、プロダクトだけを切り出しても前に進みにくい。LUDENTZは論点設計から実行、顧客反応の回収までを一つのサイクルとして扱います。</p>
          </div>
          <div className="growth-area-note">
            <div className="growth-area-note-head">
              <span>Support area</span>
              <p>1→10のボトルネックに応じて、以下の領域を横断して扱います。</p>
            </div>
            <div className="growth-area-note-grid">
              {supportAreas.map((area, index) => (
                <article key={area.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <small>{area.title}</small>
                  <h3>{area.ja}</h3>
                  <p>{area.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="business-band growth-dashboard">
          <div className="business-section-head">
            <p className="business-kicker">GROWTH LOOP</p>
            <h2>商談で得たインサイトを、プロダクト改善へ戻す。</h2>
            <p className="business-section-copy">売上ファネルのどこがボトルネックになっているかを見極め、商談で得た「購買されない理由」を訴求・営業資料・プロダクト改善に接続します。</p>
          </div>
          <div className="growth-dashboard-preview" aria-label="グロース改善ループのサンプル">
            <div className="growth-dashboard-top">
              <div>
                <span>PJ例</span>
                <h3>法人向けAI議事録ツール</h3>
              </div>
              <small>Last updated 2026.06.22</small>
            </div>
            <div className="growth-funnel-chart">
              {dashboardFunnels.map(([num, title, current, target, status, progress, subKpis, note, checkpoints]) => (
                <article className={'growth-funnel-node' + (status === 'Bottleneck' ? ' is-bottleneck' : '')} key={title}>
                  <div className="growth-funnel-node-head">
                    <span>{num}</span>
                    <small>{status}</small>
                  </div>
                  <h4>{title}</h4>
                  <strong>{current}<small> / 目標 {target}</small></strong>
                  <div className="growth-dashboard-bar" style={{ '--progress': `${progress}%` }}><span /></div>
                  <ul>
                    {subKpis.map((kpi) => (
                      <li key={kpi}>{kpi}</li>
                    ))}
                  </ul>
                  <p>{note}</p>
                  <div className="growth-funnel-checkpoints" aria-label={`${title}の検討項目`}>
                    <span>検討項目</span>
                    <ul>
                      {checkpoints.map((checkpoint) => (
                        <li key={checkpoint}>{checkpoint}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
            <div className="growth-dashboard-bottom">
              <article className="growth-dashboard-focus">
                <span>Current Bottleneck</span>
                <h4>受注率とLTV金額が、売上成長のボトルネックになっている</h4>
                <p>資料請求から商談獲得までは問題ない水準で進んでいる一方で、最終比較で競合に負けている。機能差を埋めないまま売ることで初期契約期間で離脱され、LTVも伸びていない。商談と解約で得た「選ばれない理由」を回収し、訴求・提案資料・プロダクト改善へ戻します。</p>
              </article>
              <div className="growth-dashboard-moves">
                <div className="growth-dashboard-moves-head">
                  <span>Feedback Loop</span>
                  <small>商談インサイトから改善へ</small>
                </div>
                {dashboardMoves.map(([title, body, actions]) => (
                  <article key={title}>
                    <h4>{title}</h4>
                    <p>{body}</p>
                    <ul>
                      {actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="business-band growth-output">
          <div className="business-section-head">
            <p className="business-kicker">OUTPUT</p>
            <h2>最終的に、PMF到達に向けた検証の型を残します。</h2>
            <p className="business-section-copy">外部支援に依存し続けるのではなく、社内で再現できる計画・素材・運用リズムまで整えることを重視します。</p>
          </div>
          <div className="business-overview-choices growth-output-grid">
            {deliverables.map(([label, title, body], index) => (
              <article className="business-overview-card" key={label}>
                <span className="business-overview-num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="business-overview-title-row">
                    <h3>{title}</h3>
                    <strong>{label}</strong>
                  </div>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="business-band growth-experts">
          <div className="business-section-head">
            <p className="business-kicker">WHO SUPPORTS</p>
            <h2>新規事業の立ち上げと売上検証を経験してきたメンバーが伴走します。</h2>
            <p className="business-section-copy">机上の戦略だけでなく、顧客検証、営業、広告、プロダクト改善まで、実際に手を動かしてきたメンバーが事業責任者の右腕として入ります。</p>
          </div>
          <div className="growth-expert-grid">
            {growthExperts.map((expert) => (
              <article className="growth-expert-card" key={expert.role}>
                <img className="growth-expert-photo" src={expert.image} alt="" />
                <div className="growth-expert-body">
                  <div className="business-hero-name growth-expert-name">
                    <img className={`business-name-img ${expert.nameClass}`} src={expert.nameImage} alt="" />
                    <span>{expert.role}</span>
                  </div>
                  <p>{expert.body}</p>
                  <ul>
                    {expert.strengths.map((strength) => (
                      <li key={strength}>{strength}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="business-band growth-record">
          <div className="business-section-head">
            <p className="business-kicker">TRACK RECORD</p>
            <h2>上場企業を中心に、新規事業の検証・成長支援を伴走。</h2>
            <p className="business-section-copy">顧客検証、GTM、営業・改善運用まで、PMF前の論点を横断して支援しています。</p>
          </div>
          <div className="growth-record-layout">
            <div className="growth-record-stats" aria-label="支援実績">
              {growthTrackRecords.map(([num, unit, label]) => (
                <div className="growth-record-stat" key={label}>
                  <strong>{num}</strong>
                  <span>{unit}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>
            <div className="growth-record-cases">
              {growthTrackCases.map(([company, body, tags], index) => (
                <article className="growth-record-case" key={company}>
                  <span className="growth-record-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{company}</h3>
                    <p>{body}</p>
                  </div>
                  <small>{tags.join(' / ')}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="business-band growth-pricing">
          <div className="business-section-head">
            <p className="business-kicker">PRICING</p>
            <h2>料金プラン</h2>
            <p className="business-section-copy">01の伴走支援と同じく、月額30万円・100万円・200万円の3プランから、支援密度と実行体制に応じて設計します。</p>
          </div>
          <div className="business-plan-cards growth-plan-cards">
            {growthPlans.map((plan) => (
              <article className={'business-plan-card' + (plan.recommended ? ' is-recommended' : '')} key={plan.name}>
                <div className="business-plan-card-toggle growth-plan-card">
                  {plan.recommended && <em>Recommended</em>}
                  <span>{plan.label}</span>
                  <h4>{plan.name}</h4>
                  <strong>{plan.price}<small>/ 月</small></strong>
                  <b>{plan.total}</b>
                  <p>{plan.body}</p>
                  <ul>
                    {plan.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <div className="growth-pricing-notes">
            {pricingNotes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="business-band growth-contract">
          <div className="business-section-head">
            <p className="business-kicker">FLOW TO START</p>
            <h2>契約までの流れ</h2>
            <p className="business-section-copy">まずは現状を伺い、1→10支援で扱うべき論点があるかを一緒に確認します。無理に契約へ進めるのではなく、支援範囲が明確になった段階でご提案します。</p>
          </div>
          <ol className="growth-contract-flow">
            {contractSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{step.term}</small>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <CTA onContact={() => openContact('cta')} />
      </main>
      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
