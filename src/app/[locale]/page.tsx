"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { HeroStats } from "@/components/dashboard/hero-stats";
import { BubbleChart } from "@/components/dashboard/bubble-chart";
import { HazardBarChart } from "@/components/dashboard/hazard-bar-chart";
import { useTimeRange } from "@/lib/contexts/TimeRangeContext";
import type { StatsData } from "@/lib/types";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const heroT = useTranslations("hero");
  const { dateMin, dateMax } = useTimeRange();

  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const params = new URLSearchParams();
      params.set("start_date", dateMin);
      params.set("end_date", dateMax);

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
  }, [dateMin, dateMax]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

        <p className="text-muted-foreground max-w-xl mx-auto text-base md:text/lg font-light">
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
