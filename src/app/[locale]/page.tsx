"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { HeroStats } from "@/components/dashboard/hero-stats";
import { BubbleChart } from "@/components/dashboard/bubble-chart";
import { HazardBarChart } from "@/components/dashboard/hazard-bar-chart";
import { TimeRangeFilter } from "@/components/dashboard/time-range-filter";
import type { StatsData, TimeRange } from "@/lib/types";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const heroT = useTranslations("hero");

  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const params = new URLSearchParams();

      if (timeRange === "custom" && customStart && customEnd) {
        params.set("start_date", customStart);
        params.set("end_date", customEnd);
      } else {
        const now = new Date();
        const endDate = now.toISOString().split("T")[0];
        let startDate: string;

        if (timeRange === "3d") {
          const d = new Date();
          d.setDate(d.getDate() - 3);
          startDate = d.toISOString().split("T")[0];
        } else {
          // Default 7d
          const d = new Date();
          d.setDate(d.getDate() - 7);
          startDate = d.toISOString().split("T")[0];
        }

        params.set("start_date", startDate);
        params.set("end_date", endDate);
      }

      const url = `/api/neo/stats?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [timeRange, customStart, customEnd]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // Reset custom dates when switching away from custom
    if (range !== "custom") {
      setCustomStart("");
      setCustomEnd("");
    }
  };

  const asteroidData = data?.data ?? null;

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-border rounded-full px-4 py-1.5 text-xs text-primary font-semibold tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
          {heroT("badge")}
        </div>

        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--chart-3)] bg-clip-text text-transparent">
          {heroT("title")}
        </h1>

        <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg font-light">
          {heroT("subtitle")}
        </p>

        <HeroStats
          data={data}
          loading={loading}
          error={error}
          onRetry={fetchData}
        />
      </section>

      {/* Dashboard Section */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="font-heading text-xl font-bold flex items-center gap-2">
              <span className="text-primary">◆</span> {t("title")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("subtitle")}
            </p>
          </div>
          <TimeRangeFilter
            value={timeRange}
            onChange={handleTimeRangeChange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomChange={(start, end) => {
              setCustomStart(start);
              setCustomEnd(end);
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BubbleChart
            data={asteroidData}
            loading={loading}
            error={error}
          />
          <HazardBarChart
            data={asteroidData}
            loading={loading}
            error={error}
          />
        </div>
      </section>
    </div>
  );
}
