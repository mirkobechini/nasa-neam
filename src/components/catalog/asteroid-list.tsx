"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AsteroidData } from "@/lib/types";

interface AsteroidListProps {
    data: AsteroidData[] | null;
    loading: boolean;
    error: boolean;
    onSelectAsteroid: (id: string) => void;
    onRetry: () => void;
}

export function AsteroidList({
    data,
    loading,
    error,
    onSelectAsteroid,
    onRetry,
}: AsteroidListProps) {
    const t = useTranslations("asteroids");

    const [sortBy, setSortBy] = useState("distance");
    const [hazardFilter, setHazardFilter] = useState("all");

    const filtered = useMemo(() => {
        if (!data) return [];

        let items = [...data];

        // Hazard filter
        if (hazardFilter === "hazardous") {
            items = items.filter((a) => a.hazardous);
        } else if (hazardFilter === "safe") {
            items = items.filter((a) => !a.hazardous);
        }

        // Sort
        const desc = sortBy.startsWith("-");
        const key = desc ? sortBy.slice(1) : sortBy;

        items.sort((a, b) => {
            let va: string | number = a[key as keyof AsteroidData] ?? 0;
            let vb: string | number = b[key as keyof AsteroidData] ?? 0;
            if (typeof va === "string") va = va.toLowerCase();
            if (typeof vb === "string") vb = vb.toLowerCase();
            return desc ? (va < vb ? 1 : -1) : va < vb ? -1 : 1;
        });

        return items;
    }, [data, sortBy, hazardFilter]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-destructive mb-2">{t("loadError")}</p>
                    <button
                        onClick={onRetry}
                        className="text-sm text-primary underline hover:no-underline"
                    >
                        Retry
                    </button>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">{t("noResults")}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {t("noResultsHint")}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="text-base font-semibold">
                        {t("title")}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                        {filtered.length} {t("objects")}
                    </span>
                </div>
                <div className="flex gap-2 mt-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="distance">Distance ↑</SelectItem>
                            <SelectItem value="-distance">Distance ↓</SelectItem>
                            <SelectItem value="sizeM">Size ↑</SelectItem>
                            <SelectItem value="-sizeM">Size ↓</SelectItem>
                            <SelectItem value="velocityKmh">Velocity ↑</SelectItem>
                            <SelectItem value="-velocityKmh">Velocity ↓</SelectItem>
                            <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={hazardFilter} onValueChange={setHazardFilter}>
                        <SelectTrigger className="w-[150px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t("allObjects")}</SelectItem>
                            <SelectItem value="hazardous">{t("hazardousOnly")}</SelectItem>
                            <SelectItem value="safe">{t("safeOnly")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {filtered.map((a) => {
                        const isClose = a.distKm < 200000;
                        const isModerate = a.distKm < 500000;
                        const distClass = isClose
                            ? "close"
                            : isModerate
                                ? "moderate"
                                : "far";
                        const distLabel = isClose ? "CLOSE" : isModerate ? "WATCH" : "SAFE";
                        const distVal =
                            a.distKm < 1000
                                ? a.distKm + " km"
                                : (a.distKm / 1000).toFixed(1) + "k km";

                        return (
                            <button
                                key={a.id}
                                onClick={() => onSelectAsteroid(a.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 border border-border/40 hover:border-border transition-all text-left"
                            >
                                <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${a.hazardous
                                            ? "bg-destructive shadow-[0_0_8px_var(--destructive)]"
                                            : "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold flex items-center gap-2">
                                        {a.name}
                                        {a.hazardous && (
                                            <span className="text-[0.55rem] font-bold text-destructive tracking-wider">
                                                ☠ HAZARD
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex gap-3 mt-0.5">
                                        <span>{a.sizeM.toFixed(1)} m</span>
                                        <span>{a.velocityKmh.toLocaleString()} km/h</span>
                                        <span>{distVal}</span>
                                    </div>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-heading text-[0.6rem] font-bold shrink-0 border-2 ${distClass === "close"
                                            ? "border-orange-400 text-orange-400 bg-orange-400/10"
                                            : distClass === "moderate"
                                                ? "border-primary text-primary bg-primary/10"
                                                : "border-green-400 text-green-400 bg-green-400/10"
                                        }`}
                                >
                                    {distLabel}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}