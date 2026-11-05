import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyOwner, sendWelcome } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter — footer subscribe (table: newsletter_subscribers).
 * Idempotent on email.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 200);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    const isNew = !existing;
    if (isNew) {
      await prisma.newsletterSubscriber.create({
        data: { email, source: String(body.source ?? "footer").slice(0, 60) },
      });
    }
    if (isNew) {
      const cookie = request.headers.get("cookie") ?? "";
      const locale = /(?:^|;\s*)smx_lang=(\w+)/.exec(cookie)?.[1] ?? "en";
      await Promise.all([
        sendWelcome(email, locale),
        notifyOwner("New newsletter subscriber", [
          `Email: ${email}`,
          `Source: ${String(body.source ?? "footer")}`,
          `Time: ${new Date().toISOString()}`,
        ]),
      ]);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("newsletter subscribe failed", e);
    return NextResponse.json(
      { ok: false, error: "Could not save right now — please try again." },
      { status: 500 },
    );
  }
}
