import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Solutions — Sportmetryx Football",
  description:
    "Four solutions on one platform: readiness & performance, medical & rehab, coaching & development, and governed data products.",
};

type Solution = {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  audience: string;
  problems: string[];
  screens: string[];
  outcomes: string[];
};

const SOLUTIONS: Solution[] = [
  {
    id: "readiness",
    eyebrow: "For performance staff",
    title: "Readiness & Performance",
    lede: "Know who can train — and at what intensity — before the session starts.",
    audience: "Performance staff · sport scientists",
    problems: [
      "Availability calls made from scattered exports and gut feel",
      "Load decisions without the athlete's own baseline in view",
      "Heat, travel and air-quality context lost between reports",
    ],
    screens: ["Athletes readiness board", "Player 360 with drivers", "Game readiness view", "Environment & travel exposure"],
    outcomes: [
      "One daily picture of the whole roster, sorted by who needs attention",
      "Every band traceable to its drivers — defensible in review",
      "Load read against personal baselines, not population averages",
    ],
  },
  {
    id: "medical",
    eyebrow: "For medical & rehab teams",
    title: "Medical & Rehab",
    lede: "Spot COMPROMISED signals early and document return-to-play with evidence.",
    audience: "Medical staff · physios · rehab coaches",
    problems: [
      "Early warning signs buried in wellness forms and sensor files",
      "Return-to-play decisions that leave no reconstructable trail",
      "Data quality problems silently contaminating the picture",
    ],
    screens: ["Validity-gated WITHHELD reasons", "Intervention queue", "Recovery trajectories", "Audit chain"],
    outcomes: [
      "Bad inputs flagged before they influence any decision",
      "Every readiness call reconstructable from the audit log",
      "Recovery tracked against the athlete's own history",
    ],
  },
  {
    id: "coaching",
    eyebrow: "For coaches",
    title: "Coaching & Development",
    lede: "Select, rotate and rest with context — not gut feeling alone.",
    audience: "Head coaches · assistant coaches · academy staff",
    problems: [
      "Squad selection meetings without a shared, trusted picture",
      "Rotation plans that ignore the last 14 days of trend",
      "Young athletes developed without position-context benchmarks",
    ],
    screens: ["Team overview", "Position room", "14-day trend sparklines", "Squad readiness comparison"],
    outcomes: [
      "Rotation and minutes decisions grounded in the same board the staff trusts",
      "Trends visible before they become selection surprises",
      "Position-context comparisons for development conversations",
    ],
  },
  {
    id: "data",
    eyebrow: "For analysts, researchers & leagues",
    title: "Data Products & Research",
    lede: "Package and license governed datasets through a built-in marketplace.",
    audience: "Analysts · researchers · league operations",
    problems: [
      "Derived datasets shared informally with no consent layer",
      "No trust rails for buying or selling sports data",
      "Research collaborations stalled on data governance",
    ],
    screens: ["Marketplace catalog & cart", "Dataset packaging", "Consent records", "Role-based access"],
    outcomes: [
      "Consent-governed sharing with an audit trail on every access",
      "A revenue channel on data the organization already produces",
      "Research partnerships that legal teams can actually clear",
    ],
  },
];

const INDUSTRIES = ["Academies & schools", "Semi-pro clubs", "Professional clubs", "Leagues & governing bodies"];

export default function SolutionsPage() {
  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">Solutions</p>
        <h1 className="hero-title mt-3 max-w-4xl">
          One platform. <span className="text-accent">Four seats at the table.</span>
        </h1>
        <p className="lede mt-5 max-w-3xl">
          Every organization runs the same loop — import, validate, score, decide. What changes
          is the seat you sit in. Find yours below.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Solutions">
          {SOLUTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-md border border-edge px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:border-accent/50 hover:text-ink"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </section>

      {SOLUTIONS.map((s, i) => (
        <section key={s.id} id={s.id} className="mx-auto max-w-7xl scroll-mt-20 px-6 py-12 md:px-10" aria-label={s.title}>
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{s.eyebrow}</p>
                <h2 className="h-sec mt-1.5">{s.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink">{s.lede}</p>
                <p className="mt-1 text-xs text-muted">{s.audience}</p>

                <div className="mt-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">The problems</div>
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
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">The outcomes</div>
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

              <div className="surface rounded-2xl p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  Screens you will use
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
                  className="mt-4 block rounded-md border border-edge px-4 py-2 text-center text-xs font-semibold text-ink transition-colors hover:border-accent/50 hover:bg-panel-2"
                >
                  Try these screens as guest
                </Link>
                <div className="mt-4 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-[11px] text-muted">
                  Solution {i + 1} of {SOLUTIONS.length} · all four run on the same data model
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      ))}

      {/* Industries */}
      <section className="mx-auto max-w-7xl px-6 pb-6 md:px-10" aria-label="Who it is designed for">
        <Reveal>
          <h2 className="h-sec">Designed for every level of the game</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((name) => (
              <li key={name} className="surface rounded-2xl p-5 text-center">
                <span className="display-heading text-base">{name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            The data model already spans 8 sports — football is the beachhead, not the ceiling.
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Reveal>
          <div className="cta-band rounded-3xl p-8 text-center">
            <h2 className="h-sec">Find your solution in 30 minutes</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Tell us which seat you sit in — we will walk the exact screens that solve your problems.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
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
