import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Tag } from "@/components/ui/primitives";
import { BootScreen } from "@/components/ui/boot-screen";
import { CountUp, Reveal } from "@/components/ui/motion";
import { ProductTour } from "@/components/ui/product-tour";
import { SportsMarquee } from "@/components/ui/sports-marquee";
import { TelemetryTicker } from "@/components/ui/telemetry-ticker";
import { TiltCard } from "@/components/ui/tilt-card";

/**
 * Home — product landing + data hub.
 * Explains what Sportmetryx Football is, who it serves and what it is used
 * for, then hands visitors the demo dataset (stats computed from the CSV,
 * preview table, full download) and primary navigation (marketplace,
 * athletes). Live layer: boot sequence, aurora hero, telemetry ticker,
 * scroll reveals, count-up stats, 3D tilt cards, sports marquee and an
 * interactive product tour.
 */

const CSV_PUBLIC = "/datasets/Sportmetryx_Combined_Wide_Athlete_Day.csv";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function datasetStats() {
  try {
    const table = parseCsv(
      fs.readFileSync(path.join(process.cwd(), "public", "datasets", "Sportmetryx_Combined_Wide_Athlete_Day.csv"), "utf8"),
    );
    const head = table[0]!.map((h, i) => [h, i] as const);
    const col = (name: string) => head.find(([h]) => h === name)?.[1] ?? -1;
    const cAthlete = col("Athlete"), cDate = col("Date"), cTeam = col("Team"),
      cPos = col("Position"), cScore = col("Score"), cBand = col("Score Band");
    const rows = table.slice(1).filter((r) => r[cAthlete]);
    const athletes = new Set(rows.map((r) => r[cAthlete]));
    const teams = new Set(rows.map((r) => r[cTeam]));
    const positions = new Set(rows.map((r) => r[cPos]));
    const dates = rows.map((r) => r[cDate]).sort();
    const bands: Record<string, number> = {};
    for (const r of rows) {
      const b = r[cBand];
      if (b) bands[b] = (bands[b] ?? 0) + 1;
    }
    const preview = rows.slice(0, 6).map((r) => ({
      athlete: r[cAthlete], date: r[cDate], team: r[cTeam], position: r[cPos],
      score: r[cScore], band: r[cBand],
    }));
    return { ok: true as const, rows: rows.length, athletes: athletes.size, teams: [...teams],
      positions: [...positions], range: [dates[0], dates[dates.length - 1]] as const, bands, preview };
  } catch {
    return { ok: false as const, rows: 0, athletes: 0, teams: [] as string[], positions: [] as string[],
      range: ["-", "-"] as const, bands: {}, preview: [] };
  }
}

const stats = datasetStats();
const BAND_COLORS: Record<string, string> = {
  READY: "bg-ready", MONITOR: "bg-monitor", COMPROMISED: "bg-compromised", WITHHELD: "bg-withheld",
};

const SPORTS = ["Soccer", "American football", "Basketball", "Baseball", "Cycling", "Rugby", "Track & field", "Volleyball"];

const USE_CASES: Array<[title: string, body: string]> = [
  ["Daily readiness calls", "See who is READY, MONITOR or COMPROMISED before the session starts — with the drivers behind every band, not a black-box number."],
  ["Workload & environment", "Track day-level load, travel and heat exposure against each athlete's own baseline, so context is never lost."],
  ["Squad & rotation planning", "Compare readiness across the whole roster to plan minutes, rotations and recovery days with confidence."],
  ["Data products & research", "Package and license derived datasets in the marketplace — demo checkout only, no real payments."],
];

const AUDIENCE: Array<[role: string, line: string]> = [
  ["Performance staff", "Set the daily training picture from one screen."],
  ["Medical & rehab", "Spot COMPROMISED signals early and validate return-to-play."],
  ["Coaches", "Pick the squad with readiness context, not gut feeling alone."],
  ["Analysts & researchers", "Work with validity-gated, consent-governed datasets."],
];

const QUICK_FACTS: Array<[label: string, value: string]> = [
  ["Domain", "Football (soccer) performance"],
  ["Built by", "Healthmetryx"],
  ["Scores", "Validity-gated, explainable"],
  ["Baselines", "Personal, per athlete"],
  ["Data", "Synthetic demo — not real athletes"],
  ["Status", "Prototype · research & demonstration"],
];

const GLOBE_RINGS = [0, 30, 60, 90, 120, 150];

export default function HomePage() {
  return (
    <main className="relative min-h-dvh">
      <BootScreen />

      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <span className="display-heading text-2xl">
          <span className="text-accent">Sportmetryx</span> Football
          <span className="ml-3 text-xs text-muted">Powered by Healthmetryx</span>
        </span>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/marketplace" className="hidden text-muted hover:text-ink md:block">Marketplace</Link>
          <Link href="/roster" className="hidden text-muted hover:text-ink md:block">Athletes</Link>
          <Link href="/login" className="rounded-md border border-edge px-3 py-1.5 font-semibold text-ink hover:bg-panel">
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero — aurora glow, 3D wireframe globe, live telemetry */}
      <section className="relative isolate mx-auto max-w-7xl px-6 pt-8 md:px-10">
        <div className="aurora" aria-hidden="true">
          <span className="aurora-a" />
          <span className="aurora-b" />
        </div>
        <div className="globe-wrap absolute right-0 top-0 hidden lg:block" aria-hidden="true">
          <div className="globe">
            {GLOBE_RINGS.map((deg) => (
              <span key={deg} className="ring" style={{ transform: `rotateY(${deg}deg)` }} />
            ))}
            <span className="ring ring-equator" />
          </div>
        </div>

        <p className="hero-in text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Decision support for football performance staff
        </p>
        <h1 className="display-heading hero-in hero-in-2 mt-2 text-4xl leading-tight md:text-6xl">
          <span className="text-ink">Turn daily athlete data into</span>{" "}
          <span className="text-accent">decisions you can defend.</span>
        </h1>
        <p className="hero-in hero-in-3 mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          <strong className="text-ink">Sportmetryx Football</strong> is a readiness platform for
          football (soccer) clubs. It converts the data your staff already collects — GPS and
          session load, wellness, environment — into one daily readiness score per athlete:
          validity-checked first, computed against personal baselines, and always explainable.
        </p>
        <div className="hero-in hero-in-3 mt-6 flex flex-wrap gap-3">
          <Link href="/marketplace" className="btn-sheen rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-canvas hover:bg-cyan-300">
            Open the marketplace
          </Link>
          <Link href="/roster" className="rounded-md border border-edge px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent/50 hover:bg-panel">
            Browse athletes
          </Link>
          <Link href="/guest" className="rounded-md border border-edge px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent/50 hover:bg-panel">
            Continue as guest
          </Link>
        </div>

        <TelemetryTicker />
      </section>

      {/* Multisport pipeline marquee */}
      <div className="mt-10 border-y border-edge bg-panel/40 py-3">
        <SportsMarquee items={SPORTS} />
      </div>

      {/* What is Sportmetryx */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10" aria-label="What is Sportmetryx">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="display-heading text-2xl">What is Sportmetryx?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Sportmetryx is a readiness intelligence layer that sits on top of the data a football
                organization already produces. Instead of scattering sensor exports, wellness forms
                and load reports across spreadsheets, it unifies them into a single
                <span className="text-ink"> combined athlete-day record</span> — one row per athlete
                per day — and derives a readiness score from it.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Every score is <span className="text-ink">validity-gated</span> (bad or missing inputs
                are flagged, never silently scored), <span className="text-ink">explainable</span>{" "}
                (you can always see which drivers moved the number) and{" "}
                <span className="text-ink">consent-governed</span> (athlete data is only visible under
                the access controls each athlete consents to).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                The result is not another dashboard to stare at — it is a shared, auditable picture
                the whole staff can act on before every session.
              </p>
            </div>
            <div className="rounded-[10px] border border-edge bg-panel p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">At a glance</div>
              <dl className="mt-3 space-y-2.5 text-sm">
                {QUICK_FACTS.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-edge/40 pb-2 last:border-0 last:pb-0">
                    <dt className="shrink-0 text-xs uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="text-right text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Who it is for */}
      <section className="mx-auto max-w-7xl px-6 pb-4 md:px-10" aria-label="Who uses Sportmetryx">
        <Reveal>
          <h2 className="display-heading text-2xl">Who it is for</h2>
          <p className="mt-1 text-sm text-muted">One platform, four seats at the table.</p>
          <ul className="stagger mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map(([role, line]) => (
              <li key={role} className="rounded-[10px] border border-edge bg-panel p-4">
                <div className="display-heading text-base text-accent">{role}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{line}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* What it is used for — 3D tilt cards */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="What Sportmetryx is used for">
        <Reveal delay={60}>
          <h2 className="display-heading text-2xl">What it is used for</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {USE_CASES.map(([title, body]) => (
              <TiltCard key={title} className="card-lift rounded-[10px] border border-edge bg-panel p-5">
                <div className="display-heading text-lg">{title}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{body}</p>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </section>

      {/* How it works — interactive product tour */}
      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-10" aria-label="How Sportmetryx works">
        <Reveal>
          <h2 className="display-heading text-2xl">How it works</h2>
          <p className="mt-1 text-sm text-muted">Click through the flow — or let it play.</p>
          <div className="mt-4">
            <ProductTour />
          </div>
        </Reveal>
      </section>

      {/* Explore the demo dataset */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10" aria-label="Combined athlete-day dataset">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="display-heading text-2xl">Explore the demo dataset</h2>
            <p className="mt-1 text-sm text-muted">
              The exact data this demo runs on: 50 synthetic athletes, day-level sensor means,
              workload, environment, consent, baselines and scores.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tag label="SYNTHETIC" />
            <a href={CSV_PUBLIC} download
              className="rounded-md bg-accent px-4 py-2 text-xs font-bold text-canvas hover:bg-cyan-300">
              Download full CSV
            </a>
          </div>
        </div>

        {stats.ok ? (
          <Reveal delay={80}>
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {([
                  ["Athlete-day rows", stats.rows],
                  ["Athletes", stats.athletes],
                  ["Teams", stats.teams.length],
                  ["Days covered", 28],
                ] as const).map(([label, value]) => (
                  <div key={label} className="rounded-[10px] border border-edge bg-panel p-4">
                    <div className="display-heading text-2xl text-ink"><CountUp value={value} /></div>
                    <div className="mt-0.5 text-xs text-muted">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-[10px] border border-edge bg-panel p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Readiness distribution (scored days)
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full border border-edge">
                  <div className="bar-grow flex h-full w-full">
                    {Object.entries(stats.bands).map(([band, n]) => (
                      <div key={band} className={BAND_COLORS[band] ?? "bg-edge"}
                        style={{ width: `${(n / Math.max(1, stats.rows)) * 100}%` }} title={`${band}: ${n}`} />
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  {Object.entries(stats.bands).map(([band, n]) => (
                    <span key={band}>
                      <span className={`inline-block h-2 w-2 rounded-full ${BAND_COLORS[band] ?? "bg-edge"}`} /> {band}: {n}
                    </span>
                  ))}
                  <span>Range: {stats.range[0]} → {stats.range[1]}</span>
                  <span>Teams: {stats.teams.join(", ")}</span>
                </div>
              </div>

              <div className="mt-3 overflow-x-auto rounded-[10px] border border-edge bg-panel">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-edge text-muted">
                      {["Athlete", "Date", "Team", "Position", "Score", "Band"].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.preview.map((r) => (
                      <tr key={`${r.athlete}-${r.date}`} className="border-b border-edge/40 last:border-0">
                        <td className="px-3 py-2 font-semibold text-ink">{r.athlete}</td>
                        <td className="px-3 py-2 text-muted">{r.date}</td>
                        <td className="px-3 py-2 text-muted">{r.team}</td>
                        <td className="px-3 py-2 text-muted">{r.position}</td>
                        <td className="px-3 py-2 tabular text-ink">{r.score}</td>
                        <td className="px-3 py-2">{r.band ? <Tag label={r.band} /> : <span className="text-muted">-</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Preview of the first 6 rows. The full file contains all sensor means, driver contributions
                and validity checks — clearly labeled synthetic data, not real athletes.
              </p>
            </>
          </Reveal>
        ) : (
          <p className="mt-4 text-sm text-compromised">Dataset file not found on the server.</p>
        )}
      </section>

      <footer className="border-t border-edge px-6 py-4 text-center text-xs text-muted md:px-10">
        Decision support only. Not a medical device. Prototype models are for research and demonstration.
        &copy; Sportmetryx. All athlete data governed by consent and access controls.
      </footer>
    </main>
  );
}
