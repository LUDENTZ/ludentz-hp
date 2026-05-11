import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const supportPlans = [
  {
    name: 'アドバイザリー',
    label: 'ADVISORY PLAN',
    price: '30万円',
    case: '週1回1hMTG・戦略助言（実働なし）',
    total: '240万円',
  },
  {
    name: 'スタンダード',
    label: 'STANDARD PLAN',
    price: '100万円',
    case: 'LUDENTZ主導、クライアントも実働（担当者1名・週8〜16h想定）',
    total: '800万円',
  },
  {
    name: 'プレミアム',
    label: 'PREMIUM PLAN',
    price: '200万円',
    case: 'LUDENTZフル稼働・専任チーム',
    total: '1,600万円',
  },
];

const supportPlanRows = [
  ['LUDENTZ稼働', '週1h（MTGのみ）', '週20〜30h', '週30〜40h'],
  ['クライアントの実働', '主体的に実行', '担当者1名・週8〜16h', '意思決定のみ（実働ほぼ不要）'],
  ['体制', 'アドバイザー1名', 'PM＋エンジニア＋デザイナー', '専任チーム（複数名・PM主導）'],
  ['提供範囲', '戦略助言・壁打ち', '検証設計・MVP実装・初期GTM', '一気通貫'],
  ['主な成果物', '議事録・推奨アクション', '検証レポート／MVP／GTM資料', '全成果物'],
  ['コミュニケーション', '週1回 / 1h', '週1回・1hの定例＋Slack常時', '週1〜2回・1hの定例＋Slack常時'],
  ['推奨ステージ', 'アイデア段階', 'CPF〜PMF', '最短でのCPF〜PMF'],
  ['こんな方に', '自社で動ける体制がある', '専属人材を持たない', '本業を止めずに最速で立ち上げたい'],
  ['8か月総額目安', '240万円', '800万円', '1,600万円'],
];

const phases = [
  {
    name: '課題検証（CPF）',
    term: '〜1.5か月',
    activities: ['ICP定義・仮説設計', 'インタビュー20〜30名のリクルーティング', 'シナリオ設計・顧客インタビュー実施', '課題×解決策の仮説ブラッシュアップ'],
    gate: '5社中4社以上が「導入したい」と答える顧客×課題×解決策の特定',
    deliverables: ['検証レポート', '顧客課題マップ', 'ICP定義書'],
  },
  {
    name: 'MVP構築（SPF）',
    term: '〜2.5か月',
    activities: ['要件定義・仕様策定', '技術選定（AIスタック含む）', 'UXフロー作成・UI設計', 'AIコーディング＋熟練エンジニアによるMVP開発', '動作検証・改善'],
    gate: 'テストユーザーが実際に操作できる状態',
    deliverables: ['MVPプロダクト', '技術ドキュメント', '運用マニュアル（初版）'],
  },
  {
    name: 'テストマーケ',
    term: '並行実施',
    activities: ['営業資料・提案書作成', 'LP・サービスサイト制作', '運用型広告の出稿＆検証', 'ターゲットリスト作成', '商談獲得（テストユーザー確保）'],
    gate: 'PoC候補3〜5社の確保',
    deliverables: ['LP・広告クリエイティブ', '営業パイプライン'],
  },
  {
    name: '無償PoC',
    term: '〜2か月',
    activities: ['3〜5社での導入サポート', 'オンボーディング設計', '利用状況計測・定期ヒアリング', '課題抽出・プロダクト改善', '有償化ヒアリング・提案'],
    gate: '無償PoC参加者の50%以上を有償PoCへ転換',
    deliverables: ['PoC実施レポート', '改善ロードマップ', '有償提案資料'],
  },
  {
    name: '有償PoC / PMF検証',
    term: '〜2か月',
    activities: ['有償契約クロージング', '継続利用モニタリング', 'ユニットエコノミクス検証（単価・継続率・CAC）', 'KPIダッシュボード構築', '拡大ロードマップ策定'],
    gate: '有償顧客3社以上・2か月以上継続',
    deliverables: ['有償契約書・顧客リスト', 'KPIダッシュボード', 'オペレーションマニュアル', '事業拡大ロードマップ'],
  },
];

const fitCompanies = [
  {
    number: '01',
    title: '年商10〜30億円規模の企業',
    body: '意思決定が速く、既存事業の顧客・販路・業界知見を新規事業に転用しやすい規模感です。',
  },
  {
    number: '02',
    title: '後継社長・オーナー系経営者',
    body: '2代目・3代目の社長、またはオーナー系の経営者が、次の柱づくりを経営課題として捉えている企業。',
  },
  {
    number: '03',
    title: '既存事業が成熟し、次の柱が必要',
    body: '既存事業だけでは不安があり、AIプロダクトで新しい収益源を作りたい状態と相性が良いです。',
  },
  {
    number: '04',
    title: '社内だけでは検証が回りにくい企業',
    body: '新規事業人材が不足し、社長が旗を振っても本業多忙で止まりやすい。外部推進力が必要な状態です。',
  },
];

const competitorColumns = [
  {
    key: 'ludentz',
    name: 'LUDENTZ',
    tag: 'AI事業化パートナー',
    rows: {
      field: 'AI × バーティカル特化',
      target: '年商10〜30億円の中小企業。既存顧客・販路・業界知見をAI事業に転用できる会社',
      cost: '月30万円〜',
      value: 'AIプロダクトの0→1立ち上げ＆譲渡',
      implementation: 'あり（AIコーディングで内製）',
      exit: '伴走支援で立ち上げる / 顧客つき事業を丸ごと譲渡する',
      transferOption: 'あり',
      risk: '検証ゲートで継続判断。空振り投資を抑え、学びも資産化',
      asset: 'プロダクト + 顧客 + 運営知見。社内に次の柱の実体が残る',
      owner: '8か月で初期顧客獲得まで前に進め、社長の構想を事業に落とす',
    },
  },
  {
    key: 'studio',
    name: '大手新規事業スタジオ',
    tag: '大企業向け事業開発',
    rows: {
      field: '幅広く対応',
      target: '大企業〜中堅企業。予算・期間・専門人材を確保できる会社',
      cost: '数千万円〜',
      value: '事業開発ノウハウ・伴走',
      implementation: 'あり（外部委託中心）',
      exit: 'ノウハウ・体制づくりが中心。事業譲渡は一般的ではない',
      transferOption: '一般的にない',
      risk: '初期投資が大きく、失敗時の損失も重い',
      asset: '事業開発ノウハウ・フレームワーク・販路支援が中心',
      owner: '長期伴走が前提になりやすく、社内巻き取りの負荷も残る',
    },
  },
  {
    key: 'operator',
    name: '経営コンサル伴走型',
    tag: '右腕・現場稼働',
    rows: {
      field: '業種不問（製造業等リアル業界に強い）',
      target: '中小・中堅・ベンチャー。経営課題や現場改善の相談先がほしい会社',
      cost: '月15〜200万円',
      value: '経営者の右腕として現場稼働（名刺を持つ）',
      implementation: 'なし（コンサルと現場稼働）',
      exit: '現場推進・改善支援が中心。顧客つき事業は残りにくい',
      transferOption: 'なし',
      risk: '稼働時間に対する支払いになりやすく、成果が資産化しにくい',
      asset: '現場改善・経営助言。プロダクトや顧客は別途つくる必要',
      owner: '現場稼働は助かる一方、事業責任はクライアント側に残る',
    },
  },
  {
    key: 'strategy',
    name: '戦略コンサル型',
    tag: '戦略・計画策定',
    rows: {
      field: '業種不問（戦略中心）',
      target: '中堅企業・地域中核企業。戦略整理や計画書が必要な会社',
      cost: '成果物型（数百万円〜）',
      value: '戦略・事業計画策定',
      implementation: 'なし',
      exit: '事業計画書・戦略資料の納品が中心',
      transferOption: 'なし',
      risk: '計画が納品されても、実行段階で止まりやすい',
      asset: '事業計画書・戦略資料。事業化の実行は社内に残る',
      owner: '実行支援は薄く、社長・社内メンバーの推進力に依存しやすい',
    },
  },
];

const competitorRows = [
  { key: 'field', label: '領域' },
  { key: 'target', label: '向いている企業' },
  { key: 'cost', label: '初期負担' },
  { key: 'value', label: '主な提供価値' },
  { key: 'implementation', label: 'プロダクト実装' },
  { key: 'transferOption', label: '譲渡の選択肢' },
  { key: 'asset', label: '最終的に残るもの' },
];

export default function BusinessDevelopmentPage() {
  const [modal, setModal] = useState(false);
  const [serviceMode, setServiceMode] = useState('support');
  const [openPlan, setOpenPlan] = useState('スタンダード');

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

  return (
    <div className="business-page">
      <Nav onContact={() => setModal(true)} onScrollTo={scrollTo} />

      <main>
        <section className="business-hero" id="top">
          <div className="business-hero-layout">
            <div className="business-hero-copy">
              <div className="business-hero-meta">
                <span>001</span>
                <span>新規事業開発</span>
                <span>AI × Vertical</span>
              </div>
              <h1 className="business-title">
                <span className="nowrap">AIプロダクトで、</span><span className="nowrap">次の柱をつくる。</span>
              </h1>
              <p className="business-lead">
                LUDENTZは、中小企業の既存事業資産をもとに、AI × バーティカル（特定領域特化）の新規事業を設計・開発・検証します。
              </p>
              <div className="business-choice">
                <span>ご支援方法は2通り</span>
                <p className="business-choice-copy">
                  <span>伴走して一緒に立ち上げる。</span>
                  <span>または、LUDENTZが事業を作り、</span>
                  <span>顧客ごと譲渡する。</span>
                </p>
              </div>
            </div>

            <div className="business-hero-people" aria-label="LUDENTZ project members">
              <article className="business-hero-person business-hero-person--k">
                <img className="business-hero-photo" src="/assets/person-k.png" alt="" />
                <div className="business-hero-name">
                  <img className="business-name-img business-name-img--o" src="/assets/person-o-name.png" alt="" />
                  <span>新規事業コンサルタント</span>
                </div>
                <div className="business-hero-profile">
                  <p>上場企業十数社の新規事業開発プロジェクトを支援。自身で起業したPR会社を14期運営し、売却した経験を持ち、戦略立案からAIエージェント開発、運用型広告まで一気通貫で支援します。</p>
                  <ul>
                    <li>新規事業戦略・AIプロダクト企画</li>
                    <li>AIエージェント開発・MVP構築</li>
                    <li>運用型広告・グロース検証</li>
                  </ul>
                </div>
              </article>
              <article className="business-hero-person business-hero-person--o">
                <img className="business-hero-photo" src="/assets/person-o.png" alt="" />
                <div className="business-hero-name">
                  <img className="business-name-img business-name-img--k" src="/assets/person-k-name.png" alt="" />
                  <span>新規事業コンサルタント</span>
                </div>
                <div className="business-hero-profile">
                  <p>上場企業十数社の新規事業開発プロジェクトを支援。自ら人材・不動産・M&amp;A仲介の3事業を立ち上げた経験を持ち、顧客インタビューからピボットまでの泥臭いプロセスを一気通貫で支援します。</p>
                  <ul>
                    <li>新規事業開発プログラム運営</li>
                    <li>事業仮説・顧客検証レビュー</li>
                    <li>営業戦略・営業体制構築</li>
                  </ul>
                </div>
              </article>
            </div>
          </div>

          <div className="business-marquee">
            <div className="track">
              <span>月30万円から開始</span>
              <span>AIプロダクト内製</span>
              <span>有償顧客3社×2か月をゲート化</span>
              <span>譲渡型は未達なら負担ゼロ</span>
              <span>月30万円から開始</span>
              <span>AIプロダクト内製</span>
            </div>
          </div>
        </section>

        <section className="business-band business-target">
          <div className="business-section-head">
            <p className="business-kicker">はじめに</p>
            <h2 className="business-target-title">
              <span>次の柱は、社内の延長線上だけでは作れない。</span>
            </h2>
            <p className="business-section-copy business-target-lead">中小企業の新規事業は、能力ではなく「構造」で止まります。社長一人で背負うほど、止まる確率は上がります。</p>
          </div>
          <div className="business-split">
            <div className="business-problem-body">
              <div className="business-problem-copy">
                <span>本業を回しながら次の柱を立ち上げるとき、ほぼ同じ理由で歩みが止まります。</span>
                <div className="business-issue-grid">
                  <article>
                    <span>01</span>
                    <h3>本業に追われ、社長自身が新規事業に時間を割けない。</h3>
                    <p>検証が月単位で滞り、機会も資金も静かに溶けていく。</p>
                  </article>
                  <article>
                    <span>02</span>
                    <h3>社内に経験者がおらず、相談相手も判断軸も無い。</h3>
                    <p>仮説のまま意思決定が遅れ、走りきる前に熱量が冷める。</p>
                  </article>
                  <article>
                    <span>03</span>
                    <h3>採用や育成では間に合わず、撤退判断もできない。</h3>
                    <p>投じた人件費と時間が回収できず、塩漬け事業が増える。</p>
                  </article>
                </div>
                <div className="business-problem-statement">
                  <strong>これは経営者の能力ではなく、中小企業ならではの「構造」の問題です。</strong>
                  <p>LUDENTZは新規事業に特化した社外チームとして、検証順序・撤退基準・ピボット設計までを仕組みで提供。社長一人では越えられない壁を、伴走で超えます。</p>
                </div>
              </div>
            </div>
            <section className="business-track-record" aria-label="累計支援実績">
              <div className="business-track-head">
                <span>TRACK RECORD</span>
                <h3>上場企業を中心に、新規事業の立ち上げを伴走してきました。</h3>
                <p>業種・領域を問わず、新規事業の0→1立ち上げを支援しています。</p>
              </div>
              <div className="business-track-stats">
                <div><strong>9</strong><span>社</span><small>累計伴走実績</small></div>
                <div><strong>7</strong><span>社</span><small>うち上場企業</small></div>
                <div><strong>8</strong><span>か月</span><small>標準伴走期間</small></div>
              </div>
              <div className="business-track-list">
                <article><h4>交通インフラ会社</h4><p>農業領域の新規事業開発</p><span>上場</span></article>
                <article><h4>リース会社</h4><p>既存顧客網を活用した新サービス開発</p><span>上場</span><span>AI</span></article>
                <article><h4>情報セキュリティ会社</h4><p>AI時代における決済インフラ関連事業開発</p><span>上場</span><span>AI</span></article>
                <article><h4>電子機器メーカー</h4><p>自社製品を活かした新サービス開発</p><span>上場</span><span>AI</span></article>
                <article><h4>食品メーカー</h4><p>子育て世帯向け食育支援事業開発</p><span>上場</span></article>
                <article><h4>不動産デベロッパー</h4><p>個人投資家向け収益管理ツール開発</p><span>中堅</span><span>AI</span></article>
                <article><h4>顧客接点インフラ企業</h4><p>既存サービスを統合した新サービス開発</p><span>上場</span><span>AI</span></article>
                <article><h4>航空会社</h4><p>ウェルビーイング領域の事業開発</p><span>上場</span></article>
                <article><h4>人材会社</h4><p>接客特化スキマバイトサービス開発</p><span>中堅</span></article>
              </div>
            </section>
          </div>
        </section>

        <section className="business-band business-fit">
          <div className="business-section-head">
            <p className="business-kicker">HIGH FIT</p>
            <h2>年商10〜30億円の、次の柱を探す企業と高相性。</h2>
            <p className="business-section-copy">既存事業の資産を活かしながら、AIプロダクトで新しい収益源をつくりたい企業に向いています。</p>
          </div>
          <div className="business-fit-layout">
            <div className="business-fit-cards">
              {fitCompanies.map((item) => (
                <article className="business-fit-card" key={item.number}>
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <aside className="business-fit-side">
              <span>対象テーマ</span>
              <h3>AI × バーティカル領域</h3>
              <p>クライアントの業種は問いません。既存事業の顧客基盤・販売チャネル・独自データ・業界ブランドを起点に、特定領域に深く刺さるAIエージェントを設計します。</p>
              <div className="business-fit-tag-row" aria-label="領域例">
                <div className="business-fit-tags">
                  <span>不動産</span>
                  <span>広告</span>
                  <span>人材</span>
                  <span>小売</span>
                  <span>M&amp;A</span>
                </div>
                <small>等</small>
              </div>
              <div className="business-fit-note">
                <strong>相談タイミング</strong>
                <p>経営陣に危機感があり、既存の資産を新規事業に転用できそうだが、社内だけでは検証が前に進まないとき。</p>
              </div>
            </aside>
          </div>
        </section>

        <section className="business-band business-overview">
          <div className="business-section-head">
            <p className="business-kicker">OVERVIEW</p>
            <h2>サービス全体像</h2>
            <p className="business-section-copy">事業方針からアイデアまで無償で提案します。相性が良さそうなら有償の支援に移行しましょう。</p>
          </div>
          <div className="business-overview-map" aria-label="サービス全体像">
            <article className="business-overview-card business-overview-card--wide">
              <span className="business-overview-num">01</span>
              <div>
                <div className="business-overview-title-row">
                  <h3>1次ヒアリング</h3>
                  <strong>無料・1時間</strong>
                </div>
                <p>事前フォームをもとに、既存事業の強み・弱み、技術アセット、販売チャネル、人的リソースを確認します。</p>
              </div>
            </article>

            <div className="business-overview-period">2〜3週間</div>

            <article className="business-overview-card business-overview-card--wide">
              <span className="business-overview-num">02</span>
              <div>
                <div className="business-overview-title-row">
                  <h3>事業方針 + アイデア提案</h3>
                  <strong>無料・1時間</strong>
                </div>
                <p>既存領域と周辺領域を調査し、事業アイデア3案を提示します。ここまで無料です。事業化に向けて取り組み可能とご判断の場合、有償の伴走支援をご提案。</p>
              </div>
            </article>

            <div className="business-overview-choices" aria-label="支援方法">
              <article className="business-overview-card">
                <span className="business-overview-num">03</span>
                <div>
                  <div className="business-overview-title-row">
                    <h3>伴走支援型</h3>
                    <strong>8か月 / 3プラン</strong>
                  </div>
                  <p>支援内容を具体化し、LUDENTZがチームの一員として前に進めます。</p>
                </div>
              </article>
              <article className="business-overview-card">
                <span className="business-overview-num">03</span>
                <div>
                  <h3>事業譲渡型</h3>
                  <p>※対象となる企業は限定されます（後述）</p>
                </div>
              </article>
            </div>

            <article className="business-overview-card business-overview-card--operation">
              <span className="business-overview-num">04</span>
              <div>
                <div className="business-overview-title-row">
                  <h3>事業運営</h3>
                  <strong>クライアント</strong>
                </div>
                <p><span>希望時</span> アドバイザリー</p>
              </div>
            </article>
          </div>
        </section>

        <section className="business-band business-service-options">
          <div className="business-section-head">
            <p className="business-kicker">SERVICE MENU</p>
            <h2>支援方法</h2>
            <p className="business-section-copy">伴走して一緒に立ち上げるか、LUDENTZが先に事業を作って譲渡するか。状況に合わせて2つの進め方から選べます。</p>
          </div>

          <div className="business-service-tabs" role="tablist" aria-label="支援方法">
            <button
              type="button"
              className={'business-service-tab' + (serviceMode === 'support' ? ' is-active' : '')}
              role="tab"
              aria-selected={serviceMode === 'support'}
              aria-controls="support-panel"
              id="support-tab"
              onClick={() => setServiceMode('support')}
            >
              <span>01</span>
              <strong>伴走支援型</strong>
              <small>8か月 / 3プラン</small>
            </button>
            <button
              type="button"
              className={'business-service-tab' + (serviceMode === 'transfer' ? ' is-active' : '')}
              role="tab"
              aria-selected={serviceMode === 'transfer'}
              aria-controls="transfer-panel"
              id="transfer-tab"
              onClick={() => setServiceMode('transfer')}
            >
              <span>02</span>
              <strong>事業譲渡型</strong>
              <small>選考制 / 顧客つき事業譲渡</small>
            </button>
          </div>

          {serviceMode === 'support' ? (
            <div
              className="business-tab-panel business-support"
              role="tabpanel"
              id="support-panel"
              aria-labelledby="support-tab"
            >
              <p className="business-tab-lead">事業検証から初期顧客獲得まで、LUDENTZがチームの一員として一緒に進める支援です。</p>

              <div className="business-support-block business-support-flow">
                <div className="business-subsection-head">
                  <h3>事業検証フロー</h3>
                  <p>記載内容は目安です。個別PJの状況に合わせて機動的に判断します。</p>
                </div>
                <ol className="business-phases">
                  {phases.map((phase, index) => (
                    <li key={phase.name}>
                      <span className="business-phase-num">{String(index + 1).padStart(2, '0')}</span>
                      <div className="business-phase-title">
                        <h3>{phase.name}</h3>
                        <strong>{phase.term}</strong>
                      </div>
                      <ul className="business-phase-activities" aria-label={`${phase.name}の活動`}>
                        {phase.activities.map((activity) => (
                          <li key={activity}>{activity}</li>
                        ))}
                      </ul>
                      <div className="business-phase-gate">
                        <span>完了条件</span>
                        <p>{phase.gate}</p>
                      </div>
                      <div className="business-phase-deliverables">
                        <span>成果物</span>
                        <ul>
                          {phase.deliverables.map((deliverable) => (
                            <li key={deliverable}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="business-support-block business-service-menu">
                <div className="business-subsection-head">
                  <h3>料金プラン</h3>
                  <p>まずはアドバイザリーから開始し、実行リソース不足等、推進力不足のタイミングで上位プランに切り替える等も可能です。</p>
                </div>
                <div className="business-plan-cards">
                  {supportPlans.map((plan, index) => (
                    <article className={'business-plan-card' + (plan.name === 'スタンダード' ? ' is-recommended' : '')} key={plan.name}>
                      <button
                        type="button"
                        className="business-plan-card-toggle"
                        aria-expanded={openPlan === plan.name}
                        aria-controls={`plan-detail-${index}`}
                        onClick={() => setOpenPlan((current) => (current === plan.name ? '' : plan.name))}
                      >
                        {plan.name === 'スタンダード' && <em>Recommended</em>}
                        <span>{plan.label}</span>
                        <h4>{plan.name}</h4>
                        <strong>{plan.price}</strong>
                        <p>{plan.case}</p>
                        <small>{openPlan === plan.name ? 'Close' : 'Detail'}</small>
                      </button>
                      <div
                        className="business-plan-card-detail"
                        id={`plan-detail-${index}`}
                        hidden={openPlan !== plan.name}
                      >
                        <dl>
                          {supportPlanRows.map((row) => (
                            <div key={row[0]} className={row[0] === '8か月総額目安' ? 'is-total' : ''}>
                              <dt>{row[0]}</dt>
                              <dd>{row[index + 1]}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="business-plan-table-wrap" aria-label="伴走支援プラン比較">
                  <table className="business-plan-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>
                          <span>アドバイザリー</span>
                          <small>30万円 / 月</small>
                        </th>
                        <th className="is-recommended">
                          <em>Recommended</em>
                          <span>スタンダード</span>
                          <small>100万円 / 月</small>
                        </th>
                        <th>
                          <span>プレミアム</span>
                          <small>200万円 / 月</small>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportPlanRows.map(([label, advisory, standard, premium]) => (
                        <tr key={label} className={label === '8か月総額目安' ? 'is-total' : ''}>
                          <th>{label}</th>
                          <td>{advisory}</td>
                          <td>{standard}</td>
                          <td>{premium}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="business-tab-panel business-transfer"
              role="tabpanel"
              id="transfer-panel"
              aria-labelledby="transfer-tab"
            >
              <p className="business-tab-lead business-transfer-lead">
                <span>LUDENTZがリスクを取ってAIプロダクト事業を作り、有償顧客がついた状態で譲渡する支援メニューです。</span>
                <span>LUDENTZ側のリスクが大きいため、対象領域・市場規模・クライアントの事業資産との相性を総合判断の上でご提案します（選考制）。</span>
              </p>

              <div className="business-transfer-grid">
                <article className="business-transfer-card">
                  <span>対象領域</span>
                  <h3>バーティカル × AIエージェント領域</h3>
                  <p>領域例：不動産、広告、人材、小売、M&amp;Aなど</p>
                  <small>※ LUDENTZのドメイン知識、もしくは、クライアントのドメイン知識を活かせる領域に限定</small>
                </article>
                <article className="business-transfer-card">
                  <span>除外領域</span>
                  <ul>
                    <li>金融・医療など規制が強い領域</li>
                    <li>R&amp;D（基礎研究・特許取得）が必要な領域</li>
                    <li>ハードウェア・物販</li>
                  </ul>
                </article>
              </div>

              <div className="business-transfer-panel">
                <span>検証フロー</span>
                <h3>基本構造は伴走型と同一</h3>
                <ol className="business-transfer-flow">
                  <li>課題検証</li>
                  <li>MVP</li>
                  <li>無償PoC</li>
                  <li>有償PoC</li>
                </ol>
                <ul className="business-transfer-list">
                  <li>検証期間中のクライアント負担はゼロ（LUDENTZが自己投資）</li>
                  <li>成功時に事業を丸ごと譲渡</li>
                </ul>
              </div>

              <div className="business-transfer-panel business-transfer-gate">
                <span>譲渡ゲート</span>
                <h3 className="business-transfer-gate-title">
                  <span>以下を満たした状態を</span>
                  <span>8か月以内に実現したうえで売却</span>
                </h3>
                <ul className="business-transfer-gate-list">
                  <li><strong>有償顧客3社以上</strong><small>想定単価：月額3〜50万円のBtoB SaaS課金水準</small></li>
                  <li><strong>2か月以上継続利用中</strong></li>
                  <li><strong>「使い続けたい」という<br />継続意向</strong></li>
                </ul>
              </div>

              <div className="business-transfer-grid">
                <article className="business-transfer-card">
                  <span>譲渡内容</span>
                  <ul>
                    <li>プロダクト・システム一式（著作権なども含む）</li>
                    <li>顧客との契約・関係性</li>
                    <li>運営マニュアル・ノウハウ一式</li>
                    <li>LUDENTZ担当者による引継ぎサポート（標準3か月）</li>
                  </ul>
                </article>
                <article className="business-transfer-card">
                  <span>譲渡ゲート未達時</span>
                  <ul>
                    <li>契約終了、クライアント負担ゼロ</li>
                    <li>希望があれば伴走型への切替・再挑戦を提案</li>
                  </ul>
                </article>
              </div>

              <div className="business-transfer-panel">
                <span>譲渡金額 想定レンジ</span>
                <h3>3,000万〜8,000万円</h3>
                <p>PMF達成度・ARR水準・シナジー度合いに応じて、協議の上決定しましょう。</p>
                <div className="business-transfer-ranges">
                  <div><strong>3,000〜4,000万円</strong><p>有償顧客3社・ARR300万円前後</p></div>
                  <div><strong>4,000〜6,000万円</strong><p>有償顧客5社・ARR500万円以上</p></div>
                  <div><strong>6,000〜8,000万円</strong><p>ARR1,000万円超・高継続率</p></div>
                </div>
                <p className="business-transfer-rationale">同等の事業をゼロから立ち上げる場合、通常1〜2年・5,000万〜1億円の投資と機会損失を要します。譲渡型はこの期間とリスクをLUDENTZが引き受け、完成品の事業としてお渡しするものです。</p>
              </div>
            </div>
          )}
        </section>

        <section className="business-band business-competitor">
          <div className="business-section-head">
            <p className="business-kicker">POSITIONING</p>
            <h2>「中小企業×AIプロダクトの0→1」なら、LUDENTZが最小コストかつ最短距離。</h2>
            <p className="business-section-copy">戦略資料の納品でも、数年単位の長期伴走でもありません。AIプロダクトを作り、顧客検証と譲渡までを出口に置きます。</p>
          </div>

          <div className="business-competitor-summary" aria-label="LUDENTZの違い">
            <div>
              <span>01</span>
              <strong>資料より、動くAIプロダクト</strong>
              <p>戦略整理で止めず、AIプロダクトを作って顧客に当てます。</p>
            </div>
            <div>
              <span>02</span>
              <strong>顧客つき事業まで出口に置く</strong>
              <p>有償顧客がついた事業を、プロダクトごと受け取る選択肢があります。</p>
            </div>
            <div>
              <span>03</span>
              <strong>中小企業に合う負担設計</strong>
              <p>月30万円から始められ、譲渡型は未達なら負担ゼロで設計します。</p>
            </div>
          </div>

          <div className="business-competitor-table" role="table" aria-label="競合タイプ別の比較">
            <div className="business-competitor-row business-competitor-row--head" role="row">
              <div className="business-competitor-label" role="columnheader">比較軸</div>
              {competitorColumns.map((column) => (
                <div
                  className={'business-competitor-head' + (column.key === 'ludentz' ? ' business-competitor-head--primary' : '')}
                  role="columnheader"
                  key={column.key}
                >
                  <strong>{column.name}</strong>
                  <span>{column.tag}</span>
                </div>
              ))}
            </div>

            {competitorRows.map((row) => (
              <div className="business-competitor-row" role="row" key={row.key}>
                <div className="business-competitor-label" role="rowheader">{row.label}</div>
                {competitorColumns.map((column) => (
                  <div
                    className={'business-competitor-cell' + (column.key === 'ludentz' ? ' business-competitor-cell--primary' : '')}
                    role="cell"
                    key={column.key}
                  >
                    <span className="business-competitor-mobile-label">{column.name}</span>
                    {column.rows[row.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <CTA onContact={() => setModal(true)} />
      </main>

      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
