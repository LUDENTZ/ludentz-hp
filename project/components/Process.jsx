/* global React */
function Process() {
  const rows = [
    { n: '01', t_en: 'Listen', t_ja: '傾聴', d_en: 'One long conversation. We map intent, constraints, and the shape of the thing you are actually trying to build.', d_ja: '一度の長い対話で、意図・制約・作ろうとしているものの形を捉える。', w: 'Week 1' },
    { n: '02', t_en: 'Structure', t_ja: '構造化', d_en: 'We re-draw the information architecture, business model, and product surface on one page. Agreement comes from structure, not taste.', d_ja: '情報設計・事業モデル・プロダクト面を一枚に再描画する。合意は趣味ではなく構造から。', w: 'Week 2' },
    { n: '03', t_en: 'Prototype', t_ja: '試作', d_en: 'A working prototype — not a deck. We show the thing, in the hand, under realistic load.', d_ja: '動く試作を出す。デッキではない。実際の負荷で、手の中で示す。', w: 'Week 3 — 5' },
    { n: '04', t_en: 'Ship', t_ja: '出荷', d_en: 'Production-ready surface on week six. After that, the engagement continues only on explicit renewal.', d_ja: '六週間目に出荷可能な状態へ。以降は明示的な更新のみで継続。', w: 'Week 6' },
  ];
  return (
    <section className="section" id="process" data-screen-label="Process">
      <div className="section-head">
        <div className="section-num eyebrow">§ 03</div>
        <div className="section-kicker">
          <span className="show-en">Engagement</span>
          <span className="show-ja">進め方</span>
        </div>
        <h2 className="section-title reveal">
          <span className="show-en">Six weeks,<br/>four movements.</span>
          <span className="show-ja">六週間、<br/>四つの楽章。</span>
        </h2>
      </div>

      <div className="process">
        <div className="process-intro reveal">
          <span className="show-en">Every engagement runs on the same rhythm. No pitches, no decks-about-the-deck. We work with two to four operators at a time, and we say no often.</span>
          <span className="show-ja">全ての案件は同じリズムで進む。営業デッキもデッキについてのデッキもない。同時進行は2〜4件まで。断ることもしばしば。</span>
        </div>
        <div className="process-list">
          {rows.map((r, i) => (
            <div key={r.n} className={'process-row reveal d-' + ((i % 3) + 1)}>
              <div className="n">{r.n}</div>
              <div className="t">
                {r.t_en}
                <span className="ja">{r.t_ja}</span>
              </div>
              <div className="d">
                <span className="show-en">{r.d_en}</span>
                <span className="show-ja">{r.d_ja}</span>
              </div>
              <div className="w">{r.w}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Process = Process;
