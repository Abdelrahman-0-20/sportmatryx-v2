import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { SectionTabs } from "@/components/ui/section-tabs";
import { Card, CardLabel, Sparkline } from "@/components/ui/primitives";
import { EmptyState, Footnote, StatGrid, TableScroll, TD, TH, count } from "@/components/app/ops-kit";
import { errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { requireReadForGuest } from "@/lib/offline";
import { prisma } from "@/lib/prisma";
import { daysAgoIso } from "@/lib/clock";

export const dynamic = "force-dynamic";

/**
 * Environment & Travel — sourced/synthetic exposure context: heat, AQI,
 * altitude, venue, travel legs and days-since-travel. No live external data.
 */
export default async function EnvironmentTravelPage() {
  type Row = {
    athleteId: string;
    name: string;
    heat: (number | null)[];
    aqi: (number | null)[];
    travelDays: number | null;
    lastTravel: string | null;
  };
  let rows: Row[] = [];
  let envSummary: { heatDays: number; highAqiDays: number; travelEvents: number } | null = null;
  try {
    const user = await requireReadForGuest("score.read");
    const teamId = user.memberships[0]?.teamId;
    const athletes = await prisma.athlete.findMany({
      where: { isActive: true, ...(teamId ? { teamId } : {}) },
      select: { id: true, firstName: true, lastName: true },
      take: 60,
    });

    rows = await Promise.all(
      athletes.map(async (a) => {
        const env = await prisma.$queryRaw<{ day: Date; type: string; value: number; valid: boolean }[]>`
          SELECT date_trunc('day', timestamp) AS day, type, value, "isValid"
          FROM observations
          WHERE "athleteId" = ${a.id} AND type IN ('HEAT_C','AQI','TZ_SHIFT_H') AND timestamp >= now() - interval '14 days'
          ORDER BY timestamp ASC
        `;
        const byType = (t: string) => {
          const perDay = new Map<string, number | null>();
          for (const d of env) {
            if (d.type !== t) continue;
            perDay.set(d.day.toISOString().slice(0, 10), d.valid ? d.value : null);
          }
          return [...perDay.values()];
        };
        const travelCtx = await prisma.footballContext.findFirst({
          where: { athleteId: a.id, travelLeg: { not: null } },
          orderBy: { createdAt: "desc" },
          select: { daysSinceTravel: true, createdAt: true },
        });
        return {
          athleteId: a.id,
          name: `${a.lastName}, ${a.firstName.charAt(0)}.`,
          heat: byType("HEAT_C"),
          aqi: byType("AQI"),
          travelDays: travelCtx?.daysSinceTravel ?? null,
          lastTravel: travelCtx?.createdAt.toISOString() ?? null,
        };
      }),
    );

    const heatObs = await prisma.observation.count({
      where: { type: "HEAT_C", value: { gte: 30 }, timestamp: { gte: new Date(daysAgoIso(14)) }, ...(teamId ? { athlete: { teamId } } : {}) },
    });
    const aqiObs = await prisma.observation.count({
      where: { type: "AQI", value: { gte: 100 }, timestamp: { gte: new Date(daysAgoIso(14)) }, ...(teamId ? { athlete: { teamId } } : {}) },
    });
    const travelCount = await prisma.footballContext.count({
      where: { travelLeg: { not: null }, createdAt: { gte: new Date(daysAgoIso(14)) }, ...(teamId ? { athlete: { teamId } } : {}) },
    });
    envSummary = { heatDays: heatObs, highAqiDays: aqiObs, travelEvents: travelCount };
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/environment-travel" title="Environment & Travel">
        <SectionTabs />
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  // Honest table: athletes only appear when they carry something worth
  // reading. If nobody has heat/AQI samples, a wall of dash rows would
  // contradict the summary cards — so the table becomes one empty state.
  const hasExposure = (r: Row) => r.heat.some((v) => v !== null) || r.aqi.some((v) => v !== null);
  const hasTravel = (r: Row) => r.travelDays !== null || r.lastTravel !== null;
  const exposed = rows.some(hasExposure)
    ? rows.filter((r) => hasExposure(r) || hasTravel(r)).sort((a, b) => (b.travelDays ?? 99) - (a.travelDays ?? 99)).slice(0, 20)
    : [];

  return (
    <AppShell crumb="/environment-travel" title="Environment & Travel">
      <SectionTabs />
      {envSummary ? (
        <StatGrid>
          <Card>
            <div className="hero-number text-4xl text-monitor">{count(envSummary.heatDays)}</div>
            <CardLabel>Heat ≥30°C observations (14d)</CardLabel>
          </Card>
          <Card>
            <div className="hero-number text-4xl text-monitor">{count(envSummary.highAqiDays)}</div>
            <CardLabel>AQI ≥100 observations (14d)</CardLabel>
          </Card>
          <Card>
            <div className="hero-number text-4xl">{count(envSummary.travelEvents)}</div>
            <CardLabel>Travel events (14d)</CardLabel>
          </Card>
        </StatGrid>
      ) : null}

      <Card ariaLabel="Environment and travel by athlete">
        {exposed.length === 0 ? (
          <EmptyState
            message="No exposure data captured for this team yet."
            hint="No heat or AQI samples in the rolling 14-day window — travel events are summarised in the cards above."
          />
        ) : (
          <>
            <p className="mb-3 text-xs text-muted">
              {count(exposed.length)} athlete{exposed.length === 1 ? "" : "s"} with exposure or travel data · rolling 14 days.
            </p>
            <TableScroll minWidth="min-w-[600px]">
              <thead>
                <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                  <th className={TH}>Athlete</th>
                  <th className={TH}>Last travel</th>
                  <th className={TH}>Days since travel</th>
                  <th className={TH}>Heat 14d</th>
                  <th className={TH}>AQI 14d</th>
                </tr>
              </thead>
              <tbody>
                {exposed.map((r) => (
                  <tr key={r.athleteId} className="border-b border-edge/50">
                    <td className={TD}>
                      <Link href={`/player/${r.athleteId}`} className="hover:text-accent">{r.name}</Link>
                    </td>
                    <td className={`${TD} text-muted`}>
                      {r.lastTravel
                        ? new Date(r.lastTravel).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </td>
                    <td className={`${TD} tabular`}>{r.travelDays ?? <span className="text-muted">—</span>}</td>
                    <td className={TD}>
                      {r.heat.some((v) => v !== null) ? (
                        <Sparkline points={r.heat} />
                      ) : (
                        <span className="text-xs text-muted" title="No heat samples in the last 14 days">—</span>
                      )}
                    </td>
                    <td className={TD}>
                      {r.aqi.some((v) => v !== null) ? (
                        <Sparkline points={r.aqi} />
                      ) : (
                        <span className="text-xs text-muted" title="No AQI samples in the last 14 days">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          </>
        )}
      </Card>

      <Footnote>
        Exposure context shows observed conditions with documented provenance — no unsupported
        causal effects are asserted (spec §15). External feeds are not live; adapters are future work.
      </Footnote>
    </AppShell>
  );
}
