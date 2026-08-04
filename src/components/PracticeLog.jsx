import noteFeed from '../data/note-feed.json';

export const NOTE_URL = 'https://note.com/marketing_ax';

// フィードのaccount → 表示ラベルとリンク先
const ACCOUNTS = {
  marketing_ax: { label: 'LUDENTZ', url: 'https://note.com/marketing_ax' },
  yyy_018: { label: '小林', url: 'https://note.com/yyy_018' },
};

// noteの実践ログ（ビルド時にRSSから焼き込み）。フィードが空のときは fallback を表示する
export default function PracticeLog({ fallback = null, className = '' }) {
  if (noteFeed.items.length === 0) return fallback;

  return (
    <div className={'knowledge-note' + (className ? ' ' + className : '')}>
      <span className="knowledge-note-kicker">PRACTICE LOG — note</span>
      <div className="knowledge-note-head">
        <div className="knowledge-note-lead">
          <h3 className="knowledge-note-heading">実践ログ</h3>
          <p className="knowledge-note-copy">
            自社の業務をAIエージェントで回す、日々の実践記録。うまくいった型も、失敗も、noteでそのまま公開しています。
          </p>
        </div>
        <div className="knowledge-note-links">
          <a className="knowledge-note-all" href={ACCOUNTS.marketing_ax.url} target="_blank" rel="noopener">
            LUDENTZのnote ↗
          </a>
          <a className="knowledge-note-all" href={ACCOUNTS.yyy_018.url} target="_blank" rel="noopener">
            小林のnote ↗
          </a>
        </div>
      </div>
      <div className="knowledge-note-grid">
        {noteFeed.items.slice(0, 6).map((item) => {
          const account = ACCOUNTS[item.account] || ACCOUNTS.marketing_ax;
          return (
            <a
              className="knowledge-note-card"
              href={item.url}
              target="_blank"
              rel="noopener"
              key={item.url}
            >
              {item.thumbnail ? (
                <img className="knowledge-note-thumb" src={item.thumbnail} alt="" loading="lazy" />
              ) : (
                <span className="knowledge-note-thumb knowledge-note-thumb--empty" aria-hidden="true">
                  note
                </span>
              )}
              <span className="knowledge-note-date">
                {[item.date ? item.date.replaceAll('-', '.') : null, account.label]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              <h3 className="knowledge-note-title">{item.title}</h3>
            </a>
          );
        })}
      </div>
    </div>
  );
}
