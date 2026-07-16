const MODELS = [
  {
    number: '①',
    name: '伴走型',
    en: 'SKILLS',
    concept: 'AIスキルの設計・配布',
    rows: [
      ['対象', '人が判断しながら進める業務'],
      ['例', '分析、企画、クリエイティブ、提案書'],
      ['提供', '業務手順のSkill化・配布・定着伴走。個人の生産性を再設計する'],
    ],
  },
  {
    number: '②',
    name: '固定ワークフロー',
    en: 'WORKFLOW',
    concept: '決定論的パイプライン + LLM工程',
    rows: [
      ['対象', '毎回同じ手順で流れる定型業務'],
      ['例', '定時レポートの集計・配信、リード処理'],
      ['提供', '「エージェント化しない」判断。安く、壊れにくい自動化として実装する'],
    ],
  },
  {
    number: '③',
    name: '委任型エージェント',
    en: 'DELEGATED',
    concept: '既製エージェント → カスタム構築',
    rows: [
      ['対象', '投げて離れる業務（無人・長時間・並列）'],
      ['例', '常時リサーチ、アウトバウンド運用'],
      ['提供', '既製のエージェント環境から始め、必要な時のみカスタム構築する'],
    ],
  },
];

export default function AxServiceModel() {
  return (
    <section className="business-band ax-model">
      <div className="business-section-head">
        <p className="business-kicker">SERVICE MODEL</p>
        <h2>業務を棚卸しし、<span className="nowrap">3つの型</span>に組み直す。</h2>
        <p className="business-section-copy">すべての業務を工程レベルで洗い出し、「どの型で組み直すか」を見立てます。丸ごと自動化するのではありません。どこに人の判断を残すか、現場の専門性をどうフローに織り込むか——その設計こそが、価値の源泉です。</p>
      </div>

      <div className="ax-model-gate">
        <span className="ax-model-gate-label">判定基準</span>
        <p className="ax-model-gate-question">その業務、開始ボタンを押したあと「人がそこにいる」必要があるか？</p>
        <ul className="ax-model-gate-routes">
          <li>いる <em>→ ① 伴走型</em></li>
          <li>いらない・手順を渡せる <em>→ ② 固定ワークフロー</em></li>
          <li>いらない・目的だけ渡したい <em>→ ③ 委任型エージェント</em></li>
        </ul>
      </div>

      <div className="ax-model-grid">
        {MODELS.map((model) => (
          <article className="ax-model-card" key={model.en}>
            <div className="ax-model-head">
              <span className="ax-model-num" aria-hidden="true">{model.number}</span>
              <h3>{model.name}</h3>
              <small>{model.en}</small>
            </div>
            <p className="ax-model-concept">{model.concept}</p>
            <dl className="ax-model-rows">
              {model.rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <p className="ax-model-statement">売り物は「機構」ではなく「設計」——業務をどこで切り、何をAIに任せ、何をルールで縛り、何を人が見るか。</p>
    </section>
  );
}
