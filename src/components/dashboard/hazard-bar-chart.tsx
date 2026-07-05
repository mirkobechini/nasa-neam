"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import type { AsteroidData } from "@/lib/types";

interface HazardBarChartProps {
    data: AsteroidData[] | null;
    loading: boolean;
    error: boolean;
}

const ranges = [
    { label: "< 50m", min: 0, max: 50 },
    { label: "50–150m", min: 50, max: 150 },
    { label: "150–300m", min: 150, max: 300 },
    { label: "300–500m", min: 300, max: 500 },
    { label: "> 500m", min: 500, max: Infinity },
];

export function HazardBarChart({ data, loading, error }: HazardBarChartProps) {
    const t = useTranslations("dashboard");

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Loading chart data...
                            </div>
                            <Skeleton className="h-56 w-full mt-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                        {t("hazardClassification")}
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
                        {t("hazardClassification")}
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

    const chartData = ranges.map((r) => ({
        range: r.label,
        Total: data.filter((a) => a.sizeM >= r.min && a.sizeM < r.max).length,
        Hazardous: data.filter(
            (a) => a.hazardous && a.sizeM >= r.min && a.sizeM < r.max
        ).length,
    }));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">
                    {t("hazardClassification")}
                </CardTitle>
                <span className="text-[0.6rem] font-mono text-muted-foreground tracking-wider">
                    {t("bySizeRange")}
                </span>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
                        >
                            <XAxis
                                dataKey="range"
                                tick={{ fontSize: 11, fill: "#606080" }}
                                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#606080" }}
                                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#12122a",
                                    border: "1px solid rgba(79,195,247,0.2)",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: "11px", color: "#9090b0" }}
                            />
                            <Bar
                                dataKey="Total"
                                fill="rgba(79,195,247,0.3)"
                                stroke="rgba(79,195,247,0.6)"
                                strokeWidth={1}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="Hazardous"
                                fill="rgba(255,82,82,0.5)"
                                stroke="rgba(255,82,82,0.8)"
                                strokeWidth={1}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}