export default function Pillars() {
  const primary = {
    n: '001',
    en: <>Marketing AX</>,
    ja: 'マーケの業務プロセスをAI前提に再設計',
    tag: 'Active',
    body_en: 'Adding AI as a tool only gets you so far. We rebuild the business process itself on an AI-native premise, and stay with the team until it sticks.',
    body_ja: 'AIをツールとして足すだけでは、成果は頭打ちになる。業務プロセスそのものをAI前提に作り変え、組織に定着するまで伴走します。',
    links: [
      {
        href: '/service/ad-operations-ax',
        number: '01',
        label: '広告運用AX',
        body: '広告運用まわりの実務を工程レベルで分解し、AIエージェント化。提案資料・レポーティング・入稿・運用改善までを自動化する。',
      },
      {
        href: '/service/prospecting-ax',
        number: '02',
        label: '新規開拓AX',
        body: 'ターゲットリストの作成から文面生成、送信、返信対応までをAIエージェント化。フォーム・メール・手紙・FAX・テレアポ（検証中）の接点づくりを自動で回す。',
      },
      {
        href: '/service/publishing-ax',
        number: '03',
        label: '情報発信AX',
        body: '事例記事・オウンドメディア・社内報まで、発信業務をAIエージェント化。取材音源や実績データを投げれば、記事の初稿まで自動で仕上がる。',
      },
    ],
  };

  const secondary = [
    {
      n: '002',
      en: <>Sales<br />AX</>,
      ja: 'セールスAX',
      tag: 'Active',
      href: '/service/sales-ax',
      featured: true,
      body_en: 'Reduce the work after every sales meeting. We connect HubSpot updates, follow-up emails, tasks, and next-meeting preparation into one operating flow.',
      body_ja: '商談後のHubSpot更新、フォローメール、タスク、次回準備を一つの流れに。営業担当者の手間を減らし、判断と顧客対応に集中できる運用を設計します。',
    },
    {
      n: '003',
      en: <>Business<br />Development</>,
      ja: '新規事業開発',
      tag: 'Active',
      href: '/service/business-development',
      body_en: 'Zero-to-one with operators and founders. Concept, validation, MVP, and first customers — we ship the next pillar from scratch.',
      body_ja: '構想・仮説検証・MVP・初期顧客獲得まで。AIプロダクトで、次の柱をゼロから形にする0→1支援。',
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
            <a className="pillar-knowledge-link" href="/marketing-ax/">
              <span>マーケティングAXとは何か？</span>
              <span className="pillar-service-arrow" aria-hidden="true">→</span>
            </a>
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
            <article key={it.n} className={'pillar pillar--secondary reveal d-' + (i + 2) + (it.featured ? ' pillar--featured' : '') + (teaser ? ' pillar--teaser' : '')}>
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
