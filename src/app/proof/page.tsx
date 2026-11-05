import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Proof — Sportmetryx Football",
  description:
    "The engineering proof behind Sportmetryx: live deployments, the data pipeline at scale, architecture, governance principles and the pilot framework.",
};

/* Metric values don't translate — labels come from the dictionary. */
const NUMBER_VALUES = ["2", "8", "158,747", "1,431", "1,362", "50", "6", "5"];

export default async function ProofPage() {
  const t = (await getDict()).proof;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          {t.h1a} <span className="text-accent">{t.h1b}</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">{t.lede}</p>
      </section>

      {/* Numbers */}
      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10" aria-label="Engineering numbers">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {t.numbers.map((label, i) => (
              <div key={label} className="surface rounded-2xl p-5">
                <div className="h-sec text-accent md:text-3xl">{NUMBER_VALUES[i]}</div>
                <div className="mt-1 text-xs leading-snug text-muted">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Architecture flow */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10" aria-label="Architecture">
        <Reveal>
          <h2 className="h-sec">{t.flowTitle}</h2>
          <ol className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch">
            {t.flow.map((step, i) => (
              <li key={step} className="flex flex-1 items-center gap-2">
                <div className="surface flex-1 rounded-2xl px-4 py-4 text-center text-xs font-semibold text-ink">
                  {step}
                </div>
                {i < t.flow.length - 1 ? (
                  <span className="hidden shrink-0 text-accent md:block" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-muted">{t.flowNote}</p>
        </Reveal>
      </section>

      {/* Standards + principles */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Engineering standards">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="h-sec">{t.standardsTitle}</h2>
              <ul className="mt-4 space-y-3">
                {t.standards.map((item) => (
                  <li key={item.title} className="surface rounded-2xl p-5">
                    <div className="display-heading text-base text-accent">{item.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h-sec">{t.principlesTitle}</h2>
              <ul className="mt-4 space-y-3">
                {t.principles.map((item) => (
                  <li key={item.title} className="surface rounded-2xl p-5">
                    <div className="display-heading text-base text-accent">{item.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Pilot framework */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Pilot framework">
        <Reveal>
          <h2 className="h-sec">{t.pilotTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.pilotLede}</p>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">
            {t.pilot.map((item) => (
              <li key={item.phase} className="surface rounded-2xl p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                  {item.phase}
                </span>
                <div className="display-heading mt-1 text-lg">{item.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-muted">{t.pilotNote}</p>
        </Reveal>
      </section>

      {/* Comparison matrix */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Comparison">
        <Reveal>
          <h2 className="h-sec">{t.comparisonTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.comparisonLede}</p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-edge/70 bg-panel/70">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-edge/70 text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-semibold" />
                  <th className="px-4 py-3 font-semibold">{t.colSheets}</th>
                  <th className="px-4 py-3 font-semibold">{t.colLegacy}</th>
                  <th className="px-4 py-3 font-semibold text-accent">{t.colUs}</th>
                </tr>
              </thead>
              <tbody>
                {t.compRows.map((label, i) => {
                  const row = [
                    [t.no, t.limited, t.yes],
                    [t.no, t.partial, t.yes],
                    [t.no, t.partial, t.yes],
                    [t.no, t.no, t.yes],
                    [t.no, t.no, t.yes],
                    [t.no, t.no, t.yes],
                    [t.timeSheets, t.timeLegacy, t.timeUs],
                  ][i]!;
                  return (
                    <tr key={label} className="border-b border-edge/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{label}</td>
                      <td className="px-4 py-3 text-muted">{row[0]}</td>
                      <td className="px-4 py-3 text-muted">{row[1]}</td>
                      <td className="bg-accent/5 px-4 py-3">
                        <span className="font-semibold text-accent">{row[2]}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl p-8 text-center">
            <h2 className="h-sec">{t.ctaH2}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{t.ctaLede}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                {t.ctaBtn1}
              </Link>
              <Link href="/guest" className="btn-ghost">
                {t.ctaBtn2}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
