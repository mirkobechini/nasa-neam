import { describe, it, expect } from "vitest";

describe("i18n configuration", () => {
  it("should have valid IT translations file", async () => {
    const messages = await import("../messages/it.json");
    expect(messages).toBeDefined();
    expect(messages.common).toBeDefined();
    expect(messages.common.appName).toBe("N.E.A.M.");
    expect(messages.nav).toBeDefined();
    expect(messages.hero).toBeDefined();
    expect(messages.dashboard).toBeDefined();
    expect(messages.asteroids).toBeDefined();
    expect(messages.alerts).toBeDefined();
    expect(messages.visualization).toBeDefined();
    expect(messages.education).toBeDefined();
    expect(messages.profile).toBeDefined();
    expect(messages.rateLimit).toBeDefined();
    expect(messages.timeframe).toBeDefined();
  });

  it("should have valid EN translations file", async () => {
    const messages = await import("../messages/en.json");
    expect(messages).toBeDefined();
    expect(messages.common).toBeDefined();
    expect(messages.common.appName).toBe("N.E.A.M.");
    expect(messages.nav).toBeDefined();
    expect(messages.hero).toBeDefined();
    expect(messages.dashboard).toBeDefined();
    expect(messages.asteroids).toBeDefined();
    expect(messages.alerts).toBeDefined();
    expect(messages.visualization).toBeDefined();
    expect(messages.education).toBeDefined();
    expect(messages.profile).toBeDefined();
    expect(messages.rateLimit).toBeDefined();
    expect(messages.timeframe).toBeDefined();
  });

  it("should have same keys in IT and EN translations", () => {
    const itKeys = Object.keys(require("../messages/it.json"));
    const enKeys = Object.keys(require("../messages/en.json"));
    expect(itKeys.sort()).toEqual(enKeys.sort());
  });

  it("should have routing configuration", async () => {
    const { routing } = await import("../src/i18n/routing");
    expect(routing.locales).toContain("it");
    expect(routing.locales).toContain("en");
    expect(routing.defaultLocale).toBe("it");
  });
});
