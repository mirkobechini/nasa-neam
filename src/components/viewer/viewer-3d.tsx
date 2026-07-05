"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createEarthTexture, createAsteroidLabel } from "@/lib/earth-texture";
import type { AsteroidData } from "@/lib/types";

interface Viewer3DProps {
    data: AsteroidData[] | null;
    onReady?: () => void;
    onError?: () => void;
    onHover?: (id: string | null) => void;
    onClick?: (id: string) => void;
    speed?: number;
}

export function Viewer3D({ data, onReady, onError, onHover, onClick, speed = 1 }: Viewer3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        particleSystem: THREE.Points;
        astroData: { angle: number; radius: number; yOff: number; speed: number }[];
        earth: THREE.Mesh;
        glow: THREE.Mesh;
        controls: OrbitControls;
    } | null>(null);
    const animRef = useRef<number>(0);

    const initScene = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const w = container.clientWidth;
        const h = container.clientHeight;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            // Earth
            const earthGeo = new THREE.SphereGeometry(1.2, 48, 48);
            const earthTexture = createEarthTexture();
            const earthMat = new THREE.MeshPhongMaterial({
                map: earthTexture,
                emissive: 0x1a3a5a,
                emissiveIntensity: 0.15,
                transparent: true,
                opacity: 0.85,
            });
            const earth = new THREE.Mesh(earthGeo, earthMat);
            scene.add(earth);

            // Earth glow
            const glowGeo = new THREE.SphereGeometry(1.35, 32, 32);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0x4fc3f7,
                transparent: true,
                opacity: 0.08,
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            scene.add(glow);

            // Orbit rings (simplified: reduced from 5 to 2, low opacity)
            const orbitColors = [0x4fc3f7, 0xb388ff];
            for (let i = 0; i < 2; i++) {
                const radius = 2.8 + i * 1.5;
                const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: orbitColors[i % orbitColors.length],
                    transparent: true,
                    opacity: 0.04 + i * 0.01,
                    side: THREE.DoubleSide,
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.random() * Math.PI * 0.3;
                ring.rotation.z = Math.random() * Math.PI * 0.3;
                scene.add(ring);
            }

            // Lights
            const ambient = new THREE.AmbientLight(0x222244, 0.5);
            scene.add(ambient);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(5, 5, 5);
            scene.add(dirLight);
            const pointLight = new THREE.PointLight(0x4fc3f7, 0.4, 20);
            pointLight.position.set(-3, 2, 4);
            scene.add(pointLight);

            // Asteroid particles
            const items = data || [];
            const count = Math.min(items.length, 40);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const astroData: {
                angle: number;
                radius: number;
                yOff: number;
                speed: number;
                name: string;
                distKm: number;
            }[] = [];
            const labels: THREE.Sprite[] = [];

            items.slice(0, count).forEach((a, i) => {
                const angle = Math.random() * Math.PI * 2;
                const radius = 2.5 + Math.random() * 5;
                const yOff = (Math.random() - 0.5) * 1.5;
                astroData.push({
                    angle,
                    radius,
                    yOff,
                    speed: 0.002 + Math.random() * 0.008,
                    name: a.name,
                    distKm: a.distKm,
                });
                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = yOff;
                positions[i * 3 + 2] = Math.sin(angle) * radius;
                const c = a.hazardous ? [1, 0.3, 0.3] : [0.3, 0.8, 1];
                colors[i * 3] = c[0];
                colors[i * 3 + 1] = c[1];
                colors[i * 3 + 2] = c[2];

                // Create label for asteroid
                try {
                    const label = createAsteroidLabel(a.name, a.distKm);
                    label.position.set(
                        positions[i * 3],
                        positions[i * 3 + 1] + 1,
                        positions[i * 3 + 2]
                    );
                    labels.push(label);
                    scene.add(label);
                } catch {
                    // Silently skip label if creation fails
                }
            });

            const particleGeo = new THREE.BufferGeometry();
            particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

            const particleMat = new THREE.PointsMaterial({
                size: 0.15,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
            });
            const particleSystem = new THREE.Points(particleGeo, particleMat);
            scene.add(particleSystem);

            camera.position.set(4, 3, 6);
            camera.lookAt(0, 0, 0);

            // OrbitControls for zoom, rotate, pan
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.0;
            controls.minDistance = 2;
            controls.maxDistance = 20;
            controls.target.set(0, 0, 0);

            // Raycaster for hover/click
            const raycaster = new THREE.Raycaster();
            const pointer = new THREE.Vector2();
            let hoveredId: string | null = null;
            let pointerDown = false;
            let hasDragged = false;
            const dragThreshold = 5;
            const dragThresholdSq = dragThreshold * dragThreshold;
            const pointerDownPos = { x: 0, y: 0 };
            const asteroidIds = (data || []).slice(0, 40).map((a) => a.id);

            const onPointerMove = (event: MouseEvent) => {
                if (pointerDown && !hasDragged) {
                    const dx = event.clientX - pointerDownPos.x;
                    const dy = event.clientY - pointerDownPos.y;
                    if (dx * dx + dy * dy > dragThresholdSq) {
                        hasDragged = true;
                    }
                }

                const rect = renderer.domElement.getBoundingClientRect();
                pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects([particleSystem]);

                if (intersects.length > 0) {
                    const idx = intersects[0].index;
                    if (idx !== undefined && idx < asteroidIds.length) {
                        const id = asteroidIds[idx];
                        if (id !== hoveredId) {
                            hoveredId = id;
                            onHover?.(id);
                            renderer.domElement.style.cursor = "pointer";
                        }
                        return;
                    }
                }
                if (hoveredId !== null) {
                    hoveredId = null;
                    onHover?.(null);
                    renderer.domElement.style.cursor = "default";
                }
            };

            const onPointerDown = (event: MouseEvent) => {
                pointerDown = true;
                hasDragged = false;
                pointerDownPos.x = event.clientX;
                pointerDownPos.y = event.clientY;
            };

            const onPointerUp = () => {
                pointerDown = false;
            };

            const onClickRay = (event: MouseEvent) => {
                if (hasDragged) {
                    hasDragged = false;
                    return;
                }

                const rect = renderer.domElement.getBoundingClientRect();
                pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects([particleSystem]);

                if (intersects.length > 0) {
                    const idx = intersects[0].index;
                    if (idx !== undefined && idx < asteroidIds.length) {
                        onClick?.(asteroidIds[idx]);
                    }
                }
            };

            renderer.domElement.addEventListener("pointerdown", onPointerDown);
            renderer.domElement.addEventListener("pointerup", onPointerUp);
            renderer.domElement.addEventListener("pointermove", onPointerMove);
            renderer.domElement.addEventListener("click", onClickRay);

            sceneRef.current = {
                scene,
                camera,
                renderer,
                particleSystem,
                astroData,
                earth,
                glow,
                controls,
            };

            onReady?.();

            // Animation
            let angle = 0;

            function animate() {
                animRef.current = requestAnimationFrame(animate);
                angle += 0.002 * speed;

                earth.rotation.y += 0.005 * speed;
                glow.rotation.y += 0.003 * speed;

                const pos = particleSystem.geometry.attributes.position.array;
                astroData.forEach((d, i) => {
                    d.angle += d.speed * speed;
                    pos[i * 3] = Math.cos(d.angle) * d.radius;
                    pos[i * 3 + 2] = Math.sin(d.angle) * d.radius;
                    pos[i * 3 + 1] = d.yOff + Math.sin(angle * 2 + i) * 0.2;

                    // Update label position to follow asteroid
                    if (labels[i]) {
                        labels[i].position.x = pos[i * 3];
                        labels[i].position.y = pos[i * 3 + 1] + 1;
                        labels[i].position.z = pos[i * 3 + 2];
                    }
                });
                particleSystem.geometry.attributes.position.needsUpdate = true;

                controls.autoRotateSpeed = 1.0 * speed;
                controls.update();

                renderer.render(scene, camera);
            }
            animate();
        } catch {
            onError?.();
        }
    }, [data, onReady, onError, speed]);

    useEffect(() => {
        initScene();
        return () => {
            cancelAnimationFrame(animRef.current);
            if (sceneRef.current) {
                sceneRef.current.renderer.dispose();
                sceneRef.current.renderer.domElement.remove();
            }
        };
    }, [initScene]);

    return (
        <div
            ref={containerRef}
            className="w-full h-[400px] rounded-lg overflow-hidden bg-[radial-gradient(ellipse_at_center,#0d0d2b,#050510)]"
        />
    );
}