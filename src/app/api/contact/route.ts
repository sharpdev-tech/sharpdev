import { site } from "@/lib/site";

/**
 * Where enquiries land, and the sender Resend signs for. The DKIM record lives
 * at `resend._domainkey.sharpdev.dev`, so the apex domain is what's verified —
 * any address on it works. Override with CONTACT_FROM if that ever changes.
 */
const TO = site.email;
const FROM = process.env.CONTACT_FROM ?? `SharpDev site <enquiries@${site.domain}>`;

const LIMITS = {
  name: 100,
  email: 200,
  contact: 200,
  business: 150,
  website: 300,
  message: 4000,
} as const;

type Body = {
  name?: unknown;
  /** Contact form: a real email address. */
  email?: unknown;
  /** /skica form: WhatsApp number *or* email — we don't know which. */
  contact?: unknown;
  business?: unknown;
  website?: unknown;
  message?: unknown;
  /** Which form this came from, for the subject line. */
  source?: unknown;
  /** Honeypot — real people never fill this in. */
  company?: unknown;
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export async function POST(request: Request) {
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
  const contact = clean(body.contact, LIMITS.contact);
  const business = clean(body.business, LIMITS.business);
  const website = clean(body.website, LIMITS.website);
  const message = clean(body.message, LIMITS.message);
  const skica = clean(body.source, 20) === "skica";

  // The contact form sends `email` + `message`; /skica sends `contact`, which
  // may be a phone number. Either way we need a name and a way to reply.
  const reply = email || contact;
  if (!name || !reply) {
    return Response.json({ error: "missing" }, { status: 400 });
  }
  if (!skica && (!message || !isEmail(email))) {
    return Response.json({ error: email && !isEmail(email) ? "email" : "missing" }, { status: 400 });
  }
  // On /skica the single contact field may be a phone number, so only reject
  // something that looks like a broken email attempt.
  if (skica && reply.includes("@") && !isEmail(reply)) {
    return Response.json({ error: "email" }, { status: 400 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    business ? (["Business", business] as [string, string]) : null,
    website ? (["Website", website] as [string, string]) : null,
    ["Contact", reply],
  ].filter(Boolean) as [string, string][];

  const subject = skica
    ? `Skica request — ${name}${business ? ` (${business})` : ""}`
    : `New enquiry — ${name}`;

  const text = `${skica ? "Free mockup request from /skica" : "New enquiry from the SharpDev website"}

${rows.map(([k, v]) => `${k.padEnd(9)}${v}`).join("\n")}
${message ? `\n${message}\n` : ""}`;

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#12151c">
  <p style="margin:0 0 20px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6f8496">${
    skica ? "Free mockup request — /skica" : "New enquiry from the SharpDev website"
  }</p>
  ${rows
    .map(
      ([k, v]) =>
        `<p style="margin:0 0 6px"><strong>${escape(k)}:</strong> ${
          k === "Contact" && isEmail(v)
            ? `<a href="mailto:${escape(v)}" style="color:#0f9fb4">${escape(v)}</a>`
            : escape(v)
        }</p>`,
    )
    .join("\n  ")}
  ${
    message
      ? `<div style="border-top:1px solid #e4e8ec;margin-top:20px;padding-top:20px;white-space:pre-wrap">${escape(
          message,
        )}</div>`
      : ""
  }
</div>`;

  // Checked after validation so bad input still gets a 400 when the key is absent.
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json({ error: "server" }, { status: 500 });
  }

  // A network failure here throws rather than returning a response, and an
  // uncaught throw would send a bare 500 with no JSON for the form to read.
  // A network failure here throws rather than returning a response, and an
  // uncaught throw would send a bare 500 with no JSON for the form to read.
  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // So hitting Reply in the inbox answers the sender — only possible
        // when they gave an email rather than a phone number.
        ...(isEmail(reply) ? { reply_to: reply } : {}),
        subject,
        text,
        html,
      }),
    });
  } catch (err) {
    console.error("[contact] could not reach resend", err);
    return Response.json({ error: "send" }, { status: 502 });
  }

  if (!res.ok) {
    console.error("[contact] resend failed", res.status, await res.text());
    return Response.json({ error: "send" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
