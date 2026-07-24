import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import ArticleAuthor, { AUTHOR_JSONLD, PUBLISHER_JSONLD } from '../components/ArticleAuthor';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const CANONICAL = 'https://ludentz.net/marketing-ax/three-levels';
const HEADLINE =
  'AI導入がツール止まりになる理由——業務は「作業・手順・目的」の3段階でAIに渡す【AI委譲の3段階】';
const DATE_PUBLISHED = '2026-07-24';
const DATE_MODIFIED = '2026-07-24';

// 目次はこの配列から自動生成される（H2アンカー）
const sections = [
  { id: 'why-classify', title: 'なぜ分類が必要なのか' },
  { id: 'criteria', title: '判定基準：その業務、AIに何を渡せるか？' },
  { id: 'copilot', title: 'COPILOT——作業を渡す' },
  { id: 'workflow', title: 'WORKFLOW——手順を渡す' },
  { id: 'agent', title: 'AGENT——目的を渡す' },
  { id: 'fit', title: '最適な配分は、組織ごとに違う' },
  { id: 'faq', title: 'よくある質問' },
  { id: 'start', title: '自社の業務を3段階に振り分ける' },
];

// 図版。キャプションはSVGのtitle要素と同一の文言
const figures = {
  fig1: {
    src: '/assets/three-levels/fig1.svg',
    alt: 'AI委譲の3段階：作業・手順・目的を渡すほど人の手が空く階段図',
    caption: '委譲の階段——AIには、作業か、手順か、目的を渡す',
  },
  fig2: {
    src: '/assets/three-levels/fig2.svg',
    alt: '判定基準：その業務、AIに何を渡せるか？の分岐図',
    caption: '判定基準——その業務、AIに何を渡せるか？',
  },
  fig3: {
    src: '/assets/three-levels/fig3.svg',
    alt: 'COPILOT型の実例：提案資料Skillの仕組み図',
    caption: 'COPILOTの実例——提案資料Skill',
  },
  fig4: {
    src: '/assets/three-levels/fig4.svg',
    alt: 'WORKFLOW型の実例：週次レポートラインの仕組み図',
    caption: 'WORKFLOWの実例——週次レポートライン',
  },
  fig5: {
    src: '/assets/three-levels/fig5.svg',
    alt: 'AGENT型の実例：新規開拓エージェントの仕組み図',
    caption: 'AGENTの実例——新規開拓エージェント',
  },
};

function ArticleFigure({ figure, eager = false }) {
  return (
    <figure className="article-figure">
      <img
        src={figure.src}
        alt={figure.alt}
        width="900"
        height="506"
        loading={eager ? 'eager' : 'lazy'}
      />
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

// FAQPage JSON-LDと本文を完全一致させるため、単一のデータ源から両方を描画する
const faqs = [
  {
    q: '全部AGENTにするのが一番進んでいるのでは？',
    a: 'いいえ。型は業務の性質で決まるもので、優劣ではありません。判断が要る業務は今後もCOPILOTが正解ですし、定型業務はWORKFLOWの方がAGENTより安く、壊れにくい。「全部エージェント」はコストと不安定さを抱え込むだけです。',
  },
  {
    q: 'どの型から始めるべきですか？',
    a: 'WORKFLOWに載せられる定型業務（定時レポートなど）が最初の候補です。工数削減を実測しやすく、社内の合意形成に使える数字が最短で手に入ります。並行して、判断系の業務をCOPILOTで回しながら手順の言語化を進めるのが定石です。',
  },
  {
    q: '型の判定を間違えたらどうなりますか？',
    a: '深く渡しすぎた場合（定型業務をAGENTにした等）は、挙動の不安定さとコスト高として現れます。浅くしか渡していない場合（定型業務をCOPILOTのままにした等）は、工数が減らないままです。いずれも判定をやり直して組み替えれば済む話で、だからこそ最初の業務分解と判定が重要になります。',
  },
  {
    q: 'ツール選定とはどう関係しますか？',
    a: '型が決まってからツールを選びます。COPILOTならSkillを装着できるAI（Claude等）、WORKFLOWならパイプライン基盤（Dify等）、AGENTなら既製のエージェント環境から。ツールから入ると、ツールにできることに業務を合わせる本末転倒が起きます。',
  },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: HEADLINE,
  datePublished: DATE_PUBLISHED,
  dateModified: DATE_MODIFIED,
  mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL },
  image: 'https://ludentz.net/assets/og/marketing-ax-three-levels.png',
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
    { '@type': 'ListItem', position: 3, name: 'AI委譲の3段階', item: CANONICAL },
  ],
};

export default function ThreeLevelsArticlePage() {
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
              <span>AI委譲の3段階</span>
            </nav>
            <h1 className="article-title">
              AI導入がツール止まりになる理由——業務は「作業・手順・目的」の3段階でAIに渡す【AI委譲の3段階】
            </h1>
            <p className="article-lead">
              「AIツールを全社導入したのに、業務は何も変わらなかった」——AI活用の相談で最も多く聞く言葉です。原因はツールの性能でも社員のリテラシーでもなく、<strong>業務を分類せずに、すべて同じやり方でAIを当てている</strong>ことにあります。
            </p>
            <p className="article-lead">
              LUDENTZでは、業務をAIに委ねるとき、次の一つの原則で設計しています。
            </p>
            <blockquote className="article-question">
              AIには、作業か、手順か、目的を渡す。深く渡すほど、渡す回数は減っていく。
            </blockquote>
            <ArticleFigure figure={figures.fig1} eager />
            <p className="article-lead">
              この記事では、この「AI委譲の3段階」——COPILOT（作業を渡す）／WORKFLOW（手順を渡す）／AGENT（目的を渡す）——の考え方と、それぞれの実例を解説します。
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
            <section id="why-classify">
              <h2>なぜ分類が必要なのか</h2>
              <p>
                AI活用がうまくいかないパターンは、両極端のどちらかに寄っています。
              </p>
              <p>
                ひとつは、<strong>すべてをチャットで頼むパターン</strong>。ChatGPTやClaudeに毎回指示を書いて、毎回結果を受け取る。これは判断が必要な業務には正しいやり方ですが、毎週同じ手順で作る定例レポートまでこの方式だと、「毎回人が渡す」工数が永遠に残ります。AIは速くなったのに、人が張り付いたままです。
              </p>
              <p>
                もうひとつは、<strong>すべてをAIエージェントにするパターン</strong>。エージェントは柔軟ですが、その分だけ挙動が揺れ、コストも高い。毎回同じ手順で流れる業務をエージェントで組むのは、通勤にヘリコプターを使うようなもので、高くて不安定な過剰装備です。
              </p>
              <p>
                業務にはそれぞれ「正しい渡し方」があります。それを見極めるのが、次の判定基準です。
              </p>
            </section>

            <section id="criteria">
              <h2>判定基準：その業務、AIに何を渡せるか？</h2>
              <ArticleFigure figure={figures.fig2} />
              <p>
                業務を工程レベルに分解したら、工程ごとにこう問います。<strong>「AIに何を渡せるか？」</strong>
              </p>
              <ul className="article-list">
                <li>
                  <strong>判断が要る。作業しか渡せない</strong> → COPILOT
                </li>
                <li>
                  <strong>やり方を説明できる。手順まで渡せる</strong> → WORKFLOW
                </li>
                <li>
                  <strong>過程はどうでもいい。目的だけで足りる</strong> → AGENT
                </li>
              </ul>
              <p>
                ここで重要なのは、<strong>渡せる深さは業務の言語化の深さで決まる</strong>ということです。「手順を渡せない」のは多くの場合、AIの限界ではなく、手順が誰かの頭の中にしかなく言語化されていないだけです。「目的を渡せない」のは、そもそも目的とゴール条件が曖昧なままだからです。この判定基準は、AI委譲の振り分けと同時に、自社業務の言語化がどこまで進んでいるかを映す診断ツールとしても機能します。
              </p>
            </section>

            <section id="copilot">
              <h2>COPILOT——作業を渡す</h2>
              <p>
                <strong>判断は渡せない。人が方向づけながら、AIが作業を巻き取る型。</strong> 渡すのは毎回ですが、その1回あたりの作業がAIに巻き取られます。
              </p>
              <p>
                向いているのは、分析、企画、クリエイティブ、提案書など、答えが一つに定まらず、人の判断と往復しながら仕上げる業務です。
              </p>
              <ArticleFigure figure={figures.fig3} />
              <p>
                実例が「提案資料Skill」です。過去の提案書から、構成の型・ロジックの組み立て方・トンマナをSkill（AIに装着する業務手順書）として一度だけ整備します。以降、担当者は骨子を指示するだけで、AIが構成案から本文・図表・体裁まで一気に生成し、人はレビューと修正指示で仕上げる。所要時間は約6〜8時間から約30分になります。
              </p>
              <p>
                <strong>この型の落とし穴は、Skill化をサボること。</strong> 毎回ゼロからプロンプトを書くと、品質が人によってブレ、組織の資産になりません。COPILOTの成否は「AIの上手な使い方を個人が覚える」ことではなく、「業務の型をSkillとして言語化し、誰が使っても同じ品質が出る状態を作る」ことにあります。
              </p>
            </section>

            <section id="workflow">
              <h2>WORKFLOW——手順を渡す</h2>
              <p>
                <strong>やり方まで言語化できているなら、無人のレールに載せる型。</strong> 渡すのは最初の一度だけ。以降は人が開始ボタンすら押さず、スケジュールで勝手に流れます。
              </p>
              <p>
                向いているのは、定時レポート、リード処理など、毎回同じ手順で流れる定型業務です。
              </p>
              <ArticleFigure figure={figures.fig4} />
              <p>
                実例が「週次レポートライン」です。毎週月曜9時に自動起動し、媒体データの取得→集計・グラフ化→考察ドラフト生成→Slack配信までが無人で流れます。ポイントは、<strong>AIを使うのは考察ドラフトの工程だけ</strong>で、それ以外は決定論的な処理（毎回必ず同じ結果になる普通のプログラム）で組むこと。人の仕事は「見張るだけ」になり、異常値アラートが出たときだけ呼ばれます。レポーティング工数は「1〜2時間×社数」からほぼゼロになります。
              </p>
              <p>
                <strong>この型の落とし穴は、エージェントで組んでしまうこと。</strong> 手順が決まっている業務にAIの自律判断を挟むと、挙動が揺れて壊れやすくなり、コストも上がります。「エージェント化しない」という判断も、立派な設計です。
              </p>
            </section>

            <section id="agent">
              <h2>AGENT——目的を渡す</h2>
              <p>
                <strong>進め方は問わない。ゴールだけ渡して自走させる型。</strong> 渡すのはゴール単位。人は過程に関与せず、成果だけを受け取ります。
              </p>
              <p>
                向いているのは、常時リサーチ、アウトバウンド運用など、無人・長時間・並列で回したい業務です。
              </p>
              <ArticleFigure figure={figures.fig5} />
              <p>
                実例が「新規開拓エージェント」です。人が渡すのはICP（狙う顧客の定義）だけ。エージェントがターゲットリストの生成・更新、1社ずつの文面起案、フォーム・メール・手紙のマルチチャネル送信、返信検知と一次対応までを自走させ、人に届くのは「商談化した返信」だけです。人は商談に集中し、接点づくりは別働隊が回し続ける構図になります。
              </p>
              <p>
                <strong>この型の落とし穴は2つ。</strong> ひとつは目的が曖昧なまま放つこと——ゴール条件を定義できていない業務をエージェントに渡すと、大量の的外れな成果物が返ってきます。もうひとつはガードレールなしで走らせること——お金が動く操作や外部への送信には、承認ステップや上限設定を必ず設けます。「任せる」は「野放し」ではありません。
              </p>
            </section>

            <section id="fit">
              <h2>最適な配分は、組織ごとに違う</h2>
              <p>
                この3つの型に優劣はなく、「最終的にすべてをAGENTへ」という到達点があるわけでもありません。判断の多い事業ならCOPILOT中心が最適解であり続けますし、定型業務の多い組織ではWORKFLOWが主力になります。自社のケイパビリティ——業務の言語化の進み具合、運用体制、事業の性質——に合った配分を選ぶことが、定着への最短距離です。
              </p>
              <p>
                ただし、配分は固定ではありません。人がAIと往復するうちに、「この業務、毎回同じ指示をしているな」という工程が見えてきます。それは手順が言語化された合図で、WORKFLOWに降ろせます。ゴール条件まで明確に定義できた業務に限って、AGENTに渡す選択肢が生まれます。<strong>COPILOTでの往復は、次の型のための言語化プロセスを兼ねている</strong>のです。
              </p>
              <p>
                大事なのは、深く渡すことではなく、現場で回り続けることです。空いた手は、判断と、次の業務の言語化に使う。組織の形に合わせてこの循環が回り始めた状態が、私たちの考えるAX（AIトランスフォーメーション）です。
              </p>
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
              <h2>自社の業務を3段階に振り分ける</h2>
              <p>
                LUDENTZのマーケティングAX支援は、業務の工程分解とこの3段階への振り分け設計から始まります。「どの業務に何を渡せるか」の見立てから、まずはご一緒します。
              </p>
              <ul className="article-cta-links">
                <li>
                  <a href="/marketing-ax/">マーケティングAXとは →</a>
                </li>
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
