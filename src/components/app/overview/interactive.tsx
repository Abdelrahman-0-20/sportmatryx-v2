"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardLabel } from "@/components/ui/primitives";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkline, DataVerified } from "@/components/ui/primitives";
import { TrendChart, type TrendPoint } from "@/components/ui/charts";
import { orderSports, sportIcon } from "@/lib/sports";
import { initialsOf } from "@/lib/utils";
import type { RosterRow } from "@/lib/services/dashboard";

/** Client cards for the Overview dashboard: range switch and table pagination. */

export function TrendCard({
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
  return (
    <Card ariaLabel="Performance trends">
      <CardLabel>Performance Trends</CardLabel>
      <TrendChart primary={primary} secondary={secondary} primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />
      <p className="mt-2 text-[10px] text-muted">
        Scored days only — withheld days are gaps, never zeros. Second line is the roster average on the same calendar.
      </p>
    </Card>
  );
}

const PAGE_SIZE = 6;

export function ScoutingCard({
  rows,
  sparklines,
}: {
  rows: RosterRow[];
  sparklines: Record<string, (number | null)[]>;
}) {
  const [sport, setSport] = useState("");
  const [page, setPage] = useState(0);

  const sports = useMemo(() => orderSports(rows.map((r) => r.sport)), [rows]);
  const filtered = useMemo(() => rows.filter((r) => !sport || r.sport === sport), [rows, sport]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const from = current * PAGE_SIZE;
  const slice = filtered.slice(from, from + PAGE_SIZE);

  return (
    <Card ariaLabel="Multi-sport scouting">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <CardLabel>Multi-Sport Scouting</CardLabel>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="overview-sport">
            Filter scouting list by sport
          </label>
          <select
            id="overview-sport"
            value={sport}
            onChange={(e) => {
              setSport(e.target.value);
              setPage(0);
            }}
            className="rounded-md border border-edge bg-panel-2 px-2 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
          >
            <option value="">All sports</option>
            {sports.map((s) => (
              <option key={s} value={s}>
                {sportIcon(s)} {s}
              </option>
            ))}
          </select>
          <Link
            href="/roster"
            className="rounded-md border border-edge px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            Full roster →
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wider text-muted">
              <th className="pb-2 pr-3">Athlete</th>
              <th className="pb-2 pr-3">Sport</th>
              <th className="pb-2 pr-3">Position</th>
              <th className="pb-2 pr-3">14-day trend</th>
              <th className="pb-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.athleteId} className="border-b border-edge/50 transition-colors hover:bg-panel-2">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar>
                      <AvatarFallback>{initialsOf(r.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link href={`/player/${r.athleteId}`} className="block truncate font-medium text-ink hover:text-accent">
                        {r.displayName}
                      </Link>
                      <span className="block text-[11px] text-muted">
                        {r.externalId ?? "—"}
                        {r.age !== null ? ` · ${r.age} yrs` : ""}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-muted">
                  <span aria-hidden="true" className="mr-1.5">
                    {sportIcon(r.sport)}
                  </span>
                  {r.sport}
                </td>
                <td className="py-2.5 pr-3 text-muted">{r.position}</td>
                <td className="py-2.5 pr-3">
                  <Sparkline points={sparklines[r.athleteId] ?? []} />
                </td>
                <td className="py-2.5">
                  <DataVerified validity={r.validity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
        <span>
          Showing {filtered.length === 0 ? 0 : from + 1}–{Math.min(from + PAGE_SIZE, filtered.length)} of{" "}
          {filtered.length} athletes
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, current - 1))}
            disabled={current === 0}
            className="rounded border border-edge px-2 py-1 text-xs disabled:opacity-40"
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="tabular px-1 text-xs">
            {current + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount - 1, current + 1))}
            disabled={current >= pageCount - 1}
            className="rounded border border-edge px-2 py-1 text-xs disabled:opacity-40"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </Card>
  );
}
