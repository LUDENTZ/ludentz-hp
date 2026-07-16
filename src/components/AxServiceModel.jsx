const MODELS = [
  {
    number: '①',
    name: '伴走型',
    en: 'SKILLS',
    concept: 'Claude + Skills 設計・配布',
    rows: [
      ['対象', '人が判断しながら進める業務'],
      ['例', '分析、企画、クリエイティブ、提案書'],
      ['提供', '業務手順のSkill化・配布・定着伴走。個人の生産性を再設計する'],
      ['責任', '実行判断は常に現場の人間に残る'],
    ],
  },
  {
    number: '②',
    name: '固定ワークフロー',
    en: 'WORKFLOW',
    concept: '決定的パイプライン + LLM工程',
    rows: [
      ['対象', '毎回同じ手順で流れる定型業務'],
      ['例', '定時レポートの集計・配信、リード処理'],
      ['提供', '「エージェント化しない」判断。安く、壊れにくい自動化として実装する'],
      ['責任', '挙動が決定的なため、統制しやすい'],
    ],
  },
  {
    number: '③',
    name: '委任型エージェント',
    en: 'DELEGATED',
    concept: 'Claude Cowork → Managed Agents',
    rows: [
      ['対象', '投げて離れる業務（無人・長時間・並列）'],
      ['例', '常時リサーチ、アウトバウンド運用'],
      ['提供', '既製（Cowork）から始め、必要な時のみカスタム構築（Managed Agents）'],
      ['責任', '設計・構築はLUDENTZ。運用保守はクライアントへ移管、または提携先をご紹介'],
    ],
  },
];

export default function AxServiceModel() {
  return (
    <section className="business-band ax-model">
      <div className="business-section-head">
        <p className="business-kicker">SERVICE MODEL</p>
        <h2>提供モデルは、3枚。</h2>
        <p className="business-section-copy"><strong>We build on Claude.</strong> — Claude特化は制約ではなく戦略です。寄せ集めの浅い横断ではなく、設計の深さで勝ちます。</p>
      </div>

      <div className="ax-model-gate">
        <span className="ax-model-gate-label">判定基準</span>
        <p className="ax-model-gate-question">その業務、開始ボタンを押したあと「人がそこにいる」必要があるか？</p>
        <ul className="ax-model-gate-routes">
          <li>いる <em>→ ① 伴走型</em></li>
          <li>毎回同じ手順 <em>→ ② 固定ワークフロー</em></li>
          <li>投げて離れる <em>→ ③ 委任型エージェント</em></li>
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
