/*
 * POST /api/contact — footer contact form.
 *
 * Takes the form JSON, hands it to Resend's REST API, and mails it to
 * CONTACT_TO. Exists so the site can carry a contact form without publishing
 * a real address for scrapers, and without a third party holding the
 * messages. Zero dependencies on purpose: Node 18+ has global fetch, so the
 * repo keeps its no-npm, no-build-step rule.
 *
 * Env (set in the Vercel project, never in the client):
 *   RESEND_API_KEY  required — Resend API key
 *   CONTACT_TO      required — inbox the messages land in
 *   CONTACT_FROM    optional — verified sender, defaults to the address below
 */

const FROM = process.env.CONTACT_FROM || 'Portfolio contact <hello@willim.tech>';

/* Best-effort throttle. Serverless instances are ephemeral and there are many
   of them, so this thins out a hammering client without pretending to be a
   real rate limiter — Resend's own quota is the actual backstop. */
const HITS = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const hits = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  HITS.set(ip, hits);
  if (HITS.size > 5000) HITS.clear(); /* crude ceiling on memory growth */
  return hits.length > MAX_PER_WINDOW;
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO) {
    console.error('contact: RESEND_API_KEY or CONTACT_TO is not set');
    return res.status(500).json({ error: 'contact form is not configured' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  /* Honeypot: a real person never sees this field, so anything in it is a bot.
     Answer 200 so the bot records a success and moves on. */
  if (clean(body.company, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are all required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'that email address does not look valid' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'too many messages — try again later' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [process.env.CONTACT_TO],
        /* so hitting reply in the inbox answers the sender, not the site */
        reply_to: email,
        subject: `portfolio — ${name}`,
        text: `From: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br>`
          + `<strong>IP:</strong> ${escapeHtml(ip)}</p><hr>`
          + `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!r.ok) {
      console.error('contact: resend responded', r.status, await r.text());
      return res.status(502).json({ error: 'could not send right now' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact: send failed', err);
    return res.status(502).json({ error: 'could not send right now' });
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
