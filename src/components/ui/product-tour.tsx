"use client";

import { useEffect, useState } from "react";

type Step = {
  id: string;
  n: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    id: "import",
    n: "01",
    title: "Import",
    body: "The team-generated combined athlete-day CSV lands in one place — sensor means, workload, wellness, environment and consent flags.",
  },
  {
    id: "validate",
    n: "02",
    title: "Validate & score",
    body: "Every row passes validity gates first. Scores are computed against personal baselines, with the contributing drivers kept visible.",
  },
  {
    id: "decide",
    n: "03",
    title: "Decide",
    body: "Staff open the dashboard, read the bands and their drivers, and make training, rotation and selection calls backed by data.",
  },
];

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ImportMock() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-md border border-edge bg-panel-2 px-3 py-2">
        <span className="text-xs font-semibold text-ink">combined_athlete_day.csv</span>
        <span className="text-[10px] font-semibold text-accent">parsing…</span>
      </div>
      {[
        ["ATH-001 · 2026-10-14", "LOADED"],
        ["ATH-002 · 2026-10-14", "LOADED"],
        ["ATH-003 · 2026-10-14", "LOADED"],
        ["ATH-004 · 2026-10-14", "LOADED"],
      ].map(([label, status], i) => (
        <div
          key={label}
          className="tour-row flex items-center justify-between rounded-md border border-edge/60 bg-panel px-3 py-1.5"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <span className="tabular text-[11px] text-muted">{label}</span>
          <span className="text-[10px] font-bold text-ready">{status}</span>
        </div>
      ))}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-edge">
        <span className="tour-progress block h-full bg-accent" />
      </div>
    </div>
  );
}

function ValidateMock() {
  const checks: Array<[string, string, string]> = [
    ["Baseline window", "PASS", "text-ready"],
    ["Sensor coverage ≥ 80%", "PASS", "text-ready"],
    ["Consent scope: performance", "PASS", "text-ready"],
    ["Wellness form missing", "WITHHELD", "text-withheld"],
    ["GPS dropout 34%", "FLAGGED", "text-monitor"],
  ];
  return (
    <div className="space-y-2">
      {checks.map(([label, status, color], i) => (
        <div
          key={label}
          className="tour-row flex items-center justify-between rounded-md border border-edge/60 bg-panel px-3 py-2"
          style={{ animationDelay: `${i * 160}ms` }}
        >
          <span className="text-[11px] text-muted">{label}</span>
          <span className={`text-[10px] font-bold ${color}`}>{status}</span>
        </div>
      ))}
      <p className="pt-1 text-[10px] text-muted">Rows failing a gate are withheld — never silently scored.</p>
    </div>
  );
}

function DecideMock() {
  const rows: Array<[string, string, string, string]> = [
    ["Amari Osei", "TRENCH", "91", "READY"],
    ["Cinder_01", "SKILL", "84", "READY"],
    ["Nova_07", "LB_TE", "61", "MONITOR"],
    ["Rook_12", "QB", "42", "COMPROMISED"],
  ];
  const bandColor: Record<string, string> = {
    READY: "bg-ready/15 text-ready",
    MONITOR: "bg-monitor/15 text-monitor",
    COMPROMISED: "bg-compromised/15 text-compromised",
  };
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-3 rounded-md border border-edge bg-panel-2 px-3 py-2.5">
        <span className="hero-number tour-pop text-3xl text-accent">87</span>
        <span className="mb-1 text-[10px] text-muted">Squad readiness · +6 vs 7-day baseline</span>
      </div>
      {rows.map(([name, pos, score, band], i) => (
        <div
          key={name}
          className="tour-row flex items-center justify-between rounded-md border border-edge/60 bg-panel px-3 py-1.5"
          style={{ animationDelay: `${i * 140}ms` }}
        >
          <span className="flex items-baseline gap-2">
            <span className="text-[11px] font-semibold text-ink">{name}</span>
            <span className="text-[10px] text-muted">{pos}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="tabular text-[11px] font-bold text-ink">{score}</span>
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${bandColor[band]}`}>{band}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const MOCKS = [<ImportMock key="import" />, <ValidateMock key="validate" />, <DecideMock key="decide" />];

/**
 * ProductTour — click-through, auto-advancing tour of the three pipeline
 * stages with animated illustrative mock screens (synthetic data).
 */
export function ProductTour() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % STEPS.length), 6500);
    return () => window.clearTimeout(t);
  }, [active, paused]);

  return (
    <div
      className={`grid gap-5 lg:grid-cols-[0.9fr_1.1fr] ${paused ? "tour-paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className="space-y-2.5">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`w-full rounded-[10px] border px-4 py-3 text-left transition-colors ${
                active === i ? "border-accent bg-accent/10" : "border-edge bg-panel hover:border-accent/40"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`display-heading text-xl ${active === i ? "text-accent" : "text-muted"}`}>{s.n}</span>
                <span className="display-heading text-base">{s.title}</span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{s.body}</span>
              {active === i ? (
                <span key={`timer-${active}`} className="tour-timer mt-2 block h-0.5 w-full bg-accent" />
              ) : null}
            </button>
          </li>
        ))}
      </ol>

      <div className="min-h-[260px] rounded-[10px] border border-edge bg-panel p-4">
        <div className="flex items-center justify-between pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Product tour</span>
          <span className="text-[10px] text-muted">Illustrative screens · synthetic data</span>
        </div>
        <div key={active}>{MOCKS[active]}</div>
      </div>
    </div>
  );
}
