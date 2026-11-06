/** Canonical sport ordering shared by the roster filter and Player 360 chooser.
 *
 *  The list mirrors the sports present in the curated dataset
 *  (`public/datasets/final1.csv`) and in the seeded database, so filters line
 *  up everywhere. Unknown sports are appended alphabetically rather than
 *  dropped — the UI must never hide data it does not recognise.
 */

export const SPORT_ORDER = [
  "American football",
  "soccer",
  "rugby",
  "basketball",
  "baseball",
  "volleyball",
  "cycling",
  "track and field",
] as const;

const RANK = new Map<string, number>(SPORT_ORDER.map((s, i) => [s, i]));

/** Sort a set of sport names into canonical order, unknowns last (A→Z). */
export function orderSports(sports: Iterable<string>): string[] {
  return [...new Set(sports)].sort((a, b) => {
    const ra = RANK.get(a) ?? Number.MAX_SAFE_INTEGER;
    const rb = RANK.get(b) ?? Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
}

/** Icon per sport — used in roster rows, scouting tables and the top bar. */
export const SPORT_ICONS: Record<string, string> = {
  "American football": "🏈",
  soccer: "⚽",
  rugby: "🏉",
  basketball: "🏀",
  baseball: "⚾",
  volleyball: "🏐",
  cycling: "🚴",
  "track and field": "🏃",
};

/** Icon for a sport, falling back to a neutral medal for unknown sports. */
export function sportIcon(sport: string): string {
  return SPORT_ICONS[sport] ?? "🏅";
}
