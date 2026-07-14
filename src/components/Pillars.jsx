export default function Pillars() {
  const primary = {
    n: '001',
    en: <>Business<br />Development</>,
    ja: '新規事業開発',
    tag: 'Active',
    body_en: 'Zero-to-one with operators and founders. We ship first prototypes within six weeks — concept, interface, and a working product surface.',
    body_ja: '戦略立案から具体の事業企画、サービス開発、事業グロースまで。LUDENTZの中核領域として、0→1と1→10の両方を一気通貫で支援しています。',
    links: [
      {
        href: '/service/business-development',
        number: '01',
        label: '0→1 新規事業開発支援',
        body: '構想・仮説検証・MVP・初期顧客獲得まで、次の柱をゼロから形にする。',
      },
      {
        href: '/service/business-growth',
        number: '02',
        label: '1→10 グロース支援',
        body: '立ち上がった新規事業を、GTM・営業・改善運用で売上成長の軌道に乗せる。',
      },
    ],
  };

  const secondary = [
    {
      n: '002',
      en: <>AX<br />Consulting</>,
      ja: 'AX支援',
      tag: 'Active',
      href: '/service/ax-consulting',
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
        <article className="pillar pillar--primary reveal d-1">
          <div className="pillar-head">
            <span className="pillar-num">{primary.n}</span>
            <span className="pillar-tag active">{primary.tag}</span>
          </div>
          <div className="pillar-primary-layout">
            <div className="pillar-primary-copy">
              <h3 className="pillar-en">{primary.en}</h3>
              <div className="pillar-ja">{primary.ja}</div>
            </div>
            <p className="pillar-body pillar-primary-body">
              <span className="show-en">{primary.body_en}</span>
              <span className="show-ja">{primary.body_ja}</span>
            </p>
            <div className="pillar-service-links" aria-label={`${primary.ja}のサービス`}>
              {primary.links.map((link) => (
                <a className="pillar-service-link" href={link.href} key={link.href}>
                  <span className="pillar-service-num">{link.number}</span>
                  <span className="pillar-service-main">
                    <strong>{link.label}</strong>
                    <small>{link.body}</small>
                  </span>
                  <span className="pillar-service-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </article>

        <div className="pillar-secondary-stack">
          {secondary.map((it, i) => {
          const teaser = it.tag === 'Coming soon';
          return (
            <article key={it.n} className={'pillar pillar--secondary reveal d-' + (i + 2) + (teaser ? ' pillar--teaser' : '')}>
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
                  {it.href && (
                    <a className="pillar-secondary-link" href={it.href}>
                      <span className="show-en">View details</span>
                      <span className="show-ja">詳細を見る</span>
                      <span className="pillar-service-arrow" aria-hidden="true">→</span>
                    </a>
                  )}
                </>
              )}
            </article>
          );
          })}
        </div>
      </div>
    </section>
  );
}
