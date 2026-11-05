import { NextResponse } from "next/server";
import { sportStats } from "@/lib/sport-stats";

/**
 * GET /api/sport-stats?sport=<name|empty>
 * Instant aggregation for the home-page sport selector — the client swaps
 * chips without navigating, so no full-page refresh.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport") ?? undefined;
  return NextResponse.json(sportStats(sport), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
