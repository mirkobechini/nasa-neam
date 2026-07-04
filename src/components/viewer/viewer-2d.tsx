"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
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
    const [scale, setScale] = useState(2.2);
    const scaleRef = useRef(2.2);
    const positionsRef = useRef<{ id: string; x: number; y: number; size: number }[]>([]);
    const panRef = useRef({ x: 0, y: 0 });
    const dragRef = useRef({ startX: 0, startY: 0, isDragging: false, moved: false });

    const fixedPositions = useMemo(() => {
        if (!data) return [];
        const items = data.slice(0, 40);
        const cx = 999, cy = 999, maxR = 400;
        return items.map((a) => {
            const angle = Math.random() * Math.PI * 2;
            const r = maxR * (0.15 + Math.random() * 0.75);
            return {
                id: a.id, name: a.name, hazardous: a.hazardous,
                x: cx + Math.cos(angle) * r * 1.2,
                y: cy + Math.sin(angle) * r * 0.6,
                size: Math.max(3, a.sizeM / 80),
            };
        });
    }, [data]);

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
        const cx = w / 2;
        const cy = h / 2;

        ctx.save();
        ctx.translate(cx + p.x, cy + p.y);
        ctx.scale(s, s);
        ctx.translate(-cx, -cy);

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#4fc3f7";
        ctx.fill();
        ctx.shadowColor = "#4fc3f7";
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("🌍", w / 2, h / 2 + 3);

        const pos: { id: string; x: number; y: number; size: number }[] = [];
        fixedPositions.forEach((a) => {
            const x = a.x - (999 - w / 2);
            const y = a.y - (999 - h / 2);
            pos.push({ id: a.id, x, y, size: a.size });
            ctx.beginPath();
            ctx.arc(x, y, a.size, 0, Math.PI * 2);
            ctx.fillStyle = a.hazardous ? "rgba(255,82,82,0.8)" : "rgba(79,195,247,0.7)";
            ctx.fill();
            ctx.strokeStyle = a.hazardous ? "rgba(255,82,82,1)" : "rgba(79,195,247,0.9)";
            ctx.lineWidth = 1;
            ctx.stroke();
            if (a.size > 4) {
                ctx.fillStyle = "#c0c0d0";
                ctx.font = "8px monospace";
                ctx.textAlign = "center";
                ctx.fillText(a.name, x, y - a.size - 4);
            }
        });
        positionsRef.current = pos;
        ctx.restore();

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
    }, [data, fixedPositions, onReady]);

    useEffect(() => { draw(); }, [draw]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const hWheel = (e: WheelEvent) => {
            e.preventDefault();
            scaleRef.current = Math.min(3, Math.max(0.3, scaleRef.current * (e.deltaY > 0 ? 0.9 : 1.1)));
            setScale(scaleRef.current);
            draw();
        };
        el.addEventListener("wheel", hWheel, { passive: false });
        return () => el.removeEventListener("wheel", hWheel);
    }, [draw]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const hDown = (e: MouseEvent) => {
            dragRef.current = { startX: e.clientX, startY: e.clientY, isDragging: true, moved: false };
        };
        const hMove = (e: MouseEvent) => {
            const d = dragRef.current;
            if (d.isDragging) {
                const dx = e.clientX - d.startX;
                const dy = e.clientY - d.startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    d.moved = true;
                    panRef.current.x += dx;
                    panRef.current.y += dy;
                    d.startX = e.clientX;
                    d.startY = e.clientY;
                    draw();
                }
                return;
            }
            const rect = el.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            // Convert mouse coords to world coords (inverse of translate + scale)
            const s = scaleRef.current;
            const p = panRef.current;
            const cxCanvas = el.clientWidth / 2;
            const cyCanvas = el.clientHeight / 2;
            const worldX = (mx - (cxCanvas + p.x) + cxCanvas * s) / s;
            const worldY = (my - (cyCanvas + p.y) + cyCanvas * s) / s;
            const found = positionsRef.current.find((pA) => Math.abs(worldX - pA.x) < pA.size + 4 && Math.abs(worldY - pA.y) < pA.size + 4);
            el.style.cursor = found ? "pointer" : "grab";
            onHover?.(found?.id ?? null);
        };
        const hUp = (e: MouseEvent) => {
            const d = dragRef.current;
            if (!d.moved) {
                const rect = el.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                const s = scaleRef.current;
                const p = panRef.current;
                const cxCanvas = el.clientWidth / 2;
                const cyCanvas = el.clientHeight / 2;
                const worldX = (mx - (cxCanvas + p.x) + cxCanvas * s) / s;
                const worldY = (my - (cyCanvas + p.y) + cyCanvas * s) / s;
                const found = positionsRef.current.find((pA) => Math.abs(worldX - pA.x) < pA.size + 4 && Math.abs(worldY - pA.y) < pA.size + 4);
                if (found) onClick?.(found.id);
            }
            dragRef.current = { startX: 0, startY: 0, isDragging: false, moved: false };
            el.style.cursor = "grab";
        };
        el.addEventListener("mousedown", hDown);
        el.addEventListener("mousemove", hMove);
        el.addEventListener("mouseup", hUp);
        el.addEventListener("mouseleave", () => { dragRef.current.isDragging = false; el.style.cursor = "grab"; });
        return () => {
            el.removeEventListener("mousedown", hDown);
            el.removeEventListener("mousemove", hMove);
            el.removeEventListener("mouseup", hUp);
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
