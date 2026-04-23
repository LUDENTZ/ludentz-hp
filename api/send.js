// Vercel Serverless Function — POST /api/send
// Sends contact form submissions to LUDENTZ via Resend.
//
// Required env vars:
//   RESEND_API_KEY      — https://resend.com/api-keys
//   CONTACT_FROM_EMAIL  — verified sender (e.g. noreply@ludentz.co.jp)
//   CONTACT_TO_EMAILS   — comma-separated recipients

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ok = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, intent, hp } = req.body || {};

  // honeypot — real users leave this empty
  if (hp) return res.status(200).json({ ok: true });

  if (!name || !email || !intent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!ok(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (String(intent).length > 5000) {
    return res.status(400).json({ error: 'Intent too long' });
  }

  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAILS } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAILS) {
    console.error('Missing env vars');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const to = CONTACT_TO_EMAILS.split(',').map((s) => s.trim()).filter(Boolean);

  const subject = `[LUDENTZ LP] ${name} — ${String(intent).slice(0, 60).replace(/\s+/g, ' ')}`;
  const text = [
    `Name:   ${name}`,
    `Email:  ${email}`,
    `Phone:  ${phone || '(none)'}`,
    '',
    'Intent:',
    intent,
  ].join('\n');
  const html = `
    <table style="font-family: -apple-system, sans-serif; font-size: 14px; line-height: 1.6; color: #0A0A0A;">
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Phone</td><td>${escapeHtml(phone || '(none)')}</td></tr>
      <tr><td style="padding: 12px 12px 4px 0; color: #6B6B6B; vertical-align: top;">Intent</td><td style="padding-top: 12px; white-space: pre-wrap;">${escapeHtml(intent)}</td></tr>
    </table>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend error', r.status, detail);
      return res.status(502).json({ error: 'Upstream send failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Send failed' });
  }
}
