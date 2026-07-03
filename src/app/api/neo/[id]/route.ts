import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildNasaUrl } from "@/lib/nasa";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check cache first
    const cached = await prisma.asteroid.findUnique({
      where: { id },
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (cached && cached.fetchedAt >= sevenDaysAgo) {
      return NextResponse.json({
        source: "cache",
        data: cached,
      });
    }

    // Fetch from NASA API
    const url = buildNasaUrl(`/neo/${id}`);
    const response = await fetch(url);
    const apiData = await response.json();

    // Log API call
    await prisma.apiCallLog.create({
      data: {
        endpoint: `/neo/${id}`,
        status: response.status,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "NASA API error", details: apiData },
        { status: response.status },
      );
    }

    // Parse and store
    const obj = apiData;
    const closeApproach = obj.close_approach_data?.[0];
    const distKm = closeApproach
      ? parseFloat(closeApproach.miss_distance?.kilometers || "0")
      : 0;
    const velocityKmh = closeApproach
      ? parseFloat(closeApproach.relative_velocity?.kilometers_per_hour || "0")
      : 0;
    const sizeM = obj.estimated_diameter?.meters?.estimated_diameter_max || 0;
    const now = new Date();

    const asteroid = await prisma.asteroid.upsert({
      where: { id: obj.id },
      update: {
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

    return NextResponse.json({
      source: "nasa",
      data: asteroid,
    });
  } catch (error) {
    console.error("Asteroid detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch asteroid details" },
      { status: 500 },
    );
  }
}
