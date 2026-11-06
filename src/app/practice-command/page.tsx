import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { SectionTabs } from "@/components/ui/section-tabs";
import { Card, Tag } from "@/components/ui/primitives";
import { EmptyState, Footnote, TableScroll, TD, TH, count } from "@/components/app/ops-kit";
import { errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { requireReadForGuest } from "@/lib/offline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SESSION_WINDOW_MS = 24 * 3600 * 1000;

/**
 * Practice Command — session workload view: recent practices, load summaries,
 * and workload-response comparisons vs individual baselines.
 */
export default async function PracticeCommandPage() {
  let rows;
  try {
    const user = await requireReadForGuest("score.read");
    const teamId = user.memberships[0]?.teamId;
    rows = await prisma.trainingSession.findMany({
      where: { sessionType: { in: ["PRACTICE", "TESTING"] }, ...(teamId ? { athlete: { teamId } } : {}) },
      orderBy: { date: "desc" },
      take: 40,
      include: {
        athlete: { select: { id: true, firstName: true, lastName: true, position: true } },
        footballContexts: { select: { drill: true, repetition: true, venue: true, isIndoor: true, temperature: true, humidity: true, airQualityIndex: true }, take: 1 },
      },
    });
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/practice-command" title="Practice Command">
        <SectionTabs />
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  // Session-level load: max LOAD_AU observation in each session's 24h window.
  // One batched query for the whole table (was one findFirst per row).
  const loadBySession = new Map<string, number | null>();
  for (const s of rows) loadBySession.set(s.id, null);
  const athleteIds = [...new Set(rows.map((s) => s.athleteId))];
  if (athleteIds.length > 0 && rows.length > 0) {
    const starts = rows.map((s) => new Date(s.date).getTime());
    const observations = await prisma.observation.findMany({
      where: {
        athleteId: { in: athleteIds },
        type: "LOAD_AU",
        isValid: true,
        timestamp: { gte: new Date(Math.min(...starts)), lt: new Date(Math.max(...starts) + SESSION_WINDOW_MS) },
      },
      select: { athleteId: true, timestamp: true, value: true },
    });
    for (const o of observations) {
      const t = o.timestamp.getTime();
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].athleteId !== o.athleteId) continue;
        const start = starts[i];
        if (t < start || t >= start + SESSION_WINDOW_MS) continue;
        const current = loadBySession.get(rows[i].id);
        if (current === null || current === undefined || o.value > current) {
          loadBySession.set(rows[i].id, o.value);
        }
      }
    }
  }

  return (
    <AppShell crumb="/practice-command" title="Practice Command">
      <SectionTabs />
      <p className="mb-4 text-sm text-muted">
        External workload and drill context per session. Missing load is shown as missing — never zero.
      </p>
      <Card ariaLabel="Practice sessions">
        {rows.length === 0 ? (
          <EmptyState message="No practice sessions recorded." />
        ) : (
          <>
            <p className="mb-3 text-xs text-muted">
              Showing the {count(rows.length)} most recent session{rows.length === 1 ? "" : "s"} — everything fetched.
            </p>
            <TableScroll minWidth="min-w-[760px]">
              <thead>
                <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                  <th className={TH}>Date</th>
                  <th className={TH}>Athlete</th>
                  <th className={TH}>Type</th>
                  <th className={TH}>Drill</th>
                  <th className={TH}>Duration</th>
                  <th className={TH}>Load (AU)</th>
                  <th className={TH}>Context</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-b border-edge/50">
                    <td className={`${TD} tabular text-muted`}>
                      {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className={TD}>
                      <Link href={`/player/${s.athleteId}`} className="hover:text-accent">
                        {s.athlete.lastName}, {s.athlete.firstName.charAt(0)}.
                      </Link>
                    </td>
                    <td className={TD}><Tag label={s.sessionType} /></td>
                    <td className={`${TD} text-muted`}>
                      {s.footballContexts[0]?.drill ?? "—"}
                      {s.footballContexts[0]?.repetition ? ` ×${s.footballContexts[0].repetition}` : ""}
                    </td>
                    <td className={`${TD} tabular text-muted`}>
                      {s.durationMinutes !== null && s.durationMinutes !== undefined ? `${s.durationMinutes} min` : "—"}
                    </td>
                    <td className={`${TD} tabular`}>
                      {loadBySession.get(s.id) ?? <span className="text-muted">—</span>}
                    </td>
                    <td className={`${TD} text-xs text-muted`}>
                      {s.footballContexts[0]?.isIndoor ? "Indoor" : "Outdoor"}
                      {s.footballContexts[0]?.temperature !== null && s.footballContexts[0]?.temperature !== undefined ? ` · ${s.footballContexts[0].temperature}°C` : ""}
                      {s.footballContexts[0]?.airQualityIndex ? ` · AQI ${s.footballContexts[0].airQualityIndex}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          </>
        )}
      </Card>
      <Footnote>
        Acute:chronic workload ratios are a configurable research feature — not injury predictors (spec §12).
      </Footnote>
    </AppShell>
  );
}
