import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nasaConfig, buildNasaUrl } from "@/lib/nasa";

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

    // Check cache first
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const cachedCount = await prisma.asteroid.count({
      where: {
        fetchedAt: { gte: sevenDaysAgo },
      },
    });

    // If we have cached data, return it
    if (cachedCount > 0) {
      const asteroids = await prisma.asteroid.findMany({
        where: { fetchedAt: { gte: sevenDaysAgo } },
        orderBy: { distKm: "asc" },
      });

      return NextResponse.json({
        source: "cache",
        count: asteroids.length,
        data: asteroids,
      });
    }

    // Fetch from NASA API
    const url = buildNasaUrl("/feed", {
      start_date: start,
      end_date: end,
    });

    const response = await fetch(url);
    const apiData = await response.json();

    // Log API call for rate limiting
    await prisma.apiCallLog.create({
      data: {
        endpoint: "/feed",
        status: response.status,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "NASA API error", details: apiData },
        { status: response.status },
      );
    }

    // Parse and store asteroids
    const nearEarthObjects = apiData.near_earth_objects || {};
    const asteroids = Object.values(nearEarthObjects).flat() as any[];
    const now = new Date();

    const stored = [];
    for (const obj of asteroids) {
      const closeApproach = obj.close_approach_data?.[0];
      const distKm = closeApproach
        ? parseFloat(closeApproach.miss_distance?.kilometers || "0")
        : 0;
      const velocityKmh = closeApproach
        ? parseFloat(
            closeApproach.relative_velocity?.kilometers_per_hour || "0",
          )
        : 0;
      const sizeM = obj.estimated_diameter?.meters?.estimated_diameter_max || 0;

      const asteroid = await prisma.asteroid.upsert({
        where: { id: obj.id },
        update: {
          distKm,
          sizeM,
          velocityKmh,
          hazardous: obj.is_potentially_hazardous_asteroid || false,
          closeApproach: closeApproach
            ? new Date(
                closeApproach.close_approach_date_full ||
                  closeApproach.close_approach_date,
              )
            : null,
          rawJson: JSON.stringify(obj),
          fetchedAt: now,
        },
        create: {
          id: obj.id,
          name: obj.name || obj.designation || `NEO-${obj.id}`,
          distKm,
          sizeM,
          velocityKmh,
          hazardous: obj.is_potentially_hazardous_asteroid || false,
          closeApproach: closeApproach
            ? new Date(
                closeApproach.close_approach_date_full ||
                  closeApproach.close_approach_date,
              )
            : null,
          orbitBody: closeApproach?.orbiting_body || "Earth",
          rawJson: JSON.stringify(obj),
          fetchedAt: now,
        },
      });
      stored.push(asteroid);
    }

    return NextResponse.json({
      source: "nasa",
      count: stored.length,
      data: stored,
    });
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch asteroid data" },
      { status: 500 },
    );
  }
}
