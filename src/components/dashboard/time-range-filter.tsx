"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTimeRange } from "@/lib/contexts/TimeRangeContext";
import type { TimeRange } from "@/lib/types";

const ranges: { key: TimeRange; labelKey: string }[] = [
    { key: "3d", labelKey: "timeframe.days3" },
    { key: "7d", labelKey: "timeframe.days7" },
    { key: "custom", labelKey: "timeframe.custom" },
];

export function TimeRangeFilter() {
    const t = useTranslations();
    const { dateMin, dateMax, setDateRange, setPredefinedRange } = useTimeRange();
    const [isCustom, setIsCustom] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Determine current range type
    const now = new Date();
    const endStr = now.toISOString().split("T")[0];
    let currentRange: TimeRange = "7d";

    if (dateMin && dateMax) {
        const minDate = new Date(dateMin);
        const maxDate = new Date(dateMax);
        const daysDiff = Math.round((maxDate.getTime() - minDate.getTime()) / (24 * 60 * 60 * 1000));

        if (daysDiff <= 3) currentRange = "3d";
        else if (daysDiff <= 7) currentRange = "7d";
        else currentRange = "custom";
    }

    const handleRangeClick = (range: TimeRange) => {
        setError(null);
        if (range === "3d") {
            setPredefinedRange("3days");
            setIsCustom(false);
        } else if (range === "7d") {
            setPredefinedRange("7days");
            setIsCustom(false);
        } else if (range === "custom") {
            setIsCustom(true);
        }
    };

    const handleDateChange = (newMin: string | null, newMax: string | null) => {
        const minDate = newMin ? new Date(newMin) : null;
        const maxDate = newMax ? new Date(newMax) : null;

        // Validation
        if (minDate && maxDate) {
            if (minDate >= maxDate) {
                setError("Start date must be before end date");
                return;
            }
            setError(null);
            setDateRange(newMin, newMax);
        } else if (newMin && !newMax) {
            // Only min set, don't update yet
            return;
        } else if (!newMin && newMax) {
            // Only max set, don't update yet
            return;
        }
    };

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-muted rounded-lg p-0.5">
                {ranges.map((r) => (
                    <button
                        key={r.key}
                        onClick={() => handleRangeClick(r.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${(r.key === "custom" ? isCustom : currentRange === r.key)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t(r.labelKey)}
                    </button>
                ))}
            </div>
            {isCustom && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={dateMin || ""}
                        onChange={(e) => handleDateChange(e.target.value, dateMax)}
                        className="bg-muted border border-border rounded-md px-2 py-1 text-xs text-foreground"
                    />
                    <span className="text-xs text-muted-foreground">→</span>
                    <input
                        type="date"
                        value={dateMax || ""}
                        onChange={(e) => handleDateChange(dateMin, e.target.value)}
                        className="bg-muted border border-border rounded-md px-2 py-1 text-xs text-foreground"
                    />
                    {error && (
                        <span className="text-xs text-destructive">{error}</span>
                    )}
                </div>
            )}
        </div>
    );
}