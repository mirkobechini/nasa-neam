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
    const panRef = useRef({ x: 0, y: 0 });
    const dragRef = useRef({ startX: 0, startY: 0, isDragging: false, moved: false });
    const [pan, setPan] = useState({ x: 0, y: 0 });

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
        const p = panRef.current;
        const cx = w / 2 + p.x;
        const cy = h / 2 + p.y;
        const maxR = Math.min(w, h) / 2 - 40;

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

            if (size > 4) {
                ctx.fillStyle = "#c0c0d0";
                ctx.font = "8px monospace";
                ctx.textAlign = "center";
                ctx.fillText(a.name, x, y - size - 4);
            }
        });
        positionsRef.current = pos;
        ctx.restore();

        // Legend
        ctx.save();
        ctx.shadowColor = "transparent";
        ctx.fillStyle = "#c0c0d0";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "left";
        ctx.fillText("● Hazardous", 14, h - 22);
        ctx.fillStyle = "rgba(255,82,82,0.8)";
        ctx.fillRect(14, h - 30, 8, 8);
        ctx.fillStyle = "#c0c0d0";
        ctx.font = "bold 11px monospace";
        ctx.fillText("● Safe", 150, h - 22);
        ctx.fillStyle = "rgba(79,195,247,0.7)";
        ctx.fillRect(150, h - 30, 8, 8);
        ctx.fillStyle = "#606080";
        ctx.font = "9px monospace";
        ctx.fillText("Scroll to zoom · Drag to pan", 14, h - 6);
        ctx.restore();
        onReady?.();
    }, [data, onReady]);

    useEffect(() => { draw(); }, [draw]);

    // Wheel zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            scaleRef.current = Math.min(5, Math.max(0.3, scaleRef.current * delta));
            setScale(scaleRef.current);
            draw();
        };
        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, [draw]);

    // Pan via drag + hover/click
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleDown = (e: MouseEvent) => {
            dragRef.current = { startX: e.clientX, startY: e.clientY, isDragging: true, moved: false };
        };

        const handleMove = (e: MouseEvent) => {
            const drag = dragRef.current;
            if (drag.isDragging) {
                const dx = e.clientX - drag.startX;
                const dy = e.clientY - drag.startY;
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    drag.moved = true;
                    panRef.current.x += dx;
                    panRef.current.y += dy;
                    drag.startX = e.clientX;
                    drag.startY = e.clientY;
                    setPan({ x: panRef.current.x, y: panRef.current.y });
                    draw();
                }
                return;
            }
            // Hover
            const rect = container.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const found = positionsRef.current.find((p) => Math.abs(mx - p.x) < p.size + 4 && Math.abs(my - p.y) < p.size + 4);
            container.style.cursor = found ? "pointer" : "grab";
            onHover?.(found?.id ?? null);
        };

        const handleUp = (e: MouseEvent) => {
            const drag = dragRef.current;
            if (!drag.moved) {
                // Click (not a drag)
                const rect = container.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                const found = positionsRef.current.find((p) => Math.abs(mx - p.x) < p.size + 4 && Math.abs(my - p.y) < p.size + 4);
                if (found) onClick?.(found.id);
            }
            dragRef.current = { startX: 0, startY: 0, isDragging: false, moved: false };
            container.style.cursor = "grab";
        };

        container.addEventListener("mousedown", handleDown);
        container.addEventListener("mousemove", handleMove);
        container.addEventListener("mouseup", handleUp);
        container.addEventListener("mouseleave", () => { dragRef.current.isDragging = false; container.style.cursor = "grab"; });
        return () => {
            container.removeEventListener("mousedown", handleDown);
            container.removeEventListener("mousemove", handleMove);
            container.removeEventListener("mouseup", handleUp);
        };
    }, [onHover, onClick, draw]);

    return (
        <div ref={containerRef} className="w-full h-[400px] rounded-lg overflow-hidden bg-[#050510] relative cursor-grab">
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-2 right-2 text-[0.55rem] font-mono text-muted-foreground bg-black/50 px-1.5 py-0.5 rounded">
                {Math.round(scale * 100)}%
            </div>
        </div>
    );
}
