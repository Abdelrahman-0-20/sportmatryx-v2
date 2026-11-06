"use client";
import { track } from "@vercel/analytics/react";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/primitives";
import { CountUp, Reveal } from "@/components/ui/motion";
import type { SportStats } from "@/lib/sport-stats";

type Labels = {
  afOnly: string;
  note: string;
  distTitle: string;
  range: string;
  teams: string;
  headers: string[];
};

type SportLabels = {
  title: string;
  caption: string;
  all: string;
  sessions: string;
  athletes: string;
  hours: string;
  intensity: string;
};

type AthleteDay = {
  ok: boolean;
  rows: number;
  athletes: number;
  teams: string[];
  range: readonly [string, string];
  bands: Record<string, number>;
  preview: Array<{
    athlete: string; date: string; team: string;
    position: string; score: string; band: string;
  }>;
};

const BAND_COLORS: Record<string, string> = {
  READY: "bg-ready", MONITOR: "bg-monitor", COMPROMISED: "bg-compromised", WITHHELD: "bg-withheld",
};

/**
 * DatasetSection — client-side sport explorer. Chips switch the aggregate
 * instantly via /api/sport-stats (no navigation, no page refresh) and the
 * URL is updated silently so links stay shareable. The athlete-day block
 * (scores/bands/preview — an American football cohort) only renders when
 * American football is selected.
 */
export function DatasetSection({
  labels,
  sportLabels,
  initial,
  athleteDay,
}: {
  labels: Labels;
  sportLabels: SportLabels;
  initial: SportStats;
  athleteDay: AthleteDay;
}) {
  const [stats, setStats] = useState<SportStats>(initial);
  const [busy, setBusy] = useState(false);

  const pick = async (sport: string | null) => {
    const next = sport ?? "";
    track("sport_filter", { sport: next || "all" });
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/sport-stats?sport=${encodeURIComponent(next)}`);
      const body = (await res.json()) as SportStats;
      if (body.ok) setStats(body);
      const url = next ? `/?sport=${encodeURIComponent(next)}` : "/";
      window.history.replaceState(null, "", url);
    } finally {
      setBusy(false);
    }
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "border-accent bg-accent/15 text-accent shadow-[0_0_18px_-6px_rgba(95,208,240,0.55)]"
        : "border-edge/80 text-muted hover:border-accent/40 hover:text-ink"
    }`;

  return (
    <>
      {/* Sessions by sport — instant, no page refresh */}
      <div className="mt-8 rounded-2xl border border-edge/70 bg-panel/70 p-5 md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            {sportLabels.title}
          </div>
          <div className="text-[11px] text-muted">{sportLabels.caption}</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Select a sport">
          <button
            type="button"
            onClick={() => pick(null)}
            aria-pressed={stats.current === ""}
            className={chip(stats.current === "")}
          >
            {sportLabels.all}
          </button>
          {stats.sports.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => pick(sport)}
              aria-pressed={stats.current === sport}
              className={chip(stats.current === sport)}
            >
              {sport}
            </button>
          ))}
        </div>

        <div
          className={`mt-5 grid grid-cols-2 gap-4 transition-opacity md:grid-cols-4 ${busy ? "opacity-50" : ""}`}
          aria-live="polite"
        >
          {(
            [
              [sportLabels.sessions, String(stats.sessions), true],
              [sportLabels.athletes, String(stats.athletes), true],
              [sportLabels.hours, String(stats.hours), true],
              [sportLabels.intensity, stats.avgRpe, false],
            ] as Array<[string, string, boolean]>
          ).map(([label, value, countUp]) => (
            <div key={label} className="rounded-xl border border-edge/60 bg-panel-2/70 p-4">
              <div className="stat-num">{countUp ? <CountUp value={Number(value)} /> : value}</div>
              <div className="mt-1 text-xs text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Athlete-day block — American football cohort only */}
      {stats.current !== "American football" ? (
        <p className="mt-6 rounded-xl border border-edge/60 bg-panel-2/60 px-4 py-4 text-xs leading-relaxed text-muted">
          {labels.afOnly}
        </p>
      ) : athleteDay.ok ? (
        <Reveal delay={80}>
          <>
            <div className="mt-10 grid grid-cols-2 gap-0 border-y border-edge/70 md:grid-cols-4">
              {(
                [
                  ["Athlete-day rows", athleteDay.rows],
                  ["Athletes", athleteDay.athletes],
                  ["Teams", athleteDay.teams.length],
                  ["Days covered", 28],
                ] as Array<[string, number]>
              ).map(([label, value], i) => (
                <div key={label} className={`stat-cell py-7 ${i > 0 ? "sm:pl-6 md:pl-8" : ""}`}>
                  <div className="stat-num">
                    <CountUp value={value} />
                  </div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-edge/70 bg-panel/70 p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                {labels.distTitle}
              </div>
              <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full border border-edge/70 bg-panel-2">
                <div className="bar-grow flex h-full w-full">
                  {Object.entries(athleteDay.bands).map(([band, n]) => (
                    <div
                      key={band}
                      className={BAND_COLORS[band] ?? "bg-edge"}
                      style={{ width: `${(n / Math.max(1, athleteDay.rows)) * 100}%` }}
                      title={`${band}: ${n}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                {Object.entries(athleteDay.bands).map(([band, n]) => (
                  <span key={band}>
                    <span className={`inline-block h-2 w-2 rounded-full ${BAND_COLORS[band] ?? "bg-edge"}`} /> {band}: {n}
                  </span>
                ))}
                <span>
                  {labels.range}: {athleteDay.range[0]} → {athleteDay.range[1]}
                </span>
                <span>
                  {labels.teams}: {athleteDay.teams.join(", ")}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-edge/70 bg-panel/70">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-edge/70 text-[11px] uppercase tracking-wider text-muted">
                    {labels.headers.map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {athleteDay.preview.map((r) => (
                    <tr key={`${r.athlete}-${r.date}`} className="border-b border-edge/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{r.athlete}</td>
                      <td className="px-4 py-3 text-muted">{r.date}</td>
                      <td className="px-4 py-3 text-muted">{r.team}</td>
                      <td className="px-4 py-3 text-muted">{r.position}</td>
                      <td className="tabular px-4 py-3 text-ink">{r.score}</td>
                      <td className="px-4 py-3">
                        {r.band ? <Tag label={r.band} /> : <span className="text-muted">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">{labels.note}</p>
          </>
        </Reveal>
      ) : (
        <p className="mt-6 text-sm text-compromised">Dataset file not found on the server.</p>
      )}
    </>
  );
}
