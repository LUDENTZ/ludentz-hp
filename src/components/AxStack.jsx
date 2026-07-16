const STACK = [
  { name: 'Claude', role: '中核。分析・生成からエージェント実行まで', core: true },
  { name: 'Google Workspace', role: 'ドキュメント・データの基盤' },
  { name: 'Slack', role: '通知・承認・AIとの接点' },
  { name: 'Notion', role: 'ナレッジ・マニュアルの定着先' },
  { name: 'Dify', role: '固定ワークフローの実装基盤' },
];

export default function AxStack() {
  return (
    <section className="business-band ax-stack">
      <div className="business-section-head">
        <p className="business-kicker">RECOMMENDED STACK</p>
        <h2>スタックは、絞る。</h2>
        <p className="business-section-copy">LUDENTZはClaudeを中核に、決まった道具立てで組みます。ツール選定から迷わないことも、立ち上がりの速さのうちです。</p>
      </div>
      <div className="ax-stack-grid">
        {STACK.map((tool) => (
          <article className={'ax-stack-card' + (tool.core ? ' is-core' : '')} key={tool.name}>
            <h3>{tool.name}</h3>
            <p>{tool.role}</p>
          </article>
        ))}
      </div>
      <div className="ax-stack-note">
        <span>非対応の環境</span>
        <p>Microsoft 365環境（Teams・SharePoint・Copilot）は、原則対応していません。スタックを絞ることで、寄せ集めの浅い横断ではなく、設計の深さに投資します。</p>
      </div>
    </section>
  );
}
