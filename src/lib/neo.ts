import { prisma } from "@/lib/prisma";
import { buildNasaUrl } from "@/lib/nasa";

export interface NeoObject {
  id: string;
  name?: string;
  designation?: string;
  is_potentially_hazardous_asteroid?: boolean;
  estimated_diameter?: { meters?: { estimated_diameter_max?: number } };
  close_approach_data?: Array<{
    miss_distance?: { kilometers?: string };
    relative_velocity?: { kilometers_per_hour?: string };
    orbiting_body?: string;
    close_approach_date?: string;
    close_approach_date_full?: string;
  }>;
}

export interface ParsedAsteroid {
  id: string;
  name: string;
  distKm: number;
  sizeM: number;
  velocityKmh: number;
  hazardous: boolean;
  orbitBody: string;
  closeApproach: Date | null;
  rawJson: string;
}

/**
 * Parse a NASA NeoW object into our internal format.
 */
export function parseAsteroidData(obj: NeoObject): ParsedAsteroid {
  const closeApproach = obj.close_approach_data?.[0];
  const distKm = closeApproach
    ? parseFloat(closeApproach.miss_distance?.kilometers || "0")
    : 0;
  const velocityKmh = closeApproach
    ? parseFloat(closeApproach.relative_velocity?.kilometers_per_hour || "0")
    : 0;
  const sizeM = obj.estimated_diameter?.meters?.estimated_diameter_max || 0;

  let closeApproachDate: Date | null = null;
  if (closeApproach?.close_approach_date_full) {
    closeApproachDate = new Date(closeApproach.close_approach_date_full);
  } else if (closeApproach?.close_approach_date) {
    closeApproachDate = new Date(
      closeApproach.close_approach_date + "T00:00:00Z",
    );
  }

  return {
    id: obj.id,
    name: obj.name || obj.designation || `NEO-${obj.id}`,
    distKm,
    sizeM,
    velocityKmh,
    hazardous: obj.is_potentially_hazardous_asteroid || false,
    orbitBody: closeApproach?.orbiting_body || "Earth",
    closeApproach: closeApproachDate,
    rawJson: JSON.stringify(obj),
  };
}

/**
 * Upsert a single asteroid into the database.
 */
export async function upsertAsteroid(parsed: ParsedAsteroid, fetchedAt: Date) {
  return prisma.asteroid.upsert({
    where: { id: parsed.id },
    update: {
      name: parsed.name,
      distKm: parsed.distKm,
      sizeM: parsed.sizeM,
      velocityKmh: parsed.velocityKmh,
      hazardous: parsed.hazardous,
      closeApproach: parsed.closeApproach,
      rawJson: parsed.rawJson,
      fetchedAt,
    },
    create: {
      id: parsed.id,
      name: parsed.name,
      distKm: parsed.distKm,
      sizeM: parsed.sizeM,
      velocityKmh: parsed.velocityKmh,
      hazardous: parsed.hazardous,
      orbitBody: parsed.orbitBody,
      closeApproach: parsed.closeApproach,
      rawJson: parsed.rawJson,
      fetchedAt,
    },
  });
}

/**
 * Build a Prisma date filter from optional start/end date strings.
 * Defaults to last 7 days if no start_date provided.
 */
export function buildDateFilter(
  startDate?: string | null,
  endDate?: string | null,
) {
  const filter: Record<string, Date> = {};

  if (startDate) {
    filter.gte = new Date(startDate + "T00:00:00Z");
  } else {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    filter.gte = new Date(d.toISOString().split("T")[0] + "T00:00:00Z");
  }

  if (endDate) {
    const end = new Date(endDate + "T00:00:00Z");
    end.setDate(end.getDate() + 1);
    filter.lt = end;
  } else {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    filter.lt = new Date(d.toISOString().split("T")[0] + "T00:00:00Z");
  }

  return filter;
}

/**
 * Fetch the last 7 days of NEO data from NASA and cache it in the database.
 * Returns true if successful, false otherwise.
 */
export async function fetchFromNasaAndCache(): Promise<boolean> {
  const end = new Date().toISOString().split("T")[0];
  const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = buildNasaUrl("/feed", { start_date: start, end_date: end });
  const response = await fetch(url);
  const apiData = await response.json();

  await prisma.apiCallLog.create({
    data: { endpoint: "/feed (bulk)", status: response.status },
  });

  if (!response.ok) return false;

  const nearEarthObjects =
    (apiData.near_earth_objects as Record<string, NeoObject[]>) || {};
  const asteroids = Object.values(nearEarthObjects).flat();
  const now = new Date();

  for (const obj of asteroids) {
    const parsed = parseAsteroidData(obj);
    await upsertAsteroid(parsed, now);
  }

  return true;
}
