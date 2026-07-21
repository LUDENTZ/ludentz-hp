import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const CANONICAL = 'https://ludentz.net/marketing-ax/';
const HEADLINE =
  'マーケティングAXとは？DXとの違い・進め方・費用相場まで【定義と実践ガイド】';
const DATE_PUBLISHED = '2026-07-21';
const DATE_MODIFIED = '2026-07-21';

// 目次はこの配列から自動生成される（H2アンカー）
const sections = [
  { id: 'definition', title: 'マーケティングAXの定義' },
  { id: 'why-now', title: 'なぜ今マーケティングAXなのか' },
  { id: 'scope', title: 'マーケティングAXの対象領域' },
  { id: 'patterns', title: '実装の3つのパターン' },
  { id: 'steps', title: 'マーケティングAXの進め方（5ステップ）' },
  { id: 'cost', title: '費用相場' },
  { id: 'approaches', title: 'マーケティングAXのアプローチの違い' },
  { id: 'faq', title: 'よくある質問' },
  { id: 'start', title: 'マーケティングAXを始める' },
];

// FAQPage JSON-LDと本文を完全一致させるため、単一のデータ源から両方を描画する
const faqs = [
  {
    q: 'マーケティングAXとDXの違いは何ですか？',
    a: 'DXはデジタル技術全般による業務・ビジネスの変革を指し、AXはその中でもAIを前提とした変革を指します。DXが「データと業務をデジタル化する」段階だとすれば、AXは「デジタル化されたデータと業務を、AIが判断・実行する」段階です。DXで整備した基盤の上にAXが乗る、連続した関係にあります。',
  },
  {
    q: 'AI BPRとマーケティングAXは何が違いますか？',
    a: '指す内容はほぼ同じです。AI前提の業務プロセス再設計（BPR: Business Process Re-engineering）をマーケティング領域で行うことが、マーケティングAXにあたります。呼称としてはAXが企業の組織名にも使われるなど広く定着しており、本サイトではマーケティングAXで統一しています。',
  },
  {
    q: 'どの業務から始めるべきですか？',
    a: 'レポーティングなど、毎回同じ手順で流れ、工数が大きく、効果を実測しやすい定型業務からの着手を推奨しています。最初の1業務で「工数が何割減ったか」の実数を作れると、その後の社内合意と展開が格段に速くなります。',
  },
  {
    q: '導入にはどれくらいの期間がかかりますか？',
    a: '対象業務の範囲によりますが、1業務の再設計と導入であれば数週間〜2ヶ月程度、部門単位での展開は3〜6ヶ月程度が目安です。一度にすべてを変えるのではなく、小さく入れて成功を積み上げる進め方を推奨しています。',
  },
  {
    q: '小さな会社や1人マーケでも導入できますか？',
    a: 'できます。むしろ人手が限られる組織ほど、定型業務をAIに任せて人の時間を判断に集中させる効果は大きくなります。伴走型の支援ではなく助言型から小さく始める選択肢もあります。',
  },
  {
    q: '広告代理店でも活用できますか？',
    a: 'できます。代理店の場合は、レポーティングや入稿などの運用工数を削減して1人あたりの担当社数と粗利を改善する使い方が中心になります。詳細は広告運用AXをご覧ください。',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: HEADLINE,
  datePublished: DATE_PUBLISHED,
  dateModified: DATE_MODIFIED,
  mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL },
  image: 'https://ludentz.net/og-image.png',
  inLanguage: 'ja',
  author: {
    '@type': 'Person',
    name: '大平 葵',
    jobTitle: '代表取締役',
    image: 'https://ludentz.net/assets/person-o.png',
    worksFor: { '@type': 'Organization', name: 'LUDENTZ株式会社' },
    // TODO: note・XのURLが確定したら sameAs: ['<note URL>', '<X URL>'] を追加する
  },
  publisher: {
    '@type': 'Organization',
    name: 'LUDENTZ株式会社',
    logo: { '@type': 'ImageObject', url: 'https://ludentz.net/assets/logo.svg' },
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ludentz.net/' },
    { '@type': 'ListItem', position: 2, name: 'Marketing AX', item: CANONICAL },
  ],
};

export default function MarketingAxArticlePage() {
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
    <div className="business-page article-page">
      <Nav onContact={() => openContact('nav')} onScrollTo={scrollTo} />

      <main>
        <article className="article">
          <header className="article-hero" id="top">
            <nav className="article-breadcrumb" aria-label="パンくず">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <span>Marketing AX</span>
            </nav>
            <h1 className="article-title">
              マーケティングAXとは？DXとの違い・進め方・費用相場まで【定義と実践ガイド】
            </h1>
            <p className="article-lead">
              マーケティングAXとは、AI（人工知能）を前提にマーケティングの業務プロセス・組織・意思決定のあり方を再設計する取り組みのことです。既存の業務にAIツールを足す「AI活用」とは異なり、AIがいることを前提に業務フローそのものをゼロから組み直す点が本質です。
            </p>
            <p className="article-lead">
              この記事では、マーケティングAXの定義、DXやAI活用との違い、対象領域、実装の3つのパターン、進め方、費用相場までを、マーケティング領域のAX支援を行うLUDENTZが解説します。
            </p>

            <nav className="article-toc" aria-label="目次">
              <span className="article-toc-label">目次</span>
              <ol>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </header>

          <div className="article-body">
            <section id="definition">
              <h2>マーケティングAXの定義</h2>
              <p>
                AXとは「AIトランスフォーメーション（AI Transformation）」の略称で、AI技術を活用して業務プロセスやビジネスモデル、組織のあり方を根本から変革する取り組みを指します。DX（デジタルトランスフォーメーション）が「紙や手作業をデジタルに置き換える」変革だったのに対し、AXは「デジタル化されたデータと業務を、AIが判断・実行する前提で組み直す」変革です。
              </p>
              <p>
                AXという言葉は既に企業の組織名レベルで定着しつつあります。2026年にはDX推進部門を発展解消して「AX戦略統括部」を新設する大手企業が現れるなど、DXの次のフェーズとしてAXを掲げる動きが業種を問わず広がっています。
              </p>
              <p>
                このAXをマーケティング領域に適用したものがマーケティングAXです。広告運用、新規開拓、コンテンツ制作、レポーティングといったマーケティングの実務を工程レベルで分解し、「AIに任せる工程」「ルールで縛る工程」「人が判断する工程」に振り分けて、業務フローを再設計します。
              </p>

              <h3>「AI活用」との違い</h3>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">AI活用（ツール導入）</th>
                      <th scope="col">マーケティングAX</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">出発点</th>
                      <td>既存の業務フローはそのまま</td>
                      <td>業務フローをゼロから見直す</td>
                    </tr>
                    <tr>
                      <th scope="row">AIの位置づけ</th>
                      <td>作業を速くする道具</td>
                      <td>業務の前提・実行主体</td>
                    </tr>
                    <tr>
                      <th scope="row">変わるもの</th>
                      <td>個々の作業時間</td>
                      <td>プロセス・体制・人の役割</td>
                    </tr>
                    <tr>
                      <th scope="row">成果の上限</th>
                      <td>部分最適で頭打ち</td>
                      <td>業務構造ごと変わる</td>
                    </tr>
                    <tr>
                      <th scope="row">定着</th>
                      <td>個人のスキル頼み</td>
                      <td>業務フローに組み込まれる</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                AIツールを導入しても「日々の仕事のやり方は変わらなかった」という企業は少なくありません。ツールが悪いのではなく、既存プロセスの上にAIを乗せるだけでは、業務の構造が変わらないためです。マーケティングAXは、この構造から変えるアプローチです。
              </p>
            </section>

            <section id="why-now">
              <h2>なぜ今マーケティングAXなのか</h2>

              <h3>媒体のAIが「作業」を飲み込み、「判断と体制」が残る</h3>
              <p>
                運用型広告の世界では、GoogleのP-MAXやMetaのAdvantage+など、媒体自身のAIによる自動化が急速に進んでいます。入札や配信最適化といった「作業」は媒体AIが担うようになる一方で、媒体を横断した分析、社内・クライアントへの報告、予算配分の判断、そしてそれらを回す体制づくりは残り続けます。マーケターの仕事の重心は「手を動かすこと」から「AIの出力を方向づけ、最終判断を下すこと」へ移っており、業務の再設計なしにこの移行は完了しません。
              </p>

              <h3>単発のツール導入が定着しない3つの理由</h3>
              <p>
                多くの企業でAI活用が部署ごとの単発導入にとどまり、事業の成果につながっていません。典型的な壁は次の3つです。
              </p>
              <ol className="article-numbered">
                <li>
                  <strong>導入したツールが、現場の業務プロセスに組み込まれない。</strong>{' '}
                  単発のツール導入で終わり、日々の仕事のやり方は変わらないまま形骸化する。
                </li>
                <li>
                  <strong>何から着手すべきか、優先順位を判断できる人材が社内にいない。</strong>{' '}
                  投資対効果の見極めができず、着手が遅れる。
                </li>
                <li>
                  <strong>個別業務の自動化で止まり、事業構造レベルの変革に至らない。</strong>{' '}
                  部署単位の部分最適にとどまり、全社的な競争力の底上げにつながらない。
                </li>
              </ol>

              <h3>買い手の情報行動もAIが起点になった</h3>
              <p>
                B2Bの購買行動では、検討の起点が従来の検索からChatGPTなどのAI検索へ移りつつあります。マーケティング部門は「AIをどう業務に使うか」と同時に「AIにどう選ばれるか」にも向き合う必要があり、その両方の前提となるのが自社業務のAXです。
              </p>
            </section>

            <section id="scope">
              <h2>マーケティングAXの対象領域</h2>
              <p>
                マーケティングAXは、マーケティング業務の中でも定型性が高く工数の大きい領域から着手するのが定石です。代表的な領域は次の通りです。
              </p>
              <ul className="article-list">
                <li>
                  <strong>広告運用AX</strong> —
                  提案資料、レポーティング、入稿、運用改善など、運用型広告まわりの実務を工程レベルで分解してAIエージェント化する。マーケティングAXの中で最も費用対効果を実測しやすい領域。
                  <a href="/service/ad-operations-ax">→ 広告運用AXとは</a>
                </li>
                <li>
                  <strong>新規開拓AX</strong> —
                  ターゲットリストの作成から文面生成、送信、返信対応までをパイプラインとして自動化する。
                  <a href="/service/prospecting-ax">→ 新規開拓AX</a>
                </li>
                <li>
                  <strong>情報発信AX</strong> —
                  事例記事・オウンドメディア・社内報など、発信業務の素材集約から初稿生成、多面展開までを自動化する。
                  <a href="/service/publishing-ax">→ 情報発信AX</a>
                </li>
              </ul>
              <p>今後はSEO、MA運用、データ分析などへも対象領域は広がっていきます。</p>
            </section>

            <section id="patterns">
              <h2>実装の3つのパターン</h2>
              <p>
                マーケティングAXの実装は「すべてをAIエージェントにする」ことではありません。判定基準は次の一問です。
              </p>
              <blockquote className="article-question">
                その業務、開始ボタンを押したあと「人がそこにいる」必要があるか？
              </blockquote>
              <p>この問いへの答えで、業務は3つの型に振り分けられます。</p>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">① 伴走型</th>
                      <th scope="col">② 固定ワークフロー</th>
                      <th scope="col">③ 委任型エージェント</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">対象</th>
                      <td>人が判断しながら進める業務</td>
                      <td>毎回同じ手順で流れる定型業務</td>
                      <td>投げて離れられる業務（無人・長時間・並列）</td>
                    </tr>
                    <tr>
                      <th scope="row">例</th>
                      <td>分析、企画、クリエイティブ、提案書</td>
                      <td>定時レポートの集計・配信、リード処理</td>
                      <td>常時リサーチ、アウトバウンド運用</td>
                    </tr>
                    <tr>
                      <th scope="row">実装</th>
                      <td>業務手順のSkill化・配布・定着伴走</td>
                      <td>決定論的パイプライン＋LLM工程</td>
                      <td>既製エージェント→必要時のみカスタム構築</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                よくある失敗は、②で十分な定型業務まで③のエージェントで組んでしまうことです。エージェントは柔軟ですが、その分だけ挙動が揺れ、コストも高い。毎回同じ手順で流れる業務は「エージェント化しない」と判断し、安く壊れにくい固定ワークフローとして実装するほうが、運用は安定します。
              </p>
              <p>
                売り物は「機構」ではなく「設計」——業務をどこで切り、何をAIに任せ、何をルールで縛り、何を人が見るか。この設計こそがマーケティングAXの価値の源泉です。
              </p>
            </section>

            <section id="steps">
              <h2>マーケティングAXの進め方（5ステップ）</h2>
              <ol className="article-numbered">
                <li>
                  <strong>業務の棚卸し</strong> —
                  対象業務を工程レベルまで分解する。「レポート作成」ではなく「データ取得→集計→グラフ化→考察→体裁→送付」の粒度まで下げる。
                </li>
                <li>
                  <strong>AI代替率と優先順位の診断</strong> —
                  工程ごとにAIで代替できる度合いと工数インパクトを見積もり、着手順を決める。効果を実測しやすい定型業務（レポーティング等）から始めるのが定石。
                </li>
                <li>
                  <strong>3つの型への振り分けと設計</strong> —
                  上記の判定基準で各業務を①〜③に振り分け、人の判断を残す場所を設計する。
                </li>
                <li>
                  <strong>小さく導入し、成功で合意を広げる</strong> —
                  最初から全社に入れない。1業務で成果を実測し、その数字で現場の合意を作ってから広げる。AXが失敗する典型は「正しいシステム」を作って現場に渡して終わることであり、否定すべきは現場のやり方ではなくAXの進め方の側。
                </li>
                <li>
                  <strong>定着化と実測</strong> —
                  Before/Afterの工数を計測し、業務マニュアル・ナレッジをAIが参照できる形で整備して、担当者が変わっても回る状態にする。
                </li>
              </ol>
            </section>

            <section id="cost">
              <h2>費用相場</h2>
              <p>
                マーケティングAX支援の費用は、支援の深さによって大きく変わります。目安は次の通りです。
              </p>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col">支援タイプ</th>
                      <th scope="col">月額の目安</th>
                      <th scope="col">内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">助言型（アドバイザリー）</th>
                      <td>月20万円前後〜</td>
                      <td>AI活用方針の助言・壁打ち中心。実働なし</td>
                    </tr>
                    <tr>
                      <th scope="row">伴走型（実行支援）</th>
                      <td>月50万〜200万円</td>
                      <td>週次MTG＋業務分解から実装・定着までの実行支援</td>
                    </tr>
                    <tr>
                      <th scope="row">ツール導入のみ</th>
                      <td>月数万円〜</td>
                      <td>SaaS利用料のみ。ただし業務再設計は含まれない</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* /marketing-ax/cost は未作成のため「費用相場の解説ページ」のリンクは外している（文言は初稿のまま） */}
              <p>
                参考として、LUDENTZのマーケティングAX支援は助言のみ月20万円〜、伴走支援は月50万〜200万円で提供しています。ツール導入だけで済ませる場合との違いは、業務プロセスの再設計と定着支援が含まれるかどうかです。詳細は費用相場の解説ページをご覧ください。
              </p>
            </section>

            <section id="approaches">
              <h2>マーケティングAXのアプローチの違い</h2>
              <p>
                一口にマーケティングAXと言っても、支援会社によってアプローチは異なります。大きくは2つの軸があります。
              </p>
              <ul className="article-list">
                <li>
                  <strong>データ・顧客理解軸</strong> —
                  顧客の声やSNSデータをAIで分析し、戦略立案やターゲティングを高度化するアプローチ。プラットフォーム提供型の企業に多い。
                </li>
                <li>
                  <strong>オペレーション実装軸</strong> —
                  業務プロセスと工数の再設計に踏み込み、実務のAIエージェント化と定着までを支援するアプローチ。LUDENTZはこちらに該当する。
                </li>
              </ul>
              <p>
                両者は排他ではなく補完関係にあります。自社の課題が「顧客理解の解像度」にあるのか「業務の工数と体制」にあるのかで、選ぶべきアプローチは変わります。
              </p>
            </section>

            <section id="faq">
              <h2>よくある質問</h2>
              <div className="article-faq">
                {faqs.map((faq) => (
                  <div className="article-faq-item" key={faq.q}>
                    <h3>{faq.q}</h3>
                    <p>
                      {faq.q === '広告代理店でも活用できますか？' ? (
                        <>
                          できます。代理店の場合は、レポーティングや入稿などの運用工数を削減して1人あたりの担当社数と粗利を改善する使い方が中心になります。詳細は
                          <a href="/service/ad-operations-ax">広告運用AX</a>
                          をご覧ください。
                        </>
                      ) : (
                        faq.a
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="start">
              <h2>マーケティングAXを始める</h2>
              <p>
                LUDENTZは、自社の実務をAIエージェントで運営し、その型をクライアント組織に移植するAIネイティブスタジオです。マーケティングAXの実装を検討されている方は、まずはヒアリングからご一緒します。
              </p>
              <ul className="article-cta-links">
                <li>
                  <a href="/service/ad-operations-ax">広告運用AXサービスを見る →</a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    onClick={(event) => {
                      event.preventDefault();
                      openContact('article_cta');
                    }}
                  >
                    お問い合わせ →
                  </a>
                </li>
                {/* TODO: 大平note URLが確定したらリンク化する */}
                <li>
                  <span className="article-cta-pending">実践ログはnoteで →（準備中）</span>
                </li>
              </ul>
            </section>

            <section className="article-author" aria-label="この記事の執筆者">
              <h2>この記事の執筆者</h2>
              <div className="article-author-card">
                <img
                  className="article-author-photo"
                  src="/assets/person-o.png"
                  alt="大平 葵"
                  width="72"
                  height="72"
                  loading="lazy"
                />
                <div className="article-author-body">
                  <p className="article-author-name">
                    大平 葵（LUDENTZ株式会社 創業者・代表取締役）
                  </p>
                  <p>
                    PRエージェンシーの創業・10年間の経営を経て、運用型広告コンサルティング会社にて立ち上げ期サービスの広告戦略・運用を担当。戦略設計から運用改善まで一気通貫で支援。
                  </p>
                  <p>
                    その後、上場企業10社以上の新規事業開発を伴走し、AIを活用した事業開発にも複数従事。2026年にLUDENTZ株式会社を創業。自社の営業・経理・総務・デリバリー業務をAIエージェントで運営し、その実運用から得た型をもとにマーケティング領域のAX支援を行っている。
                  </p>
                </div>
              </div>
              <p className="article-updated">最終更新: 2026年7月</p>
            </section>
          </div>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </main>

      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
