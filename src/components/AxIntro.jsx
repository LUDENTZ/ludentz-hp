const commonIssues = [
  {
    number: '01',
    title: '導入したツールが、現場の業務プロセスに組み込まれない。',
    body: '単発のツール導入で終わり、日々の仕事のやり方は変わらないまま。',
  },
  {
    number: '02',
    title: '何から着手すべきか、優先順位を判断できる人材が社内にいない。',
    body: 'AIに詳しい人材が不足し、投資対効果の見極めができず着手が遅れる。',
  },
  {
    number: '03',
    title: '個別業務の自動化で止まり、事業構造レベルの変革に至らない。',
    body: '部署単位の部分最適にとどまり、全社的な競争力の底上げにつながらない。',
  },
];

export default function AxIntro() {
  return (
    <section className="business-band ax-issues">
      <div className="business-section-head">
        <p className="business-kicker">はじめに</p>
        <h2>AIは、ツールを入れただけでは定着しない。</h2>
        <p className="business-section-copy">多くの企業で、AI活用は部署ごとの単発導入にとどまり、事業の成果につながっていません。全社共通の課題として、ほぼ同じ壁に突き当たります。</p>
      </div>
      <div className="business-issue-grid">
        {commonIssues.map((issue) => (
          <article key={issue.number}>
            <span>{issue.number}</span>
            <h3>{issue.title}</h3>
            <p>{issue.body}</p>
          </article>
        ))}
      </div>
      <div className="ax-adoption">
        <div className="ax-adoption-lead">
          <h3>定着は、現場と作る。</h3>
          <p>AXが失敗する典型は、課題解決として「正しいシステム」を作り、現場に渡して終わること。現場は「今のやり方を否定された」と感じ、使われないまま形骸化します。否定すべきは、現場のやり方ではなく、AXの進め方の方です。LUDENTZは、まず現場の強みと専門性を起点に設計し、小さな成功を積み上げて合意を作りながら、業務に溶け込ませます。</p>
        </div>
        <ul className="ax-adoption-points">
          <li>現場の強みを、設計の起点にする</li>
          <li>小さく入れ、成功で合意を広げる</li>
          <li>何を自動化し、何を人が持つかを再設計する</li>
        </ul>
      </div>
    </section>
  );
}
