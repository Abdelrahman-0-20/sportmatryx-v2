import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { PilotForm } from "@/components/marketing/pilot-form";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Pilot program — Sportmetryx Football",
  description:
    "Run Sportmetryx with your squad for a season: full platform access, a data audit and success metrics agreed before the pilot starts.",
};

const INCLUDES: Array<[title: string, body: string]> = [
  [
    "Full platform access",
    "Readiness board, Player 360, team views and the marketplace — everything the product does, for one squad, all season.",
  ],
  [
    "Data audit & import",
    "We map your existing exports (GPS, wellness, session logs) into the combined athlete-day record before week one. Row-level error reports included.",
  ],
  [
    "Metrics agreed up front",
    "Weekly active staff, decisions supported per week, exceptions caught early — written down before the pilot starts, not retrofitted after.",
  ],
  [
    "Season-end review",
    "One decision meeting: the numbers say convert, extend or stop. No lock-in during the pilot.",
  ],
];

const FIT: Array<string> = [
  "Academies and semi-pro clubs with more ambition than analytics staff",
  "Pro clubs evaluating readiness tooling without a procurement marathon",
  "Leagues and governing bodies standardizing data across member clubs",
];

export default function PilotPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Pilot program</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          Run Sportmetryx with your squad <span className="text-accent">for a season.</span>
        </h1>
        <p className="lede mt-5 max-w-2xl">
          One squad, one season, numbers agreed before we start. The waitlist is how pilot slots
          are allocated — early entries choose their window first.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="What the pilot includes">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDES.map(([title, body], i) => (
              <div key={title} className="surface rounded-2xl p-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 text-base font-semibold text-ink">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-4 md:px-10" aria-label="Who fits the pilot">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="surface rounded-2xl p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Who fits
              </div>
              <ul className="mt-4 space-y-3">
                {FIT.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted">
                The four-phase pilot framework (data audit → season → measure → convert) is
                documented on{" "}
                <Link href="/proof" className="text-accent underline-offset-2 hover:underline">
                  the Proof page
                </Link>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-accent/40 bg-[linear-gradient(135deg,rgba(34,211,238,0.10),rgba(157,120,245,0.08))] p-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                What it costs
              </div>
              <div className="display-heading mt-3 text-3xl">Free during the pilot</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Pilot squads pay nothing while we prove the numbers together. Pricing starts only
                at conversion — quoted per squad size at the season-end review, before you decide.
              </p>
              <p className="mt-4 text-xs text-muted">
                Demo first if you prefer:{" "}
                <Link href="/guest" className="text-accent underline-offset-2 hover:underline">
                  continue as guest
                </Link>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="Join the waitlist">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="h-sec">Join the waitlist</h2>
              <p className="lede mt-3">
                Two minutes now, one reply from a human later. Tell us your squad size and window
                — we allocate pilot slots in order and confirm before any setup starts.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                <li className="flex gap-2.5">
                  <span className="text-accent">✓</span> No card, no contract during the pilot
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent">✓</span> Your data stays yours — export any time
                </li>
                <li className="flex gap-2.5">
                  <span className="text-accent">✓</span> Exit cleanly if the numbers miss
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-edge/70 bg-panel/70 p-6">
              <PilotForm />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className="cta-band rounded-3xl px-8 py-12 text-center">
          <h2 className="h-sec">Want the full walkthrough first?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="btn-primary">
              Book a demo
            </Link>
            <Link href="/proof" className="btn-ghost">
              See the proof
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
