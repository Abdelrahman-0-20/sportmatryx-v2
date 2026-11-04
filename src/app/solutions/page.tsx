import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Solutions — Sportmetryx Football",
  description:
    "Four solutions on one platform: readiness & performance, medical & rehab, coaching & development, and governed data products.",
};

/* Section anchors don't translate — content comes from dict. */
const SOLUTION_IDS = ["readiness", "medical", "coaching", "data"];

export default async function SolutionsPage() {
  const t = (await getDict()).solutions;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          {t.h1a} <span className="text-accent">{t.h1b}</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">{t.lede}</p>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Solutions">
          {t.items.map((s, i) => (
            <a
              key={s.title}
              href={`#${SOLUTION_IDS[i]}`}
              className="rounded-md border border-edge px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:border-accent/50 hover:text-ink"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </section>

      {t.items.map((s, i) => (
        <section
          key={s.title}
          id={SOLUTION_IDS[i]}
          className="mx-auto max-w-7xl scroll-mt-20 px-6 py-12 md:px-10"
          aria-label={s.title}
        >
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="eyebrow">{s.eyebrow}</p>
                <h2 className="h-sec mt-1.5">{s.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink">{s.lede}</p>
                <p className="mt-1 text-xs text-muted">{s.audience}</p>

                <div className="mt-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                    {t.problemsLabel}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {s.problems.map((p) => (
                      <li key={p} className="flex gap-2 text-xs leading-relaxed text-muted">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-compromised" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                    {t.outcomesLabel}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex gap-2 text-xs leading-relaxed text-muted">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ready" aria-hidden="true" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="surface p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {t.screensLabel}
                </div>
                <ul className="mt-3 space-y-2">
                  {s.screens.map((screen, si) => (
                    <li
                      key={screen}
                      className="tour-row flex items-center justify-between rounded-md border border-edge/60 bg-panel-2 px-3 py-2"
                      style={{ animationDelay: `${si * 120}ms` }}
                    >
                      <span className="text-xs font-semibold text-ink">{screen}</span>
                      <span className="text-[10px] font-bold text-accent">OPEN →</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/guest"
                  className="btn-ghost mt-4 block w-full px-4! py-2! text-center! text-xs!"
                >
                  {t.tryGuest}
                </Link>
                <div className="mt-4 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] text-muted">
                  {t.noteLead} {i + 1} {t.noteOf} {t.items.length} {t.noteTail}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      {/* Industries */}
      <section className="mx-auto max-w-7xl px-6 pb-6 md:px-10" aria-label="Who it is designed for">
        <Reveal>
          <h2 className="h-sec">{t.industriesTitle}</h2>
          <ul className="stagger mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.industries.map((name) => (
              <li key={name} className="surface rounded-2xl p-4 text-center">
                <span className="display-heading text-base">{name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">{t.industriesNote}</p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl px-8 py-14 text-center md:px-14">
            <h2 className="h-sec">{t.ctaH2}</h2>
            <p className="lede mx-auto mt-4 max-w-xl">{t.ctaLede}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                {t.ctaBtn1}
              </Link>
              <Link href="/platform" className="btn-ghost">
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
