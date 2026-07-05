import { describe, it, expect } from "vitest";
import { splitInto7DayChunks, incrementDate } from "../src/lib/neo";

describe("Neo shared library", () => {
  it("should increment dates correctly", () => {
    expect(incrementDate("2026-07-01")).toBe("2026-07-02");
    expect(incrementDate("2026-12-31")).toBe("2027-01-01");
  });

  it("should split long ranges into 7-day chunks", () => {
    const chunks = splitInto7DayChunks({
      start: "2026-07-01",
      end: "2026-07-20",
    });

    expect(chunks).toEqual([
      { start: "2026-07-01", end: "2026-07-07" },
      { start: "2026-07-08", end: "2026-07-14" },
      { start: "2026-07-15", end: "2026-07-20" },
    ]);
  });

  it("should split a short range into one chunk", () => {
    const chunks = splitInto7DayChunks({
      start: "2026-07-01",
      end: "2026-07-05",
    });

    expect(chunks).toEqual([{ start: "2026-07-01", end: "2026-07-05" }]);
  });
});
