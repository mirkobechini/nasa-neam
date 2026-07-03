"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ModalData {
    id: string;
    name: string;
    distKm: number;
    sizeM: number;
    velocityKmh: number;
    hazardous: boolean;
    closeApproach: string | null;
    orbitBody: string;
}

interface AsteroidModalProps {
    asteroidId: string | null;
    onClose: () => void;
}

export function AsteroidModal({ asteroidId, onClose }: AsteroidModalProps) {
    const t = useTranslations("profile");
    const [data, setData] = useState<ModalData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!asteroidId) return;
        setLoading(true);
        fetch(`/api/neo/${asteroidId}`)
            .then((r) => r.json())
            .then((json) => {
                setData(json.data || json);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [asteroidId]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (asteroidId) {
            document.addEventListener("keydown", handleKey);
            return () => document.removeEventListener("keydown", handleKey);
        }
    }, [asteroidId, onClose]);

    if (!asteroidId) return null;

    const distKm = data
        ? data.distKm < 1000
            ? data.distKm + " km"
            : (data.distKm / 1000).toFixed(2) + "k km"
        : "";

    const approachDate = data?.closeApproach
        ? new Date(data.closeApproach).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Unknown";

    return (
        <div
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-[var(--bg-card)] border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-lg"
                >
                    ✕
                </button>

                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-16" />
                            <Skeleton className="h-16" />
                            <Skeleton className="h-16" />
                            <Skeleton className="h-16" />
                        </div>
                    </div>
                )}

                {!loading && !data && (
                    <p className="text-muted-foreground text-sm text-center py-8">Failed to load asteroid details.</p>
                )}

                {!loading && data && (
                    <>
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-border flex items-center justify-center text-2xl shrink-0">
                                ☄️
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-base">{data.name}</h3>
                                <Badge variant={data.hazardous ? "destructive" : "secondary"} className="mt-0.5 text-[0.6rem]">
                                    {data.hazardous ? "☠ " + t("hazardous") : "✅ " + t("notHazardous")}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-[0.55rem] uppercase tracking-widest text-muted-foreground font-semibold">{t("minDistance")}</p>
                                <p className={`font-heading text-sm mt-0.5 ${data.hazardous ? "text-destructive" : ""}`}>{distKm}</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-[0.55rem] uppercase tracking-widest text-muted-foreground font-semibold">{t("estimatedSize")}</p>
                                <p className="font-heading text-sm mt-0.5">{data.sizeM.toFixed(1)} m</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-[0.55rem] uppercase tracking-widest text-muted-foreground font-semibold">{t("velocity")}</p>
                                <p className="font-heading text-sm mt-0.5">{data.velocityKmh.toLocaleString()} km/h</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-[0.55rem] uppercase tracking-widest text-muted-foreground font-semibold">{t("closeApproach")}</p>
                                <p className="font-heading text-xs mt-0.5">{approachDate}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}