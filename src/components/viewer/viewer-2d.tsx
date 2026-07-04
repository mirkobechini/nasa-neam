"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { AsteroidData } from "@/lib/types";

interface Viewer2DProps {
    data: AsteroidData[] | null;
    onReady?: () => void;
    onHover?: (id: string | null) => void;
    onClick?: (id: string) => void;
}

export function Viewer2D({ data, onReady, onHover, onClick }: Viewer2DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(1);
    const scaleRef = useRef(1);
    const positionsRef = useRef<{ id: string; x: number; y: number; size: number }[]>([]);

    const draw = useCallback(() => {
        if (!canvasRef.current || !data) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * 2;
        canvas.height = h * 2;
        ctx.scale(2, 2);

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, w, h);

        const s = scaleRef.current;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(cx, cy) - 40;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(s, s);
        ctx.translate(-cx, -cy);

        // Earth
        ctx.beginPath();
        ctx.arc(cx, cy, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#4fc3f7";
        ctx.fill();
        ctx.shadowColor = "#4fc3f7";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 7px monospace";
        ctx.textAlign = "center";
        ctx.fillText("🌍", cx, cy + 2.5);

        // Orbit rings
        const ringColors = ["#4fc3f7", "#b388ff", "#ff4081", "#69f0ae", "#ffab40"];
        for (let i = 0; i < 5; i++) {
            const r = maxR * (0.2 + i * 0.16);
            ctx.beginPath();
            ctx.ellipse(cx, cy, r * 1.2, r * 0.6, 0.3, 0, Math.PI * 2);
            ctx.strokeStyle = ringColors[i] + "33";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Asteroids
        const items = data.slice(0, 40);
        const pos: { id: string; x: number; y: number; size: number }[] = [];
        items.forEach((a) => {
            const angle = Math.random() * Math.PI * 2;
            const r = maxR * (0.15 + Math.random() * 0.75);
            const x = cx + Math.cos(angle) * r * 1.2;
            const y = cy + Math.sin(angle) * r * 0.6;
            const size = Math.max(3, a.sizeM / 80);
            pos.push({ id: a.id, x, y, size });

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = a.hazardous ? "rgba(255,82,82,0.8)" : "rgba(79,195,247,0.7)";
            ctx.fill();
            ctx.strokeStyle = a.hazardous ? "rgba(255,82,82,1)" : "rgba(79,195,247,0.9)";
            ctx.lineWidth = 1;
            ctx.stroke();

            if (size > 5) {
                ctx.fillStyle = "#9090b0";
                ctx.font = "6px monospace";
                ctx.textAlign = "center";
                ctx.fillText(a.name, x, y - size - 3);
            }
        });
        positionsRef.current = pos;

        ctx.restore();

        // Legend
        ctx.fillStyle = "#9090b0";
        ctx.font = "7px monospace";
        ctx.textAlign = "left";
        ctx.fillText("● Hazardous", 10, h - 20);
        ctx.fillStyle = "rgba(255,82,82,0.8)";
        ctx.fillRect(10, h - 28, 6, 6);
        ctx.fillStyle = "#9090b0";
        ctx.fillText("● Safe", 120, h - 20);
        ctx.fillStyle = "rgba(79,195,247,0.7)";
        ctx.fillRect(120, h - 28, 6, 6);

        onReady?.();
    }, [data, onReady]);

    useEffect(() => {
        draw();
    }, [draw]);

    // Wheel zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(5, Math.max(0.3, scaleRef.current * delta));
            scaleRef.current = newScale;
            setScale(newScale);
        };
        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, []);

    // Hover and click
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const found = positionsRef.current.find(
                (p) => Math.abs(mx - p.x) < p.size + 4 && Math.abs(my - p.y) < p.size + 4
            );
            container.style.cursor = found ? "pointer" : "default";
            onHover?.(found?.id ?? null);
        };
        const handleClick = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const found = positionsRef.current.find(
                (p) => Math.abs(mx - p.x) < p.size + 4 && Math.abs(my - p.y) < p.size + 4
            );
            if (found) onClick?.(found.id);
        };
        container.addEventListener("mousemove", handleMove);
        container.addEventListener("click", handleClick);
        return () => {
            container.removeEventListener("mousemove", handleMove);
            container.removeEventListener("click", handleClick);
        };
    }, [onHover, onClick]);

    return (
        <div ref={containerRef} className="w-full h-[400px] rounded-lg overflow-hidden bg-[#050510] relative">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-2 right-2 text-[0.55rem] font-mono text-muted-foreground bg-black/50 px-1.5 py-0.5 rounded">
                {Math.round(scale * 100)}%
            </div>
        </div>
    );
}
