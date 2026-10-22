import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel, Tag, LinkButton } from "@/components/ui/primitives";
import { requireReadForGuest } from "@/lib/offline";
import { getAthleteProfile } from "@/lib/services/athlete";

export const dynamic = "force-dynamic";

/**
 * Athlete profile page (Player 360).
 * Shows header/readiness/7 drivers/trend/sessions/validity checks.
 * Server-rendered; simple CSS bars for charts (no chart libraries).
 */

// --- Helpers ---------------------------------------------------------------

const BAND_STYLES: Record<string, string> = {
  READY: "text-ready",
  MONITOR: "text-monitor",
  COMPROMISED: "text-compromised",
  WITHHELD: "text-withheld",
};

const DRIVER_LABELS: Record<string, string> = {
  RESPIRATORY_EFFICIENCY: "Respiratory Efficiency",
  OXYGEN_FUNCTION: "Oxygen Function",
  RECOVERY_AUTONOMIC: "Recovery & Autonomic",
  WORKLOAD_RESPONSE: "Workload Response",
  MOVEMENT_EXPLOSIVE: "Movement / Explosive",
  ENVIRONMENT_TRAVEL: "Environment & Travel",
  BASELINE_DEVIATION: "Baseline Deviation",
};

/** Format a date string to a compact human-readable format. */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** CSS bar for a normalized 0-1 ratio. */
function NormBar({ value, className = "" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-edge ${className}`}>
      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

/**
 * CSS bar strip of the last 14 scores.
 * Each column height is normalized to the max score in the window.
 */
function TrendStrip({ rows }: { rows: { date: string; score: number | null; band: string | null }[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted">No trend data yet.</p>;
  }
  const max = Math.max(...rows.map((r) => r.score ?? 0), 1);
  return (
    <div className="flex h-24 items-end gap-1" aria-label="Readiness trend">
      {rows.map((r) => {
        const height = r.score === null ? 4 : Math.max(8, (r.score / max) * 100);
        const color =
          r.band === "READY"
            ? "bg-ready"
            : r.band === "MONITOR"
              ? "bg-monitor"
              : r.band === "COMPROMISED"
                ? "bg-compromised"
                : "bg-panel-2";
        return (
          <div
            key={r.date}
            className="group relative flex w-full flex-col items-center justify-end"
            title={`${fmtDate(r.date)} — ${r.score === null ? "withheld" : r.score.toFixed(1)} (${r.band ?? "—"})`}
          >
            <div className={`w-full rounded-t ${color}`} style={{ height: `${height}%` }} />
            <span className="tabular mt-1 text-[9px] text-muted">{r.score === null ? "—" : r.score.toFixed(0)}</span>
          </div>
        );
      })}
    </div>
  );
}

// --- Page -------------------------------------------------------------------

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let detail: Awaited<ReturnType<typeof getAthleteProfile>>["detail"];
  let isSample = false;
  try {
    await requireReadForGuest("athlete.read");
    const profile = await getAthleteProfile(id);
    detail = profile.detail;
    isSample = profile.isSample;
  } catch (e) {
    const { errorToResponse, UnauthorizedError } = await import("@/lib/auth/rbac");
    if (e instanceof UnauthorizedError) {
      const { redirect } = await import("next/navigation");
      redirect("/login");
    }
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/player" title="Athlete profile">
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell crumb="/player" title="Athlete profile">
        <p className="text-sm text-muted">Athlete not found.</p>
        <div className="mt-4">
          <LinkButton href="/roster" variant="ghost">
            ← Back to roster
          </LinkButton>
        </div>
      </AppShell>
    );
  }

  const { athlete, consent, latestScore, trendRows, latestObservations, sessions } = detail;
  const s = latestScore;
  const withheld = s ? s.band === "WITHHELD" : true;

  // --- Driver cards (7) ---
  // Primary: latest score's ScoreComponent rows (name, contribution).
  // Fallback: latest Observation rows when components/drivers are unavailable.
  const componentDrivers =
    s && s.components.length > 0
      ? s.components.map((c) => ({
          key: c.name,
          name: DRIVER_LABELS[c.name] ?? c.name.replace(/_/g, " "),
          contribution: c.contribution,
          norm: c.score,
          original: null as number | null,
          reason: c.reason,
        }))
      : (latestObservations ?? []).slice(0, 7).map((o) => ({
          key: o.type,
          name: o.type.replace(/_/g, " "),
          contribution: null as number | null,
          norm: null as number | null,
          original: o.value,
          reason: o.isValid ? null : "Invalid observation",
        }));

  // Normalize contribution bars relative to the largest absolute contribution.
  const maxAbsContribution = Math.max(
    ...componentDrivers.map((d) => (d.contribution === null ? 0 : Math.abs(d.contribution))),
    1,
  );

  return (
    <AppShell crumb={`/player/${athlete.externalId ?? athlete.id}`} title={`${athlete.displayName} · Athlete Profile`}>
      {isSample ? (
        <div className="mb-4 flex items-center gap-2">
          <Tag label="Synthetic sample view" />
          <span className="text-xs text-muted">Data served from the offline demo fallback — not live measurements.</span>
        </div>
      ) : null}

      {/* 1. Header */}
      <Card className="mb-4" ariaLabel="Athlete header">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="text-2xl font-bold text-ink">{athlete.displayName}</h1>
          <Tag label={athlete.position} />
          {athlete.isActive ? <Tag label="Active" /> : <Tag label="Inactive" />}
          {isSample ? <Tag label="Synthetic sample view" /> : null}
        </div>
        <p className="mt-2 text-sm text-muted">
          {athlete.teamName} · Role: {athlete.rosterRole ?? "—"} · Born:{" "}
          {athlete.dateOfBirth ? new Date(athlete.dateOfBirth).getFullYear() : "—"} · Consent:{" "}
          <Tag label={consent?.status ?? "UNKNOWN"} />
          {consent?.reason ? ` (${consent.reason})` : ""}
        </p>
      </Card>

      {/* 2. Current readiness */}
      <Card className="mb-4" ariaLabel="Current readiness">
        <CardLabel>Current Readiness</CardLabel>
        {!s ? (
          <p className="text-sm text-muted">No readiness score computed yet.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <span className={`hero-number text-5xl ${BAND_STYLES[s.band ?? ""] ?? "text-ink"}`}>
              {s.score === null ? "—" : s.score.toFixed(1)}
            </span>
            <Tag label={s.band ?? "UNKNOWN"} glow />
            <div className="text-sm text-muted">
              Confidence: <span className="tabular text-ink">{s.confidence === null ? "—" : `${s.confidence}%`}</span>
              {" · "}Validity: <Tag label={s.validity} />
            </div>
          </div>
        )}
        {s?.explanation ? <p className="mt-2 text-xs text-muted">{s.explanation}</p> : null}
        {withheld && s?.withheldCode ? (
          <p className="mt-2 text-xs text-compromised">Withheld reason: {s.withheldCode.replace(/_/g, " ")}</p>
        ) : null}
      </Card>

      {/* 3. Driver cards (7) */}
      <Card className="mb-4" ariaLabel="Driver breakdown">
        <CardLabel>
          {s && s.components.length > 0
            ? "Readiness Drivers (7 components)"
            : (latestObservations ?? []).length > 0
              ? "Readiness Drivers (raw observations fallback)"
              : "Readiness Drivers"}
        </CardLabel>
        {componentDrivers.length === 0 ? (
          <p className="text-sm text-muted">No component or observation data available for this athlete.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {componentDrivers.map((d) => (
              <Card key={d.key} variant="elevated" className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">{d.name}</span>
                {d.contribution !== null ? (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="hero-number text-xl">{d.contribution.toFixed(1)}</span>
                      <span className="text-[10px] text-muted">pts</span>
                    </div>
                    <NormBar value={Math.abs(d.contribution) / maxAbsContribution} />
                  </>
                ) : d.original !== null ? (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="hero-number text-xl tabular">{d.original.toFixed(1)}</span>
                      <span className="text-[10px] text-muted">raw</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-panel-2" title="Raw value (no normalized bar)" />
                  </>
                ) : null}
                {d.reason ? <span className="text-[10px] text-muted">{d.reason}</span> : null}
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* 4. Readiness trend + 5. Recent sessions */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card ariaLabel="Readiness trend">
          <CardLabel>Readiness Trend (last 14 scores)</CardLabel>
          <TrendStrip rows={trendRows ?? []} />
        </Card>
        <Card ariaLabel="Recent sessions">
          <CardLabel>Recent Sessions (last 10)</CardLabel>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted">No sessions recorded.</p>
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
                {sessions.map((sess) => (
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
        </Card>
      </div>

      {/* 6. Validity checks */}
      <Card className="mb-4" ariaLabel="Validity checks">
        <CardLabel>Validity Checks</CardLabel>
        {!s || s.checks.length === 0 ? (
          <p className="text-sm text-muted">No validity checks recorded for the latest score.</p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-sm">
            {s.checks.map((c) => (
              <li key={c.name} className="flex items-center gap-2">
                <span
                  className={
                    c.status === "PASSED"
                      ? "text-ready"
                      : c.status === "FAILED"
                        ? "text-critical"
                        : c.status === "WARNING"
                          ? "text-monitor"
                          : "text-muted"
                  }
                >
                  {c.status === "PASSED" ? "✓" : c.status === "FAILED" ? "✕" : "!"}
                </span>
                <span className="font-medium text-ink">{c.name.replace(/_/g, " ")}</span>
                <span className="text-xs text-muted">{c.reason}</span>
                <Tag label={c.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* 7. Back to roster */}
      <div className="flex">
        <LinkButton href="/roster" variant="ghost">
          ← Back to roster
        </LinkButton>
      </div>
    </AppShell>
  );
}
