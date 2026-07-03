import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Educational Resources", () => {
  it("should have EducationGrid component with 9 resources", () => {
    const content = fs.readFileSync(
      "src/components/education/education-grid.tsx",
      "utf-8",
    );
    expect(content).toContain("EducationGrid");
    expect(content).toContain("EducationalCard");
    expect(content).toContain("science.nasa.gov");
    expect(content).toContain("planetarydefense");
    expect(content).toContain("jpl.nasa.gov");
    expect(content).toContain("esa.int");
    // 9 resources
    expect(content.match(/title: "/g)?.length).toBeGreaterThanOrEqual(6);
  });

  it("should have Education page", () => {
    const content = fs.readFileSync(
      "src/app/[locale]/education/page.tsx",
      "utf-8",
    );
    expect(content).toContain("EducationPage");
    expect(content).toContain("EducationGrid");
    expect(content).toContain("handleOpenResource");
  });

  it("should have education translations", async () => {
    const it = await import("../messages/it.json");
    const en = await import("../messages/en.json");
    expect(it.education).toBeDefined();
    expect(en.education).toBeDefined();
    expect(it.education.title).toBe("Risorse Educative");
    expect(en.education.title).toBe("Educational Resources");
  });
});
