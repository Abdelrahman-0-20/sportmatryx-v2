import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Proof — Sportmetryx Football",
  description:
    "The engineering proof behind Sportmetryx: live deployments, the data pipeline at scale, architecture, governance principles and the pilot framework.",
};

const NUMBERS: Array<[value: string, label: string]> = [
  ["2", "live deployments (Vercel)"],
  ["8", "sports in the pipeline"],
  ["158,747", "device observations processed"],
  ["1,431", "sessions modeled end-to-end"],
  ["1,362", "athlete-day rows in the wide dataset"],
  ["50", "synthetic athletes, fully labeled"],
  ["6", "versioned database migrations"],
  ["5", "device metric streams (HR · SpO₂ · resp · accel · GPS)"],
];

const FLOW = [
  "GPS · HR · wellness · environment CSVs",
  "Combined athlete-day record",
  "Validity gates",
  "Score vs personal baseline",
  "Staff dashboard & marketplace",
];

const STANDARDS: Array<[title: string, body: string]> = [
  ["Type-safe end to end", "TypeScript + Prisma — schema changes break the build before they break production."],
  ["Gates on every push", "Lint, type-check and a production build run before any deploy; CI ships only green builds."],
  ["Versioned schema", "Six ordered migrations — every database change is reviewable, repeatable and reversible in history."],
  ["Secrets never in git", "Only placeholder templates are committed; real credentials live in env config on the host."],
  ["Guest mode by design", "Anyone can audit the full product on labeled synthetic data — zero privacy exposure."],
  ["Accessible motion", "Every animation respects prefers-reduced-motion; keyboard focus is always visible."],
];

const PRINCIPLES: Array<[title: string, body: string]> = [
  ["Validity-gated", "Garbage in → WITHHELD out. Never a silent score."],
  ["Baseline-first", "Each athlete measured against their own history."],
  ["Explainable", "Drivers visible on every number — no black boxes."],
  ["Decision support", "Not diagnosis — labeled in the interface, every screen."],
  ["Consent-governed", "Access follows recorded consent, enforced in the schema."],
];

const PILOT: Array<[phase: string, title: string, body: string]> = [
  ["Phase 1", "Data audit", "Two weeks: map your existing exports to the combined record, confirm coverage and quality."],
  ["Phase 2", "Pilot season", "8–12 weeks with one squad: readiness board in the daily loop, guest-free real sessions."],
  ["Phase 3", "Measure", "Weekly active staff, decisions supported per week, exceptions caught early — agreed up front."],
  ["Phase 4", "Convert & scale", "Season-end review against the numbers. Convert to contract, add squads, enable marketplace."],
];

export default function ProofPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Proof</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          The proof is <span className="text-accent">already running.</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">
          Not a deck — a deployed product with a production database, versioned migrations and a
          data pipeline that has processed real volume. These are the numbers behind the demo.
        </p>
      </section>

      {/* Numbers */}
      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10" aria-label="Engineering numbers">
        <Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {NUMBERS.map(([value, label]) => (
              <div key={label} className="surface rounded-2xl p-5">
                <div className="h-sec text-accent md:text-3xl">{value}</div>
                <div className="mt-1 text-xs leading-snug text-muted">{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Architecture flow */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10" aria-label="Architecture">
        <Reveal>
          <h2 className="h-sec">How the data moves</h2>
          <ol className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch">
            {FLOW.map((step, i) => (
              <li key={step} className="flex flex-1 items-center gap-2">
                <div className="surface flex-1 rounded-2xl px-4 py-4 text-center text-xs font-semibold text-ink">
                  {step}
                </div>
                {i < FLOW.length - 1 ? (
                  <span className="hidden shrink-0 text-accent md:block" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-muted">
            Next.js on Vercel · PostgreSQL (Neon) via Prisma · session auth with role-based access ·
            hash-chained audit log.
          </p>
        </Reveal>
      </section>

      {/* Standards + principles */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Engineering standards">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="h-sec">Engineering standards</h2>
              <ul className="mt-4 space-y-3">
                {STANDARDS.map(([title, body]) => (
                  <li key={title} className="surface rounded-2xl p-5">
                    <div className="display-heading text-base text-accent">{title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h-sec">Governance principles</h2>
              <ul className="mt-4 space-y-3">
                {PRINCIPLES.map(([title, body]) => (
                  <li key={title} className="surface rounded-2xl p-5">
                    <div className="display-heading text-base text-accent">{title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
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
          <h2 className="h-sec">The pilot framework</h2>
          <p className="mt-1 text-sm text-muted">
            How a first club goes live — measured against numbers agreed before the pilot starts.
          </p>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">
            {PILOT.map(([phase, title, body]) => (
              <li key={phase} className="surface rounded-2xl p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{phase}</span>
                <div className="display-heading mt-1 text-lg">{title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-muted">
            Honest stage note: no customer logos yet — synthetic-first means we can demonstrate
            everything today, and pilots are what produce the first real ones.
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl p-8 text-center">
            <h2 className="h-sec">Verify it yourself</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Open the live product, download the dataset, or walk the architecture with us —
              whichever proves it faster for you.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link href="/guest" className="btn-ghost">
                Open the live product
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
