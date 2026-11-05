import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { TacticalStudio } from "@/components/marketing/tactical-board";
import { TacticsShowcase } from "@/components/marketing/tactics-showcase";
import { HeroBackground } from "@/components/marketing/hero-background";
import { Reveal } from "@/components/ui/motion";
import { getDict } from "@/lib/i18n/server";
import { Rich } from "@/lib/i18n/rich";

export const metadata: Metadata = {
  title: "Tactics — Sportmetryx",
  description:
    "Tactical intelligence in development: a 3D board with formation switcher, phase animations, game-systems library and coaching drills — the planning layer beside readiness.",
};

export default async function TacticsPage() {
  const dict = await getDict();
  const t = dict.tacticsPage;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      {/* Hero — full-bleed basketball background video */}
      <section className="relative isolate overflow-hidden pb-14 pt-14 md:pt-20">
        <div className="aurora" aria-hidden="true">
          <span className="aurora-a" />
          <span className="aurora-b" />
        </div>
        <HeroBackground clips={["/hero/6.mp4"]} />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="hero-title mt-3">
            {t.h1a} <span className="text-accent">{t.h1b}</span>
          </h1>
          <p className="lede mt-5 max-w-2xl">
            <Rich text={t.lede} />
          </p>
        </div>
      </section>

      {/* The board */}
      <section id="board" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-10 md:px-10" aria-label="3D tactical board">
        <TacticalStudio labels={dict.tacticsBoard} />
      </section>

      {/* Dashboard collage — the panels staff actually read */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Performance intelligence showcase">
        <Reveal>
          <p className="eyebrow">{t.showEyebrow}</p>
          <h2 className="h-sec mt-3">{t.showH2}</h2>
          <p className="lede mt-3 max-w-2xl">{t.showLede}</p>
          <div className="mt-8">
            <TacticsShowcase />
          </div>
        </Reveal>
      </section>

      {/* Roadmap: what tactical analysis will measure */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="Tactical analysis roadmap">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">{t.roadmapEyebrow}</p>
            <h2 className="h-sec mt-3">{t.roadmapTitle}</h2>
            <p className="lede mt-3 max-w-2xl">{t.roadmapLede}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.roadmap.map((item, i) => {
                const status = t.roadmapStatus[i]! as "beta" | "roadmap";
                return (
                  <li key={item.key} className="surface rounded-2xl p-6">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                        status === "beta" ? "text-accent" : "text-prototype"
                      }`}
                    >
                      {t.statuses[status]}
                    </span>
                    <div className="mt-2 text-base font-semibold text-ink">{item.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Positioning */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="How tactics fits">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {t.readinessSay}
              </div>
              <div className="h-sec mt-2 text-2xl">{t.readinessH}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.readinessBody}</p>
              <Link href="/roster" className="btn-ghost mt-5 inline-flex">
                {t.readinessBtn}
              </Link>
            </div>
            <div className="surface rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {t.tacticsSay}
              </div>
              <div className="h-sec mt-2 text-2xl">{t.tacticsH}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.tacticsBody}</p>
              <a href="#board" className="btn-ghost mt-5 inline-flex">
                {t.tacticsBtn}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl px-8 py-14 text-center md:px-14">
            <h2 className="h-sec">{t.ctaH2}</h2>
            <p className="lede mx-auto mt-4 max-w-xl">{t.ctaLede}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                {t.btn1}
              </Link>
              <Link href="/platform" className="btn-ghost">
                {t.btn2}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
