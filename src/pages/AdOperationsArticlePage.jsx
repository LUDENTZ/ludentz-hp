import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import ArticleAuthor, { AUTHOR_JSONLD, PUBLISHER_JSONLD } from '../components/ArticleAuthor';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const CANONICAL = 'https://ludentz.net/marketing-ax/ad-operations';
const HEADLINE =
  '広告運用AXとは？運用型広告の業務をAI前提に再設計する方法【7領域の実装マップ付き】';
const DATE_PUBLISHED = '2026-07-21';
const DATE_MODIFIED = '2026-07-21';

// 目次はこの配列から自動生成される（H2アンカー）
const sections = [
  { id: 'definition', title: '広告運用AXの定義' },
  { id: 'why-ad-operations', title: 'なぜ広告運用から始めるのか' },
  { id: 'map', title: '広告運用×AI：7領域の実装マップ' },
  { id: 'involvement', title: '人の関与は3段階に整理する' },
  { id: 'steps', title: '広告運用AXの進め方' },
  { id: 'failures', title: 'よくある失敗' },
  { id: 'faq', title: 'よくある質問' },
  { id: 'start', title: '広告運用AXを始める' },
];

// FAQPage JSON-LDと本文を完全一致させるため、単一のデータ源から両方を描画する
const faqs = [
  {
    q: '媒体の自動化機能と何が違いますか？',
    a: '媒体の自動化（P-MAX等）は媒体内の配信最適化を担うもので、媒体横断の分析・報告・提案・社内フローはカバーしません。広告運用AXの対象はこの「媒体の外側」の業務です。両者は競合ではなく併用する関係にあります。',
  },
  {
    q: 'レポーティングの自動化だけ頼むこともできますか？',
    a: 'できます。むしろレポーティングなど1業務から小さく始め、実測効果を確認してから範囲を広げる進め方を推奨しています。',
  },
  {
    q: '広告代理店でも使えますか？',
    a: '使えます。代理店の場合、レポーティング・入稿・定例資料の工数を削減して1人あたりの担当社数を増やし、粗利を改善する使い方が中心です。クライアントワーク特有の承認フローやトンマナ対応も設計に織り込みます。',
  },
  {
    q: '効果はどれくらいの期間で出ますか？',
    a: 'レポーティングなどの定型業務であれば、設計・実装から数週間で工数削減の実測値が出ます。組織への定着まで含めると1〜3ヶ月程度が目安です。',
  },
  {
    q: 'どの媒体に対応していますか？',
    a: 'Google広告、Yahoo!広告、Meta広告、X広告、LINE広告、TikTok広告、SmartNews広告など、主要な運用型広告媒体に対応しています。',
  },
];

const usecaseMap = [
  {
    area: '営業提案資料',
    before: '約6〜8時間',
    after: '約30分',
    model: '伴走型',
    human: '戦略の方向づけ・最終レビュー',
  },
  {
    area: '定例資料',
    before: '約3〜4時間',
    after: '約15分',
    model: '固定ワークフロー＋レビュー',
    human: '考察の確認・調整',
  },
  {
    area: 'レポーティング',
    before: '1〜2時間×社数',
    after: 'ほぼゼロ',
    model: '固定ワークフロー',
    human: 'アラート時のみ対応',
  },
  {
    area: 'バナー生成',
    before: '約2〜3時間',
    after: '数十分で10案',
    model: '伴走型',
    human: '選定・ブランド適合の判断',
  },
  {
    area: '動画生成',
    before: '数日〜数週間',
    after: '1時間以内',
    model: '伴走型（検証フェーズ推奨）',
    human: '品質判断・権利確認',
  },
  {
    area: '入稿・構築',
    before: '約8〜16時間',
    after: '2〜3時間',
    model: 'AI提案×承認実行',
    human: '設定の最終承認',
  },
  {
    area: '運用改善',
    before: '約2〜3時間',
    after: '週30分',
    model: 'AI提案×承認実行',
    human: '改善案の承認・反映判断',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: HEADLINE,
  datePublished: DATE_PUBLISHED,
  dateModified: DATE_MODIFIED,
  mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL },
  image: 'https://ludentz.net/assets/og/marketing-ax-ad-operations.png',
  inLanguage: 'ja',
  author: AUTHOR_JSONLD,
  publisher: PUBLISHER_JSONLD,
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
    { '@type': 'ListItem', position: 2, name: 'Marketing AX', item: 'https://ludentz.net/marketing-ax/' },
    { '@type': 'ListItem', position: 3, name: '広告運用AXとは', item: CANONICAL },
  ],
};

export default function AdOperationsArticlePage() {
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
              <a href="/marketing-ax/">Marketing AX</a>
              <span aria-hidden="true">/</span>
              <span>広告運用AXとは</span>
            </nav>
            <h1 className="article-title">
              広告運用AXとは？運用型広告の業務をAI前提に再設計する方法【7領域の実装マップ付き】
            </h1>
            <p className="article-lead">
              広告運用AXとは、運用型広告のオペレーション——提案資料の作成、入稿、レポーティング、運用改善など——をAI前提に再設計する取り組みのことです。<a href="/marketing-ax/">マーケティングAX</a>のサブ領域のひとつであり、マーケティング業務の中で最も定型性が高く、効果を実測しやすい領域です。
            </p>
            <p className="article-lead">
              この記事では、広告運用AXの定義、媒体の自動化機能との違い、7領域の実装マップ、進め方、よくある失敗までを解説します。
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
              <h2>広告運用AXの定義</h2>
              <p>
                広告運用AXとは、運用型広告にまつわる業務を工程レベルまで分解し、「AIに任せる工程」「ルールで縛る工程」「人が判断する工程」に振り分けて、業務フローそのものを組み直すことです。
              </p>
              <p>
                「広告運用の自動化ツールを導入すること」とは異なります。ツール導入は既存の業務フローを前提に一部の作業を速くするアプローチですが、広告運用AXは業務フローの側を作り変えます。たとえばレポーティングであれば、「人がツールを使って速くレポートを作る」のではなく、「データ取得から配信までが無人で回り、人はアラート時のみ動く」状態を設計します。
              </p>

              <h3>媒体の自動化機能（P-MAX等）との関係</h3>
              <p>
                GoogleのP-MAXやMetaのAdvantage+など、媒体自身のAIによる自動化は年々強力になっています。「媒体のAIで十分では？」という疑問はもっともですが、媒体AIがカバーするのは媒体の内側だけです。
              </p>
              <ul className="article-list">
                <li>
                  <strong>媒体AIが担うもの</strong>：入札、配信最適化、オーディエンス拡張など、媒体内の配信ロジック
                </li>
                <li>
                  <strong>残り続けるもの</strong>：媒体を横断した分析と予算配分、社内・クライアントへの報告、提案資料、入稿・構築の段取り、承認フロー、ナレッジの蓄積
                </li>
              </ul>
              <p>
                広告運用AXの対象は後者です。媒体AIの進化はむしろ、「人の仕事が媒体横断の判断と報告に寄っていく」という意味で、広告運用AXの必要性を高めています。
              </p>
            </section>

            <section id="why-ad-operations">
              <h2>なぜ広告運用から始めるのか</h2>
              <p>
                マーケティングAXの着手領域として広告運用を最初に推奨する理由は3つあります。
              </p>
              <ol className="article-numbered">
                <li>
                  <strong>定型性が高い</strong>。レポーティングや入稿は毎回ほぼ同じ手順で流れるため、AIとワークフローに載せやすい。
                </li>
                <li>
                  <strong>効果を実測しやすい</strong>。「レポート作成に週何時間かかっていたか」はBefore/Afterを数字で比較でき、社内合意を作りやすい。
                </li>
                <li>
                  <strong>両方の立場に効く</strong>。広告主（インハウス）には「少人数のまま運用規模を拡大できる」、広告代理店には「1人あたりの担当社数と粗利の改善」という形で、立場は違えど同じ再設計が価値になる。
                </li>
              </ol>
            </section>

            <section id="map">
              <h2>広告運用×AI：7領域の実装マップ</h2>
              <p>
                広告運用まわりの実務は、大きく7つの領域に分解できます。各領域の工数目安と、どの型で組むべきかの見立てです（工数は業界一般の目安。導入時は自社の実測値でBeforeを置き換えて効果を測定します）。
              </p>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col">領域</th>
                      <th scope="col">Before（目安）</th>
                      <th scope="col">After（目安）</th>
                      <th scope="col">実装の型</th>
                      <th scope="col">人が残る工程</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usecaseMap.map((row) => (
                      <tr key={row.area}>
                        <th scope="row">{row.area}</th>
                        <td>{row.before}</td>
                        <td>{row.after}</td>
                        <td>{row.model}</td>
                        <td>{row.human}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                対応媒体は、Google広告、Yahoo!広告、Meta広告、X広告、LINE広告、TikTok広告、SmartNews広告など主要な運用型広告全般です。媒体ごとに個別のツールを入れるのではなく、媒体横断でデータと業務フローがつながる形で設計します。
              </p>
            </section>

            <section id="involvement">
              <h2>人の関与は3段階に整理する</h2>
              <p>7領域を再設計すると、人の関与は次の3段階に整理されます。</p>
              <ol className="article-numbered">
                <li>
                  <strong>完全自動</strong>——レポーティングなど。人はアラート時のみ動く
                </li>
                <li>
                  <strong>AI一気通貫×レビュー</strong>——提案資料やクリエイティブなど。AIが最後まで作り、人は品質を見る
                </li>
                <li>
                  <strong>AI提案×承認実行</strong>——入稿や運用改善など。AIが提案し、人が承認してから実行される
                </li>
              </ol>
              <p>
                重要なのは「すべてを完全自動にしない」ことです。お金が動く工程（入稿・予算変更）には必ず人の承認を挟む、ブランドに関わる工程（クリエイティブ）には人のレビューを残す——どこに人を残すかの設計こそが、広告運用AXの品質を決めます。
              </p>
              <p>
                この3つの型の詳細と実例は<a href="/marketing-ax/three-levels">AI委譲の3段階</a>で解説しています。
              </p>
            </section>

            <section id="steps">
              <h2>広告運用AXの進め方</h2>
              <p>
                進め方は<a href="/marketing-ax/">マーケティングAXの5ステップ</a>と同じですが、広告運用ではとくに最初の棚卸しの粒度が成否を分けます。
              </p>
              <p>
                「レポート作成」という単位ではなく、「管理画面からデータ取得→スプレッドシートで集計→グラフ化→考察コメント作成→体裁調整→送付」という工程単位まで分解します。この粒度まで下げると、「データ取得と集計は完全自動化できる」「考察はAIの初稿に人が手を入れる」というように、工程ごとに適切な型を割り当てられるようになります。
              </p>
              <p>
                そのうえで、最初の1業務はレポーティングか定例資料から始めるのが定石です。毎週・毎月必ず発生し、工数が読みやすく、削減効果がすぐ数字になるためです。
              </p>
            </section>

            <section id="failures">
              <h2>よくある失敗</h2>
              <ul className="article-list">
                <li>
                  <strong>ツールだけ入れて業務フローが据え置き</strong>。「AIツールを契約したが、結局今まで通りのやり方に戻った」という典型例。ツールではなく業務フローを変えるのがAXです。
                </li>
                <li>
                  <strong>すべてをAIエージェント化しようとする</strong>。定型業務はエージェントではなく固定ワークフローで組むほうが安く、壊れにくい。「エージェント化しない」判断も設計のうちです。
                </li>
                <li>
                  <strong>Beforeを測らずに始める</strong>。導入前の工数を記録していないと、効果が語れず社内展開が止まります。着手前に現状工数の記録から始めてください。
                </li>
              </ul>
            </section>

            <section id="faq">
              <h2>よくある質問</h2>
              <div className="article-faq">
                {faqs.map((faq) => (
                  <div className="article-faq-item" key={faq.q}>
                    <h3>{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="start">
              <h2>広告運用AXを始める</h2>
              <p>
                LUDENTZの広告運用AX支援では、7領域の棚卸しから型の設計、実装、定着までを伴走します。まずは現状の業務分解と優先順位の見立てからご一緒します。
              </p>
              <ul className="article-cta-links">
                <li>
                  <a href="/service/ad-operations-ax">広告運用AXサービスの詳細を見る →</a>
                </li>
                <li>
                  <a href="/marketing-ax/cost">費用相場を見る →</a>
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
              </ul>
            </section>

            <ArticleAuthor />
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
