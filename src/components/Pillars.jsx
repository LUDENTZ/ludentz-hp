export default function Pillars() {
  const items = [
    {
      n: '001',
      en: <>Business<br />Development</>,
      ja: '新規事業開発',
      tag: 'Active',
      body_en: 'Zero-to-one with operators and founders. We ship first prototypes within six weeks — concept, interface, and a working product surface.',
      body_ja: '新規事業開発に関して、戦略立案〜具体の事業企画及びサービス開発から事業グロースまでを一気通貫支援しています。',
      link: '/service/business-development',
    },
    {
      n: '002',
      en: <>AX<br />Consulting</>,
      ja: 'AX支援',
      tag: 'Active',
      body_en: 'Architecture across the business — information, organisation, product. We re-draw the structure first, and let the surface follow.',
      body_ja: '最新AI技術を前提に、既存の事業構造から見直す本質的なAXプランを提案。組織定着まで伴走します。',
    },
    {
      n: '003',
      en: <>Cross-border<br />E-commerce</>,
      ja: '越境EC',
      tag: 'Coming soon',
      body_en: 'Our own cross-border commerce venture. Small, deliberate, long-horizon. Currently in closed development — announcing later this year.',
      body_ja: '自社で運営する越境ECの事業。小さく、意図的で、長期視点。現在クローズドで開発中、年内に告知予定。',
    },
  ];

  return (
    <section className="section" id="work">
      <div className="section-head">
        <div className="section-kicker">
          <span className="show-en">Three pillars</span>
          <span className="show-ja">事業内容</span>
        </div>
        <h2 className="section-title reveal">
          <span className="show-en">Three pillars,<br />one <span className="ja">秩序</span>.</span>
        </h2>
      </div>

      <div className="pillars">
        {items.map((it, i) => {
          const teaser = it.tag === 'Coming soon';
          return (
            <div key={it.n} className={'pillar reveal d-' + (i + 1) + (teaser ? ' pillar--teaser' : '')}>
              <div className="pillar-head">
                <span className="pillar-num">{it.n}</span>
                <span className={'pillar-tag' + (teaser ? '' : ' active')}>{teaser ? 'Coming soon' : 'Active'}</span>
              </div>
              <h3 className="pillar-en">{it.en}</h3>
              <div className="pillar-ja">{it.ja}</div>
              {teaser ? (
                <div className="teaser-box">
                  <div className="teaser-stamp">Coming<br />soon.</div>
                </div>
              ) : (
                <>
                  <p className="pillar-body">
                    <span className="show-en">{it.body_en}</span>
                    <span className="show-ja">{it.body_ja}</span>
                  </p>
                  {it.link ? (
                    <a className="pillar-link" href={it.link}>
                      <span className="show-en">View details</span>
                      <span className="show-ja">詳細を見る</span>
                    </a>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
