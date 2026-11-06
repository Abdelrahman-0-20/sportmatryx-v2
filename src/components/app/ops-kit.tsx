import type { ReactNode } from "react";

/**
 * Shared building blocks for the operations screens (interventions, position
 * room, practice, recovery, environment, data quality, admin) so the seven
 * pages read as one family: one empty state, one footnote, one responsive
 * stat-card grid, one scrollable table shell, one enum label helper.
 */

/** Empty state — the single treatment used across every ops page. */
export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="rounded-md border border-dashed border-edge p-6 text-center text-sm text-muted">
      <p>{message}</p>
      {hint ? <p className="mt-1 text-xs text-muted/80">{hint}</p> : null}
    </div>
  );
}

/** Page footnote — at most one per page, always last, always this styling. */
export function Footnote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 border-t border-edge/60 pt-3 text-xs leading-relaxed text-muted">{children}</p>
  );
}

/**
 * Responsive stat-card grid — the one pattern used by every ops page:
 * 1 column on phones, 2 from sm, 3 (or 4) from lg once the sidebar has room.
 */
export function StatGrid({ cols = 3, children }: { cols?: 3 | 4; children: ReactNode }) {
  const final = cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return <div className={`stagger mb-4 grid gap-4 sm:grid-cols-2 ${final}`}>{children}</div>;
}

/** Scrollable table shell — wide tables scroll inside the card, never the page. */
export function TableScroll({
  children,
  minWidth = "min-w-[640px]",
}: {
  children: ReactNode;
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${minWidth}`}>{children}</table>
    </div>
  );
}

/** Unified header cell padding for every ops table. */
export const TH = "pb-2 pr-3 text-left align-bottom";
/** Unified body cell padding for every ops table. */
export const TD = "py-2.5 pr-3 align-top";

/**
 * Human label for a raw enum/code value: "MULTI_FAIL" → "Multi Fail",
 * "OK" → "OK". Short all-caps tokens (acronyms) are kept as-is. The raw value
 * should stay available to staff as a title/tooltip on the wrapper.
 */
export function humanize(value: string): string {
  return value
    .split("_")
    .map((word) =>
      word.length > 0 && word.length <= 3 && word === word.toUpperCase()
        ? word
        : word.charAt(0) + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

/** Human labels for position-group codes (raw code stays on the tooltip). */
export const POSITION_LABELS: Record<string, string> = {
  QB: "Quarterbacks",
  SKILL: "Skill positions",
  TRENCH: "Linemen",
  LB_TE: "Linebackers & tight ends",
  ST: "Special teams",
};

/** Human labels (with units) for observation metrics. */
export const METRIC_LABELS: Record<string, string> = {
  ACCEL_N: "Acceleration (N)",
  ACWR: "Acute:chronic workload ratio",
  ALT_M: "Altitude (m)",
  AQI: "Air quality index",
  HEAT_C: "Heat (°C)",
  HRV_MS: "HRV (ms)",
  JUMP_CM: "Jump height (cm)",
  LOAD_AU: "External load (AU)",
  RESP_RATE: "Respiration rate (brpm)",
  RHR: "Resting heart rate (bpm)",
  SLEEP_H: "Sleep (h)",
  SPO2: "SpO₂ (%)",
  TZ_SHIFT_H: "Time-zone shift (h)",
  VENT_EFF: "Ventilation efficiency",
  VO2_PROXY: "VO₂ proxy",
};

/** Age of a sample in minutes → "45m ago" / "13h ago". */
export function formatAge(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return "—";
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Locale-formatted integer — large counts must never render raw (125,995). */
export function count(n: number): string {
  return n.toLocaleString("en-US");
}
