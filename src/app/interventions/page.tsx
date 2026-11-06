import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { SectionTabs } from "@/components/ui/section-tabs";
import { Card, CardLabel, Tag } from "@/components/ui/primitives";
import { InterventionActions } from "@/components/app/intervention-actions";
import {
  EmptyState,
  StatGrid,
  TableScroll,
  TD,
  TH,
  humanize,
} from "@/components/app/ops-kit";
import { can, errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { requireReadForGuest } from "@/lib/offline";
import { listInterventions, getInterventionStats } from "@/lib/services/interventions";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "SUGGESTED", label: "Suggested" },
  { key: "APPROVED", label: "Approved" },
  { key: "SNOOZED", label: "Snoozed" },
  { key: "DISMISSED", label: "Dismissed" },
] as const;

/**
 * Tab → status sets. Disjoint (a row appears in exactly one tab) and
 * exhaustive over InterventionStatus:
 *   OPEN/ASSIGNED            → Suggested  (awaiting a decision)
 *   UNDER_REVIEW/RESOLVED    → Approved   (approve moves a row here)
 *   FOLLOW_UP_REQUIRED       → Snoozed    (snooze 24h / restore)
 *   DISMISSED                → Dismissed  (documented reason)
 */
const TAB_STATUSES: Record<string, readonly string[]> = {
  SUGGESTED: ["OPEN", "ASSIGNED"],
  APPROVED: ["UNDER_REVIEW", "RESOLVED"],
  SNOOZED: ["FOLLOW_UP_REQUIRED"],
  DISMISSED: ["DISMISSED"],
};

/** Closed rows no longer carry an action window ("Next 48h"). */
const CLOSED_STATUSES = new Set(["RESOLVED", "DISMISSED"]);

export default async function InterventionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = (params.tab ?? "ALL").toUpperCase();
  const statuses = tab === "ALL" ? undefined : TAB_STATUSES[tab];

  let rows, stats, teamId: string | undefined, canReview: boolean;
  try {
    const user = await requireReadForGuest("intervention.read");
    teamId = user.memberships[0]?.teamId;
    // One unfiltered fetch: the tab sets are disjoint, so the current view and
    // the count on every tab pill are derived from the same rows.
    [rows, stats] = await Promise.all([
      listInterventions(teamId),
      getInterventionStats(teamId),
    ]);
    canReview = can(user, "intervention.review", teamId ?? null);
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/interventions" title="Intervention Queue">
        <SectionTabs />
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  const allRows = rows;
  if (statuses) rows = allRows.filter((r) => statuses.includes(r.status));
  const tabCount = (key: string): number => {
    const set = key === "ALL" ? undefined : TAB_STATUSES[key];
    return set ? allRows.filter((r) => set.includes(r.status)).length : allRows.length;
  };

  return (
    <AppShell crumb="/interventions" title="Intervention Queue">
      <SectionTabs />
      <div className="mb-4 rounded-md border border-monitor/50 bg-monitor/10 p-3 text-sm text-monitor" role="note">
        Suggestions require human review. Approving records a review; it does not message, schedule
        or act. No action is taken automatically.
      </div>

      <StatGrid>
        <Card>
          <div className="hero-number text-4xl">{stats.suggested}</div>
          <CardLabel>Active suggestions (open + in review)</CardLabel>
        </Card>
        <Card>
          <div className="hero-number text-4xl">{stats.resolvedThisWeek}</div>
          <CardLabel>Resolved this week</CardLabel>
        </Card>
        <Card>
          <div className="hero-number text-4xl">{stats.snoozed}</div>
          <CardLabel>Snoozed / follow-up</CardLabel>
        </Card>
      </StatGrid>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/interventions?tab=${t.key}`}
            aria-current={tab === t.key ? "page" : undefined}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              tab === t.key ? "border-accent bg-accent/10 text-accent" : "border-edge text-muted hover:text-ink"
            }`}
          >
            {t.label} ({tabCount(t.key)})
          </Link>
        ))}
      </div>

      <Card ariaLabel="Intervention queue">
        {rows.length === 0 ? (
          <EmptyState
            message="No interventions in this view."
            hint="Try another tab — every intervention appears in exactly one tab."
          />
        ) : (
          <>
            <p className="mb-3 text-xs text-muted">
              {rows.length} intervention{rows.length === 1 ? "" : "s"} in this view.
            </p>

            {/* Phones: one card per row so Approve / Snooze / Dismiss stay reachable. */}
            <ul className="flex flex-col gap-3 md:hidden">
              {rows.map((r) => (
                <li key={r.id} className="rounded-md border border-edge/70 bg-panel-2/60 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={`/player/${r.athleteId}`} className="font-medium hover:text-accent">
                      {r.athleteName}
                    </Link>
                    <span className="flex flex-wrap items-center gap-1.5" title={`Priority: ${r.priority}`}>
                      <Tag label={r.priority} />
                      <span title={`Status: ${r.status}`}>
                        <Tag label={r.status} />
                      </span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm" title={r.exceptionKey}>
                    {humanize(r.exceptionKey)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{r.recommendation ?? r.description}</p>
                  {!CLOSED_STATUSES.has(r.status) && r.suggestedWindow ? (
                    <p className="mt-1 text-xs text-muted">Window: {r.suggestedWindow}</p>
                  ) : null}
                  <div className="mt-2.5 border-t border-edge/60 pt-2.5">
                    <InterventionActions id={r.id} status={r.status} canReview={canReview} />
                  </div>
                </li>
              ))}
            </ul>

            {/* md and up: table inside a horizontal scroll container. */}
            <div className="hidden md:block">
              <TableScroll minWidth="min-w-[860px]">
                <thead>
                  <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                    <th className={TH}>Athlete</th>
                    <th className={TH}>Exception</th>
                    <th className={TH}>Recommended review</th>
                    <th className={TH}>Priority</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Window</th>
                    <th className={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-edge/50">
                      <td className={`${TD} font-medium`}>
                        <Link href={`/player/${r.athleteId}`} className="hover:text-accent">{r.athleteName}</Link>
                      </td>
                      <td className={TD} title={r.exceptionKey}>{humanize(r.exceptionKey)}</td>
                      <td className={`${TD} text-muted`}>{r.recommendation ?? r.description}</td>
                      <td className={TD} title={`Priority: ${r.priority}`}><Tag label={r.priority} /></td>
                      <td className={TD} title={`Status: ${r.status}`}>
                        <span className={r.status === "OPEN" ? "pulse-newest" : ""}>
                          <Tag label={r.status} />
                        </span>
                      </td>
                      <td className={`${TD} text-muted`}>
                        {!CLOSED_STATUSES.has(r.status) && r.suggestedWindow ? r.suggestedWindow : "—"}
                      </td>
                      <td className={TD}>
                        <InterventionActions id={r.id} status={r.status} canReview={canReview} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableScroll>
            </div>
          </>
        )}
      </Card>
    </AppShell>
  );
}
