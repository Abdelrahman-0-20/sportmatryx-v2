import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { HeroBackground } from "@/components/marketing/hero-background";
import { BootScreen } from "@/components/ui/boot-screen";
import { CountUp, Reveal } from "@/components/ui/motion";
import { ProductTour } from "@/components/ui/product-tour";
import { getDict } from "@/lib/i18n/server";
import { Rich } from "@/lib/i18n/rich";

/**
 * Home — Kitman-style marketing flow with the premium dark treatment and
 * full i18n (EN/ES/PT/ZH): hero + product mockup → proof strip → solutions →
 * what it is → audience → use cases → product tour → marquee → dataset →
 * demo CTA.
 */

const PROOF_VALUES = [8, 158747, 1431, 2];
const SOL_IDS = ["readiness", "medical", "coaching", "data"];
const GLOBE_RINGS = [0, 30, 60, 90, 120, 150];

export default async function HomePage() {
  const dict = await getDict();
  const t = dict.home;

  return (
    <main className="min-h-dvh">
      <BootScreen />
      <MarketingHeader />

      {/* Hero — full-bleed cinematic background + oversized statement */}
      <section className="relative isolate overflow-hidden pb-16 pt-14 md:pt-20">
        <div className="aurora" aria-hidden="true">
          <span className="aurora-a" />
          <span className="aurora-b" />
        </div>
        <HeroBackground />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="globe-wrap absolute right-0 top-6 hidden opacity-40 xl:block" aria-hidden="true">
          <div className="globe">
            {GLOBE_RINGS.map((deg) => (
              <span key={deg} className="ring" style={{ transform: `rotateY(${deg}deg)` }} />
            ))}
            <span className="ring ring-equator" />
          </div>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="eyebrow hero-in">{t.hero.eyebrow}</p>
            <h1 className="hero-title hero-in hero-in-2 mt-4 text-ink">
              <span>{t.hero.h1a}</span>{" "}
              <span className="text-accent">{t.hero.h1b}</span>
            </h1>
            <p className="lede hero-in hero-in-3 mt-5 max-w-xl">
              <strong className="text-ink">{t.hero.ledeStrong}</strong> {t.hero.ledeRest}
            </p>
            <div className="hero-in hero-in-3 mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                {t.hero.btnDemo}
              </Link>
              <Link href="/guest" className="btn-ghost">
                {t.hero.btnGuest}
              </Link>
            </div>
            <p className="hero-in hero-in-3 mt-5 text-xs text-muted">
              {t.hero.guestNote}{" "}
              <Link href="/platform" className="font-semibold text-accent underline-offset-2 hover:underline">
                {t.hero.btnPlatform} →
              </Link>
            </p>
          </div>

        </div>
        </div>
      </section>

      {/* The problem */}
      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10" aria-label="The problem">
        <Reveal>
          <p className="eyebrow">{t.problem.eyebrow}</p>
          <h2 className="h-sec mt-3 max-w-4xl">{t.problem.h2}</h2>
          <p className="lede mt-4 max-w-3xl">{t.problem.body}</p>
        </Reveal>
      </section>

      {/* Proof strip — hairline stats, no boxes */}
      <section className="border-y border-edge/70 bg-panel-2/50" aria-label="Engineering proof">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-6 sm:grid-cols-2 md:grid-cols-4 md:px-10">
          {t.proofLabels.map((label, i) => (
            <div key={label} className={`stat-cell py-7 ${i > 0 ? "md:pl-8" : ""} ${i > 0 ? "sm:pl-6" : ""}`}>
              <div className="stat-num">
                <CountUp value={PROOF_VALUES[i]!} />
              </div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions pillars */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Solutions">
        <Reveal>
          <p className="eyebrow">{t.solutions.eyebrow}</p>
          <h2 className="h-sec mt-3">{t.solutions.h2}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.solutions.cards.map((card, i) => (
              <Link
                key={card.title}
                href={`/solutions#${SOL_IDS[i]}`}
                className="surface group flex flex-col rounded-2xl p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 text-lg font-semibold leading-snug text-ink">{card.title}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{card.body}</span>
                <span className="mt-4 text-xs font-bold text-accent transition-transform group-hover:translate-x-1">
                  {t.solutions.explore}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* What is Sportmetryx */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="What is Sportmetryx">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="eyebrow">{t.what.eyebrow}</p>
                <h2 className="h-sec mt-3">{t.what.h2}</h2>
                <div className="lede mt-6 space-y-5">
                  <p>
                    <Rich text={t.what.p1} />
                  </p>
                  <p>
                    <Rich text={t.what.p2} />
                  </p>
                  <p>{t.what.p3}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-edge/70 bg-panel/70 p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {t.what.glanceTitle}
                </div>
                <dl className="mt-5 divide-y divide-edge/60">
                  {t.what.glance.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-xs uppercase tracking-wider text-muted">{fact.label}</dt>
                      <dd className="text-right text-sm font-medium text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {t.consent.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {[t.consent.b1, t.consent.b2, t.consent.b3].map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
              <Link href="/privacy" className="mt-4 inline-block text-xs font-bold text-accent underline-offset-2 hover:underline">
                {t.consent.link} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works — interactive product tour */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="How Sportmetryx works">
        <Reveal>
          <p className="eyebrow">{t.tour.eyebrow}</p>
          <h2 className="h-sec mt-3">{t.tour.h2}</h2>
          <p className="lede mt-3 max-w-2xl">{t.tour.sub}</p>
          <div className="mt-8">
            <ProductTour />
          </div>
        </Reveal>
      </section>

      {/* Demo CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl px-8 py-14 text-center md:px-14">
            <h2 className="h-sec">{t.cta.h2}</h2>
            <p className="lede mx-auto mt-4 max-w-xl">{t.cta.lede}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                {t.hero.btnDemo}
              </Link>
              <Link href="/proof" className="btn-ghost">
                {t.cta.btnProof}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
