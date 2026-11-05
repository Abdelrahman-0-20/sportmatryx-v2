/**
 * Email sending via Resend HTTP API (no SDK needed).
 * Requires RESEND_API_KEY in the environment — every function degrades
 * gracefully (logs a warning, never breaks the request) when it's missing.
 *
 * Default sender is Resend's auto-verified onboarding address — swap
 * RESEND_FROM for your own domain once you own one (e.g. news@sportmatryx.com).
 */

const API = "https://api.resend.com/emails";
const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM ?? "Sportmetryx <onboarding@resend.dev>";
const SITE = "https://sportmatryx-v2.vercel.app";
/* Interim: Resend testing mode only delivers to the account email
 * (egydarknight10@gmail.com). After verifying a domain at resend.com/domains,
 * switch this (or set NEWSLETTER_OWNER) to the official inbox. */
const OWNER = process.env.NEWSLETTER_OWNER ?? "egydarknight10@gmail.com";

type SendArgs = { to: string; subject: string; html: string; text: string };

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<boolean> {
  if (!KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send:", subject);
    return false;
  }
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
    });
    if (!res.ok) {
      console.error("[email] resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] send failed", e);
    return false;
  }
}

function wrap(inner: string): string {
  return `<div style="font-family:Georgia,serif;background:#0b1529;color:#e8f0f9;padding:36px 40px;max-width:560px;margin:0 auto;border-radius:14px;border:1px solid #253755;">
    <div style="font-family:sans-serif;font-size:13px;letter-spacing:3px;color:#5fd0f0;font-weight:700;">SPORTMETRYX</div>
    <div style="height:3px;background:linear-gradient(90deg,#5fd0f0,#9d78f5);border-radius:3px;margin:16px 0 24px;"></div>
    ${inner}
    <div style="font-family:sans-serif;font-size:12px;color:#a9bbd6;margin-top:28px;">
      <a href="${SITE}" style="color:#5fd0f0;text-decoration:none;">${SITE.replace("https://", "")}</a><br/>
      Validity-gated readiness intelligence · built by Healthmetryx
    </div>
  </div>`;
}

/* Localized welcome — matches the subscriber's site language at signup. */
const WELCOME: Record<string, { subject: string; heading: string; body: string }> = {
  en: {
    subject: "You're subscribed — Sportmetryx",
    heading: "You're on the list.",
    body: "Thanks for joining. You'll get shipping updates and product news — a few per month, no spam. Explore the platform in the meantime, or continue as guest.",
  },
  es: {
    subject: "Ya estás suscrito — Sportmetryx",
    heading: "Ya estás en la lista.",
    body: "Gracias por unirte. Recibirás novedades de entregas y producto — unos pocos al mes, sin spam. Mientras tanto, explora la plataforma o continúa como invitado.",
  },
  pt: {
    subject: "Você está inscrito — Sportmetryx",
    heading: "Você está na lista.",
    body: "Obrigado por entrar. Você receberá novidades de entregas e produto — algumas por mês, sem spam. Enquanto isso, explore a plataforma ou continue como convidado.",
  },
  zh: {
    subject: "订阅成功 — Sportmetryx",
    heading: "你已加入名单。",
    body: "感谢订阅。你会收到发布与产品更新 — 每月几封，绝不打扰。在此期间，可以探索平台或以访客身份继续。",
  },
};

export async function sendWelcome(email: string, locale: string): Promise<boolean> {
  const t = WELCOME[locale] ?? WELCOME.en!;
  return sendEmail({
    to: email,
    subject: t.subject,
    html: wrap(
      `<h1 style="font-family:sans-serif;font-size:26px;color:#e8f0f9;margin:0 0 14px;">${t.heading}</h1>
       <p style="font-size:15px;line-height:1.7;color:#a9bbd6;margin:0;">${t.body}</p>`,
    ),
    text: `${t.heading}\n\n${t.body}`,
  });
}

export async function notifyOwner(subject: string, lines: string[]): Promise<boolean> {
  const html = wrap(
    `<h1 style="font-family:sans-serif;font-size:22px;color:#e8f0f9;margin:0 0 14px;">${subject}</h1>
     ${lines.map((l) => `<p style="font-size:15px;line-height:1.7;color:#a9bbd6;margin:6px 0;">${l}</p>`).join("")}`,
  );
  return sendEmail({ to: OWNER, subject: `[Sportmetryx] ${subject}`, html, text: lines.join("\n") });
}
