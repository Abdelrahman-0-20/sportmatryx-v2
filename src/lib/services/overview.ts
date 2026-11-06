import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withFallback } from "@/lib/offline";
import { SAMPLE_ROSTER, SAMPLE_ATHLETE } from "@/lib/offline/sample-data";
import { getRosterRows, type RosterRow } from "@/lib/services/dashboard";
import { listProducts, type MarketProduct } from "@/lib/services/marketplace";
import type { TrendPoint } from "@/components/ui/charts";

/** Overview dashboard data: featured athlete, trend series, readiness radar. */

export interface OverviewComponent {
  name: string;
  score: number | null;
  contribution: number | null;
  weight: number;
}

export interface OverviewData {
  rows: RosterRow[];
  featured: {
    athleteId: string;
    displayName: string;
    externalId: string | null;
    sport: string;
    position: string;
    teamName: string;
    score: number | null;
    band: string | null;
    confidence: number | null;
    validity: string;
    components: OverviewComponent[];
    /** Score change versus the same athlete ~14 days earlier, null when either side is missing. */
    delta14: number | null;
  } | null;
  trend: { primary: TrendPoint[]; secondary: TrendPoint[] };
  radar: { axes: string[]; athlete: number[]; cohort: number[] };
  products: MarketProduct[];
  /** Last 14 scores per roster athlete (oldest first) for the scouting sparklines. */
  sparklines: Record<string, (number | null)[]>;
}

const DAY_MS = 86_400_000;
/** Longest window the seed generates — matches the chart's 6M range. */
const TREND_DAYS = 180;

/** A score counts toward a chart only when it passed the validity gates. */
function chartValue(score: number | null, validity: string): number | null {
  return validity === "VALID" || validity === "LIMITED" ? score : null;
}

export async function getOverviewData(teamId?: string): Promise<OverviewData> {
  // Products carry their own fallback, so they are loaded regardless of which
  // branch the dashboard data took — the marketplace widget never renders empty.
  const [data, products] = await Promise.all([
    withFallback<OverviewData>(() => queryOverview(teamId), () => sampleOverview()),
    listProducts(),
  ]);
  return { ...data, products };
}

async function queryOverview(teamId?: string): Promise<OverviewData> {
  const rows = await getRosterRows(teamId);

  // Featured athlete = best current score on the roster (the "top form" story
  // the card tells). Falls back to the first row when nobody is scored.
  const scored = rows.filter((r) => r.score !== null);
  const featured =
    [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? rows[0] ?? null;

  const [trend, radar, sparklines] = await Promise.all([
    featured ? loadTrend(featured.athleteId, teamId) : emptyTrend(),
    featured ? loadRadar(featured.athleteId, teamId) : emptyRadar(),
    loadSparklines(rows.map((r) => r.athleteId)),
  ]);

  let detail: OverviewData["featured"] = null;
  if (featured) {
    const scores = await prisma.performanceScore.findMany({
      where: { athleteId: featured.athleteId },
      orderBy: { timestamp: "desc" },
      take: 40,
      select: {
        timestamp: true,
        score: true,
        validityStatus: true,
        scoreComponents: {
          select: { componentName: true, normalizedValue: true, contributionToScore: true, weightApplied: true },
          orderBy: { weightApplied: "desc" },
        },
      },
    });
    const latest = scores[0];
    const prior = scores.find((s) => latest && s.timestamp.getTime() <= latest.timestamp.getTime() - 14 * DAY_MS);
    const delta14 =
      latest && prior && latest.score !== null && prior.score !== null
        ? Math.round((latest.score - prior.score) * 10) / 10
        : null;

    detail = {
      athleteId: featured.athleteId,
      displayName: featured.displayName,
      externalId: featured.externalId,
      sport: featured.sport,
      position: featured.position,
      teamName: featured.teamName,
      score: featured.score,
      band: featured.band,
      confidence: featured.confidence,
      validity: featured.validity,
      components: (latest?.scoreComponents ?? []).map((c) => ({
        name: c.componentName,
        score: c.normalizedValue,
        contribution: c.contributionToScore,
        weight: c.weightApplied,
      })),
      delta14,
    };
  }

  return { rows, featured: detail, trend, radar, products: [], sparklines };
}

/** One query for every roster athlete's last 14 scores — avoids N+1 on the card grid. */
async function loadSparklines(ids: string[]): Promise<Record<string, (number | null)[]>> {
  if (ids.length === 0) return {};
  const rows = await prisma.$queryRaw<Array<{ athleteId: string; score: number | null; validity: string; ts: Date }>>`
    SELECT t."athleteId", t.score, t.validity, t.ts
    FROM (
      SELECT ps."athleteId",
             ps.score,
             ps."validityStatus"::text AS validity,
             ps.timestamp AS ts,
             ROW_NUMBER() OVER (PARTITION BY ps."athleteId" ORDER BY ps.timestamp DESC) AS rn
      FROM performance_scores ps
      WHERE ps."athleteId" IN (${Prisma.join(ids)})
    ) t
    WHERE t.rn <= 14
    ORDER BY t."athleteId", t.ts
  `;
  const out: Record<string, (number | null)[]> = {};
  for (const r of rows) {
    (out[r.athleteId] ??= []).push(chartValue(r.score, r.validity));
  }
  return out;
}

/** Featured athlete's daily scores + the roster's daily average. */
async function loadTrend(athleteId: string, teamId?: string): Promise<OverviewData["trend"]> {
  const own = await prisma.performanceScore.findMany({
    where: { athleteId },
    orderBy: { timestamp: "asc" },
    take: TREND_DAYS,
    select: { timestamp: true, score: true, validityStatus: true },
  });

  const teamFilter = teamId ? Prisma.sql`AND a."teamId" = ${teamId}` : Prisma.empty;
  const avg = await prisma.$queryRaw<Array<{ day: string; value: number }>>`
    SELECT to_char(ps."timestamp" AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
           AVG(ps.score)::float8 AS value
    FROM performance_scores ps
    JOIN athletes a ON a.id = ps."athleteId"
    WHERE ps."validityStatus" IN ('VALID', 'LIMITED')
      AND ps.score IS NOT NULL
      ${teamFilter}
    GROUP BY 1
    ORDER BY 1
  `;
  const avgByDay = new Map(avg.map((r) => [r.day, r.value]));

  const primary: TrendPoint[] = own.map((s) => ({
    date: s.timestamp.toISOString(),
    value: chartValue(s.score, s.validityStatus),
  }));

  // Secondary series is aligned to the athlete's calendar so both lines share
  // an x-axis; days the roster never scored stay null (gap, not a zero).
  const secondary: TrendPoint[] = primary.map((p) => {
    const day = p.date.slice(0, 10);
    const v = avgByDay.get(day);
    return { date: p.date, value: v === undefined ? null : Math.round(v * 10) / 10 };
  });

  return { primary, secondary };
}

/** Featured athlete's latest components vs the roster's latest component averages. */
async function loadRadar(athleteId: string, teamId?: string): Promise<OverviewData["radar"]> {
  const latest = await prisma.performanceScore.findFirst({
    where: { athleteId },
    orderBy: { timestamp: "desc" },
    select: {
      scoreComponents: {
        select: { componentName: true, normalizedValue: true },
        orderBy: { weightApplied: "desc" },
      },
    },
  });

  const teamFilter = teamId ? Prisma.sql`WHERE a."teamId" = ${teamId}` : Prisma.empty;
  const cohort = await prisma.$queryRaw<Array<{ name: string; value: number }>>`
    WITH latest AS (
      SELECT DISTINCT ON (ps."athleteId") ps.id
      FROM performance_scores ps
      JOIN athletes a ON a.id = ps."athleteId"
      ${teamFilter}
      ORDER BY ps."athleteId", ps.timestamp DESC
    )
    SELECT sc."componentName" AS name, AVG(sc."normalizedValue")::float8 AS value
    FROM score_components sc
    JOIN latest l ON l.id = sc."performanceScoreId"
    GROUP BY 1
  `;
  const cohortByName = new Map(cohort.map((c) => [c.name, c.value]));

  const axes = (latest?.scoreComponents ?? []).map((c) => c.componentName);
  return {
    axes,
    athlete: (latest?.scoreComponents ?? []).map((c) => c.normalizedValue ?? 0),
    cohort: axes.map((name) => cohortByName.get(name) ?? 0),
  };
}

const emptyTrend = (): OverviewData["trend"] => ({ primary: [], secondary: [] });
const emptyRadar = (): OverviewData["radar"] => ({ axes: [], athlete: [], cohort: [] });

/**
 * Guest / database-down fallback. Every page in this mode already shows the
 * "synthetic sample" banner, so the series here are clearly-labeled synthetic
 * values rather than an empty card.
 */
function sampleOverview(): OverviewData {
  const rows = SAMPLE_ROSTER;
  const top = [...rows].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0]!;
  const sample = SAMPLE_ATHLETE(top.athleteId);
  const comps = sample.latestScore?.components ?? [];

  const trend = (flat: number, swing: number): TrendPoint[] =>
    Array.from({ length: TREND_DAYS }, (_, i) => {
      const t = i / (TREND_DAYS - 1);
      return {
        date: new Date(Date.now() - (TREND_DAYS - 1 - i) * DAY_MS).toISOString(),
        value: Math.round((flat + Math.sin(t * 7.3) * swing + t * 5) * 10) / 10,
      };
    });

  return {
    rows,
    featured: {
      athleteId: top.athleteId,
      displayName: top.displayName,
      externalId: top.externalId,
      sport: top.sport,
      position: top.position,
      teamName: top.teamName,
      score: top.score,
      band: top.band,
      confidence: top.confidence,
      validity: top.validity,
      components: comps.map((c) => ({
        name: c.name,
        score: c.score,
        contribution: c.contribution,
        weight: c.weight,
      })),
      delta14: 2.4,
    },
    trend: { primary: trend(78, 6), secondary: trend(72, 3) },
    radar: {
      axes: comps.map((c) => c.name),
      athlete: comps.map((c) => c.score ?? 0),
      cohort: comps.map((c, i) => Math.max(0.2, (c.score ?? 0.5) - 0.08 - i * 0.01)),
    },
    products: [],
    sparklines: Object.fromEntries(
      rows.map((r, ri) => [
        r.athleteId,
        Array.from({ length: 14 }, (_, i) =>
          r.score === null ? null : Math.round((r.score - 4 + Math.sin((i + ri) * 1.1) * 3) * 10) / 10,
        ),
      ]),
    ),
  };
}
