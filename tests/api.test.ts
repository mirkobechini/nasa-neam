import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("NASA API config", () => {
  it("should have correct config values", async () => {
    const { nasaConfig, buildNasaUrl } = await import("../src/lib/nasa");

    expect(nasaConfig.baseUrl).toBe("https://api.nasa.gov/neo/rest/v1");
    expect(nasaConfig.rateLimit).toBe(1000);
    expect(nasaConfig.cacheMaxDays).toBe(7);
    expect(nasaConfig.apiKey).toBe("DEMO_KEY");
  });

  it("should build valid NASA API URLs", async () => {
    const { buildNasaUrl } = await import("../src/lib/nasa");

    const url = buildNasaUrl("/feed", {
      start_date: "2026-07-01",
      end_date: "2026-07-03",
    });
    expect(url).toContain("api.nasa.gov/neo/rest/v1/feed");
    expect(url).toContain("start_date=2026-07-01");
    expect(url).toContain("end_date=2026-07-03");
    expect(url).toContain("api_key=");
  });
});

describe("Prisma schema", () => {
  it("should have Prisma schema file with all models", () => {
    const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");
    expect(schema).toContain("model Asteroid");
    expect(schema).toContain("model ApiCallLog");
    expect(schema).toContain("model UserPreference");
    expect(schema).toContain('provider = "sqlite"');
  });

  it("should have generated client files", () => {
    const files = fs.readdirSync("src/generated/prisma");
    expect(files).toContain("client.ts");
    expect(files).toContain("enums.ts");
  });
});

describe("API routes structure", () => {
  it("should have feed route with GET export", () => {
    const content = fs.readFileSync("src/app/api/neo/feed/route.ts", "utf-8");
    expect(content).toContain("export async function GET");
    expect(content).toContain("closeApproach");
    expect(content).toContain("ensureRangeCached");
    expect(content).toContain("buildDateFilter");
  });

  it("should have [id] route with GET export", () => {
    const content = fs.readFileSync(
      path.join("src/app/api/neo", "[id]", "route.ts"),
      "utf-8",
    );
    expect(content).toContain("export async function GET");
    expect(content).toContain("prisma.asteroid.findUnique");
    expect(content).toContain("buildNasaUrl");
  });

  it("should have rate-limit route with GET export", () => {
    const content = fs.readFileSync(
      "src/app/api/neo/rate-limit/route.ts",
      "utf-8",
    );
    expect(content).toContain("export async function GET");
    expect(content).toContain("prisma.apiCallLog.count");
    expect(content).toContain("nasaConfig.rateLimit");
  });
});

describe("Shared neo library", () => {
  it("should parse NASA object into our format", async () => {
    const { parseAsteroidData } = await import("../src/lib/neo");

    const nasaObj = {
      id: "123",
      name: "Test Asteroid",
      is_potentially_hazardous_asteroid: true,
      estimated_diameter: { meters: { estimated_diameter_max: 500 } },
      close_approach_data: [
        {
          miss_distance: { kilometers: "100000" },
          relative_velocity: { kilometers_per_hour: "25000" },
          orbiting_body: "Earth",
          close_approach_date: "2026-07-04",
        },
      ],
    };

    const parsed = parseAsteroidData(nasaObj as any);
    expect(parsed.id).toBe("123");
    expect(parsed.name).toBe("Test Asteroid");
    expect(parsed.hazardous).toBe(true);
    expect(parsed.sizeM).toBe(500);
    expect(parsed.distKm).toBe(100000);
    expect(parsed.velocityKmh).toBe(25000);
    expect(parsed.orbitBody).toBe("Earth");
    expect(parsed.closeApproach).toBeInstanceOf(Date);
  });

  it("should build date filter with start_date and end_date", async () => {
    const { buildDateFilter } = await import("../src/lib/neo");

    const filter = buildDateFilter("2026-07-01", "2026-07-03");
    expect(filter.gte).toBeInstanceOf(Date);
    expect(filter.lt).toBeInstanceOf(Date);
    // gte should be 2026-07-01
    expect(filter.gte.toISOString().split("T")[0]).toBe("2026-07-01");
    // lt should be 2026-07-04 (end + 1 day)
    expect(filter.lt.toISOString().split("T")[0]).toBe("2026-07-04");
  });

  it("should build date filter with defaults", async () => {
    const { buildDateFilter } = await import("../src/lib/neo");

    const filter = buildDateFilter(null, null);
    expect(filter.gte).toBeInstanceOf(Date);
    expect(filter.lt).toBeInstanceOf(Date);
  });

  it("should have stats route using shared logic", () => {
    const content = fs.readFileSync("src/app/api/neo/stats/route.ts", "utf-8");
    expect(content).toContain('from "@/lib/neo"');
    expect(content).toContain("buildDateFilter");
    expect(content).toContain("ensureRangeCached");
  });

  it("should have feed route using shared neo library", () => {
    const content = fs.readFileSync("src/app/api/neo/feed/route.ts", "utf-8");
    expect(content).toContain('from "@/lib/neo"');
    expect(content).toContain("buildDateFilter");
    expect(content).toContain("ensureRangeCached");
  });
});
