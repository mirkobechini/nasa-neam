import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Viewer interaction", () => {
  it("should have AsteroidModal component", () => {
    const content = fs.readFileSync(
      "src/components/viewer/asteroid-modal.tsx",
      "utf-8",
    );
    expect(content).toContain("AsteroidModal");
    expect(content).toContain("/api/neo/");
    expect(content).toContain("onClose");
  });

  it("should have raycaster in 3D viewer", () => {
    const content = fs.readFileSync(
      "src/components/viewer/viewer-3d.tsx",
      "utf-8",
    );
    expect(content).toContain("Raycaster");
    expect(content).toContain("pointermove");
    expect(content).toContain("onHover");
    expect(content).toContain("onClick");
    expect(content).toContain("pointerdown");
    expect(content).toContain("pointerup");
    expect(content).toContain("hasDragged");
  });

  it("should have hover/click in 2D viewer", () => {
    const content = fs.readFileSync(
      "src/components/viewer/viewer-2d.tsx",
      "utf-8",
    );
    expect(content).toContain("onHover");
    expect(content).toContain("onClick");
    expect(content).toContain("mousemove");
    expect(content).toContain("positionsRef");
  });

  it("should have viewer page with modal integration", () => {
    const content = fs.readFileSync(
      "src/app/[locale]/viewer/page.tsx",
      "utf-8",
    );
    expect(content).toContain("AsteroidModal");
    expect(content).toContain("hoveredId");
    expect(content).toContain("selectedId");
    expect(content).toContain("hoveredAsteroid");
  });
});
