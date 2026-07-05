import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  splitInto7DayChunks,
  incrementDate,
  ensureRangeCached,
} from "../src/lib/neo";
import { prisma } from "../src/lib/prisma";

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    asteroid: {
      count: vi.fn(),
      upsert: vi.fn(),
    },
    apiCallLog: {
      create: vi.fn(),
    },
  },
}));

describe("Neo shared library", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("should fetch only missing chunks when cache is partial", async () => {
    const countMock = prisma.asteroid.count as unknown as ReturnType<
      typeof vi.fn
    >;
    (
      prisma.asteroid.upsert as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(true);

    countMock.mockImplementation(({ where }) => {
      const gte = (where.closeApproach.gte as Date).toISOString().split("T")[0];
      if (gte === "2026-07-01" || gte === "2026-07-08") {
        return Promise.resolve(0);
      }
      return Promise.resolve(1);
    });

    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        near_earth_objects: {
          "2026-07-01": [
            {
              id: "123",
              name: "Test",
              is_potentially_hazardous_asteroid: false,
              estimated_diameter: { meters: { estimated_diameter_max: 10 } },
              close_approach_data: [
                {
                  miss_distance: { kilometers: "10000" },
                  relative_velocity: { kilometers_per_hour: "5000" },
                  orbiting_body: "Earth",
                  close_approach_date: "2026-07-01",
                },
              ],
            },
          ],
        },
      }),
    }));

    global.fetch = fetchMock as any;

    const result = await ensureRangeCached({
      start: "2026-07-01",
      end: "2026-07-20",
    });

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
