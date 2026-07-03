"use client";

import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";

interface ThresholdControlsProps {
    distThreshold: number;
    sizeThreshold: number;
    onDistChange: (value: number) => void;
    onSizeChange: (value: number) => void;
}

export function ThresholdControls({
    distThreshold,
    sizeThreshold,
    onDistChange,
    onSizeChange,
}: ThresholdControlsProps) {
    const t = useTranslations("alerts");

    return (
        <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-xs font-semibold flex items-center gap-1.5">
                <span className="text-accent">⚙</span> {t("customThresholds")}
            </h4>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold">
                        {t("maxDistance")}
                    </label>
                    <span className="text-[0.65rem] font-mono text-primary">
                        {distThreshold.toLocaleString()} km
                    </span>
                </div>
                <Slider
                    value={[distThreshold]}
                    onValueChange={([v]) => onDistChange(v)}
                    min={50000}
                    max={2000000}
                    step={10000}
                    className="w-full"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-semibold">
                        {t("minSize")}
                    </label>
                    <span className="text-[0.65rem] font-mono text-primary">
                        {sizeThreshold} m
                    </span>
                </div>
                <Slider
                    value={[sizeThreshold]}
                    onValueChange={([v]) => onSizeChange(v)}
                    min={50}
                    max={1000}
                    step={10}
                    className="w-full"
                />
            </div>
        </div>
    );
}