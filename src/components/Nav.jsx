import { useState, useEffect } from 'react';

export default function Nav({ onContact, onScrollTo }) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const jst = time
    ? time.toLocaleTimeString('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

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
