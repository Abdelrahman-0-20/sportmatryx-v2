import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { CountUp } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Investors — Sportmetryx",
  description:
    "The Sportmetryx raise: what the round funds, the milestones it buys, why now, and how to reach the team.",
};

const CONTACT_EMAIL = "sportmatryx@protonmail.com";

export default async function InvestorsPage() {
  const t = (await getDict()).investors;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-14 pt-14 md:pt-20">
        <div className="aurora" aria-hidden="true">
          <span className="aurora-a" />
          <span className="aurora-b" />
        </div>
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="hero-title mt-3 max-w-4xl">
            {t.h1a} <span className="text-accent">{t.h1b}</span>
          </h1>
          <p className="lede mt-5 max-w-2xl">{t.lede}</p>
        </div>
      </section>

      {/* Honest stage banner — neutral tokens; purple only on the stage tag,
          which is exactly the beta/prototype semantic. */}
      <section className="mx-auto max-w-7xl px-6 pt-8 md:px-10" aria-label="Stage">
        <div className="rounded-2xl border border-edge/70 bg-panel-2/60 px-6 py-5">
          <span className="inline-flex rounded-full border border-prototype/50 bg-prototype/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-prototype">
            {t.stageTag}
          </span>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{t.stageNote}</p>
        </div>
      </section>

      {/* Traction band */}
      <section className="mt-8 border-y border-edge/70 bg-panel-2/50" aria-label="Traction">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 md:grid-cols-4 md:px-10">
          {t.traction.map((item, i) => {
            /* Digits animate at .stat-num scale; words stay display type but
               never at digit size, so the row reads as one system. */
            const numeric = /^[0-9]+$/.test(item.v);
            return (
              <div key={item.l} className={`stat-cell py-7 ${i > 0 ? "sm:pl-6 md:pl-8" : ""}`}>
                <div
                  className="stat-num"
                  style={numeric ? undefined : { fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)" }}
                >
                  {numeric ? <CountUp value={Number(item.v)} /> : item.v}
                </div>
                <div className="stat-label">{item.l}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use of funds */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Use of funds">
        <h2 className="h-sec">{t.fundsTitle}</h2>
        <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.funds.map((item, i) => (
            <div key={item.title} className="surface h-full rounded-2xl p-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-2 text-base font-semibold text-ink">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="Milestones">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h2 className="h-sec">{t.milestonesTitle}</h2>
          <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.milestones.map((item, i) => (
              <div key={item.title} className="surface h-full rounded-2xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 text-base font-semibold text-ink">{item.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why now */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Why now">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="h-sec">{t.whyTitle}</h2>
          </div>
          <ul className="space-y-4">
            {t.why.map((line, i) => (
              <li key={line} className="surface flex gap-4 rounded-2xl p-5">
                <span className="display-heading shrink-0 text-xl text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-muted">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-14 text-center md:px-14">
          <h2 className="h-sec">{t.ctaTitle}</h2>
          <p className="lede mx-auto mt-4 max-w-xl">{t.ctaLede}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo" className="btn-primary">
              {t.ctaBtn}
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn-ghost"
              aria-label={`${t.emailLabel}: ${CONTACT_EMAIL}`}
            >
              {t.emailLabel}
            </a>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
