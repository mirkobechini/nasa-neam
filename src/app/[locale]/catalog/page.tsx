"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AsteroidList } from "@/components/catalog/asteroid-list";
import type { AsteroidData } from "@/lib/types";

export default function CatalogPage() {
    const t = useTranslations("asteroids");
    const router = useRouter();

    const [data, setData] = useState<AsteroidData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/neo/feed");
            if (!res.ok) throw new Error("API error");
            const json = await res.json();
            setData(json.data || []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelect = useCallback(
        (id: string) => {
            router.push(`/neo/${id}`);
        },
        [router]
    );

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <h1 className="font-heading text-2xl font-bold mb-8">{t("title")}</h1>

            <AsteroidList
                data={data}
                loading={loading}
                error={error}
                onSelectAsteroid={handleSelect}
                onRetry={fetchData}
            />
        </div>
    );
}