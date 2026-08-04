import PracticeLog, { NOTE_URL } from './PracticeLog';

const FEATURED = {
  href: '/marketing-ax/',
  number: '01',
  label: 'GUIDE',
  title: 'マーケティングAXとは？',
  body: 'DXとの違い、実装の3つのパターン、進め方、費用相場まで。マーケティングAXの全体像をまとめた定義と実践ガイド。',
};

const articles = [
  {
    href: '/marketing-ax/ad-operations',
    number: '02',
    label: 'HOW-TO',
    title: '広告運用AXとは？',
    body: '運用型広告の業務をAI前提に再設計する方法。7領域の実装マップ付き。',
  },
  {
    href: '/marketing-ax/cost',
    number: '03',
    label: 'PRICING',
    title: 'AX支援の費用相場',
    body: '助言型・伴走型・ツール導入のみ。支援タイプ別の料金と選び方。',
  },
  {
    href: '/marketing-ax/comparison',
    number: '04',
    label: 'COMPARISON',
    title: '内製 vs 外注 vs AX支援',
    body: '広告運用の体制はどう組むべきか。AI時代の第三の選択肢まで徹底比較。',
  },
  {
    href: '/marketing-ax/three-levels',
    number: '05',
    label: 'METHOD',
    title: 'AI委譲の3段階',
    body: 'AIには、作業か、手順か、目的を渡す。伴走型・固定ワークフロー・委任型エージェントを図解。',
  },
];

export default function Knowledge() {
  return (
    <section className="section" id="knowledge">
      <div className="section-head">
        <div className="section-kicker">
          <span className="show-en">Knowledge</span>
          <span className="show-ja">ナレッジ</span>
        </div>
        <h2 className="section-title section-title--bilingual reveal">
          What we’ve<br />learned.
        </h2>
      </div>

      <div className="knowledge-grid reveal d-1" aria-label="ナレッジ記事">
        <a className="knowledge-card knowledge-card--feature" href={FEATURED.href}>
          <div className="knowledge-meta">
            <span>{FEATURED.number}</span>
            <span>{FEATURED.label}</span>
          </div>
          <div className="knowledge-feature-main">
            <h3 className="knowledge-title">{FEATURED.title}</h3>
            <p className="knowledge-body">{FEATURED.body}</p>
          </div>
          <span className="knowledge-arrow" aria-hidden="true">→</span>
        </a>
        {articles.map((article) => (
          <a className="knowledge-card" href={article.href} key={article.href}>
            <div className="knowledge-meta">
              <span>{article.number}</span>
              <span>{article.label}</span>
            </div>
            <h3 className="knowledge-title">{article.title}</h3>
            <p className="knowledge-body">{article.body}</p>
            <span className="knowledge-arrow" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
      <PracticeLog
        className="reveal d-2"
        fallback={
          <a className="knowledge-external" href={NOTE_URL} target="_blank" rel="noopener">
            日々のAX実践ログはnoteで公開しています ↗
          </a>
        }
      />
    </section>
  );
}
