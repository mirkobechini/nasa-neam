import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Alert System", () => {
  it("should have AlertPanel component", () => {
    const content = fs.readFileSync(
      "src/components/alerts/alert-panel.tsx",
      "utf-8",
    );
    expect(content).toContain("AlertPanel");
    expect(content).toContain("criticals");
    expect(content).toContain("warnings");
    expect(content).toContain("allClear");
  });

  it("should have ThresholdControls component", () => {
    const content = fs.readFileSync(
      "src/components/alerts/threshold-controls.tsx",
      "utf-8",
    );
    expect(content).toContain("ThresholdControls");
    expect(content).toContain("Slider");
    expect(content).toContain("distThreshold");
    expect(content).toContain("sizeThreshold");
  });

  it("should have SoundToggle component and notification hook", () => {
    const content = fs.readFileSync(
      "src/components/alerts/sound-toggle.tsx",
      "utf-8",
    );
    expect(content).toContain("SoundToggle");
    expect(content).toContain("useAlertNotifications");
    expect(content).toContain("playAlertSound");
    expect(content).toContain("toast");
  });

  it("should have alert messages in translations", async () => {
    const it = await import("../messages/it.json");
    const en = await import("../messages/en.json");
    expect(it.alerts).toBeDefined();
    expect(en.alerts).toBeDefined();
    expect(it.alerts.title).toBe("Sistema di Allerta");
    expect(en.alerts.title).toBe("Alert System");
    expect(it.alerts.allClear).toBe("Tutto Tranquillo");
    expect(en.alerts.allClear).toBe("All Clear");
    expect(it.alerts.critical).toBe("Critico");
    expect(en.alerts.critical).toBe("Critical");
  });
});
