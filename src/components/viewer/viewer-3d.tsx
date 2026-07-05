"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createEarthTexture, createAsteroidLabel, createAsteroidMesh } from "@/lib/earth-texture";
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
        asteroidMeshes: THREE.Mesh[];
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

            // Asteroid meshes (3D rocky appearance)
            const items = data || [];
            const count = Math.min(items.length, 40);
            const astroData: {
                angle: number;
                radius: number;
                yOff: number;
                speed: number;
            }[] = [];
            const labels: THREE.Sprite[] = [];
            const asteroidMeshes: THREE.Mesh[] = [];
            const asteroidIds = items.slice(0, count).map((a) => a.id);

            items.slice(0, count).forEach((a, i) => {
                const angle = Math.random() * Math.PI * 2;
                const radius = 2.5 + Math.random() * 5;
                const yOff = (Math.random() - 0.5) * 1.5;
                astroData.push({
                    angle,
                    radius,
                    yOff,
                    speed: 0.002 + Math.random() * 0.008,
                });

                // Create 3D asteroid mesh
                const mesh = createAsteroidMesh(a.sizeM, a.hazardous);
                mesh.position.set(
                    Math.cos(angle) * radius,
                    yOff,
                    Math.sin(angle) * radius
                );
                asteroidMeshes.push(mesh);
                scene.add(mesh);

                // Create label for asteroid
                try {
                    const label = createAsteroidLabel(a.name, a.distKm);
                    label.position.set(
                        mesh.position.x,
                        mesh.position.y + 1,
                        mesh.position.z
                    );
                    labels.push(label);
                    scene.add(label);
                } catch {
                    // Silently skip label if creation fails
                }
            });

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
            let hoveredIdx: number | null = null;
            let pointerDown = false;
            let hasDragged = false;
            const dragThreshold = 5;
            const dragThresholdSq = dragThreshold * dragThreshold;
            const pointerDownPos = { x: 0, y: 0 };

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
                const intersects = raycaster.intersectObjects(asteroidMeshes);

                if (intersects.length > 0) {
                    const mesh = intersects[0].object;
                    const idx = asteroidMeshes.indexOf(mesh as THREE.Mesh);
                    if (idx !== -1 && idx < asteroidIds.length) {
                        const id = asteroidIds[idx];
                        if (idx !== hoveredIdx) {
                            hoveredIdx = idx;
                            onHover?.(id);
                            renderer.domElement.style.cursor = "pointer";
                        }
                        return;
                    }
                }
                if (hoveredIdx !== null) {
                    hoveredIdx = null;
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
                const intersects = raycaster.intersectObjects(asteroidMeshes);

                if (intersects.length > 0) {
                    const mesh = intersects[0].object;
                    const idx = asteroidMeshes.indexOf(mesh as THREE.Mesh);
                    if (idx !== -1 && idx < asteroidIds.length) {
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
                asteroidMeshes,
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

                astroData.forEach((d, i) => {
                    d.angle += d.speed * speed;
                    const x = Math.cos(d.angle) * d.radius;
                    const z = Math.sin(d.angle) * d.radius;
                    const y = d.yOff + Math.sin(angle * 2 + i) * 0.2;

                    // Update asteroid mesh position
                    if (asteroidMeshes[i]) {
                        asteroidMeshes[i].position.set(x, y, z);
                        // Rotate mesh for visual effect
                        asteroidMeshes[i].rotation.x += 0.01 * speed;
                        asteroidMeshes[i].rotation.y += 0.015 * speed;
                    }

                    // Update label position to follow asteroid
                    if (labels[i]) {
                        labels[i].position.x = x;
                        labels[i].position.y = y + 1;
                        labels[i].position.z = z;
                    }
                });

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