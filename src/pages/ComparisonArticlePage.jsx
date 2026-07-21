import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import ArticleAuthor, { AUTHOR_JSONLD, PUBLISHER_JSONLD } from '../components/ArticleAuthor';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const CANONICAL = 'https://ludentz.net/marketing-ax/comparison';
const HEADLINE =
  '広告運用は内製と外注どっちがいい？AI時代の第三の選択肢「AX支援」まで徹底比較';
const DATE_PUBLISHED = '2026-07-21';
const DATE_MODIFIED = '2026-07-21';

// 目次はこの配列から自動生成される（H2アンカー）
const sections = [
  { id: 'inhouse', title: '内製のメリット・デメリット' },
  { id: 'outsource', title: '外注（代理店）のメリット・デメリット' },
  { id: 'premise', title: '従来の比較が見落としている前提の変化' },
  { id: 'third-option', title: '第三の選択肢：AX支援で「自走する内製」を作る' },
  { id: 'how-to-choose', title: 'どれを選ぶべきか' },
  { id: 'faq', title: 'よくある質問' },
  { id: 'start', title: '自社に最適な選択肢を見立てる' },
];

// FAQPage JSON-LDと本文を完全一致させるため、単一のデータ源から両方を描画する
// （リンク付きで表示する回答は render で上書きし、テキストは a と一致させる）
const faqs = [
  {
    q: 'いま代理店に任せています。切り替えるべきですか？',
    a: '一概には言えません。代理店の戦略価値が高いなら、レポーティングなどの定型業務だけ自社のAIフローに移す併用型が現実的です。手数料に対して得られている価値を業務単位で棚卸しすることから始めてください。',
  },
  {
    q: 'AX支援の後、本当に自走できますか？',
    a: '自走できる状態を作ることが支援のゴールです。業務フロー・ドキュメント・ナレッジを社内に残し、担当者が運用・改修できるまで定着支援を行います。逆に「作って渡して終わり」の支援は定着しないため、定着フェーズの有無を支援会社選びの基準にしてください。',
  },
  {
    q: '広告費が小さくてもAX支援は意味がありますか？',
    a: '広告費が小さい場合、手数料削減のインパクトは小さいため、外注継続も合理的です。ただし「広告以外も含めたマーケ業務全体の工数」が課題なら、マーケティングAXとして検討する価値があります。',
    render: (
      <>
        広告費が小さい場合、手数料削減のインパクトは小さいため、外注継続も合理的です。ただし「広告以外も含めたマーケ業務全体の工数」が課題なら、
        <a href="/marketing-ax/">マーケティングAX</a>
        として検討する価値があります。
      </>
    ),
  },
  {
    q: '内製経験ゼロからでも始められますか？',
    a: '始められます。その場合は助言型の支援で業務の棚卸しと優先順位づけから入り、小さな業務のAI化で成功体験を作ってから体制構築に進む段階的な進め方を推奨しています。',
  },
];

const comparisonRows = [
  {
    label: 'コスト構造',
    inhouse: '人件費（固定）',
    outsource: '手数料（広告費に連動）',
    ax: '支援費（期間限定）＋少人数の人件費',
  },
  {
    label: 'ノウハウ蓄積',
    inhouse: '社内に貯まるが属人化',
    outsource: '社内に残らない',
    ax: '業務フローとして社内に残る',
  },
  {
    label: '立ち上げ速度',
    inhouse: '遅い（採用・教育）',
    outsource: '速い',
    ax: '中（1〜3ヶ月で体制構築）',
  },
  {
    label: '属人化リスク',
    inhouse: '高い',
    outsource: '低い（ただし依存先が変わるだけ）',
    ax: '低い（フローとナレッジが資産化）',
  },
  {
    label: '長期コスト',
    inhouse: '中',
    outsource: '高（広告費比例が続く）',
    ax: '低（支援終了後は自社運用）',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: HEADLINE,
  datePublished: DATE_PUBLISHED,
  dateModified: DATE_MODIFIED,
  mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL },
  image: 'https://ludentz.net/assets/og/marketing-ax-comparison.png',
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
    { '@type': 'ListItem', position: 3, name: '内製 vs 外注 vs AX', item: CANONICAL },
  ],
};

export default function ComparisonArticlePage() {
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
              <span>内製 vs 外注 vs AX</span>
            </nav>
            <h1 className="article-title">
              広告運用は内製と外注どっちがいい？AI時代の第三の選択肢「AX支援」まで徹底比較
            </h1>
            <p className="article-lead">
              「広告運用は内製すべきか、代理店に外注すべきか」——長年議論されてきたテーマですが、AIの実用化によって前提が変わりました。結論から言えば、いま多くの企業にとっての現実解は、<strong>AIで再設計した業務を少人数の内製で回す</strong>という第三の道です。
            </p>
            <p className="article-lead">
              この記事では、内製・外注それぞれのメリットとデメリットを整理したうえで、AI時代に現れた第三の選択肢「AX支援」を含めた選び方を解説します。
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
            <section id="inhouse">
              <h2>内製のメリット・デメリット</h2>
              <p>
                <strong>メリット</strong>
              </p>
              <ul className="article-list">
                <li>意思決定と実行が速い。社内の状況変化に即応できる</li>
                <li>運用ノウハウとデータが社内に蓄積される</li>
                <li>手数料（一般に広告費の20%前後）がかからない</li>
              </ul>
              <p>
                <strong>デメリット</strong>
              </p>
              <ul className="article-list">
                <li>採用が難しい。運用型広告の経験者は市場に少なく、採用しても定着しない</li>
                <li>属人化しやすい。担当者の退職で運用品質が崩れる</li>
                <li>教育コストが高く、媒体アップデートへの追随を1人で担うのは負荷が大きい</li>
              </ul>
            </section>

            <section id="outsource">
              <h2>外注（代理店）のメリット・デメリット</h2>
              <p>
                <strong>メリット</strong>
              </p>
              <ul className="article-list">
                <li>専門性と最新知見。複数アカウントの運用から得られる横断的なノウハウ</li>
                <li>立ち上がりが速い。契約すればすぐに体制が手に入る</li>
                <li>人の採用・教育・退職リスクを負わなくてよい</li>
              </ul>
              <p>
                <strong>デメリット</strong>
              </p>
              <ul className="article-list">
                <li>手数料コスト。広告費が大きくなるほど負担が増える</li>
                <li>ブラックボックス化。何をどう運用しているかが見えにくい</li>
                <li>社内にノウハウとデータの解釈力が残らない</li>
                <li>自社の事業理解には限界があり、コミュニケーションコストがかかる</li>
              </ul>
            </section>

            <section id="premise">
              <h2>従来の比較が見落としている前提の変化</h2>
              <p>
                この「内製 vs 外注」の比較は、<strong>内製の最大の壁が人手とスキルである</strong>ことを前提にしてきました。運用経験者を採用できないから外注する、教育できないから外注する——という構図です。
              </p>
              <p>
                しかしAIの実用化で、この前提が変わりました。レポーティングや入稿といった作業の大半はAIとワークフローで自動化でき、経験者の暗黙知だった考察や改善判断も、AIの提案を人が承認する形に再設計できます。つまり、<strong>「経験者を何人も抱えなければ回らない」という内製の壁そのものが下がった</strong>のです。少人数、場合によっては専任1人でも、AIを前提に業務を組めば運用が回る時代になりました。
              </p>
            </section>

            <section id="third-option">
              <h2>第三の選択肢：AX支援で「自走する内製」を作る</h2>
              <p>
                そこで現れたのが、AX支援という選択肢です。外注のように運用を「任せる」のではなく、<strong>AI前提の内製体制そのものを構築してもらい、最終的に自社で自走する</strong>アプローチです。詳しくは<a href="/marketing-ax/ad-operations">広告運用AXとは</a>で解説していますが、比較表にすると次のようになります。
              </p>
              <div className="article-table-wrap">
                <table className="article-table">
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">内製（従来型）</th>
                      <th scope="col">外注（代理店）</th>
                      <th scope="col">AX支援</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        <td>{row.inhouse}</td>
                        <td>{row.outsource}</td>
                        <td>{row.ax}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                AX支援の本質は、支援が終わった後に<strong>費用構造とノウハウが自社の資産として残る</strong>ことです。外注は続ける限り手数料が発生しますが、AXは業務フローという資産への一度の投資に近い性格を持ちます。
              </p>
            </section>

            <section id="how-to-choose">
              <h2>どれを選ぶべきか</h2>
              <p>3つの問いで判断できます。</p>
              <ol className="article-numbered">
                <li>
                  <strong>社内に広告運用の判断ができる人が1人でもいるか？</strong>
                  <ul>
                    <li>いない＆すぐ成果が必要 → まず外注。並行して内製化の準備を</li>
                    <li>いる → 次の問いへ</li>
                  </ul>
                </li>
                <li>
                  <strong>月の広告費は手数料負担が気になる規模か？</strong>（目安：月300万円以上）
                  <ul>
                    <li>気にならない規模で、社内リソースも割けない → 外注継続が合理的</li>
                    <li>気になる → 次の問いへ</li>
                  </ul>
                </li>
                <li>
                  <strong>1〜3ヶ月の体制構築期間を許容できるか？</strong>
                  <ul>
                    <li>できる → AX支援で内製体制の構築を</li>
                    <li>できない → 外注で回しつつ、区切りの時期を見てAXへ</li>
                  </ul>
                </li>
              </ol>
              <p>
                <strong>外注が最適なケースも明確にあります。</strong> 広告費が小さく手数料負担が軽い場合、社内に判断役を一切置けない場合、超短期のキャンペーンだけ回したい場合は、代理店への外注が合理的です。また「代理店を切ってAXにする」だけが道ではなく、<strong>戦略は代理店・定型業務は自社のAIフロー</strong>という併用型も現実的な解です。
              </p>
              <p>
                なお、この構造変化は代理店にとっても他人事ではありません。代理店自身が運用オペレーションをAXすれば、1人あたりの担当社数と粗利を改善し、手数料モデルの価格競争から抜け出せます。代理店の方は<a href="/marketing-ax/ad-operations">広告運用AX</a>を代理店の立場でご覧ください。
              </p>
            </section>

            <section id="faq">
              <h2>よくある質問</h2>
              <div className="article-faq">
                {faqs.map((faq) => (
                  <div className="article-faq-item" key={faq.q}>
                    <h3>{faq.q}</h3>
                    <p>{faq.render ?? faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="start">
              <h2>自社に最適な選択肢を見立てる</h2>
              <p>
                内製・外注・AX支援のどれが合うかは、広告費の規模、社内リソース、求めるスピードで変わります。LUDENTZでは現状の業務棚卸しをもとにした見立てからご一緒できます。
              </p>
              <ul className="article-cta-links">
                <li>
                  <a href="/marketing-ax/ad-operations">広告運用AXとは →</a>
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
