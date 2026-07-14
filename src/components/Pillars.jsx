export default function Pillars() {
  const primary = {
    n: '001',
    en: <>AX<br />Consulting</>,
    ja: 'AX支援',
    tag: 'Active',
    body_en: 'AI-native business process re-engineering. We rebuild the workflow itself — not just add a tool — and forward deployed engineers stay on-site until it ships and sticks.',
    body_ja: '最新AI技術を前提に、業務プロセスそのものを作り変えるAI BPR。診断や資料で終わらせず、現場に入る専任エンジニア（FDE）が、実装から組織定着までを担います。',
    links: [
      {
        href: '/service/ax-consulting',
        number: '',
        label: 'AI BPR｜業務プロセスをAI前提に再設計',
        body: '業務を棚卸しし、インパクトの大きい領域からAI前提へ。FDE（現場に入る専任エンジニア）が実装・定着まで一気通貫で担う。',
      },
    ],
  };

  const secondary = [
    {
      n: '002',
      en: <>Business<br />Development</>,
      ja: '新規事業開発',
      tag: 'Active',
      href: '/service/business-development',
      body_en: 'Zero-to-one with operators and founders. Concept, validation, MVP, and first customers — we ship the next pillar from scratch.',
      body_ja: '構想・仮説検証・MVP・初期顧客獲得まで。AIプロダクトで、次の柱をゼロから形にする0→1支援。',
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
