/* global React */
function ContactModal({ open, onClose }) {
  const [sent, setSent] = React.useState(false);
  const [pillar, setPillar] = React.useState('Ventures');
  const [budget, setBudget] = React.useState('—');
  React.useEffect(() => { if (!open) { setSent(false); } }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {sent ? (
          <>
            <h3>Received.</h3>
            <div className="sub">
              <span className="show-en">Thank you. A person — not a form — reads every submission. We reply from Tokyo within two working days.</span>
              <span className="show-ja">ありがとうございます。すべての問い合わせは人が読みます。東京より二営業日以内に返信します。</span>
            </div>
            <div className="modal-actions" style={{justifyContent: 'flex-end'}}>
              <button className="nav-btn" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h3>
              <span className="show-en">Start a project.</span>
              <span className="show-ja">お問い合わせ。</span>
            </h3>
            <div className="sub">
              <span className="show-en">Tell us the intent. A person — not a form — reads every submission.</span>
              <span className="show-ja">フォームではなく人が読みます。</span>
            </div>
            <div className="field"><label>Name · お名前</label><input placeholder="Yamada Tarō / 山田太郎" /></div>
            <div className="field"><label>Email · メール</label><input placeholder="you@company.co" /></div>
            <div className="field"><label>Phone · 電話番号</label><input type="tel" placeholder="03-0000-0000" /></div>
            <div className="field"><label>Intent · お問い合わせ内容</label><textarea rows="3" /></div>
            <div className="modal-actions">
              <span className="eyebrow" style={{fontSize: 10, color: 'var(--fg-muted)'}}>Tokyo · JST</span>
              <div style={{display: 'flex', gap: 8}}>
                <button className="chip" onClick={onClose}>Cancel</button>
                <button className="nav-btn" onClick={() => setSent(true)}>Send →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
window.ContactModal = ContactModal;
