import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { PilotForm } from "@/components/marketing/pilot-form";
import { prisma } from "@/lib/prisma";
import { CountUp, Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Pilot program — Sportmetryx",
  description:
    "Run Sportmetryx with your squad for a season: full platform access, a data audit and success metrics agreed before the pilot starts.",
};

export default async function PilotPage() {
  const dict = await getDict();
  const t = dict.pilot;
  /* Live social proof — real rows in pilot_waitlist (Neon); never blocks render. */
  const waitlistCount = await prisma.pilotWaitlist.count().catch(() => 0);
  const noEntriesYet = waitlistCount === 0;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          {t.h1a} <span className="text-accent">{t.h1b}</span>
        </h1>
        <p className="lede mt-5 max-w-2xl">{t.lede}</p>
      </section>

      {/* Live waitlist counter + cohort size. The band never disappears: at zero
          it states the honest number and points at the form instead of hiding
          the (only) social proof on the page. */}
      <section className="mt-8 border-y border-edge/70 bg-panel-2/50" aria-label="Waitlist status">
        <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 sm:grid-cols-2 md:px-10">
          <div className="stat-cell py-6 md:py-7">
            <div className="stat-num">
              <CountUp value={waitlistCount} />
            </div>
            <div className="stat-label">{t.counterLabel}</div>
            {noEntriesYet ? (
              <a
                href="#waitlist"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-2 hover:underline"
              >
                {t.waitlistTitle} <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
          <div className="stat-cell py-6 sm:pl-6 md:py-7 md:pl-8">
            <div className="stat-num">6</div>
            <div className="stat-label">{t.counterSeats}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="What the pilot includes">
        <Reveal>
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.includes.map((item, i) => (
              <div key={item.title} className="surface h-full rounded-2xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 text-base font-semibold text-ink">{item.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4 md:px-10" aria-label="Who fits the pilot">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="surface h-full rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {t.whoTitle}
              </div>
              <ul className="mt-4 space-y-3">
                {t.fit.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted">
                {t.frameworkLead}{" "}
                <Link href="/proof" className="text-accent underline-offset-2 hover:underline">
                  {t.frameworkLink}
                </Link>
                {t.frameworkTail}
              </p>
            </div>

            {/* One card system across the page: same surface, same radius. */}
            <div className="surface h-full rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {t.costTitle}
              </div>
              <div className="display-heading mt-3 text-3xl">{t.costValue}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.costBody}</p>
              <p className="mt-4 rounded-lg border border-ready/40 bg-ready/10 px-3 py-2.5 text-xs font-semibold text-ready">
                {t.termsLine}
              </p>
              {/* Guest mode promoted from buried inline copy to a real action. */}
              <p className="mt-5 text-xs text-muted">{t.costTail}</p>
              <Link href="/guest" className="btn-ghost mt-2 first-letter:uppercase">
                {t.costGuest}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Primary conversion — renders eagerly, never behind Reveal. */}
      <section
        id="waitlist"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-10 md:px-10"
        aria-label="Join the waitlist"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="h-sec">{t.waitlistTitle}</h2>
            <p className="lede mt-3">{t.waitlistLede}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {t.bullets.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="text-accent">✓</span> {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-2xl p-6">
            <PilotForm labels={t.form} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-12 text-center">
          <h2 className="h-sec">{t.ctaH2}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="btn-primary">
              {t.btnDemo}
            </Link>
            <Link href="/proof" className="btn-ghost">
              {t.btnProof}
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
