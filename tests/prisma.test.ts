import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Prisma setup", () => {
  it("should have schema with all required models", () => {
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

  it("should have applied migration", () => {
    const migrations = fs.readdirSync("prisma/migrations");
    expect(migrations.length).toBeGreaterThan(0);
  });
});
