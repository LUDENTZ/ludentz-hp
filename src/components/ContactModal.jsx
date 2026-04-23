import { useState, useEffect } from 'react';

const INITIAL = { name: '', email: '', phone: '', intent: '', hp: '' };

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setErrorMsg('');
      setForm(INITIAL);
    }
  }, [open]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.email || !form.intent) {
      setErrorMsg('Name / Email / Intent は必須です。');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const r = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      setStatus('sent');
    } catch (err) {
      setErrorMsg(err.message || 'Send failed.');
      setStatus('error');
    }
  };

  const sending = status === 'sending';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {status === 'sent' ? (
          <>
            <h3>Received.</h3>
            <div className="sub">
              <span className="show-en">Thank you for your message. We reply within one working day.</span>
              <span className="show-ja">お問い合わせありがとうございました。1営業日以内に返信します。</span>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
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

            <div className="field">
              <label>Name · お名前</label>
              <input value={form.name} onChange={set('name')} placeholder="Yamada Tarō / 山田太郎" disabled={sending} />
            </div>
            <div className="field">
              <label>Email · メール</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.co" disabled={sending} />
            </div>
            <div className="field">
              <label>Phone · 電話番号</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="03-0000-0000" disabled={sending} />
            </div>
            <div className="field">
              <label>Intent · お問い合わせ内容</label>
              <textarea rows="3" value={form.intent} onChange={set('intent')} disabled={sending} />
            </div>

            {/* honeypot — hidden from real users */}
            <input
              type="text"
              name="company_website"
              value={form.hp}
              onChange={set('hp')}
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />

            {status === 'error' && (
              <div style={{ color: '#b54b4b', fontSize: 12, marginTop: 8 }}>{errorMsg}</div>
            )}

            <div className="modal-actions">
              <span className="eyebrow" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>Tokyo · JST</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="chip" onClick={onClose} disabled={sending}>Cancel</button>
                <button className="nav-btn" onClick={submit} disabled={sending}>
                  {sending ? 'Sending…' : 'Send →'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
