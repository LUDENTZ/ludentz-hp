// Vercel Serverless Function — POST /api/send
// Sends contact form submissions to LUDENTZ via Resend.
//
// Required env vars:
//   RESEND_API_KEY      — https://resend.com/api-keys
//   CONTACT_FROM_EMAIL  — verified sender (e.g. noreply@ludentz.co.jp)
//   CONTACT_TO_EMAILS   — comma-separated recipients

import { SALES_AX_SCHEDULE_URL, SALES_AX_SOURCE } from '../src/config/salesAx.js';

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ok = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { company, name, email, phone, intent, hp, source } = req.body || {};
  const isSalesAx = source === SALES_AX_SOURCE;

  // honeypot — real users leave this empty
  if (hp) return res.status(200).json({ ok: true });

  if (!company || !name || !email || !intent) {
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

  const subject = `[LUDENTZ LP${isSalesAx ? ' / 営業AX' : ''}] ${company} / ${name} — ${String(intent).slice(0, 60).replace(/\s+/g, ' ')}`;
  const text = [
    `Company: ${company}`,
    `Name:   ${name}`,
    `Email:  ${email}`,
    `Phone:  ${phone || '(none)'}`,
    `Source: ${isSalesAx ? '営業AX LP' : source || 'general'}`,
    '',
    'Intent:',
    intent,
  ].join('\n');
  const html = `
    <table style="font-family: -apple-system, sans-serif; font-size: 14px; line-height: 1.6; color: #0A0A0A;">
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Company</td><td>${escapeHtml(company)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Phone</td><td>${escapeHtml(phone || '(none)')}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #6B6B6B;">Source</td><td>${escapeHtml(isSalesAx ? '営業AX LP' : source || 'general')}</td></tr>
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
    if (isSalesAx) {
      const autoReply = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL,
          to: [email],
          subject: '【LUDENTZ】営業AXのご相談を受け付けました',
          text: `${name} 様\n\n営業AXへのお問い合わせありがとうございます。\n続けて、以下より30分のご相談日時をお選びください。\n\n${SALES_AX_SCHEDULE_URL}\n\n日程を選択されなかった場合も、担当者よりご連絡いたします。\n\nLUDENTZ株式会社`,
          html: `<div style="font-family:-apple-system,sans-serif;font-size:14px;line-height:1.9;color:#0A0A0A;"><p>${escapeHtml(name)} 様</p><p>営業AXへのお問い合わせありがとうございます。<br>続けて、以下より30分のご相談日時をお選びください。</p><p><a href="${SALES_AX_SCHEDULE_URL}" style="display:inline-block;padding:12px 18px;background:#0A0A0A;color:#fff;text-decoration:none;">30分の相談日時を選ぶ</a></p><p>日程を選択されなかった場合も、担当者よりご連絡いたします。</p><p>LUDENTZ株式会社</p></div>`,
        }),
      });
      if (!autoReply.ok) {
        console.error('Resend auto-reply error', autoReply.status, await autoReply.text());
      }
    }
    return res.status(200).json({ ok: true, scheduleUrl: isSalesAx ? SALES_AX_SCHEDULE_URL : null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Send failed' });
  }
}
