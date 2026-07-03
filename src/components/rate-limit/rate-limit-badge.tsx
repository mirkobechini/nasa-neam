"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface RateLimitData {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
}

export function RateLimitBadge() {
    const t = useTranslations("rateLimit");
    const [data, setData] = useState<RateLimitData | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchAndUpdate() {
            try {
                const res = await fetch("/api/neo/rate-limit");
                if (!res.ok) throw new Error("API error");
                const json = await res.json();
                if (!cancelled) {
                    setData(json);
                    setError(false);
                }
            } catch {
                if (!cancelled) setError(true);
            }
        }

        fetchAndUpdate();
        const interval = setInterval(fetchAndUpdate, 60000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    if (error || !data) {
        return (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30">
                <span className="text-[0.6rem] text-muted-foreground">API: --</span>
            </div>
        );
    }

    const colorClass =
        data.percentage <= 20
            ? "text-green-400"
            : data.percentage <= 50
                ? "text-yellow-400"
                : "text-destructive";

    const barColor =
        data.percentage <= 20
            ? "bg-green-400"
            : data.percentage <= 50
                ? "bg-yellow-400"
                : "bg-destructive";

    return (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/30 border border-border/30">
            <span className={`text-[0.6rem] font-semibold font-mono ${colorClass}`}>
                {data.remaining}/{data.limit}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${Math.min(data.percentage, 100)}%` }}
                />
            </div>
            <span className="text-[0.55rem] text-muted-foreground font-mono hidden sm:inline">
                {t("thisHour")}
            </span>
        </div>
    );
}