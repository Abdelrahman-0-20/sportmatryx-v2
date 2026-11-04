import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { TacticalStudio } from "@/components/marketing/tactical-board";
import { TacticsShowcase } from "@/components/marketing/tactics-showcase";
import { HeroBackground } from "@/components/marketing/hero-background";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Tactics — Sportmetryx Football",
  description:
    "Tactical intelligence in development: a 3D board with formation switcher, phase animations, game-systems library and coaching drills — the planning layer beside readiness.",
};

const ROADMAP: Array<[title: string, body: string, status: string]> = [
  ["Phase-of-play tagging", "Every possession auto-classified: build-up, progression, final third, transition, set piece.", "BETA"],
  ["Formation recognition", "Detect the opponent's shape phase by phase and flag the moment it changes.", "BETA"],
  ["Spacing metrics", "Width, depth and compactness measured per line — quantify 'staying connected' instead of guessing.", "ROADMAP"],
  ["Pressing intensity", "Trigger timing, lines jumped and regains per high-press action.", "ROADMAP"],
  ["Transition speed", "Seconds from regain to first vertical pass, and to the first shot.", "ROADMAP"],
  ["Set-piece conversion", "Routines tracked from rehearsal to match delivery and outcome.", "ROADMAP"],
];

export default function TacticsPage() {
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
        <p className="eyebrow">Tactical intelligence · beta</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          Read the game. <span className="text-accent">Then plan it.</span>
        </h1>
        <p className="lede mt-5 max-w-2xl">
          Formations, phases and game systems on a 3D board — the planning layer that sits beside
          readiness. Health answers <span className="text-ink">who can play</span>; tactics answers{" "}
          <span className="text-ink">how we play</span>.
        </p>
        </div>
      </section>

      {/* The board */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="3D tactical board">
        <TacticalStudio />
      </section>

      {/* Dashboard collage — the panels staff actually read */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Performance intelligence showcase">
        <Reveal>
          <p className="eyebrow">Performance intelligence</p>
          <h2 className="h-sec mt-3">Every metric, visualized.</h2>
          <p className="lede mt-3 max-w-2xl">
            Scouting tables, radars, load trends, filters and analyst notes — the panels staff
            actually read, wired to the same readiness model as the board above.
          </p>
          <div className="mt-8">
            <TacticsShowcase />
          </div>
        </Reveal>
      </section>

      {/* Roadmap: what tactical analysis will measure */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="Tactical analysis roadmap">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">Tactical analysis</p>
            <h2 className="h-sec mt-3">What it will measure</h2>
            <p className="lede mt-3 max-w-2xl">
              These are the metrics the analysis layer will compute from tagged match and session
              footage — the board above already runs on them.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ROADMAP.map(([title, body, status]) => (
                <li key={title} className="surface rounded-2xl p-6">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      status === "BETA" ? "text-accent" : "text-prototype"
                    }`}
                  >
                    {status}
                  </span>
                  <div className="mt-2 text-base font-semibold text-ink">{title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </li>
              ))}
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
                Readiness says
              </div>
              <div className="h-sec mt-2 text-2xl">Who can play today.</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Validity-gated readiness bands, personal baselines, drivers behind every score —
                the health half of the decision, already live on the athletes board.
              </p>
              <Link href="/roster" className="btn-ghost mt-5 inline-flex">
                Open the readiness board
              </Link>
            </div>
            <div className="surface rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Tactics says
              </div>
              <div className="h-sec mt-2 text-2xl">How we play against them.</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Formation, phase and game-system planning on the 3D board — the coaching half of
                the same decision loop, in beta above.
              </p>
              <a href="#top" className="btn-ghost mt-5 inline-flex">
                Back to the board
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl px-8 py-14 text-center md:px-14">
            <h2 className="h-sec">Plan the session, then check who can handle it.</h2>
            <p className="lede mx-auto mt-4 max-w-xl">
              Readiness and tactics on one platform — see both in a 30-minute walkthrough.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link href="/platform" className="btn-ghost">
                See the platform
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
