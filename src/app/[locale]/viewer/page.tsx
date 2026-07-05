"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Viewer3D } from "@/components/viewer/viewer-3d";
import { Viewer2D } from "@/components/viewer/viewer-2d";
import { SpeedControls } from "@/components/viewer/speed-controls";
import { AsteroidModal } from "@/components/viewer/asteroid-modal";
import { useTimeRange } from "@/lib/contexts/TimeRangeContext";
import type { AsteroidData } from "@/lib/types";

export default function ViewerPage() {
  const t = useTranslations("visualization");
  const { dateMin, dateMax } = useTimeRange();
  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const [speed, setSpeed] = useState<number>(1);
  const [data, setData] = useState<AsteroidData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      params.set("start_date", dateMin);
      params.set("end_date", dateMax);
      const res = await fetch(`/api/neo/feed?${params.toString()}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json.data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [dateMin, dateMax]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handle3dReady = useCallback(() => {
    setWebglReady(true);
    setLoading(false);
  }, []);

  const handle3dError = useCallback(() => {
    setWebglFailed(true);
    setLoading(false);
  }, []);

  const hoveredAsteroid = data?.find((a) => a.id === hoveredId);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-muted rounded-lg p-0.5">
            <button onClick={() => setMode("3d")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "3d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >{t("switch3d")}</button>
            <button onClick={() => setMode("2d")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "2d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >{t("switch2d")}</button>
          </div>
          {mode === "3d" && (
            <SpeedControls speed={speed} onSpeedChange={setSpeed} />
          )}
        </div>
      </div>

      {loading && !webglReady && !webglFailed && (
        <div className="w-full h-[400px] rounded-lg bg-[#0d0d2b] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-2xl mb-2">⚙</div>
            <p className="text-xs text-muted-foreground">{t("initializing")}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full h-[400px] rounded-lg bg-[#0d0d2b] flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load asteroid data.</p>
            <button onClick={fetchData} className="text-xs text-primary underline hover:no-underline">Retry</button>
          </div>
        </div>
      )}

      {webglFailed && (
        <div className="w-full h-[400px] rounded-lg bg-[#0d0d2b] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">{t("unavailable")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("unavailableHint")}</p>
          </div>
        </div>
      )}

      <div className={loading && !webglReady ? "hidden" : ""}>
        {mode === "3d" && data && !webglFailed && (
          <Viewer3D data={data} onReady={handle3dReady} onError={handle3dError} onHover={setHoveredId} onClick={setSelectedId} speed={speed} />
        )}
        {mode === "2d" && data && (
          <Viewer2D data={data} onReady={() => setLoading(false)} onHover={setHoveredId} onClick={setSelectedId} />
        )}
      </div>

      {hoveredAsteroid && (
        <div className="mt-2 text-xs text-center text-muted-foreground">
          <span className="font-semibold text-foreground">{hoveredAsteroid.name}</span>
          {" — "}
          {hoveredAsteroid.sizeM.toFixed(0)}m · {hoveredAsteroid.velocityKmh.toLocaleString()} km/h · {(hoveredAsteroid.distKm / 1000).toFixed(1)}k km
          <span className="ml-1 text-[0.55rem]">(click for details)</span>
        </div>
      )}

      <AsteroidModal asteroidId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
