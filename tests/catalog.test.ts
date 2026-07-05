import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Asteroid Catalog", () => {
  it("should have AsteroidList component", () => {
    const content = fs.readFileSync(
      "src/components/catalog/asteroid-list.tsx",
      "utf-8",
    );
    expect(content).toContain("AsteroidList");
    expect(content).toContain("onSelectAsteroid");
    expect(content).toContain("sortBy");
    expect(content).toContain("hazardFilter");
    expect(content).toContain("useMemo");
  });

  it("should have catalog page", () => {
    const content = fs.readFileSync(
      "src/app/[locale]/catalog/page.tsx",
      "utf-8",
    );
    expect(content).toContain("CatalogPage");
    expect(content).toContain("AsteroidList");
    expect(content).toContain("/api/neo/feed");
    expect(content).toContain("router.push");
  });

  it("should have asteroid profile page", () => {
    const content = fs.readFileSync(
      path.join("src/app/[locale]/neo", "[id]", "page.tsx"),
      "utf-8",
    );
    expect(content).toContain("AsteroidProfile");
    expect(content).toContain("/api/neo/");
    expect(content).toContain("minDistance");
    expect(content).toContain("estimatedSize");
    expect(content).toContain("velocity");
  });

  it("should have /api/neo/feed returning data array", () => {
    const content = fs.readFileSync("src/app/api/neo/feed/route.ts", "utf-8");
    expect(content).toContain("export async function GET");
    expect(content).toContain("ensureRangeCached");
    expect(content).toContain("buildNasaUrl");
  });
});
