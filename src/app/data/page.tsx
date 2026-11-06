import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Tag } from "@/components/ui/primitives";
import { MarketingFooter, MarketingHeader } from "@/components/marketing/chrome";
import { DatasetSection } from "@/components/marketing/dataset-section";
import { parseCsv, sportStats } from "@/lib/sport-stats";
import { getDict } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Data — Sportmetryx",
  description:
    "Explore the Sportmetryx datasets: downloads, a per-sport sessions selector and the scored athlete-day preview with its data dictionary.",
};

const CSV_PUBLIC = "/datasets/Sportmetryx_Combined_Wide_Athlete_Day.csv";
const SESSIONS_PUBLIC = "/datasets/final1.csv";

function datasetStats() {
  try {
    const table = parseCsv(
      fs.readFileSync(path.join(process.cwd(), "public", "datasets", "Sportmetryx_Combined_Wide_Athlete_Day.csv"), "utf8"),
    );
    const head = table[0]!.map((h, i) => [h, i] as const);
    const col = (name: string) => head.find(([h]) => h === name)?.[1] ?? -1;
    const cAthlete = col("athlete_name"), cDate = col("date"), cTeam = col("team"),
      cPos = col("position"), cScore = col("score"), cBand = col("score_band");
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

export default async function DataPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>;
}) {
  const sp = await searchParams;
  const initial = sportStats(sp?.sport);
  const athleteDay = datasetStats();
  const t = (await getDict()).home;

  return (
    <main className="min-h-dvh">
      <MarketingHeader />

      <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10">
        <p className="eyebrow">{t.data.eyebrow}</p>
        <h1 className="hero-title mt-3 max-w-4xl">{t.data.h2}</h1>
        <p className="lede mt-5 max-w-2xl">{t.data.lede}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Tag label="DATASET" />
          <a href={CSV_PUBLIC} download className="btn-primary">
            {t.data.download}
          </a>
          <a
            href={SESSIONS_PUBLIC}
            download="Sportmetryx_Combined_Sessions.csv"
            className="btn-ghost"
          >
            {t.data.download2}
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="/datasets/Sportmetryx_Wide_Data_Dictionary.csv"
            download
            className="text-xs font-semibold text-accent underline-offset-2 hover:underline"
          >
            {t.data.download3} →
          </a>
          <a
            href="/datasets/Sportmetryx_Sessions_Data_Dictionary.csv"
            download
            className="text-xs font-semibold text-accent underline-offset-2 hover:underline"
          >
            {t.data.download4} →
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-6 md:px-10" aria-label="Dataset explorer">
        <DatasetSection
          labels={t.data}
          sportLabels={t.sportPanel}
          initial={initial}
          athleteDay={athleteDay}
        />
      </section>

      <MarketingFooter />
    </main>
  );
}
