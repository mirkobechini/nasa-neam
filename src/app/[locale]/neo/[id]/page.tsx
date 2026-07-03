"use client";

import { use, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProfileData {
    id: string;
    name: string;
    distKm: number;
    sizeM: number;
    velocityKmh: number;
    hazardous: boolean;
    closeApproach: string | null;
    orbitBody: string;
    rawJson: string | null;
}

export default function AsteroidProfile({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const t = useTranslations("profile");
    const router = useRouter();
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchProfile() {
            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`/api/neo/${id}`);
                if (!res.ok) throw new Error("API error");
                const json = await res.json();
                if (!cancelled) {
                    setData(json.data || json);
                }
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchProfile();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="container max-w-3xl mx-auto px-4 py-12">
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container max-w-3xl mx-auto px-4 py-12 text-center">
                <p className="text-destructive mb-4">
                    Failed to load asteroid details.
                </p>
                <button
                    onClick={() => router.refresh()}
                    className="text-sm text-primary underline hover:no-underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    const distKm =
        data.distKm < 1000
            ? data.distKm + " km"
            : (data.distKm / 1000).toFixed(2) + "k km";

    const approachDate = data.closeApproach
        ? new Date(data.closeApproach).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Unknown";

    return (
        <div className="container max-w-3xl mx-auto px-4 py-12">
            <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
            >
                ← Back to Dashboard
            </Link>

            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center text-3xl shrink-0">
                    ☄️
                </div>
                <div>
                    <h1 className="font-heading text-2xl font-bold">{data.name}</h1>
                    <Badge
                        variant={data.hazardous ? "destructive" : "secondary"}
                        className="mt-1"
                    >
                        {data.hazardous ? "☠ " + t("hazardous") : "✅ " + t("notHazardous")}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-semibold">
                            {t("minDistance")}
                        </p>
                        <p
                            className={`font-heading text-xl mt-1 ${data.hazardous ? "text-destructive" : ""
                                }`}
                        >
                            {distKm}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-semibold">
                            {t("estimatedSize")}
                        </p>
                        <p className="font-heading text-xl mt-1">
                            {data.sizeM.toFixed(1)} m
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-semibold">
                            {t("velocity")}
                        </p>
                        <p className="font-heading text-xl mt-1">
                            {data.velocityKmh.toLocaleString()} km/h
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-semibold">
                            {t("closeApproach")}
                        </p>
                        <p className="font-heading text-base mt-1">{approachDate}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground font-semibold">
                        {t("orbitingBody")}
                    </p>
                    <p className="font-heading text-base mt-1">{data.orbitBody}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {t("trajectoryHint")}
                        {data.hazardous
                            ? " ⚠ " + t("needsMonitoring")
                            : " ✅ " + t("noRisk")}
                    </p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.6rem] font-semibold bg-primary/10 text-primary border border-primary/20">
                            NASA NeoWs
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.6rem] font-semibold bg-accent/10 text-accent border border-accent/20">
                            ID: {data.id}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}