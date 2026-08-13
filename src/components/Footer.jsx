export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-cols">
          <div className="footer-col">
            <div className="h">Studio</div>
            <a href="/">About</a>
            <a href="/#company">Company</a>
            <a href="/#contact">Contact</a>
          </div>
          <div className="footer-col">
            <div className="h">Work</div>
            <a href="/service/ax-consulting">Marketing AX</a>
            <a href="/service/sales-ax">営業AX</a>
            <a href="/service/business-development">Business Development</a>
          </div>
          <div className="footer-col">
            <div className="h">Knowledge</div>
            <a href="/marketing-ax/">マーケティングAXとは</a>
            <a href="/marketing-ax/ad-operations">広告運用AXとは</a>
            <a href="/marketing-ax/cost">AX支援の費用相場</a>
            <a href="/marketing-ax/comparison">内製 vs 外注 vs AX</a>
            <a href="/marketing-ax/three-levels">AI委譲の3段階</a>
            <a href="https://note.com/marketing_ax" target="_blank" rel="noopener">実践ログ（note）↗</a>
          </div>
        </div>
        <div
          className="footer-wordmark"
        >
          <a href="/" aria-label="LUDENTZ トップページ">LUDENTZ</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 LUDENTZ</span>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
