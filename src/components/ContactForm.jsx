import { useEffect, useState } from 'react';
import { trackEvent } from '../lib/analytics';

const INITIAL = { company: '', name: '', email: '', phone: '', intent: '', hp: '' };

export default function ContactForm({ onCancel, resetKey = 0, showCancel = false }) {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setStatus('idle');
    setErrorMsg('');
    setForm(INITIAL);
  }, [resetKey]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    trackEvent('contact_form_submit_attempt', {
      page_path: window.location.pathname,
      form_location: showCancel ? 'modal' : 'page',
    });

    if (!form.company || !form.name || !form.email || !form.intent) {
      trackEvent('contact_form_validation_error', {
        page_path: window.location.pathname,
        form_location: showCancel ? 'modal' : 'page',
      });
      setErrorMsg('Company / Name / Email / Intent は必須です。');
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
      trackEvent('contact_form_submit_success', {
        page_path: window.location.pathname,
        form_location: showCancel ? 'modal' : 'page',
      });
      setStatus('sent');
    } catch (err) {
      trackEvent('contact_form_submit_error', {
        page_path: window.location.pathname,
        form_location: showCancel ? 'modal' : 'page',
      });
      setErrorMsg(err.message || 'Send failed.');
      setStatus('error');
    }
  };

  const sending = status === 'sending';

  if (status === 'sent') {
    return (
      <div className="contact-form contact-form--sent">
        <h3>Received.</h3>
        <div className="sub">
          <span className="show-en">Thank you for your message. We reply within one working day.</span>
          <span className="show-ja">お問い合わせありがとうございました。1営業日以内に返信します。</span>
        </div>
        {showCancel && (
          <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="nav-btn" onClick={onCancel}>Close</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="contact-form">
      <h3>
        <span className="show-en">Start a project.</span>
        <span className="show-ja">お問い合わせ。</span>
      </h3>
      <div className="sub">
        <span className="show-en">Tell us the intent. A person — not a form — reads every submission.</span>
        <span className="show-ja">AIではなく、人が読みます。</span>
      </div>

      <div className="field">
        <label>Company · 社名</label>
        <input value={form.company || ''} onChange={set('company')} placeholder="LUDENTZ株式会社" disabled={sending} />
      </div>
      <div className="field">
        <label>Name · お名前</label>
        <input value={form.name || ''} onChange={set('name')} placeholder="Yamada Taro / 山田太郎" disabled={sending} />
      </div>
      <div className="field">
        <label>Email · メール</label>
        <input type="email" value={form.email || ''} onChange={set('email')} placeholder="you@company.co" disabled={sending} />
      </div>
      <div className="field">
        <label>Phone · 電話番号</label>
        <input type="tel" value={form.phone || ''} onChange={set('phone')} placeholder="03-0000-0000" disabled={sending} />
      </div>
      <div className="field">
        <label>Intent · お問い合わせ内容</label>
        <textarea rows="3" value={form.intent || ''} onChange={set('intent')} disabled={sending} />
      </div>

      <input
        type="text"
        name="company_website"
        value={form.hp || ''}
        onChange={set('hp')}
        tabIndex="-1"
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      {status === 'error' && (
        <div className="contact-form-error">{errorMsg}</div>
      )}

      <div className="modal-actions">
        <span className="eyebrow" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>Tokyo · JST</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {showCancel && <button className="chip" onClick={onCancel} disabled={sending}>Cancel</button>}
          <button className="nav-btn" onClick={submit} disabled={sending}>
            {sending ? 'Sending...' : 'Send ->'}
          </button>
        </div>
      </div>
    </div>
  );
}
