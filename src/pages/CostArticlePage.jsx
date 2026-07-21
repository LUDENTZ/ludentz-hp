import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import ArticleAuthor, { AUTHOR_JSONLD, PUBLISHER_JSONLD } from '../components/ArticleAuthor';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const CANONICAL = 'https://ludentz.net/marketing-ax/cost';
const HEADLINE =
  'マーケティングAX・広告運用のAI化にかかる費用相場は？支援タイプ別の料金と選び方';
const DATE_PUBLISHED = '2026-07-21';
const DATE_MODIFIED = '2026-07-21';

// 目次はこの配列から自動生成される（H2アンカー）
const sections = [
  { id: 'market-rates', title: '支援タイプ別の費用相場' },
  { id: 'factors', title: '何が価格を決めるのか' },
  { id: 'roi', title: '費用対効果の考え方' },
  { id: 'pricing', title: 'LUDENTZの料金' },
  { id: 'faq', title: 'よくある質問' },
  { id: 'start', title: 'まずは現状の工数から' },
];

// FAQPage JSON-LDと本文を完全一致させるため、単一のデータ源から両方を描画する
const faqs = [
  {
    q: '最低契約期間はありますか？',
    a: 'ありません。月単位でのご契約が基本で、スポットでの単発支援にも対応しています。小さく始めて、効果を見てから継続を判断いただけます。',
  },
  {
    q: 'スポット（単発）での依頼はできますか？',
    a: 'できます。たとえば「レポーティング業務の自動化設計だけ」「AI活用方針の壁打ち数回だけ」といった単発のご依頼にも対応しています。',
  },
  {
    q: 'ツールやAPIの費用は支援費用に含まれますか？',
    a: '含まれません。ClaudeなどのAI利用料、各種ツール・APIの費用は実費でのご請求となります。多くの場合、月数千円〜数万円の規模です。',
  },
  {
    q: '成果報酬型での契約はできますか？',
    a: 'ご相談次第で設計可能です。工数削減の実測値など、成果の定義が明確にできる場合に検討しています。まずはお問い合わせください。',
  },
  {
    q: '途中でプランの変更はできますか？',
    a: 'できます。助言のみで始めて、実装フェーズで伴走支援に切り替えるケースが典型です。',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: HEADLINE,
  datePublished: DATE_PUBLISHED,
  dateModified: DATE_MODIFIED,
  mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL },
  image: 'https://ludentz.net/assets/og/marketing-ax-cost.png',
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
    { '@type': 'ListItem', position: 3, name: 'AX支援の費用相場', item: CANONICAL },
  ],
};

export default function CostArticlePage() {
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
              <span>AX支援の費用相場</span>
            </nav>
            <h1 className="article-title">
              マーケティングAX・広告運用のAI化にかかる費用相場は？支援タイプ別の料金と選び方
            </h1>
            <p className="article-lead">
              マーケティングAX（マーケティング業務のAI前提での再設計）にかかる費用は、支援のタイプによって大きく異なります。相場の目安は、助言型（アドバイザリー）が月20万円前後から、実行まで踏み込む伴走型が月50万〜200万円、ツール導入のみなら月数万円からです。
            </p>
            <p className="article-lead">
              この記事では、支援タイプ別の費用相場、価格を決める要因、費用対効果の考え方までを、実際に価格を公開しているLUDENTZが解説します。
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
            <section id="market-rates">
              <h2>支援タイプ別の費用相場</h2>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col">支援タイプ</th>
                      <th scope="col">月額の目安</th>
                      <th scope="col">含まれるもの</th>
                      <th scope="col">含まれないもの</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">ツール導入のみ</th>
                      <td>月数万円〜</td>
                      <td>SaaS利用料、基本サポート</td>
                      <td>業務フローの再設計、定着支援</td>
                    </tr>
                    <tr>
                      <th scope="row">助言型（アドバイザリー）</th>
                      <td>月20万円前後〜</td>
                      <td>AI活用方針の助言・壁打ち、優先順位の整理</td>
                      <td>実装の実働</td>
                    </tr>
                    <tr>
                      <th scope="row">伴走型（実行支援）</th>
                      <td>月50万〜200万円</td>
                      <td>業務分解、設計、実装、週次MTG、定着支援</td>
                      <td>ツール・API実費</td>
                    </tr>
                    <tr>
                      <th scope="row">大手コンサルのAX支援</th>
                      <td>数百万円〜／月（参考）</td>
                      <td>全社レベルの変革設計、大規模PJ体制</td>
                      <td>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                マーケティング領域に限定した部門単位のAXであれば、助言型〜伴走型（月20万〜200万円）のレンジに収まるケースがほとんどです。全社レベルのAXや基幹システムを含む変革は大手コンサルの領域になり、価格帯が一桁変わります。
              </p>
            </section>

            <section id="factors">
              <h2>何が価格を決めるのか</h2>
              <p>
                同じ「AX支援」でも価格に幅があるのは、次の4つの変数で工数が大きく変わるためです。
              </p>
              <ol className="article-numbered">
                <li>
                  <strong>対象業務の範囲</strong>——レポーティング1業務か、広告運用の7領域すべてか、マーケティング部門全体か。
                </li>
                <li>
                  <strong>実装の深さ</strong>——方針の助言までか、ワークフローやエージェントの構築・実装まで行うか。
                </li>
                <li>
                  <strong>定着支援の有無</strong>——作って渡すだけか、現場が使いこなして自走するまで伴走するか。AXの失敗の大半は定着フェーズで起きるため、ここの有無は成果を大きく左右します。
                </li>
                <li>
                  <strong>内製化移行の設計</strong>——支援終了後に社内で運用・改修できる状態（ドキュメント、ナレッジ、担当者育成）まで作るか。
                </li>
              </ol>
            </section>

            <section id="roi">
              <h2>費用対効果の考え方</h2>
              <p>AX支援の費用対効果は、「削減された工数×時間単価」で概算できます。</p>
              <p>
                例：レポーティングと定例資料で月40時間の工数が削減され、担当者の時間単価が4,000円の場合、月16万円分の工数が浮く計算です。ここに「浮いた時間で何をするか」（改善施策の実行、担当社数の拡大など）の価値が上乗せされます。
              </p>
              <p>
                注意したいのは、ツールの月額が安くても業務が変わらなければ回収はゼロだということです。費用比較は「月額いくらか」ではなく「業務がどれだけ変わり、それが何ヶ月続くか」で行うのが正確です。AXは業務フロー自体を作り変えるため、支援期間が終わった後も削減効果が資産として残ります。
              </p>
            </section>

            <section id="pricing">
              <h2>LUDENTZの料金</h2>
              <p>LUDENTZのマーケティングAX支援は、次の2プランです。</p>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col">プラン</th>
                      <th scope="col">月額</th>
                      <th scope="col">内容</th>
                      <th scope="col">向いている企業</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">助言のみ（ADVISORY）</th>
                      <td>月20万円〜</td>
                      <td>AI活用方針の助言・壁打ち中心（実働なし）</td>
                      <td>社内に実行リソースがあり、方針と優先順位の整理が欲しい</td>
                    </tr>
                    <tr>
                      <th scope="row">伴走支援（HANDS-ON）</th>
                      <td>月50万〜200万円</td>
                      <td>週次MTGと実行支援。業務分解から実装・定着まで</td>
                      <td>実装まで任せたい、社内にAI人材がいない</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>契約条件は次の通りです。</p>
              <ul className="article-list">
                <li>
                  <strong>最低契約期間の縛りはありません。</strong> スポット（単発）でのご発注も可能です
                </li>
                <li>
                  <strong>ツール・API利用料は実費</strong>でのご請求です（支援費用とは別）
                </li>
                <li>
                  <strong>成果報酬型の座組も相談可能</strong>です（内容に応じて設計します）
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
              <h2>まずは現状の工数から</h2>
              <p>
                費用対効果の議論は、現状の業務工数がわかって初めて成立します。「どの業務に何時間かかっているか」の棚卸しからご一緒できますので、まずはお気軽にご相談ください。
              </p>
              <ul className="article-cta-links">
                <li>
                  <a href="/marketing-ax/ad-operations">広告運用AXとは →</a>
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
