import { useEffect, useId, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics';

const INITIAL = { company: '', name: '', email: '', phone: '', intent: '', hp: '' };

export default function ContactForm({
  onCancel,
  resetKey = 0,
  showCancel = false,
  source = 'general',
  trackingPrefix = '',
  submitLabel = 'Send ->',
  sentTitle = 'Received.',
  sentMessage = 'お問い合わせありがとうございました。1営業日以内に返信します。',
  successLink = '',
  successLinkLabel = '',
  onSuccess,
}) {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const started = useRef(false);
  const submitting = useRef(false);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    setStatus('idle');
    setErrorMsg('');
    setFieldErrors({});
    setForm(INITIAL);
    started.current = false;
    submitting.current = false;
  }, [resetKey]);

  const noteStart = () => {
    if (!trackingPrefix || started.current) return;
    started.current = true;
    trackEvent(`${trackingPrefix}_form_start`, { page_path: window.location.pathname });
  };

  const set = (k) => (e) => {
    noteStart();
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setFieldErrors((errors) => ({ ...errors, [k]: '' }));
  };

  const submit = async (event) => {
    event?.preventDefault();
    trackEvent('contact_form_submit_attempt', {
      page_path: window.location.pathname,
      form_location: showCancel ? 'modal' : 'page',
    });

    const errors = {
      company: form.company ? '' : '社名を入力してください。',
      name: form.name ? '' : 'お名前を入力してください。',
      email: !form.email
        ? 'メールアドレスを入力してください。'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
          ? ''
          : 'メールアドレスの形式を確認してください。',
      intent: form.intent ? '' : 'お問い合わせ内容を入力してください。',
    };
    if (Object.values(errors).some(Boolean)) {
      trackEvent('contact_form_validation_error', {
        page_path: window.location.pathname,
        form_location: showCancel ? 'modal' : 'page',
      });
      setFieldErrors(errors);
      setErrorMsg('未入力の必須項目があります。');
      setStatus('error');
      return;
    }
    if (submitting.current) return;
    submitting.current = true;
    setStatus('sending');
    setErrorMsg('');
    try {
      const r = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      trackEvent('contact_form_submit_success', {
        page_path: window.location.pathname,
        form_location: showCancel ? 'modal' : 'page',
      });
      if (trackingPrefix) {
        trackEvent(`${trackingPrefix}_form_submit`, { page_path: window.location.pathname });
      }
      setStatus('sent');
      onSuccess?.(form);
    } catch (err) {
      submitting.current = false;
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
      <div className="contact-form contact-form--sent" role="status">
        <h3>{sentTitle}</h3>
        <div className="sub">
          <span className="show-en">Thank you for your message. We reply within one working day.</span>
          <span className="show-ja">{sentMessage}</span>
        </div>
        {successLink && (
          <a className="nav-btn contact-form-success-link" href={successLink}>
            {successLinkLabel || 'Continue →'}
          </a>
        )}
        {showCancel && (
          <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="nav-btn" onClick={onCancel}>Close</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <h3>
        <span className="show-en">Start a project.</span>
        <span className="show-ja">お問い合わせ。</span>
      </h3>
      <div className="sub">
        <span className="show-en">Tell us the intent. A person — not a form — reads every submission.</span>
        <span className="show-ja">AIではなく、人が読みます。</span>
      </div>

      <div className="field">
        <label htmlFor={`${id}-company`}>Company · 社名</label>
        <input id={`${id}-company`} value={form.company || ''} onChange={set('company')} placeholder="LUDENTZ株式会社" disabled={sending} required aria-invalid={Boolean(fieldErrors.company)} aria-describedby={fieldErrors.company ? `${id}-company-error` : undefined} />
        {fieldErrors.company && <span className="contact-field-error" id={`${id}-company-error`}>{fieldErrors.company}</span>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-name`}>Name · お名前</label>
        <input id={`${id}-name`} value={form.name || ''} onChange={set('name')} placeholder="Yamada Taro / 山田太郎" disabled={sending} required aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? `${id}-name-error` : undefined} />
        {fieldErrors.name && <span className="contact-field-error" id={`${id}-name-error`}>{fieldErrors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-email`}>Email · メール</label>
        <input id={`${id}-email`} type="email" value={form.email || ''} onChange={set('email')} placeholder="you@company.co" disabled={sending} required aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? `${id}-email-error` : undefined} />
        {fieldErrors.email && <span className="contact-field-error" id={`${id}-email-error`}>{fieldErrors.email}</span>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-phone`}>Phone · 電話番号</label>
        <input id={`${id}-phone`} type="tel" value={form.phone || ''} onChange={set('phone')} placeholder="03-0000-0000" disabled={sending} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-intent`}>Intent · お問い合わせ内容</label>
        <textarea id={`${id}-intent`} rows="3" value={form.intent || ''} onChange={set('intent')} disabled={sending} required aria-invalid={Boolean(fieldErrors.intent)} aria-describedby={fieldErrors.intent ? `${id}-intent-error` : undefined} />
        {fieldErrors.intent && <span className="contact-field-error" id={`${id}-intent-error`}>{fieldErrors.intent}</span>}
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

      {status === 'error' && errorMsg && (
        <div className="contact-form-error" role="alert">{errorMsg}</div>
      )}

      <div className="modal-actions">
        <span className="eyebrow" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>Tokyo · JST</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {showCancel && <button className="chip" type="button" onClick={onCancel} disabled={sending}>Cancel</button>}
          <button className="nav-btn" type="submit" disabled={sending}>
            {sending ? 'Sending...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
