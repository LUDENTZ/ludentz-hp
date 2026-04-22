/* global React */
function Nav({ onContact, onScrollTo }) {
  const [time, setTime] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const jst = time.toLocaleTimeString('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const links = [
    { id: 'work', label: 'Work', ja: '事業' },
    { id: 'manifesto', label: 'Manifesto', ja: '能書' },
    { id: 'process', label: 'Process', ja: '行程' },
    { id: 'contact', label: 'Contact', ja: '連絡' },
  ];
  return (
    <nav className="nav">
      <a className="nav-logo" onClick={() => onScrollTo('top')}>
        LUDENTZ
      </a>
      <div className="nav-right">
        <span className="nav-ticker">TYO · {jst} JST</span>
        <button className="nav-btn" onClick={onContact}>
          <span className="show-en">Start a project</span>
          <span className="show-ja">ご相談はコチラから</span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M7 2l4 4-4 4"/></svg>
        </button>
      </div>
    </nav>
  );
}
window.Nav = Nav;
