"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardLabel } from "@/components/ui/primitives";
import { orderSports, SPORT_ORDER } from "@/lib/sports";
import type { SportStats } from "@/lib/sport-stats";

/**
 * SportSessionsCard — Player 360's "choose your sport" control.
 *
 * Two jobs, both driven by the selected sport:
 *   1. filters THIS athlete's sessions to the chosen sport (honest empty state
 *      when the athlete has none — an athlete has one sport, so switching away
 *      from theirs shows exactly that), and
 *   2. loads the chosen sport's cohort context from the curated dataset via
 *      /api/sport-stats, so the panel always shows real numbers.
 *
 * The selection lives in the URL (?sport=) so the view is shareable, updated
 * with history.replaceState — no page navigation, same as the home selector.
 */

export type AthleteSessionRow = {
  id: string;
  type: string;
  sport: string;
  date: string;
  durationMinutes: number | null;
  intensity: string | null;
  venue: string | null;
};

const STAT_LABELS: Array<[keyof SportStats, string]> = [
  ["sessions", "Dataset sessions"],
  ["athletes", "Dataset athletes"],
  ["hours", "Training hours"],
  ["avgRpe", "Avg intensity (RPE)"],
];

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SportSessionsCard({
  sessions,
  athleteSport,
  initialSport,
}: {
  sessions: AthleteSessionRow[];
  athleteSport: string;
  initialSport?: string;
}) {
  const sports = useMemo(
    // Every sport is always selectable — basketball, soccer, American football
    // and the rest — so the chooser works as a sport lens even when this
    // athlete has no sessions in the picked sport (the empty state and the
    // cohort panel then carry the view). The URL's sport is included so a
    // shared link renders its own active chip.
    () =>
      orderSports([
        ...SPORT_ORDER,
        athleteSport,
        ...sessions.map((s) => s.sport),
        ...(initialSport ? [initialSport] : []),
      ]),
    [sessions, athleteSport, initialSport],
  );

  const [sport, setSport] = useState<string>(initialSport ?? athleteSport);
  const [stats, setStats] = useState<SportStats | null>(null);
  const [busy, setBusy] = useState(false);

  /* Cohort context for the selected sport — fetched, never fabricated. */
  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    fetch(`/api/sport-stats?sport=${encodeURIComponent(sport)}`)
      .then((r) => r.json())
      .then((body: SportStats) => {
        if (!cancelled && body.ok) setStats(body);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sport]);

  const pick = (next: string) => {
    setSport(next);
    try {
      const url = new URL(window.location.href);
      if (next) url.searchParams.set("sport", next);
      else url.searchParams.delete("sport");
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* SSR/hydration edge — the filter still works without the URL write. */
    }
  };

  const rows = sessions.filter((s) => sport === "" || s.sport === sport);
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "border-accent bg-accent/15 text-accent shadow-[0_0_18px_-6px_rgba(95,208,240,0.55)]"
        : "border-edge text-muted hover:border-accent/40 hover:text-ink"
    }`;

  return (
    <Card ariaLabel="Recent sessions by sport">
      <CardLabel>Recent Sessions</CardLabel>

      {/* --- choose your sport --- */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a sport">
        <button type="button" onClick={() => pick("")} aria-pressed={sport === ""} className={chip(sport === "")}>
          All sports
        </button>
        {sports.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pick(s)}
            aria-pressed={sport === s}
            className={chip(sport === s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* --- the athlete's own sport, for orientation --- */}
      <p className="mt-2 text-[11px] text-muted">
        {athleteSport ? `This athlete competes in ${athleteSport}.` : "Sport not set for this athlete."}{" "}
        {sport && sport !== athleteSport
          ? `Sessions below are filtered to ${sport}.`
          : "Showing every session on record."}
      </p>

      {/* --- session table --- */}
      <div className={`mt-3 transition-opacity ${busy ? "opacity-50" : ""}`} aria-live="polite">
        {rows.length === 0 ? (
          <p className="rounded-md border border-dashed border-edge p-4 text-center text-sm text-muted">
            No {sport} sessions recorded for this athlete — {athleteSport || "their sport"} is the only sport on their
            record.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wider text-muted">
                <th className="pb-1">Date</th>
                <th className="pb-1">Type</th>
                <th className="pb-1">Duration</th>
                <th className="pb-1">Intensity</th>
                <th className="pb-1">Venue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sess) => (
                <tr key={sess.id} className="border-b border-edge/50">
                  <td className="tabular py-1.5 text-muted">{fmtDate(sess.date)}</td>
                  <td className="py-1.5">{sess.type.replace(/_/g, " ")}</td>
                  <td className="tabular py-1.5 text-muted">{sess.durationMinutes ?? "—"} min</td>
                  <td className="py-1.5 text-muted">{sess.intensity ?? "—"}</td>
                  <td className="py-1.5 text-muted">{sess.venue ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- cohort context for the selected sport --- */}
      {stats && stats.ok ? (
        <div className="mt-4 border-t border-edge/60 pt-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            {stats.current ? `${stats.current} context` : "All sports context"}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
            {STAT_LABELS.map(([key, label]) => (
              <div key={key} className="rounded-xl border border-edge/60 bg-panel-2/70 p-3">
                <div className="hero-number text-lg">{String(stats[key])}</div>
                <div className="mt-0.5 text-[11px] text-muted">{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted">
            Cohort figures come from the curated sample dataset, not this athlete&apos;s records.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
