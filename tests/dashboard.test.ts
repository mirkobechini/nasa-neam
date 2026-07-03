import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Dashboard components", () => {
  it("should have all dashboard components", () => {
    const componentsDir = "src/components/dashboard";
    const files = fs.readdirSync(componentsDir);
    expect(files).toContain("hero-stats.tsx");
    expect(files).toContain("bubble-chart.tsx");
    expect(files).toContain("hazard-bar-chart.tsx");
    expect(files).toContain("time-range-filter.tsx");
  });

  it("should have Stats API endpoint", () => {
    const content = fs.readFileSync("src/app/api/neo/stats/route.ts", "utf-8");
    expect(content).toContain("export async function GET");
    expect(content).toContain("prisma.asteroid.findMany");
    expect(content).toContain("avgVelocity");
    expect(content).toContain("minDistance");
  });

  it("should have types for dashboard data", () => {
    const content = fs.readFileSync("src/lib/types.ts", "utf-8");
    expect(content).toContain("StatsData");
    expect(content).toContain("AsteroidData");
    expect(content).toContain("TimeRange");
  });

  it("should use Recharts for charts", () => {
    const bubble = fs.readFileSync(
      "src/components/dashboard/bubble-chart.tsx",
      "utf-8",
    );
    expect(bubble).toContain("recharts");
    expect(bubble).toContain("ScatterChart");

    const bar = fs.readFileSync(
      "src/components/dashboard/hazard-bar-chart.tsx",
      "utf-8",
    );
    expect(bar).toContain("recharts");
    expect(bar).toContain("BarChart");
  });

  it("should have page.tsx using dashboard components", () => {
    const page = fs.readFileSync("src/app/[locale]/page.tsx", "utf-8");
    expect(page).toContain("HeroStats");
    expect(page).toContain("BubbleChart");
    expect(page).toContain("HazardBarChart");
    expect(page).toContain("TimeRangeFilter");
    expect(page).toContain("fetchData");
    expect(page).toContain("/api/neo/stats");
  });
});
