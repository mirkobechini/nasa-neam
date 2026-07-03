"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AsteroidData } from "@/lib/types";

interface AlertPanelProps {
    data: AsteroidData[] | null;
    loading: boolean;
    error: boolean;
    distThreshold: number;
    sizeThreshold: number;
    onRetry: () => void;
}

export function AlertPanel({
    data,
    loading,
    error,
    distThreshold,
    sizeThreshold,
    onRetry,
}: AlertPanelProps) {
    const t = useTranslations("alerts");

    const { criticals, warnings } = useMemo(() => {
        if (!data)
            return { criticals: [] as AsteroidData[], warnings: [] as AsteroidData[] };

        const matched = data.filter(
            (a) => a.distKm < distThreshold && a.sizeM > sizeThreshold
        );

        return {
            criticals: matched.filter((a) => a.hazardous),
            warnings: matched.filter((a) => !a.hazardous),
        };
    }, [data, distThreshold, sizeThreshold]);

    const totalAlerts = criticals.length + warnings.length;

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-destructive mb-2">Failed to load alert data.</p>
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

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                        {t("title")}
                    </CardTitle>
                    {totalAlerts > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {totalAlerts} {t("active")}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {totalAlerts === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-green-400 text-lg mb-1">✅ {t("allClear")}</p>
                        <p className="text-xs text-muted-foreground">{t("allClearHint")}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {criticals.slice(0, 4).map((a) => (
                            <div
                                key={a.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border-l-[3px] border-destructive"
                            >
                                <span className="text-lg">🚨</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">
                                        {a.name} — {t("critical")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {a.sizeM.toFixed(0)}m at {(a.distKm / 1000).toFixed(1)}k km
                                    </p>
                                </div>
                                <span className="text-[0.6rem] font-mono text-muted-foreground shrink-0">
                                    {t("now")}
                                </span>
                            </div>
                        ))}
                        {warnings.slice(0, 3).map((a) => (
                            <div
                                key={a.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-orange-400/5 border-l-[3px] border-orange-400"
                            >
                                <span className="text-lg">⚠️</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">
                                        {a.name} — {t("caution")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {a.sizeM.toFixed(0)}m object ·{" "}
                                        {(a.distKm / 1000).toFixed(1)}k km distance
                                    </p>
                                </div>
                                <span className="text-[0.6rem] font-mono text-muted-foreground shrink-0">
                                    {t("now")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}