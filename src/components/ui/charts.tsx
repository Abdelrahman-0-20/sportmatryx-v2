"use client";

import { useState } from "react";

/**
 * Hand-rolled SVG charts — the site ships no chart library, so these follow
 * the same approach as the Sparkline in primitives: plain SVG, CSS variables
 * for color, no client-side data fetching (the server passes series in).
 *
 *  - TrendChart: dual-series line chart with a 1M / 3M / 6M range switch.
 *  - RadarChart: n-axis comparison polygon (athlete vs cohort).
 */

export type TrendPoint = { date: string; value: number | null };

const RANGES = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
] as const;

const W = 720;
const H = 240;
const PAD = { top: 16, right: 14, bottom: 30, left: 36 };

function fmtDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Split a series into contiguous runs so a withheld gap breaks the line. */
function segments(points: Array<{ x: number; y: number | null }>): Array<Array<{ x: number; y: number }>> {
  const out: Array<Array<{ x: number; y: number }>> = [];
  let cur: Array<{ x: number; y: number }> = [];
  for (const p of points) {
    if (p.y === null) {
      if (cur.length) out.push(cur);
      cur = [];
    } else {
      cur.push({ x: p.x, y: p.y });
    }
  }
  if (cur.length) out.push(cur);
  return out;
}

export function TrendChart({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
}: {
  primary: TrendPoint[];
  secondary: TrendPoint[];
  primaryLabel: string;
  secondaryLabel: string;
}) {
  const [rangeIdx, setRangeIdx] = useState(2); // default 6M — matches the data window
  const days = RANGES[rangeIdx]!.days;

  const slice = (pts: TrendPoint[]) => (pts.length > days ? pts.slice(-days) : pts);
  const a = slice(primary);
  const b = slice(secondary);
  const n = Math.max(a.length, b.length);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xAt = (i: number) => PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yAt = (v: number) => PAD.top + plotH - (Math.max(0, Math.min(100, v)) / 100) * plotH;

  const toPoints = (pts: TrendPoint[]) =>
    pts.map((p, i) => ({ x: xAt(i), y: p.value === null ? null : yAt(p.value) }));

  const path = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const aSegs = segments(toPoints(a));
  const bSegs = segments(toPoints(b));
  const hasData = aSegs.length > 0 || bSegs.length > 0;

  // X labels: up to six evenly spaced days across the window.
  const labelIdx = Array.from(new Set([0, ...Array.from({ length: 4 }, (_, k) => Math.round(((k + 1) * (n - 1)) / 5)), n - 1])).filter(
    (i) => i >= 0 && i < n,
  );

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            {primaryLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-prototype" aria-hidden="true" />
            {secondaryLabel}
          </span>
        </div>
        <div className="flex gap-1" role="group" aria-label="Chart range">
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRangeIdx(i)}
              aria-pressed={i === rangeIdx}
              className={`rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                i === rangeIdx
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-edge text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${primaryLabel} over the selected range`}>
          {/* grid + y labels */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                y1={yAt(v)}
                x2={W - PAD.right}
                y2={yAt(v)}
                stroke="rgba(37,55,85,0.8)"
                strokeWidth="1"
              />
              <text x={PAD.left - 8} y={yAt(v) + 3.5} textAnchor="end" fontSize="10" fill="var(--color-muted)">
                {v}
              </text>
            </g>
          ))}

          {/* secondary series (cohort) */}
          {bSegs.map((seg, i) => (
            <path
              key={`b${i}`}
              d={path(seg)}
              fill="none"
              stroke="var(--color-prototype)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          ))}
          {/* primary series (athlete / headline) */}
          {aSegs.map((seg, i) => (
            <path
              key={`a${i}`}
              d={path(seg)}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* x labels */}
          {labelIdx.map((i) => {
            const pt = a[i] ?? b[i];
            if (!pt) return null;
            return (
              <text key={i} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
                {fmtDay(pt.date)}
              </text>
            );
          })}
        </svg>
      ) : (
        <p className="rounded-md border border-dashed border-edge p-6 text-center text-sm text-muted">
          No scored days in this range.
        </p>
      )}
    </div>
  );
}

/** n-axis radar: series values are0..1 (score normalizedValue). */
export function RadarChart({
  axes,
  series,
}: {
  axes: string[];
  series: Array<{ label: string; color: string; values: number[] }>;
}) {
  const n = axes.length;
  if (n < 3) return null;
  const CX = 170;
  const CY = 120;
  const R = 82;

  const angle = (i: number) => ((-90 + (i * 360) / n) * Math.PI) / 180;
  const at = (i: number, r: number) => [CX + r * Math.cos(angle(i)), CY + r * Math.sin(angle(i))] as const;

  const polygon = (values: number[]) =>
    values
      .map((v, i) => {
        const [x, y] = at(i, R * Math.max(0, Math.min(1, v)));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div>
      <svg viewBox="0 0 340 250" className="w-full" role="img" aria-label="Readiness component radar">
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={axes.map((_, i) => {
              const [x, y] = at(i, R * f);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(37,55,85,0.9)"
            strokeWidth="1"
          />
        ))}
        {/* spokes + labels */}
        {axes.map((label, i) => {
          const [x, y] = at(i, R);
          const [lx, ly] = at(i, R + 26);
          const anchor = lx > CX + 6 ? "start" : lx < CX - 6 ? "end" : "middle";
          return (
            <g key={label}>
              <line x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(37,55,85,0.9)" strokeWidth="1" />
              <text x={lx} y={ly + 3} textAnchor={anchor} fontSize="9.5" fill="var(--color-muted)">
                {label}
              </text>
            </g>
          );
        })}
        {/* series */}
        {series.map((s) => (
          <polygon
            key={s.label}
            points={polygon(s.values)}
            fill={s.color}
            fillOpacity="0.16"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap justify-center gap-4 text-[11px] text-muted">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
