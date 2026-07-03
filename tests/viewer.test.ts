import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Trajectory Viewer", () => {
  it("should have Viewer3D component with Three.js", () => {
    const content = fs.readFileSync(
      "src/components/viewer/viewer-3d.tsx",
      "utf-8",
    );
    expect(content).toContain("Viewer3D");
    expect(content).toContain("THREE");
    expect(content).toContain("WebGLRenderer");
    expect(content).toContain("SphereGeometry");
    expect(content).toContain("PointsMaterial");
  });

  it("should have Viewer2D component with Canvas", () => {
    const content = fs.readFileSync(
      "src/components/viewer/viewer-2d.tsx",
      "utf-8",
    );
    expect(content).toContain("Viewer2D");
    expect(content).toContain("getContext");
    expect(content).toContain("arc");
    expect(content).toContain("fillText");
  });

  it("should have viewer page with 3D/2D switch", () => {
    const content = fs.readFileSync(
      "src/app/[locale]/viewer/page.tsx",
      "utf-8",
    );
    expect(content).toContain("ViewerPage");
    expect(content).toContain("Viewer3D");
    expect(content).toContain("Viewer2D");
    expect(content).toContain('setMode("3d")');
    expect(content).toContain('setMode("2d")');
    expect(content).toContain("/api/neo/feed");
  });

  it("should have visualization translations", async () => {
    const it = await import("../messages/it.json");
    const en = await import("../messages/en.json");
    expect(it.visualization).toBeDefined();
    expect(en.visualization).toBeDefined();
    expect(it.visualization.title).toBe("Visualizzatore 3D/2D");
    expect(en.visualization.title).toBe("3D/2D Viewer");
    expect(it.visualization.switch3d).toBe("3D");
    expect(en.visualization.switch3d).toBe("3D");
  });
});
