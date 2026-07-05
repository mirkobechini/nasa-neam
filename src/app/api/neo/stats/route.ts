import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildNasaUrl } from "@/lib/nasa";

type NeoObject = Record<string, unknown> & {
  id: string;
  name?: string;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: { meters?: { estimated_diameter_max?: number } };
  close_approach_data?: Array<{
    miss_distance?: { kilometers?: string };
    relative_velocity?: { kilometers_per_hour?: string };
    orbiting_body?: string;
    close_approach_date?: string;
    close_approach_date_full?: string;
  }>;
};

async function fetchFromNasaAndCache() {
  const end = new Date().toISOString().split("T")[0];
  const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = buildNasaUrl("/feed", { start_date: start, end_date: end });
  const response = await fetch(url);
  const apiData = await response.json();

  await prisma.apiCallLog.create({
    data: { endpoint: "/feed (from stats)", status: response.status },
  });

  if (!response.ok) return null;

  const nearEarthObjects =
    (apiData.near_earth_objects as Record<string, NeoObject[]>) || {};
  const asteroids = Object.values(nearEarthObjects).flat();
  const now = new Date();

  for (const obj of asteroids) {
    const closeApproach = obj.close_approach_data?.[0];
    const distKm = closeApproach
      ? parseFloat(closeApproach.miss_distance?.kilometers || "0")
      : 0;
    const velocityKmh = closeApproach
      ? parseFloat(closeApproach.relative_velocity?.kilometers_per_hour || "0")
      : 0;
    const sizeM = obj.estimated_diameter?.meters?.estimated_diameter_max || 0;

    // Parse close_approach_date into a Date object
    let closeApproachDate: Date | null = null;
    if (closeApproach?.close_approach_date) {
      closeApproachDate = new Date(
        closeApproach.close_approach_date + "T00:00:00Z",
      );
    }

    await prisma.asteroid.upsert({
      where: { id: obj.id },
      update: {
        distKm,
        sizeM,
        velocityKmh,
        hazardous: obj.is_potentially_hazardous_asteroid || false,
        closeApproach: closeApproachDate,
        rawJson: JSON.stringify(obj),
        fetchedAt: now,
      },
      create: {
        id: obj.id,
        name: obj.name || `NEO-${obj.id}`,
        distKm,
        sizeM,
        velocityKmh,
        hazardous: obj.is_potentially_hazardous_asteroid || false,
        orbitBody: closeApproach?.orbiting_body || "Earth",
        closeApproach: closeApproachDate,
        rawJson: JSON.stringify(obj),
        fetchedAt: now,
      },
    });
  }
  return true;
}

function buildDateFilter(startDate?: string | null, endDate?: string | null) {
  const filter: Record<string, Date> = {};

  if (startDate) {
    filter.gte = new Date(startDate + "T00:00:00Z");
  } else {
    // Default: 7 days ago
    const d = new Date();
    d.setDate(d.getDate() - 7);
    filter.gte = new Date(d.toISOString().split("T")[0] + "T00:00:00Z");
  }

  if (endDate) {
    // Inclusive end: add one day so closeApproach < end+1
    const end = new Date(endDate + "T00:00:00Z");
    end.setDate(end.getDate() + 1);
    filter.lt = end;
  } else {
    // Default: tomorrow (inclusive of today)
    const d = new Date();
    d.setDate(d.getDate() + 1);
    filter.lt = new Date(d.toISOString().split("T")[0] + "T00:00:00Z");
  }

  return filter;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Ensure cache is populated at least once
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let cachedCount = await prisma.asteroid.count({
      where: { fetchedAt: { gte: sevenDaysAgo } },
    });

    if (cachedCount === 0) {
      await fetchFromNasaAndCache();
    }

    // Filter by close approach date range
    const dateFilter = buildDateFilter(startDate, endDate);

    let asteroids = await prisma.asteroid.findMany({
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
