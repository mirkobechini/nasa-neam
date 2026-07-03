"use client";

import { useTranslations } from "next-intl";
import type { TimeRange } from "@/lib/types";

interface TimeRangeFilterProps {
    value: TimeRange;
    onChange: (range: TimeRange) => void;
    customStart?: string;
    customEnd?: string;
    onCustomChange?: (start: string, end: string) => void;
}

const ranges: { key: TimeRange; labelKey: string }[] = [
    { key: "3d", labelKey: "timeframe.days3" },
    { key: "7d", labelKey: "timeframe.days7" },
    { key: "custom", labelKey: "timeframe.custom" },
];

export function TimeRangeFilter({
    value,
    onChange,
    customStart,
    customEnd,
    onCustomChange,
}: TimeRangeFilterProps) {
    const t = useTranslations();

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-muted rounded-lg p-0.5">
                {ranges.map((r) => (
                    <button
                        key={r.key}
                        onClick={() => onChange(r.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${value === r.key
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t(r.labelKey)}
                    </button>
                ))}
            </div>
            {value === "custom" && onCustomChange && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={customStart || ""}
                        onChange={(e) =>
                            onCustomChange(e.target.value, customEnd || "")
                        }
                        className="bg-muted border border-border rounded-md px-2 py-1 text-xs text-foreground"
                    />
                    <span className="text-xs text-muted-foreground">→</span>
                    <input
                        type="date"
                        value={customEnd || ""}
                        onChange={(e) =>
                            onCustomChange(customStart || "", e.target.value)
                        }
                        className="bg-muted border border-border rounded-md px-2 py-1 text-xs text-foreground"
                    />
                </div>
            )}
        </div>
    );
}