import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nasaConfig, buildNasaUrl } from "@/lib/nasa";
import {
  parseAsteroidData,
  upsertAsteroid,
  buildDateFilter,
  fetchFromNasaAndCache,
} from "@/lib/neo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Default to last 7 days if no dates provided
    const end = endDate || new Date().toISOString().split("T")[0];
    const start =
      startDate ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    // Ensure cache is populated at least once
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const cachedCount = await prisma.asteroid.count({
      where: { fetchedAt: { gte: sevenDaysAgo } },
    });

    if (cachedCount === 0) {
      await fetchFromNasaAndCache();
    }

    // Filter by close approach date range
    const dateFilter = buildDateFilter(startDate, endDate);

    const asteroids = await prisma.asteroid.findMany({
      where: { closeApproach: dateFilter },
      orderBy: { distKm: "asc" },
    });

    return NextResponse.json({
      source: cachedCount === 0 && asteroids.length > 0 ? "nasa" : "cache",
      count: asteroids.length,
      data: asteroids,
      dateRange: { start, end },
    });
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch asteroid data" },
      { status: 500 },
    );
  }
}
