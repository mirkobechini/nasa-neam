import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Viewer zoom controls", () => {
  it("should have OrbitControls in 3D viewer", () => {
    const content = fs.readFileSync("src/components/viewer/viewer-3d.tsx", "utf-8");
    expect(content).toContain("OrbitControls");
    expect(content).toContain("controls.enableDamping");
    expect(content).toContain("controls.minDistance");
    expect(content).toContain("controls.maxDistance");
    expect(content).toContain("controls.update()");
  });

  it("should have wheel zoom and drag-to-pan in 2D viewer", () => {
    const content = fs.readFileSync("src/components/viewer/viewer-2d.tsx", "utf-8");
    expect(content).toContain("handleWheel");
    expect(content).toContain("wheel");
    expect(content).toContain("dragRef");
    expect(content).toContain("mousedown");
    expect(content).toContain("mouseup");
  });

  it("should have improved legend in 2D viewer", () => {
    const content = fs.readFileSync("src/components/viewer/viewer-2d.tsx", "utf-8");
    expect(content).toContain("bold 11px monospace");
    expect(content).toContain("Drag to pan");
  });
});
