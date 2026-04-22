/* global React */
function Company() {
  const rows = [
    {
      k_en: 'Company',
      k_ja: '会社名',
      v: <>LUDENTZ<span className="tiny">株式会社</span></>,
    },
    {
      k_en: 'Representative',
      k_ja: '代表取締役',
      v: <img src="assets/rep-name.png" srcSet="assets/rep-name.png 1x, assets/rep-name-2x.png 2x" alt="" className="rep-name" aria-hidden="true" />,
    },
    {
      k_en: 'Founded',
      k_ja: '設立',
      v: (
        <>
          <span className="show-en">1 April 2026</span>
          <span className="show-ja">2026年4月1日</span>
        </>
      ),
    },
    {
      k_en: 'Capital',
      k_ja: '資本金',
      v: (
        <>
          <span className="show-en">JPY 3,000,000</span>
          <span className="show-ja">3,000,000円</span>
        </>
      ),
    },
    {
      k_en: 'Address',
      k_ja: '所在地',
      v: (
        <>
          <span className="show-en">Park Front Shinjuku 202,<br/>2-8-15 Shinjuku, Shinjuku-ku, Tokyo</span>
          <span className="show-ja">東京都新宿区新宿2丁目8番15号<br/>パークフロント新宿202号室</span>
        </>
      ),
    },
  ];

  return (
    <section className="section" id="company" data-screen-label="Company">
      <div className="section-head">
        <div className="section-kicker">
          <span className="show-en">Company</span>
          <span className="show-ja">会社概要</span>
        </div>
        <h2 className="section-title reveal">
          <span className="show-en">Company<br/>information.</span>
        </h2>
      </div>

      <div className="company-wrap">
        <dl className="company-dl reveal">
          {rows.map((r) => (
            <React.Fragment key={r.k_en}>
              <dt>
                <span className="dt-num">{r.k_en}</span>
                <span className="dt-ja">{r.k_ja}</span>
              </dt>
              <dd>{r.v}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}
window.Company = Company;
