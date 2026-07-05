import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildDateFilter, fetchFromNasaAndCache } from "@/lib/neo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

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
    });

    if (asteroids.length === 0) {
      return NextResponse.json({
        total: 0,
        hazardous: 0,
        avgVelocity: 0,
        minDistance: 0,
        data: [],
      });
    }

    const hazardous = asteroids.filter((a) => a.hazardous).length;
    const avgVelocity = Math.round(
      asteroids.reduce((s, a) => s + a.velocityKmh, 0) / asteroids.length,
    );
    const minDistance = Math.min(...asteroids.map((a) => a.distKm));

    return NextResponse.json({
      total: asteroids.length,
      hazardous,
      avgVelocity,
      minDistance,
      data: asteroids.map((a) => ({
        id: a.id,
        name: a.name,
        distKm: a.distKm,
        sizeM: a.sizeM,
        velocityKmh: a.velocityKmh,
        hazardous: a.hazardous,
      })),
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
