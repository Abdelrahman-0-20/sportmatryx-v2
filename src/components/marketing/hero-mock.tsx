/**
 * HeroMock — the floating product mockup in the home hero: a glass-panel
 * readiness board rendered as pure markup (no image asset). Decorative;
 * hidden from assistive tech because the real board lives at /roster.
 */

const ROWS: Array<[initials: string, name: string, pos: string, score: string, band: string, bars: number[]]> = [
  ["AO", "Amari Osei", "TRENCH", "91", "READY", [62, 68, 71, 74, 83, 88, 91]],
  ["C1", "Cinder_01", "SKILL", "84", "READY", [70, 66, 72, 78, 80, 82, 84]],
  ["N7", "Nova_07", "LB_TE", "61", "MONITOR", [77, 74, 70, 66, 64, 62, 61]],
  ["R12", "Rook_12", "QB", "42", "COMPROMISED", [74, 68, 61, 55, 49, 45, 42]],
];

const BAND_CLASS: Record<string, string> = {
  READY: "bg-ready/15 text-ready",
  MONITOR: "bg-monitor/15 text-monitor",
  COMPROMISED: "bg-compromised/15 text-compromised",
};

function Spark({ bars, className }: { bars: number[]; className?: string }) {
  const w = 64;
  const step = w / (bars.length - 1);
  const points = bars
    .map((b, i) => `${(i * step).toFixed(1)},${(24 - (b / 100) * 22).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} 24`} className={`h-5 w-16 ${className ?? ""}`} fill="none" aria-hidden="true">
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function HeroMock() {
  return (
    <div className="float-mock glass rounded-2xl p-4 sm:p-5" aria-hidden="true">
      {/* Board header */}
      <div className="flex items-center justify-between gap-3 border-b border-edge/70 pb-3">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          <span className="live-dot" /> Today · squad readiness
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="hero-number text-3xl text-accent">87</span>
          <span className="text-[10px] font-semibold text-ready">+6</span>
        </span>
      </div>

      {/* Athlete rows */}
      <ul className="mt-3 space-y-2">
        {ROWS.map(([initials, name, pos, score, band, bars], i) => (
          <li
            key={name}
            className="tour-row flex items-center gap-3 rounded-xl border border-edge/50 bg-panel-2/70 px-3 py-2.5"
            style={{ animationDelay: `${400 + i * 130}ms` }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink">{name}</span>
              <span className="block text-[10px] uppercase tracking-wider text-muted">{pos}</span>
            </span>
            <span className={`hidden text-accent sm:block ${i === 3 ? "text-compromised" : ""}`}>
              <Spark bars={bars} />
            </span>
            <span className="tabular w-9 text-right text-sm font-bold text-ink">{score}</span>
            <span className={`rounded-md px-2 py-1 text-[9px] font-bold ${BAND_CLASS[band]}`}>{band}</span>
          </li>
        ))}
      </ul>

      {/* Footer chips */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-edge/70 pt-3">
        <span className="rounded-md bg-monitor/15 px-2 py-1 text-[10px] font-bold text-monitor">
          3 exceptions to review
        </span>
        <span className="text-[10px] text-muted">Synthetic demo data</span>
      </div>
    </div>
  );
}
