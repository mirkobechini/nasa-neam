# Feature: Zoom controls for 3D/2D viewer

## Obiettivo

Aggiungere zoom con rotellina del mouse e pinch-to-zoom su mobile nei viewer 3D e 2D.

## Dettagli

- **3D:** Usare `OrbitControls` di Three.js (zoom, rotazione, pan)
- **2D:** Aggiungere event listener `wheel` per zoom su canvas con transform

## Dipendenze

- Feature #6 (3D/2D Viewer)

## Stack

- Three.js (OrbitControls)
- Canvas 2D API

## Output atteso

- Viewer 3D: zoom con rotellina, rotazione drag, pinch-to-zoom mobile
- Viewer 2D: zoom con rotellina, pinch-to-zoom mobile
- Limite zoom minimo/massimo per evitare di perdersi

## Status

[x] Completata
Completata il: 2026-07-03
Note: OrbitControls (zoom, rotazione, pan) per 3D viewer. Wheel zoom con scala percentuale per 2D viewer. 40 test passati. PR #26.
