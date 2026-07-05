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
    expect(content).toContain("createAsteroidMesh");
    expect(content).toContain("MeshPhongMaterial");
    expect(content).toContain("for (let i = 0; i < 2;");
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

  it("should have SpeedControls component", () => {
    const content = fs.readFileSync(
      "src/components/viewer/speed-controls.tsx",
      "utf-8",
    );
    expect(content).toContain("SpeedControls");
    expect(content).toContain("speed");
    expect(content).toContain("onSpeedChange");
    expect(content).toContain("Slow");
    expect(content).toContain("Normal");
    expect(content).toContain("Fast");
  });

  it("should have Viewer3D component with speed prop", () => {
    const content = fs.readFileSync(
      "src/components/viewer/viewer-3d.tsx",
      "utf-8",
    );
    expect(content).toContain("speed");
    expect(content).toContain("speed = 1");
    expect(content).toContain("angle += 0.002 * speed");
    expect(content).toContain("earth.rotation.y += 0.005 * speed");
    expect(content).toContain("d.angle += d.speed * speed");
    expect(content).toContain("controls.autoRotateSpeed = 1.0 * speed");
  });

  it("should integrate SpeedControls in viewer page", () => {
    const content = fs.readFileSync(
      "src/app/[locale]/viewer/page.tsx",
      "utf-8",
    );
    expect(content).toContain("SpeedControls");
    expect(content).toContain("const [speed, setSpeed]");
    expect(content).toContain('mode === "3d" &&');
    expect(content).toContain("speed={speed}");
  });

  it("should have Earth texture and label generator", () => {
    const content = fs.readFileSync("src/lib/earth-texture.ts", "utf-8");
    expect(content).toContain("createEarthTexture");
    expect(content).toContain("createAsteroidLabel");
    expect(content).toContain("THREE.CanvasTexture");
    expect(content).toContain("THREE.Sprite");
  });

  it("should integrate Earth texture in Viewer3D", () => {
    const content = fs.readFileSync(
      "src/components/viewer/viewer-3d.tsx",
      "utf-8",
    );
    expect(content).toContain("createEarthTexture");
    expect(content).toContain("createAsteroidLabel");
    expect(content).toContain("createAsteroidMesh");
    expect(content).toContain("earthTexture");
    expect(content).toContain("labels");
    expect(content).toContain("labels[i].position");
    expect(content).toContain("asteroidMeshes");
  });

  it("should have createAsteroidMesh function for 3D rocky appearance", () => {
    const content = fs.readFileSync("src/lib/earth-texture.ts", "utf-8");
    expect(content).toContain("createAsteroidMesh");
    expect(content).toContain("IcosahedronGeometry");
    expect(content).toContain("MeshPhongMaterial");
    expect(content).toContain("hazardous");
    expect(content).toContain("sizeM");
  });
});
