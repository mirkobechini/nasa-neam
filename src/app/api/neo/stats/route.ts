import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const asteroids = await prisma.asteroid.findMany({
      where: { fetchedAt: { gte: sevenDaysAgo } },
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
