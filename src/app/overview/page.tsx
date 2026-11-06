import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLabel, Tag, DataVerified } from "@/components/ui/primitives";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadarChart } from "@/components/ui/charts";
import { TrendCard, ScoutingCard } from "@/components/app/overview/interactive";
import { getOverviewData } from "@/lib/services/overview";
import { requireReadForGuest } from "@/lib/offline";
import { errorToResponse, UnauthorizedError } from "@/lib/auth/rbac";
import { sportIcon } from "@/lib/sports";
import { initialsOf } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Overview — the signed-in landing page: featured athlete, trend chart,
 * multi-sport scouting table, readiness radar and the marketplace widget.
 * Every number comes from the database via getOverviewData; nothing here is
 * rendered client-side except the range switch and table pagination.
 */

/** Radar labels are short so seven axes still fit around the polygon. */
const SHORT_LABELS: Record<string, string> = {
  RESPIRATORY_EFFICIENCY: "Respiratory",
  OXYGEN_FUNCTION: "Oxygen",
  RECOVERY_AUTONOMIC: "Recovery",
  WORKLOAD_RESPONSE: "Workload",
  MOVEMENT_EXPLOSIVE: "Movement",
  ENVIRONMENT_TRAVEL: "Environment",
  BASELINE_DEVIATION: "Baseline",
};

const shortLabel = (name: string) =>
  SHORT_LABELS[name] ?? name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const prettyLabel = (name: string) =>
  name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export default async function OverviewPage() {
  let data: Awaited<ReturnType<typeof getOverviewData>>;
  try {
    const user = await requireReadForGuest("roster.read");
    data = await getOverviewData(user.memberships[0]?.teamId);
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/overview" title="Overview">
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  const { rows, featured, trend, radar, products, sparklines } = data;
  const headline = featured?.components.slice(0, 4) ?? [];
  const money = (cents: number) => (cents === 0 ? "Demo" : `$${(cents / 100).toFixed(2)}`);

  return (
    <AppShell crumb="/overview" title="Overview">
      <p className="mb-4 max-w-3xl text-sm text-muted">
        The daily picture for your roster — top form, trend, scouting across every sport and the data you can license.
      </p>

      {/* Row 1 — featured athlete + performance trends */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card ariaLabel="Featured athlete">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              <span aria-hidden="true">★</span> Featured athlete
            </span>
            {featured ? (
              <Link
                href={`/player/${featured.athleteId}`}
                className="text-xs font-semibold text-accent hover:underline"
              >
                View profile →
              </Link>
            ) : null}
          </div>

          {!featured ? (
            <p className="mt-3 text-sm text-muted">No athletes on the roster yet.</p>
          ) : (
            <>
              <div className="mt-3 flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{initialsOf(featured.displayName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold text-ink">{featured.displayName}</div>
                  <div className="truncate text-xs text-muted">
                    <span aria-hidden="true">{sportIcon(featured.sport)}</span> {featured.sport} ·{" "}
                    {featured.position} · {featured.teamName}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="hero-number text-3xl">
                      {featured.score === null ? "—" : featured.score.toFixed(1)}
                    </span>
                    <Tag label={featured.band ?? "UNKNOWN"} glow />
                    <DataVerified validity={featured.validity} />
                  </div>
                </div>
              </div>

              {/* Headline sub-scores — the four heaviest real components */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {headline.map((c) => (
                  <div key={c.name} className="rounded-xl border border-edge/60 bg-panel-2/70 p-3">
                    <div className="hero-number text-xl">
                      {c.score === null ? "—" : (c.score * 100).toFixed(1)}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-muted" title={prettyLabel(c.name)}>
                      {prettyLabel(c.name)}
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-edge">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.round((c.score ?? 0) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[11px] text-muted">
                {featured.delta14 === null
                  ? "No 14-day comparison available yet."
                  : `14-day change: ${featured.delta14 > 0 ? "+" : ""}${featured.delta14} pts vs the same athlete two weeks ago.`}
              </p>
            </>
          )}
        </Card>

        <div className="lg:col-span-2">
          <TrendCard
            primary={trend.primary}
            secondary={trend.secondary}
            primaryLabel={featured?.displayName ?? "Athlete"}
            secondaryLabel="Roster average"
          />
        </div>
      </div>

      {/* Row 2 — scouting table + readiness radar */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScoutingCard rows={rows} sparklines={sparklines} />
        </div>

        <Card ariaLabel="Athlete readiness radar">
          <CardLabel>Athlete Readiness</CardLabel>
          {radar.axes.length >= 3 ? (
            <RadarChart
              axes={radar.axes.map(shortLabel)}
              series={[
                { label: featured?.displayName ?? "Athlete", color: "var(--color-accent)", values: radar.athlete },
                { label: "Roster average", color: "var(--color-prototype)", values: radar.cohort },
              ]}
            />
          ) : (
            <p className="text-sm text-muted">Not enough component data for a radar yet.</p>
          )}
          <p className="mt-1 text-[10px] text-muted">
            Normalised0–1 from the latest valid score, compared with the roster&apos;s latest score per athlete.
          </p>
        </Card>
      </div>

      {/* Row 3 — marketplace */}
      <Card className="mt-4" ariaLabel="Data marketplace">
        <div className="mb-3 flex items-center justify-between">
          <CardLabel>Data Marketplace</CardLabel>
          <Link href="/marketplace" className="text-xs font-semibold text-accent hover:underline">
            View marketplace →
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-muted">No listings available right now.</p>
        ) : (
          <ul className="grid gap-2 md:grid-cols-3">
            {products.slice(0, 3).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-edge/60 bg-panel-2/70 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <Link
                    href={`/marketplace/${p.id}`}
                    className="block truncate text-sm font-medium text-ink hover:text-accent"
                  >
                    {p.name}
                  </Link>
                  <div className="truncate text-[11px] text-muted">
                    {p.rowsEstimate ? `${p.rowsEstimate.toLocaleString()} rows · ` : ""}
                    {p.tag}
                  </div>
                </div>
                <span className="tabular shrink-0 text-sm font-bold text-accent">{money(p.priceCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
