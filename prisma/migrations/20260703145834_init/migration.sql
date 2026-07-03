-- CreateTable
CREATE TABLE "asteroids" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dist_km" REAL NOT NULL,
    "size_m" REAL NOT NULL,
    "velocity_kmh" REAL NOT NULL,
    "hazardous" BOOLEAN NOT NULL,
    "close_approach" DATETIME,
    "orbit_body" TEXT NOT NULL DEFAULT 'Earth',
    "raw_json" TEXT NOT NULL,
    "fetched_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "api_call_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "endpoint" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sound_enabled" BOOLEAN NOT NULL DEFAULT true,
    "dist_threshold" REAL NOT NULL DEFAULT 500000,
    "size_threshold" REAL NOT NULL DEFAULT 200,
    "language" TEXT NOT NULL DEFAULT 'it'
);
