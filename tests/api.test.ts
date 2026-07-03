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

    const url = buildNasaUrl("/feed", { start_date: "2026-07-01", end_date: "2026-07-03" });
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
    expect(content).toContain("prisma.asteroid.count");
    expect(content).toContain("buildNasaUrl");
  });

  it("should have [id] route with GET export", () => {
    const content = fs.readFileSync(
      path.join("src/app/api/neo", "[id]", "route.ts"),
      "utf-8"
    );
    expect(content).toContain("export async function GET");
    expect(content).toContain("prisma.asteroid.findUnique");
    expect(content).toContain("buildNasaUrl");
  });

  it("should have rate-limit route with GET export", () => {
    const content = fs.readFileSync(
      "src/app/api/neo/rate-limit/route.ts",
      "utf-8"
    );
    expect(content).toContain("export async function GET");
    expect(content).toContain("prisma.apiCallLog.count");
    expect(content).toContain("nasaConfig.rateLimit");
  });
});
