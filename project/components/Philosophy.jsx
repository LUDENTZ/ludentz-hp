/* global React */
function Philosophy() {
  const items = [
    {
      n: '001',
      en: 'Less, but exact.',
      ja: '少なく、正確に。',
      body_en: 'Subtract first. Then place what remains in its perfect position. Minimal is not empty — it is intentional density.',
      body_ja: 'まず引く。残されたものを、その完璧な位置に置く。最小は空ではない。それは意図された密度である。',
    },
    {
      n: '002',
      en: 'Grid as structure.',
      ja: '構造としての格子。',
      body_en: "An orderly grid renders the studio's intelligence visible. We break it only to deliver meaning — never for decoration.",
      body_ja: '秩序ある格子は、スタジオの知性を可視化する。我々が格子を崩すのは、意味を運ぶときだけ。',
    },
    {
      n: '003',
      en: 'Serious, not solemn.',
      ja: '真剣に、されど荘厳でなく。',
      body_en: 'Earnest, never stiff. We play with type and ratio. We never play with hue — colour stays monochrome by design.',
      body_ja: '真剣であるが、固くはない。タイポグラフィと比率で遊ぶ。色では遊ばない。モノクロは設計である。',
    },
  ];
  return (
    <section className="section" id="philosophy" data-screen-label="Philosophy">
      <div className="section-head">
        <div className="section-num eyebrow">§ 02</div>
        <div className="section-kicker">
          <span className="show-en">Principles</span>
          <span className="show-ja">原則</span>
        </div>
        <h2 className="section-title reveal">
          <span className="show-en">How we <span className="ja">設計</span><br/>every engagement.</span>
          <span className="show-ja">すべての仕事を、<br/>この三つで設計する。</span>
        </h2>
      </div>

      <div className="philo-grid">
        {items.map((it, i) => (
          <div key={it.n} className={'philo-col reveal d-' + (i % 3 + 1)} style={{gridColumn: i === 2 ? 'span 12' : 'span 6'}}>
            <div className="philo-num">{it.n}</div>
            <h3 className="philo-title">
              {it.en}
              <span className="ja">{it.ja}</span>
            </h3>
            <p className="philo-body">
              <span className="show-en">{it.body_en}</span>
              <span className="show-ja">{it.body_ja}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
window.Philosophy = Philosophy;
