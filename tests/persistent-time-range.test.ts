import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Persistent Time Range Feature", () => {
  it("should have TimeRangeContext in lib/contexts", () => {
    const content = fs.readFileSync(
      "src/lib/contexts/TimeRangeContext.tsx",
      "utf-8",
    );
    expect(content).toContain("TimeRangeContext");
    expect(content).toContain("TimeRangeProvider");
    expect(content).toContain("useTimeRange");
    expect(content).toContain("dateMin");
    expect(content).toContain("dateMax");
  });

  it("should have TimeRangeFilter integrated in dashboard", () => {
    const content = fs.readFileSync(
      "src/components/dashboard/time-range-filter.tsx",
      "utf-8",
    );
    expect(content).toContain("useTimeRange");
    expect(content).toContain("TimeRangeContext");
    expect(content).toContain("setPredefinedRange");
  });

  it("should have TimeRangeFilter in NavbarWrapper", () => {
    const content = fs.readFileSync(
      "src/components/layout/navbar-wrapper.tsx",
      "utf-8",
    );
    expect(content).toContain("TimeRangeFilter");
    expect(content).toContain("NavbarWrapper");
  });

  it("dashboard page should use TimeRangeContext", () => {
    const content = fs.readFileSync("src/app/[locale]/page.tsx", "utf-8");
    expect(content).toContain("useTimeRange");
    expect(content).toContain("dateMin");
    expect(content).toContain("dateMax");
  });
});
