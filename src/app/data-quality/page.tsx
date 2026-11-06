import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel, Tag } from "@/components/ui/primitives";
import { ImportPanel } from "@/components/app/import-panel";
import {
  EmptyState,
  METRIC_LABELS,
  StatGrid,
  TableScroll,
  TD,
  TH,
  count,
  formatAge,
  humanize,
} from "@/components/app/ops-kit";
import { errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { requireReadForGuest, isGuest } from "@/lib/offline";
import { SAMPLE_ROSTER } from "@/lib/offline/sample-data";
import { prisma } from "@/lib/prisma";
import { nowMs, daysAgoIso } from "@/lib/clock";

export const dynamic = "force-dynamic";

/**
 * Data Quality & Validity — quality views (spec §14): missingness, invalid
 * samples, calibration issues, import failures, withheld scores.
 */
export default async function DataQualityPage() {
  let stats, invalidSamples, staleDevices, importJobs, withheld, staleObs, futureRows;
  let futureSamples = 0;
  try {
    await requireReadForGuest("roster.read");
    const guest = await isGuest();
    const since = new Date(daysAgoIso(14));
    if (guest) {
      // Offline/guest mode: render representative sample quality views without a DB.
      invalidSamples = 34;
      staleDevices = [
        {
          id: "dev-013", serialNumber: "DEV-013", model: "O2-MASK-V1",
          calibrationRecords: [{ status: "Expired", calibrationDate: new Date(nowMs() - 72 * 3600000) }],
        },
        {
          id: "dev-012", serialNumber: "DEV-012", model: "O2-MASK-V1",
          calibrationRecords: [{ status: "OK", calibrationDate: new Date(nowMs() - 60 * 3600000) }],
        },
        {
          id: "dev-010", serialNumber: "DEV-010", model: "O2-MASK-V1",
          calibrationRecords: [{ status: "OK", calibrationDate: new Date(nowMs() - 2 * 3600000) }],
        },
      ];
      importJobs = [
        { id: "ij-1", fileName: "demo_observations_week3.csv", status: "COMPLETED", processedRows: 480, totalRows: 480, errorRows: 0 },
        { id: "ij-2", fileName: "demo_bad_units.csv", status: "PARTIAL_SUCCESS", processedRows: 96, totalRows: 120, errorRows: 24 },
      ] as never;
      withheld = SAMPLE_ROSTER.filter((r) => r.band === "WITHHELD").map((r) => ({
        id: r.athleteId, validityStatus: r.validity, validityReason: r.withheldCode,
        timestamp: new Date(r.timestamp as string),
        athlete: { id: r.athleteId, firstName: r.displayName.split(",")[0] ?? "S", lastName: r.displayName.split(",")[0] ?? "Sample", externalId: r.externalId },
      })) as never;
      staleObs = [
        { metric: "HEAT_C", stale_minutes: 26 * 60, last_sample: new Date(nowMs() - 26 * 3600000) },
        { metric: "SLEEP_H", stale_minutes: 18 * 60, last_sample: new Date(nowMs() - 18 * 3600000) },
        { metric: "HRV_MS", stale_minutes: 6 * 60, last_sample: new Date(nowMs() - 6 * 3600000) },
        { metric: "RHR", stale_minutes: 6 * 60, last_sample: new Date(nowMs() - 6 * 3600000) },
      ] as never;
      futureSamples = 0;
      stats = { invalidSamples: 34, totalObs: 19732 };
    } else {
      [invalidSamples, staleDevices, importJobs, withheld, staleObs, futureRows] = await Promise.all([
        prisma.observation.count({ where: { isValid: false, timestamp: { gte: since } } }),
        prisma.device.findMany({
          include: { calibrationRecords: { orderBy: { calibrationDate: "desc" }, take: 1 } },
          take: 12,
        }),
        prisma.importJob.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
        prisma.performanceScore.findMany({
          where: { validityStatus: { in: ["WITHHELD", "RETEST", "INSUFFICIENT_BASELINE"] }, timestamp: { gte: new Date(daysAgoIso(7)) } },
          orderBy: { timestamp: "desc" },
          take: 12,
          include: { athlete: { select: { id: true, firstName: true, lastName: true, externalId: true } } },
        }),
        // Age of the most recent VALID sample at or before the server clock —
        // future-stamped samples cannot establish an age, so they are excluded
        // (and counted below) instead of rendering as negative hours.
        prisma.$queryRaw<{ metric: string; stale_minutes: number; last_sample: Date | null }[]>`
          SELECT type AS metric,
                 max(timestamp) FILTER (WHERE timestamp <= now()) AS last_sample,
                 round(extract(epoch FROM (now() - max(timestamp) FILTER (WHERE timestamp <= now()))) / 60)::int AS stale_minutes
          FROM observations
          WHERE "isValid"
          GROUP BY type
          ORDER BY stale_minutes DESC NULLS LAST
          LIMIT 8
        `,
        prisma.$queryRaw<{ future_samples: number }[]>`
          SELECT count(*)::int AS future_samples FROM observations WHERE timestamp > now()
        `,
      ]);
      futureSamples = Number(futureRows?.[0]?.future_samples ?? 0);
      stats = {
        invalidSamples,
        totalObs: await prisma.observation.count(),
      };
    }
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/data-quality" title="Data Quality & Validity">
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  const calibrationIssues = staleDevices.filter((d) => d.calibrationRecords[0]?.status !== "OK").length;

  return (
    <AppShell crumb="/data-quality" title="Data Quality & Validity">
      <StatGrid cols={4}>
        <Card>
          <div className="hero-number text-4xl">{count(stats.totalObs)}</div>
          <CardLabel>Total observations (all time)</CardLabel>
        </Card>
        <Card>
          <div className={`hero-number text-4xl ${stats.invalidSamples > 0 ? "text-monitor" : "text-ready"}`}>
            {count(stats.invalidSamples)}
          </div>
          <CardLabel>Invalid samples (14d)</CardLabel>
        </Card>
        <Card>
          <div className="hero-number text-4xl text-withheld">{count(withheld?.length ?? 0)}</div>
          <CardLabel>Withheld scores (7d)</CardLabel>
        </Card>
        <Card>
          <div className={`hero-number text-4xl ${calibrationIssues > 0 ? "text-monitor" : "text-ready"}`}>
            {count(calibrationIssues)}
          </div>
          <CardLabel>Devices with calibration issues (latest calibration)</CardLabel>
        </Card>
      </StatGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card ariaLabel="CSV import">
          <CardLabel>CSV import (validated)</CardLabel>
          <ImportPanel />
        </Card>

        <Card ariaLabel="Import jobs">
          <CardLabel>Import jobs (last 10)</CardLabel>
          {importJobs.length === 0 ? (
            <EmptyState message="No imports yet." hint="Upload a CSV or Excel export to create the first import job." />
          ) : (
            <TableScroll minWidth="min-w-[440px]">
              <thead>
                <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                  <th className={TH}>File</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Rows</th>
                  <th className={TH}>Errors</th>
                </tr>
              </thead>
              <tbody>
                {importJobs.map((j) => (
                  <tr key={j.id} className="border-b border-edge/50">
                    <td className={TD}>{j.fileName ?? "—"}</td>
                    <td className={TD} title={`Status: ${j.status}`}>
                      <Tag label={j.status} />
                    </td>
                    <td className={`${TD} tabular text-muted`}>
                      {count(j.processedRows ?? 0)}/{count(j.totalRows ?? 0)}
                    </td>
                    <td className={`${TD} tabular`}>
                      {(j.errorRows ?? 0) > 0 ? (
                        <span className="text-monitor">{count(j.errorRows ?? 0)}</span>
                      ) : (
                        "0"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          )}
        </Card>

        <Card ariaLabel="Signal staleness">
          <CardLabel>Signal staleness by metric (age of the last valid sample)</CardLabel>
          {staleObs && staleObs.length > 0 ? (
            <>
              <ul className="flex flex-col gap-1.5 text-sm">
                {staleObs.map((s) => (
                  <li key={s.metric} className="flex items-center justify-between gap-3">
                    <span title={`Metric code: ${s.metric}`}>
                      {METRIC_LABELS[s.metric] ?? humanize(s.metric)}
                    </span>
                    <span
                      className={`tabular text-xs ${s.stale_minutes > 36 * 60 ? "text-monitor" : "text-muted"}`}
                      title={
                        s.last_sample
                          ? `Last valid sample: ${new Date(s.last_sample).toLocaleString("en-US")}`
                          : `Metric code: ${s.metric}`
                      }
                    >
                      {formatAge(s.stale_minutes)}
                    </span>
                  </li>
                ))}
              </ul>
              {futureSamples > 0 ? (
                <p className="mt-3 border-t border-edge/60 pt-2 text-xs text-muted" role="note">
                  {count(futureSamples)} samples are stamped ahead of the server clock (timezone skew) and are
                  excluded from these ages.
                </p>
              ) : null}
            </>
          ) : (
            <EmptyState message="No valid observations yet." />
          )}
        </Card>

        <Card ariaLabel="Calibration issues">
          <CardLabel>Device calibration</CardLabel>
          {staleDevices.length === 0 ? (
            <EmptyState message="No devices registered." />
          ) : (
            <TableScroll minWidth="min-w-[440px]">
              <thead>
                <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                  <th className={TH}>Device</th>
                  <th className={TH}>Calibrated</th>
                  <th className={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {staleDevices.map((d) => {
                  const cal = d.calibrationRecords[0];
                  const status = cal?.status ?? "Unknown";
                  const ageH = cal ? Math.round((nowMs() - cal.calibrationDate.getTime()) / 3600000) : null;
                  return (
                    <tr key={d.id} className="border-b border-edge/50">
                      <td className={TD}>{d.serialNumber} · {d.model}</td>
                      <td className={`${TD} tabular text-muted`}>{ageH !== null ? `${ageH}h ago` : "—"}</td>
                      <td className={TD}>
                        {status === "OK" ? <Tag label="VALID" /> : <Tag label="HIGH" />}
                        <span className="ml-2 text-xs text-muted" title={`Calibration status: ${status}`}>
                          {humanize(status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </TableScroll>
          )}
        </Card>
      </div>

      <Card className="mt-4" ariaLabel="Withheld scores">
        <CardLabel>Withheld scores (last 7 days)</CardLabel>
        {(withheld ?? []).length === 0 ? (
          <EmptyState message="No withheld scores in the last week." />
        ) : (
          <TableScroll minWidth="min-w-[600px]">
            <thead>
              <tr className="border-b border-edge text-[11px] uppercase tracking-wider text-muted">
                <th className={TH}>Athlete</th>
                <th className={TH}>Code</th>
                <th className={TH}>Date</th>
                <th className={TH}>Guidance</th>
              </tr>
            </thead>
            <tbody>
              {(withheld ?? []).map((s) => (
                <tr key={s.id} className="border-b border-edge/50">
                  <td className={TD}>
                    <Link href={`/player/${s.athlete.id}`} className="hover:text-accent">
                      {s.athlete.lastName}, {s.athlete.firstName.charAt(0)}.
                    </Link>
                  </td>
                  <td className={TD} title={s.validityReason ? `Code: ${s.validityReason}` : "Withheld by a validity gate"}>
                    {s.validityReason ? humanize(s.validityReason) : "Withheld"}
                  </td>
                  <td className={`${TD} tabular text-muted`}>
                    {new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className={`${TD} text-xs text-muted`}>
                    {s.validityReason === "MULTI_FAIL"
                      ? "Request validation retest with verified device."
                      : s.validityReason === "CALIBRATION_FRESHNESS"
                        ? "Recalibrate device before next capture."
                        : s.validityReason === "CONSENT_STATE"
                          ? "Confirm consent state with governance."
                          : "Retest required."}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        )}
      </Card>
    </AppShell>
  );
}
