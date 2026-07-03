import { NextResponse } from "next/server";
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

    await prisma.asteroid.upsert({
      where: { id: obj.id },
      update: {
        distKm,
        sizeM,
        velocityKmh,
        hazardous: obj.is_potentially_hazardous_asteroid || false,
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
        rawJson: JSON.stringify(obj),
        fetchedAt: now,
      },
    });
  }
  return true;
}

export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let asteroids = await prisma.asteroid.findMany({
      where: { fetchedAt: { gte: sevenDaysAgo } },
    });

    // Se cache vuota, fetcha da NASA
    if (asteroids.length === 0) {
      await fetchFromNasaAndCache();
      asteroids = await prisma.asteroid.findMany({
        where: { fetchedAt: { gte: sevenDaysAgo } },
      });
    }

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
