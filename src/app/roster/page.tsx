import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/ui/app-shell";
import { PageHero } from "@/components/ui/page-hero";
import { SectionTabs } from "@/components/ui/section-tabs";
import {Card,  Tag, Sparkline, ConfidenceRing, WithheldStamp, DataVerified } from "@/components/ui/primitives";
import {Avatar,  AvatarFallback } from "@/components/ui/avatar";
import { initialsOf } from "@/lib/utils";
import {Tooltip,  TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {errorToResponse,  UnauthorizedError } from "@/lib/auth/rbac";
import { requireReadForGuest } from "@/lib/offline";
import {getRosterRows,  type RosterRow } from "@/lib/services/dashboard";
import { orderSports, sportIcon } from "@/lib/sports";

export const dynamic = "force-dynamic";

const FILTERS = ["ALL", "READY", "MONITOR", "COMPROMISED", "WITHHELD", "EXCEPTIONS"] as const;

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; group?: string; sport?: string }>;
}) {
  const params = await searchParams;
  const view = (params.view ?? "ALL").toUpperCase();
  const group = params.group ?? "ALL";
  const sport = params.sport ?? "";

  let rows: RosterRow[];
  try {
    const user = await requireReadForGuest("roster.read");
    rows = await getRosterRows(user.memberships[0]?.teamId);
  } catch (e) {
    if (e instanceof UnauthorizedError) redirect("/login");
    const mapped = errorToResponse(e);
    return (
      <AppShell crumb="/roster" title="Athletes">
  <SectionTabs />
        <p className="text-sm text-compromised">{mapped.body.error}</p>
      </AppShell>
    );
  }

  const sports = orderSports(rows.map((r) => r.sport));

  /** Build a /roster href that keeps the other two filters intact. */
  const hrefFor = (next: { view?: string; group?: string; sport?: string }) => {
    const q = new URLSearchParams();
    const v = next.view ?? view;
    const g = next.group ?? group;
    const s = next.sport ?? sport;
    if (v !== "ALL") q.set("view", v);
    if (g !== "ALL") q.set("group", g);
    if (s) q.set("sport", s);
    const qs = q.toString();
    return qs ? `/roster?${qs}` : "/roster";
  };

  const filtered = rows.filter((r) => {
    const bandOk =
      view === "ALL" ||
      (view === "EXCEPTIONS" && r.openExceptions > 0) ||
      r.band === view;
    const groupOk = group === "ALL" || r.position === group;
    const sportOk = sport === "" || r.sport === sport;
    return bandOk && groupOk && sportOk;
  });

  return (
    <AppShell crumb="/roster" title="Athletes">
      <SectionTabs />
      {/* Professional intro — cinematic video banner */}
      <PageHero clip={3} className="mb-4">
        <p className="max-w-3xl text-sm leading-relaxed text-ink">
          The live readiness picture for every athlete on the roster — one row per athlete, built
          from their latest valid athlete-day record. Use it to decide who trains full, who needs
          closer monitoring and who sits out, before the session starts.
        </p>
        <p className="mt-2 max-w-3xl text-xs text-muted">
          Rows are sorted by exception severity first, then by lowest readiness — the athletes who
          need attention surface at the top. Click any athlete to open Player 360 for the full
          profile, baselines and score history.
        </p>
      </PageHero>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted">
        <span className="text-[11px] font-semibold uppercase tracking-wider">How to read the bands</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-ready" /> READY — full availability
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-monitor" /> MONITOR — watch closely
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-compromised" /> COMPROMISED — restrict or rest
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-withheld" /> WITHHELD — data did not pass validity, not scored
        </span>
      </div>

      {/* Filter bar */}
      <Card className="mb-4" ariaLabel="Roster filters">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={hrefFor({ view: f })}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                view === f ? "border-accent bg-accent/10 text-accent" : "border-edge text-muted hover:text-ink"
              }`}
            >
              {f === "ALL" ? "All athletes" : f === "EXCEPTIONS" ? "Exceptions only" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-edge" />
          {["ALL", "QB", "SKILL", "TRENCH", "LB_TE", "ST"].map((g) => (
            <Link
              key={g}
              href={hrefFor({ group: g })}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                group === g ? "border-accent bg-accent/10 text-accent" : "border-edge text-muted hover:text-ink"
              }`}
            >
              {g}
            </Link>
          ))}
        </div>

        {/* Sport filter — the multi-sport roster lens */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-edge/60 pt-3">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Sport</span>
          <Link
            href={hrefFor({ sport: "" })}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              sport === "" ? "border-accent bg-accent/10 text-accent" : "border-edge text-muted hover:text-ink"
            }`}
          >
            All
          </Link>
          {sports.map((s) => (
            <Link
              key={s}
              href={hrefFor({ sport: s })}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                sport === s ? "border-accent bg-accent/10 text-accent" : "border-edge text-muted hover:text-ink"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </Card>

      {/* Roster grid */}
      <Card className="overflow-x-auto" ariaLabel="Roster grid">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-dashed border-edge p-6 text-center text-sm text-muted">
            No athletes match this filter.
          </p>
        ) : (
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-edge text-left text-[11px] uppercase tracking-wider text-muted">
                <th className="pb-2 pr-3">Athlete</th>
                <th className="pb-2 pr-3">Position</th>
                <th className="pb-2 pr-3">Sport</th>
                <th className="pb-2 pr-3">Readiness</th>
                <th className="pb-2 pr-3">Band</th>
                <th className="pb-2 pr-3">Confidence</th>
                <th className="pb-2 pr-3">14-day trend</th>
                <th className="pb-2 pr-3">Data</th>
                <th className="pb-2 pr-3">Exceptions</th>
              </tr>
            </thead>
            <tbody className="row-stagger">
              {filtered.map((r) => {
                const withheld = r.band === "WITHHELD";
                const border = r.maxSeverity === "CRITICAL" ? "border-l-2 border-l-critical" : r.maxSeverity === "HIGH" ? "border-l-2 border-l-monitor" : "";
                return (
                  <tr
                    key={r.athleteId}
                    className={`row-in border-b border-edge/50 transition-colors hover:bg-panel-2 ${border}`}
                  >
                    <td className="py-2.5 pr-3 font-medium">
                      <div className="flex items-center gap-2.5">
                        <Avatar>
                          <AvatarFallback>{initialsOf(r.displayName)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Link href={`/player/${r.athleteId}`} className="block text-ink hover:text-accent">
                            {r.displayName}
                          </Link>
                          <span className="block text-[11px] font-normal text-muted">
                            {r.externalId ?? "—"}
                            {r.age !== null ? ` · ${r.age} yrs` : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-muted">{r.position}</td>
                    <td className="py-2.5 pr-3 text-muted">
                      <span aria-hidden="true" className="mr-1.5">{sportIcon(r.sport)}</span>
                      {r.sport}
                    </td>
                    <td className="hero-number py-2.5 pr-3 text-xl">
                      {withheld || r.score === null ? "—" : r.score.toFixed(1)}
                    </td>
                    <td className="py-2.5 pr-3">
                      {withheld ? (
                        <WithheldStamp code={r.withheldCode} />
                      ) : r.band ? (
                        <Tag label={r.band} />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3">
                      {r.confidence === null ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <ConfidenceRing value={r.confidence} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Confidence {r.confidence}% — evidence-quality indicator, not a probability.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </td>
                    <td className="py-2.5 pr-3">
                      <SparklinePoints athleteId={r.athleteId} />
                    </td>
                    <td className="py-2.5 pr-3">
                      <DataVerified validity={r.validity} />
                    </td>
                    <td className="py-2.5 pr-3">
                      {r.openExceptions > 0 ? (
                        <span className={`text-xs font-semibold ${r.maxSeverity === "CRITICAL" ? "text-critical" : "text-monitor"}`}>
                          {r.openExceptions} exception{r.openExceptions === 1 ? "" : "s"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">No exceptions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {filtered.length > 0 ? (
          <p className="mt-3 text-[11px] text-muted">
            Showing 1–{filtered.length} of {rows.length} athletes
            {sport !== "" ? ` · ${sport}` : ""}
          </p>
        ) : null}
      </Card>
    </AppShell>
  );
}

/** Sparkline computed server-side from the athlete's 14-day score trend. */
async function SparklinePoints({ athleteId }: { athleteId: string }) {
  const scores = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.performanceScore.findMany({
      where: { athleteId },
      orderBy: { timestamp: "desc" },
      take: 14,
      select: { score: true, validityStatus: true },
    }),
  );
  const points = scores.reverse().map((s) =>
    s.validityStatus === "VALID" || s.validityStatus === "LIMITED" ? s.score : null,
  );
  return <Sparkline points={points} />;
}
