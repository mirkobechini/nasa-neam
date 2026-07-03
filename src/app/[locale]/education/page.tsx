"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { EducationGrid } from "@/components/education/education-grid";

export default function EducationPage() {
    const t = useTranslations("education");

    const handleOpenResource = useCallback((url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    }, []);

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{t("subtitle")}</p>
            </div>

            <EducationGrid
                loading={false}
                onOpenResource={handleOpenResource}
            />
        </div>
    );
}