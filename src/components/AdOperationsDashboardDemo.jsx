export default function AdOperationsDashboardDemo() {
  return (
    <section className="business-band ad-ops-demo" aria-labelledby="ad-ops-demo-title">
      <div className="business-section-head">
        <p className="business-kicker">WORKING DEMO</p>
        <h2 id="ad-ops-demo-title">レポートから、改善実装まで。</h2>
        <p className="business-section-copy">
          広告データを眺めるだけで終わらず、検索語句からボトルネックと変更案を示し、人の承認後にGoogle広告へ反映。実行後の照合までを一つの画面で行います。
        </p>
      </div>
      <figure className="ad-ops-demo-frame">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/ad-operations-dashboard/poster.png"
          aria-label="広告運用AXダッシュボードの操作デモ"
        >
          <source src="/media/ad-operations-dashboard/dashboard-demo.mp4" type="video/mp4" />
          <source src="/media/ad-operations-dashboard/dashboard-demo.webm" type="video/webm" />
        </video>
        <figcaption>デモデータを使用しています。実案件では、媒体アカウント・LP・承認ルールに合わせて構築します。</figcaption>
      </figure>
    </section>
  );
}
