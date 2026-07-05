import * as THREE from "three";

/**
 * Creates an anime-style Earth texture using Canvas.
 * Returns a THREE.CanvasTexture with animated glow effect.
 */
export function createEarthTexture(size: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get 2D context");

  // Create gradient background (ocean)
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "#4fc3f7"); // Cyan center (light)
  gradient.addColorStop(0.7, "#0277bd"); // Darker blue
  gradient.addColorStop(1, "#01579b"); // Deep blue edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Draw simple continents using ellipses in anime style
  ctx.fillStyle = "#00897b";
  ctx.globalAlpha = 0.8;

  // North America
  ctx.beginPath();
  ctx.ellipse(
    size * 0.25,
    size * 0.35,
    size * 0.08,
    size * 0.1,
    -0.3,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // South America
  ctx.beginPath();
  ctx.ellipse(
    size * 0.3,
    size * 0.6,
    size * 0.05,
    size * 0.08,
    -0.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Europe & Africa
  ctx.beginPath();
  ctx.ellipse(
    size * 0.5,
    size * 0.35,
    size * 0.1,
    size * 0.15,
    0.1,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Asia
  ctx.beginPath();
  ctx.ellipse(
    size * 0.65,
    size * 0.3,
    size * 0.12,
    size * 0.1,
    0.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(
    size * 0.72,
    size * 0.62,
    size * 0.05,
    size * 0.06,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  // Add glow overlay
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "#4fc3f7";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, (size / 2) * (1 - i * 0.1), 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  return texture;
}

/**
 * Creates a sprite label for an asteroid with name and distance.
 */
export function createAsteroidLabel(
  name: string,
  distanceKm: number,
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get 2D context");

  // Dark background with transparency
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = "#4fc3f7";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // Title (asteroid name)
  ctx.font = "bold 24px Arial";
  ctx.fillStyle = "#4fc3f7";
  ctx.textAlign = "left";
  ctx.fillText(name, 16, 40);

  // Distance info
  ctx.font = "14px Arial";
  ctx.fillStyle = "#81d4fa";
  const distText =
    distanceKm < 1000
      ? `${Math.round(distanceKm)} km`
      : `${(distanceKm / 1000).toFixed(1)}k km`;
  ctx.fillText(`Distance: ${distText}`, 16, 70);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  sprite.scale.set(2, 1, 1);

  return sprite;
}
