/**
 * TacticsShowcase — Hudl-style dashboard collage: radar, heatmap scouting
 * table, team-average sparklines, range sliders, leaderboard, analyst note
 * and a formation map. Static markup; all motion is CSS (scroll-revealed by
 * the parent Reveal, row staggers via .tour-row, radar/knob/dot keyframes).
 */

function Panel({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`surface rounded-2xl p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">{title}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent/70" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

/* ---------- radar ---------- */

function RadarPanel() {
  const labels: Array<[x: number, y: number, text: string]> = [
    [120, 16, "xG"],
    [196, 56, "NP xG/Shot"],
    [196, 146, "NP Shots"],
    [120, 188, "Key Passes"],
    [44, 146, "Carries"],
    [44, 56, "Crosses"],
  ];
  const ring = (r: number) =>
    [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180;
        return `${(120 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");
  const poly = (vals: number[]) =>
    vals
      .map((v, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180;
        return `${(120 + 70 * v * Math.cos(a)).toFixed(1)},${(100 + 70 * v * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");

  return (
    <Panel title="Radar — attacking output">
      <svg viewBox="0 0 240 200" className="w-full" aria-hidden="true">
        {[23.3, 46.6, 70].map((r) => (
          <polygon key={r} points={ring(r)} fill="none" stroke="rgba(37,55,85,0.9)" strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = ((-90 + i * 60) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1="120"
              y1="100"
              x2={120 + 70 * Math.cos(a)}
              y2={100 + 70 * Math.sin(a)}
              stroke="rgba(37,55,85,0.7)"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          className="radar-poly"
          points={poly([0.88, 0.62, 0.78, 0.5, 0.72, 0.84])}
          fill="rgba(95,208,240,0.16)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          style={{ animationDelay: "0.15s" }}
        />
        <polygon
          className="radar-poly"
          points={poly([0.55, 0.82, 0.5, 0.74, 0.46, 0.58])}
          fill="rgba(157,120,245,0.14)"
          stroke="var(--color-prototype)"
          strokeWidth="2"
          style={{ animationDelay: "0.45s" }}
        />
        {labels.map(([x, y, text]) => (
          <text key={text} x={x} y={y} textAnchor="middle" fontSize="9" fill="var(--color-muted)">
            {text}
          </text>
        ))}
      </svg>
      <div className="mt-1 flex justify-center gap-4 text-[10px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" /> This week
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-prototype" /> Season avg
        </span>
      </div>
    </Panel>
  );
}

/* ---------- scouting table with heatmap cells ---------- */

const TABLE_ROWS: Array<{
  name: string;
  cells: Array<[value: string, tier: 0 | 1 | 2 | 3]>;
}> = [
  { name: "Amari Osei", cells: [["2,372", 0], [".22", 1], [".12", 2], ["33.4", 1], ["18", 3]] },
  { name: "Cinder_01", cells: [["2,899", 0], [".22", 1], [".10", 3], ["31.8", 3], ["15", 2]] },
  { name: "Nova_07", cells: [["1,224", 0], [".33", 2], [".12", 2], ["34.1", 1], ["7", 3]] },
  { name: "Rook_12", cells: [["4,869", 0], [".39", 2], [".11", 3], ["30.2", 3], ["10", 3]] },
  { name: "Vale_03", cells: [["1,813", 0], [".17", 3], [".06", 3], ["32.6", 1], ["40", 1]] },
];

const TIER_CLS = ["", "bg-ready/15 text-ready", "bg-accent/15 text-accent", "bg-monitor/15 text-monitor"];

function ScoutingTable() {
  const headers = ["Player", "Minutes", "xG", "xG/Shot", "Speed", "Presses"];
  return (
    <Panel title="Explore — player impact" className="md:col-span-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted">
              {headers.map((h, i) => (
                <th key={h} className={`pb-2 font-semibold ${i > 0 ? "text-right" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map((row, ri) => (
              <tr key={row.name} className="tour-row" style={{ animationDelay: `${ri * 90}ms` }}>
                <td className="py-1.5 pr-3">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full border border-edge" aria-hidden="true" />
                    <span className="font-semibold text-ink">{row.name}</span>
                  </span>
                </td>
                {row.cells.map(([value, tier], ci) => (
                  <td key={ci} className="py-1.5 pl-2">
                    <span
                      className={`ml-auto block w-fit rounded px-2 py-1 tabular font-semibold ${TIER_CLS[tier]}`}
                    >
                      {value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right text-[10px] text-muted">Showing 5 of 50</div>
    </Panel>
  );
}

/* ---------- team-average sparkline cards ---------- */

const TEAM_STATS: Array<[label: string, value: string, delta: string, up: boolean, path: string]> = [
  ["Distance (m)", "5,385", "89.3%", false, "M0,26 L16,20 L32,22 L48,12 L64,16 L80,9 L100,13"],
  ["m/min", "113.29", "101.5%", true, "M0,24 L16,25 L32,18 L48,20 L64,12 L80,14 L100,7"],
  ["Abs HSR (m)", "327.4", "86.2%", false, "M0,10 L16,14 L32,12 L48,18 L64,16 L80,23 L100,25"],
  ["Abs Sprint (m)", "1.8", "23.1%", false, "M0,8 L16,12 L32,11 L48,17 L64,21 L80,20 L100,27"],
];

function TeamAverages() {
  return (
    <Panel title="Team average — % vs last 5 matches" className="md:col-span-2">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TEAM_STATS.map(([label, value, delta, up, path], i) => (
          <div key={label} className="tour-row rounded-xl border border-edge/60 bg-panel-2/70 p-3" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="hero-number text-xl text-ink">{value}</span>
              <span className={`text-[11px] font-bold ${up ? "text-ready" : "text-monitor"}`}>
                {up ? "▲" : "▼"} {delta}
              </span>
            </div>
            <svg viewBox="0 0 100 34" className="mt-2 h-9 w-full" aria-hidden="true">
              <path d={`${path} L100,34 L0,34 Z`} fill="rgba(95,208,240,0.14)" />
              <path
                className="sparkline"
                d={path}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ ["--smx-len" as string]: "220" }}
              />
            </svg>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------- range sliders ---------- */

function SlidersPanel() {
  const sliders: Array<[label: string, range: string]> = [
    ["Open play xG assisted", "0.061 – 0.177"],
    ["Presses", "6 – 20"],
  ];
  return (
    <Panel title="Filters">
      <div className="space-y-6 pt-1">
        {sliders.map(([label, range], i) => (
          <div key={label} className="tour-row" style={{ animationDelay: `${i * 140}ms` }}>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-ink">{label}</span>
              <span className="tabular text-xs text-accent">{range}</span>
            </div>
            <div className="slider-track mt-4">
              <span className="slider-knob" style={{ animationDelay: i === 0 ? "0s" : "-2.2s" }} />
              <span className="slider-knob" style={{ animationDelay: i === 0 ? "-2.2s" : "-4s" }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted">
              <span>0</span>
              <span>24</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------- leaderboard ---------- */

const SPEED_BOARD: Array<[rank: number, name: string, value: string]> = [
  [1, "Amari Osei", "33.4"],
  [2, "Vale_03", "32.6"],
  [3, "Cinder_01", "31.8"],
];

function Leaderboard() {
  return (
    <Panel title="Top speed this week (km/h)">
      <ul className="space-y-2">
        {SPEED_BOARD.map(([rank, name, value], i) => (
          <li
            key={name}
            className="tour-row flex items-center gap-3 rounded-lg border border-edge/50 bg-panel-2/70 px-3 py-2"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <span className="tabular w-5 text-[11px] font-bold text-accent">#{rank}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
              {name.slice(0, 2).toUpperCase()}
            </span>
            <span className="flex-1 truncate text-xs font-semibold text-ink">{name}</span>
            <span className="tabular text-sm font-bold text-ink">{value}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ---------- analyst note (chat-style) ---------- */

function AnalystNote() {
  return (
    <Panel title="Analyst">
      <div className="tour-row flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md border border-edge/60 bg-panel-2 px-3 py-2 text-[11px] text-muted">
          What does our high-speed running look like by position?
        </p>
      </div>
      <div className="tour-row mt-3 rounded-2xl rounded-bl-md border border-accent/30 bg-accent/5 px-3 py-2.5 text-[11px] leading-relaxed text-ink" style={{ animationDelay: "220ms" }}>
        <strong>Full backs</strong> lead total HSR volume due to wide coverage.{" "}
        <strong>MD-4</strong> is a universal low point — a planned team taper.
        <svg viewBox="0 0 160 44" className="mt-2 h-10 w-full" aria-hidden="true">
          <path d="M0,30 L32,24 L64,27 L96,14 L128,18 L160,8" fill="none" stroke="var(--color-ready)" strokeWidth="2" />
          <path d="M0,36 L32,33 L64,35 L96,28 L128,31 L160,24" fill="none" stroke="var(--color-monitor)" strokeWidth="2" />
          <path d="M0,20 L32,22 L64,17 L96,21 L128,15 L160,18" fill="none" stroke="var(--color-compromised)" strokeWidth="2" opacity="0.75" />
        </svg>
      </div>
    </Panel>
  );
}

/* ---------- formation map ---------- */

const MAP_DOTS: Array<[x: number, y: number, label: string, active?: boolean]> = [
  [50, 90, "GK"],
  [82, 74, "RB"], [64, 78, "CB"], [36, 78, "CB"], [18, 74, "LB"],
  [76, 54, "RM"], [56, 58, "CM"], [44, 58, "CM"], [24, 54, "LM"],
  [62, 28, "ST"], [38, 28, "ST"],
];

function FormationMap() {
  return (
    <Panel title="Formation map — 4-4-2">
      <svg viewBox="0 0 100 104" className="w-full" aria-hidden="true">
        <rect x="3" y="3" width="94" height="98" rx="4" fill="none" stroke="rgba(95,208,240,0.35)" strokeWidth="1.4" />
        <line x1="3" y1="52" x2="97" y2="52" stroke="rgba(95,208,240,0.35)" strokeWidth="1.4" />
        <circle cx="50" cy="52" r="12" fill="none" stroke="rgba(95,208,240,0.35)" strokeWidth="1.4" />
        <rect x="32" y="3" width="36" height="14" fill="none" stroke="rgba(95,208,240,0.35)" strokeWidth="1.2" />
        <rect x="32" y="87" width="36" height="14" fill="none" stroke="rgba(95,208,240,0.35)" strokeWidth="1.2" />
        {MAP_DOTS.map(([x, y, label, active], i) => (
          <g key={label + i}>
            <circle
              cx={x}
              cy={y}
              r="6.5"
              fill={active ? "var(--color-accent)" : "rgba(157,120,245,0.35)"}
              stroke={active ? "#0b1529" : "rgba(95,208,240,0.5)"}
              strokeWidth="1.2"
              className={active ? "map-dot" : ""}
            />
            <text
              x={x}
              y={y + 2.4}
              textAnchor="middle"
              fontSize="5.4"
              fontWeight="700"
              fill={active ? "#071018" : "var(--color-muted)"}
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </Panel>
  );
}

export function TacticsShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <RadarPanel />
      <ScoutingTable />
      <TeamAverages />
      <SlidersPanel />
      <Leaderboard />
      <AnalystNote />
      <FormationMap />
    </div>
  );
}
