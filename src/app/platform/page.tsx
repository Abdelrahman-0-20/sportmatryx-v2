import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Platform — Sportmetryx Football",
  description:
    "The Sportmetryx platform: team command, explainable performance index, load and recovery intelligence, environment context, athlete twin, marketplace and governance.",
};

const PIPELINE: Array<[title: string, body: string]> = [
  ["Import", "Sensor, wellness and environment CSVs land in one pipeline with row-level error reports."],
  ["Validate", "Every row passes validity gates — bad inputs are flagged, never silently scored."],
  ["Score", "Readiness is computed against each athlete's own baseline, drivers kept visible."],
  ["Decide", "Staff act on one shared board: bands, exceptions and Player 360 in one place."],
  ["Share", "Governed datasets flow to the marketplace — consent and audit chain intact."],
];

type Status = "ESTABLISHED" | "DERIVED" | "PROTOTYPE";

const MODULES: Array<{ code: string; name: string; status: Status; body: string }> = [
  { code: "SMX-01", name: "Team Command", status: "ESTABLISHED", body: "Exception-first operational roster with readiness distribution and a review queue — the daily picture for the whole staff." },
  { code: "SMX-02", name: "Performance Index", status: "ESTABLISHED", body: "Transparent 0–100 composite per athlete with component breakdown, confidence and the drivers behind every move." },
  { code: "SMX-03", name: "Load Intelligence", status: "DERIVED", body: "Session workload, acute:chronic context and baseline comparisons so load decisions rest on the athlete's own history." },
  { code: "SMX-04", name: "Recovery Intelligence", status: "DERIVED", body: "Recovery trajectories with a retest queue — who is bouncing back, who is not, and what changed." },
  { code: "SMX-05", name: "Environment & Travel", status: "DERIVED", body: "Heat, air quality, altitude and travel exposure attached to every session, so context is never lost." },
  { code: "SMX-06", name: "Digital Athlete Twin", status: "PROTOTYPE", body: "Longitudinal baseline and scenario comparison workspace — compare today's athlete against their own history." },
  { code: "SMX-07", name: "Marketplace", status: "ESTABLISHED", body: "Package and license derived data products — catalog, cart and demo checkout with clearly labeled synthetic pricing." },
  { code: "SMX-08", name: "Governance", status: "ESTABLISHED", body: "Consent records, role-based access, guest mode and a hash-chained audit log — trust built into the schema." },
];

const STATUS_STYLE: Record<Status, string> = {
  ESTABLISHED: "text-positive",
  DERIVED: "text-accent",
  PROTOTYPE: "text-prototype",
};

const PRINCIPLES: Array<[title: string, body: string]> = [
  ["Validity-gated by design", "Bad or missing inputs are flagged WITHHELD — a score is never produced from garbage."],
  ["Baseline-first, not population-first", "Every athlete is compared against their own history, not a population average."],
  ["Explainable scores, no black boxes", "Drivers stay visible — a coach can always answer why the number moved."],
  ["Decision support, not diagnosis", "Explicitly labeled everywhere. The human owns the call; the audit trail reconstructs it."],
  ["Consent-governed data", "Athlete data is visible only under the access controls each athlete consents to."],
];

export default function PlatformPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">The platform</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          One platform. <span className="text-accent">Every football decision surface.</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">
          Eight modules on one shared data model — from the daily roster to licensed datasets.
          Nothing is a bolt-on: every module reads the same validity-gated, consent-governed
          athlete-day record.
        </p>
      </section>

      {/* Pipeline strip */}
      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-10" aria-label="Data pipeline">
        <Reveal>
          <ol className="grid gap-3 md:grid-cols-5">
            {PIPELINE.map(([title, body], i) => (
              <li key={title} className="relative surface rounded-2xl p-5">
                <span className="display-heading text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div className="display-heading mt-1 text-base">{title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10" aria-label="Modules">
        <Reveal>
          <h2 className="h-sec">The modules</h2>
          <p className="mt-1 text-sm text-muted">
            Status labels are honest: what runs today, what is derived from it, and what is still prototype.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <li key={m.code} className="surface flex flex-col rounded-2xl p-6">
                <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em]">
                  <span className="text-muted">{m.code}</span>
                  <span className={STATUS_STYLE[m.status]}>{m.status}</span>
                </span>
                <span className="display-heading mt-2 text-lg">{m.name}</span>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{m.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Governance */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Governance principles">
        <Reveal>
          <h2 className="h-sec">Governance principles</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(([title, body]) => (
              <div key={title} className="surface rounded-2xl p-5">
                <div className="display-heading text-base text-accent">{title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl p-8 text-center">
            <h2 className="h-sec">See the platform run</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              A 30-minute walkthrough of all eight modules on live synthetic data — plus what a
              pilot season looks like on your own.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link href="/guest" className="btn-ghost">
                Continue as guest
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
