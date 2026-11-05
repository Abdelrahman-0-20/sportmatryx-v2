import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Methodology — Sportmetryx",
  description:
    "How the Sportmetryx readiness score is calculated: validity gates, personal baselines, weighted components, band cutoffs and every threshold in the open.",
};

const BAND_STYLE: Record<string, string> = {
  READY: "border-ready/50 bg-ready/10 text-ready",
  MONITOR: "border-monitor/50 bg-monitor/10 text-monitor",
  COMPROMISED: "border-compromised/50 bg-compromised/10 text-compromised",
  WITHHELD: "border-withheld/60 bg-withheld/10 text-withheld",
};

export default async function MethodologyPage() {
  const t = (await getDict()).methodology;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          {t.h1a} <span className="text-accent">{t.h1b}</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">{t.lede}</p>
      </section>

      {/* How the score is calculated */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="How the score is calculated">
        <Reveal>
          <h2 className="h-sec">{t.calcTitle}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.calcSteps.map((step, i) => (
              <li key={step.title} className="surface rounded-2xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 text-base font-semibold text-ink">{step.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Components */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="The seven components">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <h2 className="h-sec">{t.componentsTitle}</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {t.components.map((c) => (
                <li key={c.name} className="surface rounded-2xl p-5">
                  <div className="text-base font-semibold text-ink">{c.name}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{c.body}</p>
                </li>
              ))}
            </ul>
            <p className="body-md mt-6 max-w-3xl">{t.mandatoryNote}</p>
          </Reveal>
        </div>
      </section>

      {/* Baselines */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Personal baselines">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="h-sec">{t.baselineTitle}</h2>
            <ul className="space-y-3">
              {t.baseline.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Gates */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="Validity gates">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <h2 className="h-sec">{t.gatesTitle}</h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {t.gates.map((g) => (
                <li key={g.name} className="surface rounded-2xl p-5">
                  <div className="display-heading text-base text-accent">{g.name}</div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{g.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Bands */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Readiness bands">
        <Reveal>
          <h2 className="h-sec">{t.bandsTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.bands.map((b) => (
              <div key={b.band} className={`rounded-2xl border p-6 ${BAND_STYLE[b.band] ?? "border-edge"}`}>
                <div className="display-heading text-xl">{b.band}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </div>
          <p className="body-md mt-6 max-w-3xl">{t.thresholdsNote}</p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl px-8 py-12 text-center">
            <h2 className="h-sec">{t.ctaH2}</h2>
            <p className="lede mx-auto mt-4 max-w-xl">{t.ctaLede}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/guest" className="btn-primary">
                {t.ctaBtn}
              </Link>
              <Link href="/proof" className="btn-ghost">
                See the proof
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
