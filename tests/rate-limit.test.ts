import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Rate Limit Monitor", () => {
  it("should have RateLimitBadge component", () => {
    const content = fs.readFileSync(
      "src/components/rate-limit/rate-limit-badge.tsx",
      "utf-8",
    );
    expect(content).toContain("RateLimitBadge");
    expect(content).toContain("/api/neo/rate-limit");
    expect(content).toContain("setInterval");
    expect(content).not.toContain("useCallback");
    expect(content).not.toContain("setState synchronously");
  });

  it("should have navbar component with links", () => {
    const content = fs.readFileSync(
      "src/components/layout/navbar.tsx",
      "utf-8",
    );
    expect(content).toContain("Navbar");
    expect(content).toContain("RateLimitBadge");
    expect(content).toContain("/catalog");
    expect(content).toContain("/viewer");
    expect(content).toContain("/education");
  });

  it("should have navbar wrapper in layout", () => {
    const content = fs.readFileSync("src/app/[locale]/layout.tsx", "utf-8");
    expect(content).toContain("NavbarWrapper");
    expect(content).toContain("navbar-wrapper");
  });

  it("should have rate limit API endpoint", () => {
    const content = fs.readFileSync(
      "src/app/api/neo/rate-limit/route.ts",
      "utf-8",
    );
    expect(content).toContain("export async function GET");
    expect(content).toContain("prisma.apiCallLog.count");
    expect(content).toContain("nasaConfig.rateLimit");
  });
});
