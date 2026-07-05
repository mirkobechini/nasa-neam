import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildDateFilter,
  ensureRangeCached,
  fetchFromNasaAndCache,
} from "@/lib/neo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const end = endDate || new Date().toISOString().split("T")[0];
    const start =
      startDate ||
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const requestedRange = { start, end };
    if (!(await ensureRangeCached(requestedRange))) {
      return NextResponse.json(
        { error: "Failed to cache requested date range" },
        { status: 500 },
      );
    }

    const dateFilter = buildDateFilter(startDate, endDate);

    const asteroids = await prisma.asteroid.findMany({
      where: { closeApproach: dateFilter },
      orderBy: { distKm: "asc" },
    });

    return NextResponse.json({
      source: "cache",
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
