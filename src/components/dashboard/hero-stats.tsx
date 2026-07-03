"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import type { StatsData } from "@/lib/types";

interface HeroStatsProps {
    data: StatsData | null;
    loading: boolean;
    error: boolean;
    onRetry: () => void;
}

export function HeroStats({ data, loading, error, onRetry }: HeroStatsProps) {
    const t = useTranslations("hero");

    if (loading) {
        return (
            <div className="flex justify-center gap-10 flex-wrap mt-10">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                        <Skeleton className="w-20 h-8 mx-auto mb-2" />
                        <Skeleton className="w-24 h-4 mx-auto" />
                    </div>
                ))}
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex justify-center mt-10">
                <Card className="p-6 text-center max-w-md">
                    <p className="text-destructive mb-2">
                        Failed to load asteroid telemetry.
                    </p>
                    <button
                        onClick={onRetry}
                        className="text-sm text-primary underline hover:no-underline"
                    >
                        Retry
                    </button>
                </Card>
            </div>
        );
    }

    if (data.total === 0) {
        return (
            <div className="flex justify-center mt-10">
                <Card className="p-6 text-center max-w-md">
                    <p className="text-muted-foreground">
                        Waiting for asteroid data...
                    </p>
                </Card>
            </div>
        );
    }

    const stats = [
        { value: data.total, label: t("tracked") },
        { value: data.hazardous, label: t("hazardous") },
        { value: data.avgVelocity.toLocaleString(), label: t("avgSpeed") },
        {
            value:
                data.minDistance < 1000
                    ? Math.round(data.minDistance).toLocaleString()
                    : Math.round(data.minDistance / 1000).toLocaleString() + "k",
            label: t("closest"),
        },
    ];

    return (
        <div className="flex justify-center gap-10 flex-wrap mt-10">
            {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                    <div className="font-heading text-3xl font-bold text-primary" style={{ color: "var(--primary)" }}>
                        {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 font-light tracking-wider">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}