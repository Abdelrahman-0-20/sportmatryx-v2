import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyOwner } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cap = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/**
 * POST /api/pilot — pilot-program waitlist signup (marketing /pilot page).
 * Additive table (pilot_waitlist); idempotent on email.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = cap(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const name = cap(body.name, 80) || null;
  const org = cap(body.org, 120) || null;
  const squadSize = cap(body.squadSize, 60) || null;
  const seasonWindow = cap(body.seasonWindow, 60) || null;
  const note = cap(body.note, 500) || null;

  try {
    const existing = await prisma.pilotWaitlist.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ ok: true, duplicate: true });

    await prisma.pilotWaitlist.create({
      data: { email, name, org, squadSize, seasonWindow, note },
    });
    await notifyOwner("New pilot waitlist signup", [
      `Email: ${email}`,
      `Name: ${name ?? "-"}`,
      `Organization: ${org ?? "-"}`,
      `Squad size: ${squadSize ?? "-"}`,
      `Window: ${seasonWindow ?? "-"}`,
      note ? `Note: ${note}` : "",
      `Time: ${new Date().toISOString()}`,
    ].filter(Boolean));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("pilot waitlist insert failed", e);
    return NextResponse.json(
      { ok: false, error: "Could not save right now — please try again." },
      { status: 500 },
    );
  }
}
