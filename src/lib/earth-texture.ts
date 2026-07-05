import * as THREE from "three";

/**
 * Creates a realistic Earth texture using Canvas.
 * Returns a THREE.CanvasTexture with oceans, continents, clouds and atmosphere.
 */
export function createEarthTexture(size: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get 2D context");

  // Create gradient background (ocean) - deeper, more realistic blues
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "#1e88e5"); // Brighter blue center
  gradient.addColorStop(0.6, "#1565c0"); // Medium blue
  gradient.addColorStop(1, "#0d47a1"); // Deep ocean blue edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add subtle noise pattern to oceans for depth
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  // Draw continents with varied colors (greens, browns, oranges)

  // North America - green
  ctx.fillStyle = "#2e7d32";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.23,
    size * 0.32,
    size * 0.075,
    size * 0.095,
    -0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Greenland
  ctx.fillStyle = "#558b2f";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.38,
    size * 0.15,
    size * 0.035,
    size * 0.05,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // South America - brownish-green
  ctx.fillStyle = "#33691e";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.3,
    size * 0.62,
    size * 0.048,
    size * 0.078,
    -0.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Europe - light green
  ctx.fillStyle = "#558b2f";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.48,
    size * 0.28,
    size * 0.04,
    size * 0.05,
    0.1,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Africa - brown-orange
  ctx.fillStyle = "#d84315";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.52,
    size * 0.48,
    size * 0.065,
    size * 0.12,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Asia - green
  ctx.fillStyle = "#2e7d32";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.64,
    size * 0.3,
    size * 0.11,
    size * 0.095,
    0.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Australia - orange-brown
  ctx.fillStyle = "#bf360c";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.73,
    size * 0.64,
    size * 0.048,
    size * 0.058,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // New Zealand
  ctx.fillStyle = "#558b2f";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.78,
    size * 0.72,
    size * 0.015,
    size * 0.03,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Antarctica - whitish
  ctx.fillStyle = "#e8eaf6";
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    const x = size / 2 + Math.cos(angle) * size * 0.48;
    const y = size / 2 + Math.sin(angle) * size * 0.48;
    ctx.fillRect(x - 3, y - 3, 6, 6);
  }
  ctx.globalAlpha = 1;

  // Add cloud layer - thin, subtle
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const width = Math.random() * 20 + 10;
    const height = Math.random() * 8 + 3;
    ctx.fillRect(x - width / 2, y - height / 2, width, height);
  }

  // Add atmospheric glow
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#81d4fa";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size / 2) * (1 - i * 0.12), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  return texture;
}

/**
 * Creates a small sprite label for an asteroid with name and distance.
 */
export function createAsteroidLabel(
  name: string,
  distanceKm: number,
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 60;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get 2D context");

  // Dark background with transparency
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = "#4fc3f7";
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // Title (asteroid name) - smaller font
  ctx.font = "bold 10px Arial";
  ctx.fillStyle = "#4fc3f7";
  ctx.textAlign = "left";
  ctx.fillText(name, 8, 18);

  // Distance info - tiny font
  ctx.font = "8px Arial";
  ctx.fillStyle = "#81d4fa";
  const distText =
    distanceKm < 1000
      ? `${Math.round(distanceKm)} km`
      : `${(distanceKm / 1000).toFixed(1)}k km`;
  ctx.fillText(distText, 8, 35);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  // Much smaller scale - reduced from 2 to 0.8
  sprite.scale.set(0.8, 0.4, 1);

  return sprite;
}

/**
 * Creates a 3D rocky asteroid mesh with random distortion.
 * Simulates crater surface with a jagged rocky appearance.
 */
export function createAsteroidMesh(
  sizeM: number,
  hazardous: boolean,
): THREE.Mesh {
  // Base geometry: icosahedron for irregular rocky shape
  const geometry = new THREE.IcosahedronGeometry(0.2, 4);

  // Distort vertices for rocky appearance
  const positionAttr = geometry.getAttribute("position");
  const positions = positionAttr.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    // Random distortion per vertex for jagged effect
    const distortion = 0.1 + Math.random() * 0.15;
    const length = Math.sqrt(x * x + y * y + z * z);

    if (length > 0) {
      positions[i] =
        (x / length) * length * (1 + (Math.random() - 0.5) * distortion);
      positions[i + 1] =
        (y / length) * length * (1 + (Math.random() - 0.5) * distortion);
      positions[i + 2] =
        (z / length) * length * (1 + (Math.random() - 0.5) * distortion);
    }
  }

  positionAttr.needsUpdate = true;
  geometry.computeVertexNormals();

  // Material: rocky appearance with hazard coloring
  const color = hazardous ? 0xff4444 : 0x4488ff; // Red for hazardous, blue for normal
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: hazardous ? 0x330000 : 0x001133,
    emissiveIntensity: 0.2,
    roughness: 0.8,
    metalness: 0.2,
    flatShading: false,
  });

  const mesh = new THREE.Mesh(geometry, material);

  // Scale based on asteroid size (0.1m to 1000m)
  // Logarithmic scaling so small and large asteroids are both visible
  const minScale = 0.05;
  const maxScale = 0.4;
  const logSize = Math.log10(Math.max(sizeM, 1));
  const scale = minScale + (logSize / 3) * (maxScale - minScale);
  mesh.scale.set(scale, scale, scale);

  // Add random rotation for variety
  mesh.rotation.x = Math.random() * Math.PI * 2;
  mesh.rotation.y = Math.random() * Math.PI * 2;
  mesh.rotation.z = Math.random() * Math.PI * 2;

  return mesh;
}
