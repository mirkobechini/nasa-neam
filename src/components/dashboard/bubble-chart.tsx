"use client";

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import type { AsteroidData } from "@/lib/types";

interface BubbleChartProps {
    data: AsteroidData[] | null;
    loading: boolean;
    error: boolean;
}

export function BubbleChart({ data, loading, error }: BubbleChartProps) {
    const t = useTranslations("dashboard");

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                        {t("velocityVsDistance")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-destructive text-sm">
                        Failed to load chart data.
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                        {t("velocityVsDistance")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                        {t("waitingData")}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map((a) => ({
        x: Math.round(a.distKm / 1000),
        y: a.velocityKmh,
        z: Math.max(100, a.sizeM * 3),
        name: a.name,
        hazardous: a.hazardous,
    }));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">
                    {t("velocityVsDistance")}
                </CardTitle>
                <span className="text-[0.6rem] font-mono text-muted-foreground tracking-wider">
                    {t("sizeAsRadius")}
                </span>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                            <XAxis
                                dataKey="x"
                                name="Distance"
                                unit="k km"
                                tick={{ fontSize: 11, fill: "#606080" }}
                                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                                tickLine={false}
                            />
                            <YAxis
                                dataKey="y"
                                name="Velocity"
                                unit="km/h"
                                tick={{ fontSize: 11, fill: "#606080" }}
                                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                                tickLine={false}
                            />
                            <ZAxis dataKey="z" range={[20, 200]} />
                            <Tooltip
                                contentStyle={{
                                    background: "#12122a",
                                    border: "1px solid rgba(79,195,247,0.2)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#e8e8f0",
                                }}
                            />
                            <Scatter data={chartData}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            entry.hazardous
                                                ? "rgba(255,82,82,0.7)"
                                                : "rgba(79,195,247,0.5)"
                                        }
                                        stroke={
                                            entry.hazardous
                                                ? "rgba(255,82,82,0.9)"
                                                : "rgba(79,195,247,0.8)"
                                        }
                                        strokeWidth={1}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}