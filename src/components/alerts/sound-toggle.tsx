"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { AsteroidData } from "@/lib/types";

let audioCtx: AudioContext | null = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
}

function playAlertSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch {
        // silent fail
    }
}

function playClickSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    } catch {
        // silent fail
    }
}

interface SoundToggleProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
    const t = useTranslations("alerts");

    const handleToggle = (v: boolean) => {
        onToggle(v);
        if (v) playClickSound();
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">🔊</span>
            <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                aria-label="Toggle sounds"
            />
        </div>
    );
}

export function useAlertNotifications(
    data: AsteroidData[] | null,
    distThreshold: number,
    sizeThreshold: number,
    soundEnabled: boolean,
    loading: boolean
) {
    const prevCriticals = useRef<string[]>([]);

    useEffect(() => {
        if (loading || !data) return;

        const matched = data.filter(
            (a) => a.distKm < distThreshold && a.sizeM > sizeThreshold
        );
        const criticals = matched.filter((a) => a.hazardous);

        const currentIds = criticals.map((a) => a.id);
        const prevIds = prevCriticals.current;
        const newCriticals = criticals.filter((a) => !prevIds.includes(a.id));

        if (newCriticals.length > 0) {
            const first = newCriticals[0];
            toast.error(`🚨 Critical: ${first.name} — hazardous asteroid approaching!`);

            if (soundEnabled) {
                setTimeout(playAlertSound, 200);
            }
        } else if (matched.length > 0 && prevIds.length === 0 && soundEnabled) {
            const first = matched[0];
            toast.warning(`⚠️ ${first.name} within alert thresholds`);
        }

        prevCriticals.current = currentIds;
    }, [data, distThreshold, sizeThreshold, soundEnabled, loading]);
}