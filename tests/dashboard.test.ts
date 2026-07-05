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

  it("should pass start_date and end_date for all time ranges", () => {
    const page = fs.readFileSync("src/app/[locale]/page.tsx", "utf-8");
    // For 3d and 7d ranges
    expect(page).toContain('params.set("start_date"');
    expect(page).toContain('params.set("end_date"');
    // For custom range
    expect(page).toContain("customStart");
    expect(page).toContain("customEnd");
    // handleTimeRangeChange resets custom dates when switching away
    expect(page).toContain("handleTimeRangeChange");
  });

  it("should have closeApproach field in stats route", () => {
    const content = fs.readFileSync("src/app/api/neo/stats/route.ts", "utf-8");
    expect(content).toContain("closeApproach");
    expect(content).toContain("buildDateFilter");
    expect(content).toContain("start_date");
    expect(content).toContain("end_date");
    expect(content).toContain("NextRequest");
  });

  it("should have DateRangeFilter supporting custom date picker", () => {
    const filter = fs.readFileSync(
      "src/components/dashboard/time-range-filter.tsx",
      "utf-8",
    );
    expect(filter).toContain("customStart");
    expect(filter).toContain("customEnd");
    expect(filter).toContain("onCustomChange");
    expect(filter).toContain('type="date"');
  });
});
