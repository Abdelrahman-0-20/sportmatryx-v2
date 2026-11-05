"use client";

import { useEffect, useRef, useState } from "react";

type Metric = {
  key: string;
  label: string;
  unit: string;
  base: number;
  jitter: number;
  decimals: number;
};

const METRICS: Metric[] = [
  { key: "hr", label: "Heart rate", unit: "bpm", base: 72, jitter: 6, decimals: 0 },
  { key: "spo2", label: "Blood oxygen", unit: "%", base: 98, jitter: 1.2, decimals: 0 },
  { key: "resp", label: "Respiration", unit: "rpm", base: 16, jitter: 2, decimals: 0 },
  { key: "load", label: "Training load", unit: "", base: 8.4, jitter: 0.7, decimals: 1 },
  { key: "recovery", label: "Recovery", unit: "%", base: 92, jitter: 4, decimals: 0 },
  { key: "aqi", label: "Air quality", unit: "AQI", base: 12, jitter: 4, decimals: 0 },
];

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * TelemetryTicker — the "live" hero strip. Numbers gently drift around their
 * illustrative baselines so the page feels alive. Clearly labeled as a
 * synthetic demo — this is NOT real athlete data.
 */
export function TelemetryTicker() {
  const [values, setValues] = useState<number[]>(METRICS.map((m) => m.base));
  const [dirs, setDirs] = useState<number[]>(METRICS.map(() => 0));
  const valuesRef = useRef<number[]>(METRICS.map((m) => m.base));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      const prev = valuesRef.current;
      const next = prev.map((v, i) => {
        const m = METRICS[i]!;
        const target = m.base + (Math.random() * 2 - 1) * m.jitter;
        return Math.round(target * 10) / 10;
      });
      setDirs(next.map((n, i) => (n > prev[i]! ? 1 : n < prev[i]! ? -1 : 0)));
      valuesRef.current = next;
      setValues(next);
    }, 1900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mt-8 rounded-[10px] border border-edge bg-panel/70 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ready">
          <span className="live-dot" aria-hidden="true" />
          Sample device data
        </span>
        <svg className="ecg h-4 w-16 text-accent" viewBox="0 0 64 16" fill="none" aria-hidden="true">
          <path
            d="M0 8 H10 L14 3 L18 13 L22 8 H34 L38 5 L42 11 L46 8 H64"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {METRICS.map((m, i) => (
          <span key={m.key} className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted">{m.label}</span>
            <span className="tabular text-sm font-bold text-ink">{values[i]!.toFixed(m.decimals)}</span>
            {m.unit ? <span className="text-[10px] text-muted">{m.unit}</span> : null}
            <span
              aria-hidden="true"
              className={`text-[9px] ${dirs[i]! > 0 ? "text-monitor" : dirs[i]! < 0 ? "text-ready" : "text-muted"}`}
            >
              {dirs[i]! > 0 ? "▲" : dirs[i]! < 0 ? "▼" : "·"}
            </span>
          </span>
        ))}
        <span className="ml-auto hidden text-[10px] text-muted sm:block">From the sample dataset</span>
      </div>
    </div>
  );
}
