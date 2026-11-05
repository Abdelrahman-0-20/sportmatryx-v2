import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { Tag } from "@/components/ui/primitives";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { DemoVideo } from "@/components/marketing/demo-video";
import { HeroBackground } from "@/components/marketing/hero-background";
import { HeroMock } from "@/components/marketing/hero-mock";
import { BootScreen } from "@/components/ui/boot-screen";
import { CountUp, Reveal } from "@/components/ui/motion";
import { ProductTour } from "@/components/ui/product-tour";
import { SportsMarquee } from "@/components/ui/sports-marquee";
import { TelemetryTicker } from "@/components/ui/telemetry-ticker";
import { TiltCard } from "@/components/ui/tilt-card";
import { getDict } from "@/lib/i18n/server";
import { Rich } from "@/lib/i18n/rich";

/**
 * Home — Kitman-style marketing flow with the premium dark treatment and
 * full i18n (EN/ES/PT/ZH): hero + product mockup → proof strip → solutions →
 * what it is → audience → use cases → product tour → marquee → dataset →
 * demo CTA.
 */

const CSV_PUBLIC = "/datasets/Sportmetryx_Combined_Wide_Athlete_Day.csv";
const SESSIONS_PUBLIC = "/datasets/final1.csv";

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
    const scored = rows.filter((r) => r[cScore] && r[cBand] && r[cBand] !== "WITHHELD");
    const preview = (scored.length >= 6 ? scored : rows).slice(0, 6).map((r) => ({
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

          <div className="hidden lg:block">
            <HeroMock />
          </div>
        </div>

        <div className="mt-12 xl:mt-14">
          <TelemetryTicker />
        </div>
        <div className="mt-6 lg:hidden">
          <HeroMock />
        </div>
        </div>
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

      {/* Who it is for */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Who uses Sportmetryx">
        <Reveal>
          <p className="eyebrow">{t.who.eyebrow}</p>
          <h2 className="h-sec mt-3">{t.who.h2}</h2>
          <ul className="stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.who.cards.map((card) => (
              <li key={card.title} className="surface rounded-2xl p-6">
                <div className="text-base font-semibold text-ink">{card.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.line}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* What it is used for — 3D tilt surfaces */}
      <section className="section-y border-t border-edge/50 bg-panel-2/30" aria-label="What Sportmetryx is used for">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="eyebrow">{t.usecases.eyebrow}</p>
            <h2 className="h-sec mt-3">{t.usecases.h2}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.usecases.cards.map((card) => (
                <TiltCard key={card.title} className="surface rounded-2xl p-6">
                  <div className="text-lg font-semibold text-ink">{card.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Demo video */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Product tour video">
        <Reveal>
          <p className="eyebrow">{t.watch.eyebrow}</p>
          <h2 className="h-sec mt-3">{t.watch.h2}</h2>
          <p className="lede mt-3 max-w-2xl">
            <Rich text={t.watch.lede} />
          </p>
          <div className="mt-8 max-w-4xl">
            <DemoVideo />
          </div>
        </Reveal>
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

      {/* Multisport pipeline marquee */}
      <div className="border-y border-edge/70 bg-panel-2/50 py-4">
        <SportsMarquee items={t.sports} />
      </div>

      {/* Explore the demo dataset */}
      <section className="section-y mx-auto max-w-7xl px-6 md:px-10" aria-label="Combined athlete-day dataset">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t.data.eyebrow}</p>
            <h2 className="h-sec mt-3">{t.data.h2}</h2>
            <p className="lede mt-3 max-w-2xl">{t.data.lede}</p>
          </div>
          <div className="flex items-center gap-3">
            <Tag label="DATASET" />
            <a href={CSV_PUBLIC} download className="btn-primary">
              {t.data.download}
            </a>
            <a href={SESSIONS_PUBLIC} download="Sportmetryx_Combined_Sessions.csv" className="btn-ghost">
              {t.data.download2}
            </a>
          </div>
        </div>

        {stats.ok ? (
          <Reveal delay={80}>
            <>
              <div className="mt-10 grid grid-cols-2 gap-0 border-y border-edge/70 md:grid-cols-4">
                {t.data.stats.map((label, i) => {
                  const value = [stats.rows, stats.athletes, stats.teams.length, 28][i]!;
                  return (
                    <div key={label} className={`stat-cell py-7 ${i > 0 ? "sm:pl-6 md:pl-8" : ""}`}>
                      <div className="stat-num">
                        <CountUp value={value} />
                      </div>
                      <div className="stat-label">{label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-edge/70 bg-panel/70 p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                  {t.data.distTitle}
                </div>
                <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full border border-edge/70 bg-panel-2">
                  <div className="bar-grow flex h-full w-full">
                    {Object.entries(stats.bands).map(([band, n]) => (
                      <div key={band} className={BAND_COLORS[band] ?? "bg-edge"}
                        style={{ width: `${(n / Math.max(1, stats.rows)) * 100}%` }} title={`${band}: ${n}`} />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                  {Object.entries(stats.bands).map(([band, n]) => (
                    <span key={band}>
                      <span className={`inline-block h-2 w-2 rounded-full ${BAND_COLORS[band] ?? "bg-edge"}`} /> {band}: {n}
                    </span>
                  ))}
                  <span>
                    {t.data.range}: {stats.range[0]} → {stats.range[1]}
                  </span>
                  <span>
                    {t.data.teams}: {stats.teams.join(", ")}
                  </span>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-2xl border border-edge/70 bg-panel/70">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-edge/70 text-[11px] uppercase tracking-wider text-muted">
                      {t.data.headers.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.preview.map((r) => (
                      <tr key={`${r.athlete}-${r.date}`} className="border-b border-edge/40 last:border-0">
                        <td className="px-4 py-3 font-medium text-ink">{r.athlete}</td>
                        <td className="px-4 py-3 text-muted">{r.date}</td>
                        <td className="px-4 py-3 text-muted">{r.team}</td>
                        <td className="px-4 py-3 text-muted">{r.position}</td>
                        <td className="tabular px-4 py-3 text-ink">{r.score}</td>
                        <td className="px-4 py-3">{r.band ? <Tag label={r.band} /> : <span className="text-muted">-</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">{t.data.note}</p>
            </>
          </Reveal>
        ) : (
          <p className="mt-6 text-sm text-compromised">Dataset file not found on the server.</p>
        )}
      </section>

      {/* Tactics teaser */}
      <section className="mx-auto max-w-7xl px-6 pb-6 md:px-10">
        <Reveal>
          <Link
            href="/tactics"
            className="cta-band group flex flex-col items-start gap-6 rounded-3xl px-8 py-12 md:flex-row md:items-center md:justify-between md:px-12"
          >
            <div>
              <span className="eyebrow">{t.tactics.eyebrow}</span>
              <span className="h-sec mt-3 block">{t.tactics.h2}</span>
              <span className="lede mt-3 block max-w-xl">{t.tactics.lede}</span>
            </div>
            <span className="btn-primary shrink-0 transition-transform group-hover:translate-x-1">
              {t.tactics.btn}
            </span>
          </Link>
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
