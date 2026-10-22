import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Tag } from "@/components/ui/primitives";

/**
 * Home — the data hub.
 * Features the team-generated Combined Wide Athlete-Day dataset (SYNTHETIC,
 * honesty-labeled): stats computed from the file, a preview table, a full-CSV
 * download, and primary navigation (marketplace, athletes, reports).
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

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="flex items-center justify-between px-6 py-4 md:px-10">
        <span className="display-heading text-2xl">
          <span className="text-accent">Sportmetryx</span> Football
          <span className="ml-3 text-xs text-muted">Powered by Healthmetryx</span>
        </span>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/marketplace" className="hidden text-muted hover:text-ink md:block">Marketplace</Link>
          <Link href="/roster" className="hidden text-muted hover:text-ink md:block">Athletes</Link>
          <Link href="/research" className="hidden text-muted hover:text-ink md:block">Reports</Link>
          <Link href="/login" className="rounded-md border border-edge px-3 py-1.5 font-semibold text-ink hover:bg-panel">
            Sign in
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-6 md:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Decision support for football performance staff
        </p>
        <h1 className="display-heading mt-2 text-4xl leading-tight md:text-6xl">
          <span className="text-ink">One dataset.</span>{" "}
          <span className="text-accent">Every decision.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Validity-gated, explainable athlete readiness built on personal baselines — fueled by the
          team-generated combined athlete-day dataset. Demo marketplace included; no real payments.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/marketplace" className="rounded-md bg-accent px-5 py-2.5 text-sm font-bold text-canvas hover:bg-cyan-300">
            Open the marketplace
          </Link>
          <Link href="/roster" className="rounded-md border border-edge px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent/50 hover:bg-panel">
            Browse athletes
          </Link>
          <Link href="/guest" className="rounded-md border border-edge px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent/50 hover:bg-panel">
            Continue as guest
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10" aria-label="Combined athlete-day dataset">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="display-heading text-2xl">Combined athlete-day dataset</h2>
            <p className="mt-1 text-sm text-muted">
              50 synthetic athletes · day-level sensor means, workload, environment, consent, baselines and scores.
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
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([
                ["Athlete-day rows", String(stats.rows)],
                ["Athletes", String(stats.athletes)],
                ["Teams", String(stats.teams.length)],
                ["Days covered", "28"],
              ] as const).map(([label, value]) => (
                <div key={label} className="rounded-[10px] border border-edge bg-panel p-4">
                  <div className="display-heading text-2xl text-ink">{value}</div>
                  <div className="mt-0.5 text-xs text-muted">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[10px] border border-edge bg-panel p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Readiness distribution (scored days)
              </div>
              <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full border border-edge">
                {Object.entries(stats.bands).map(([band, n]) => (
                  <div key={band} className={BAND_COLORS[band] ?? "bg-edge"}
                    style={{ width: `${(n / Math.max(1, stats.rows)) * 100}%` }} title={`${band}: ${n}`} />
                ))}
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
        ) : (
          <p className="mt-4 text-sm text-compromised">Dataset file not found on the server.</p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-10">
        <h2 className="display-heading mb-3 text-xl">Go to</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["/marketplace", "Marketplace", "Browse and license datasets - demo checkout, no payments."],
            ["/roster", "Athletes", "50 synthetic athletes across 3 teams with full profiles."],
            ["/team-command", "Team Command", "Readiness distribution and operational roster overview."],
            ["/admin", "Administration & Audit", "Tamper-evident audit chain and administration."],
          ] as const).map(([href, name, desc]) => (
            <li key={href} className="card-lift rounded-[10px] border border-edge bg-panel p-4">
              <Link href={href} className="display-heading text-lg hover:text-accent">{name}</Link>
              <p className="mt-1 text-xs text-muted">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-edge px-6 py-4 text-center text-xs text-muted md:px-10">
        Decision support only. Not a medical device. Prototype models are for research and demonstration.
        &copy; Sportmetryx. All athlete data governed by consent and access controls.
      </footer>
    </main>
  );
}
