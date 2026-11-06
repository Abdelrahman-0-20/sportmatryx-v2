import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { SectionTabs } from "@/components/ui/section-tabs";
import { Card, CardLabel, Tag, Sparkline, ConfidenceRing, WithheldStamp } from "@/components/ui/primitives";
import {
  EmptyState,
  Footnote,
  POSITION_LABELS,
  StatGrid,
  TableScroll,
  TD,
  TH,
} from "@/components/app/ops-kit";
import { errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { requireReadForGuest, isGuest } from "@/lib/offline";
import { getRosterRows, type RosterRow } from "@/lib/services/dashboard";
import { prisma } from "@/lib/prisma";
import { daysAgoIso, nowMs } from "@/lib/clock";

export const dynamic = "force-dynamic";

const GROUPS = ["QB", "SKILL", "TRENCH", "LB_TE", "ST"] as const;
/** Staff-facing descriptions — no internal model codenames. */
const GROUP_NOTES: Record<string, string> = {
  QB: "Quarterbacks — workload and recovery emphasis for the QB room.",
  SKILL: "Skill positions — wide receivers, running backs and defensive backs, with movement emphasis.",
  TRENCH: "Linemen — offensive and defensive line, with workload emphasis.",
  LB_TE: "Linebackers, tight ends and hybrid roles.",
  ST: "Special teams — kicking, punting and return units.",
};

export default async function PositionRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const params = await searchParams;
  const group = (params.group ?? "QB").toUpperCase();

  let rows: RosterRow[];
  try {
    const user = await requireReadForGuest("roster.read");
    rows = await getRosterRows(user.memberships[0]?.teamId);
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/position-room" title="Position Room">
        <SectionTabs />
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  const groupRows = rows.filter((r) => r.position === group);
  const valid = groupRows.filter((r) => r.score !== null);
  const avg = valid.length
    ? Math.round((valid.reduce((a, r) => a + (r.score as number), 0) / valid.length) * 10) / 10
    : null;

  // 14-day score history for the Trend column — one batched query for the
  // whole group (guest/offline mode has no DB, so it falls back to "—").
  const trendByAthlete = new Map<string, (number | null)[]>();
  if (groupRows.length > 0) {
    try {
      if (!(await isGuest())) {
        const ids = groupRows.map((r) => r.athleteId);
        const scores = await prisma.performanceScore.findMany({
          where: { athleteId: { in: ids }, timestamp: { gte: new Date(daysAgoIso(14)) } },
          select: { athleteId: true, score: true, timestamp: true },
          orderBy: { timestamp: "asc" },
        });
        const now = nowMs();
        const dayKeys = Array.from({ length: 14 }, (_, i) =>
          new Date(now - (13 - i) * 86400000).toISOString().slice(0, 10),
        );
        const latest = new Map<string, number | null>();
        for (const s of scores) {
          latest.set(`${s.athleteId}|${s.timestamp.toISOString().slice(0, 10)}`, s.score);
        }
        for (const id of ids) {
          trendByAthlete.set(id, dayKeys.map((d) => latest.get(`${id}|${d}`) ?? null));
        }
      }
    } catch {
      // History unavailable — the Trend column renders an honest "—".
    }
  }

  return (
    <AppShell crumb="/position-room" title="Position Room">
      <SectionTabs />
      <div className="mb-4 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <Link
            key={g}
            href={`/position-room?group=${g}`}
            title={`Position group: ${g}`}
            aria-current={group === g ? "page" : undefined}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              group === g ? "border-accent bg-accent/10 text-accent" : "border-edge text-muted hover:text-ink"
            }`}
          >
            {POSITION_LABELS[g] ?? g}
          </Link>
        ))}
      </div>

      <p className="mb-4 text-sm text-muted">{GROUP_NOTES[group] ?? "Mixed group."}</p>

      <StatGrid>
        <Card>
          <div className="hero-number text-4xl">{avg !== null ? avg : "—"}</div>
          <CardLabel>Average index</CardLabel>
        </Card>
        <Card>
          <div className="hero-number text-4xl">{groupRows.filter((r) => r.band === "READY").length}</div>
          <CardLabel>Ready</CardLabel>
        </Card>
        <Card>
          <div className="hero-number text-4xl">{groupRows.filter((r) => r.band === "WITHHELD").length}</div>
          <CardLabel>Withheld</CardLabel>
        </Card>
      </StatGrid>

      <Card ariaLabel="Position roster">
        {groupRows.length === 0 ? (
          <EmptyState
            message="No athletes in this position group."
            hint="Pick another position above — every athlete appears in exactly one group."
          />
        ) : (
          <TableScroll minWidth="min-w-[640px]">
            <thead>
              <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                <th className={TH}>Athlete</th>
                <th className={TH}>Index</th>
                <th className={TH}>Band</th>
                <th className={TH}>Confidence</th>
                <th className={TH}>Trend (14d)</th>
              </tr>
            </thead>
            <tbody>
              {groupRows.map((r) => {
                const trend = trendByAthlete.get(r.athleteId) ?? [];
                const hasTrend = trend.some((v) => v !== null);
                return (
                  <tr key={r.athleteId} className="border-b border-edge/50">
                    <td className={TD}>
                      <Link href={`/player/${r.athleteId}`} className="hover:text-accent">{r.displayName}</Link>
                    </td>
                    <td className={`${TD} hero-number text-lg`}>{r.score === null ? "—" : r.score.toFixed(1)}</td>
                    <td className={TD}>
                      {r.band === "WITHHELD" ? (
                        <span
                          className="inline-block max-w-[9rem] truncate align-middle"
                          title={r.withheldCode ? `Withheld · ${r.withheldCode}` : "Withheld by a validity gate"}
                        >
                          <WithheldStamp code={r.withheldCode} />
                        </span>
                      ) : r.band ? (
                        <Tag label={r.band} />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={TD}>
                      {r.confidence === null ? (
                        <span className="text-xs text-muted" title="No confidence estimate for this athlete yet">—</span>
                      ) : (
                        <ConfidenceRing value={r.confidence} />
                      )}
                    </td>
                    <td className={TD}>
                      {hasTrend ? (
                        <Sparkline points={trend} />
                      ) : (
                        <span className="text-xs text-muted" title="No score history in the last 14 days">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableScroll>
        )}
      </Card>

      <Footnote>
        Comparisons respect role differences. Cross-position ranking is not displayed without an
        explicit, defensible method (spec §10).
      </Footnote>
    </AppShell>
  );
}
