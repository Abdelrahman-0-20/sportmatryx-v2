import fs from "node:fs";
import path from "node:path";

/** Shared CSV parsing + sessions-dataset aggregation (used by the home page
 *  for its server-rendered initial state and by /api/sport-stats for instant
 *  client-side sport switching). */

export function parseCsv(text: string): string[][] {
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

export type SportStats = {
  ok: boolean;
  sports: string[];
  current: string;
  sessions: number;
  athletes: number;
  hours: number;
  avgRpe: string;
};

/** Aggregate final1.csv for the sport selector. */
export function sportStats(sport?: string): SportStats {
  try {
    const table = parseCsv(
      fs.readFileSync(path.join(process.cwd(), "public", "datasets", "final1.csv"), "utf8"),
    );
    const head = table[0]!.map((h, i) => [h, i] as const);
    const col = (name: string) => head.find(([h]) => h === name)?.[1] ?? -1;
    const cSport = col("sport"), cAth = col("ath_alias"),
      cDur = col("duration_min"), cRpe = col("intensity_rpe_1_10");
    const all = table.slice(1).filter((r) => r[cSport]);
    const sports = [...new Set(all.map((r) => r[cSport]))].sort();
    const current = sport && sports.includes(sport) ? sport : "";
    const rows = current ? all.filter((r) => r[cSport] === current) : all;
    const athletes = new Set(rows.map((r) => r[cAth]).filter(Boolean));
    const minutes = rows.reduce((a, r) => a + (Number(r[cDur]) || 0), 0);
    const rpes = rows.map((r) => Number(r[cRpe])).filter((n) => Number.isFinite(n) && n > 0);
    const avgRpe = rpes.length ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1) : "—";
    return { ok: true, sports, current, sessions: rows.length,
      athletes: athletes.size, hours: Math.round(minutes / 60), avgRpe };
  } catch {
    return { ok: false, sports: [], current: "", sessions: 0, athletes: 0, hours: 0, avgRpe: "—" };
  }
}
