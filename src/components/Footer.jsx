export default function Footer() {
  const scrollTo = (id) => {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-cols">
          <div className="footer-col">
            <div className="h">Studio</div>
            <a onClick={() => scrollTo('top')}>About</a>
            <a onClick={() => scrollTo('company')}>Company</a>
            <a onClick={() => scrollTo('contact')}>Contact</a>
          </div>
          <div className="footer-col">
            <div className="h">Work</div>
            <a onClick={() => scrollTo('work')}>Business Development</a>
            <a onClick={() => scrollTo('work')}>Marketing AX</a>
            <a onClick={() => scrollTo('work')}>In-house · Soon</a>
          </div>
        </div>
        <div
          className="footer-wordmark"
          onClick={() => scrollTo('top')}
          style={{ cursor: 'pointer' }}
        >
          LUDENTZ
        </div>
        <div className="footer-bottom">
          <span>© 2026 LUDENTZ</span>
        </div>
      </div>
    </footer>
  );
}
