import { site } from "@/lib/site";

/**
 * Where enquiries land, and the sender Resend signs for. The DKIM record lives
 * at `resend._domainkey.sharpdev.dev`, so the apex domain is what's verified —
 * any address on it works. Override with CONTACT_FROM if that ever changes.
 */
const TO = site.email;
const FROM = process.env.CONTACT_FROM ?? `SharpDev site <enquiries@${site.domain}>`;

const LIMITS = { name: 100, email: 200, message: 4000 } as const;

type Body = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — real people never fill this in. */
  company?: unknown;
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json({ error: "server" }, { status: 500 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Bots fill every field they find; a real submission leaves this empty.
  // Answer 200 so they don't learn to work around it.
  if (clean(body.company, 100)) return Response.json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (!name || !email || !message) {
    return Response.json({ error: "missing" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ error: "email" }, { status: 400 });
  }

  const text = `New enquiry from the SharpDev website

Name:    ${name}
Email:   ${email}

${message}
`;

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#12151c">
  <p style="margin:0 0 20px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6f8496">New enquiry from the SharpDev website</p>
  <p style="margin:0 0 4px"><strong>${escape(name)}</strong></p>
  <p style="margin:0 0 20px"><a href="mailto:${escape(email)}" style="color:#0f9fb4">${escape(email)}</a></p>
  <div style="border-top:1px solid #e4e8ec;padding-top:20px;white-space:pre-wrap">${escape(message)}</div>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      // So hitting Reply in the inbox answers the visitor, not the site.
      reply_to: email,
      subject: `New enquiry — ${name}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[contact] resend failed", res.status, await res.text());
    return Response.json({ error: "send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
