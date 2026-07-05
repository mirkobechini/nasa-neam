"use client";

import { useTranslations } from "next-intl";

interface SpeedControlsProps {
    speed: number;
    onSpeedChange: (speed: number) => void;
}

export function SpeedControls({ speed, onSpeedChange }: SpeedControlsProps) {
    const t = useTranslations("visualization");

    return (
        <div className="flex bg-muted rounded-lg p-0.5">
            <button
                onClick={() => onSpeedChange(0.5)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${speed === 0.5
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                Slow
            </button>
            <button
                onClick={() => onSpeedChange(1)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${speed === 1
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                Normal
            </button>
            <button
                onClick={() => onSpeedChange(2)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${speed === 2
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
            >
                Fast
            </button>
        </div>
    );
}
