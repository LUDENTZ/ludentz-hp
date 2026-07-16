const plans = [
  {
    name: '助言のみ',
    label: 'ADVISORY',
    price: '月20万円〜',
    body: 'AI活用方針の助言・壁打ちを中心としたプラン（実働なし）。',
  },
  {
    name: '伴走支援',
    label: 'HANDS-ON',
    price: '月50万円〜200万円',
    body: '週次MTGと実行支援。支援範囲は内容に応じて調整します。',
  },
];

export default function AxPricing() {
  return (
    <section className="business-band ax-pricing">
      <div className="business-section-head">
        <p className="business-kicker">PRICING</p>
        <h2>まず助言から。実行フェーズで伴走へ。</h2>
        <p className="business-section-copy">状況に合わせて、助言のみ／実行まで踏み込む伴走支援の2段階でご提供します。</p>
      </div>
      <div className="ax-plan-grid">
        {plans.map((plan) => (
          <article className="ax-plan" key={plan.name}>
            <span className="ax-plan-label">{plan.label}</span>
            <h3 className="ax-plan-name">{plan.name}</h3>
            <strong className="ax-plan-price">{plan.price}</strong>
            <p className="ax-plan-body">{plan.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
