import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Language Switcher", () => {
  it("should have LanguageSwitcher component", () => {
    const content = fs.readFileSync(
      "src/components/layout/language-switcher.tsx",
      "utf-8",
    );
    expect(content).toContain("LanguageSwitcher");
    expect(content).toContain("useLocale");
    expect(content).toContain("useRouter");
    expect(content).toContain('"it"');
    expect(content).toContain('"en"');
  });

  it("should be integrated in navbar", () => {
    const content = fs.readFileSync(
      "src/components/layout/navbar.tsx",
      "utf-8",
    );
    expect(content).toContain("LanguageSwitcher");
    expect(content).toContain("language-switcher");
  });

  it("should have both languages in routing config", async () => {
    const { routing } = await import("../src/i18n/routing");
    expect(routing.locales).toContain("it");
    expect(routing.locales).toContain("en");
    expect(routing.defaultLocale).toBe("it");
  });
});
