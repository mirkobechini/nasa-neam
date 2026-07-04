# Feature: Asteroid hover tooltip and click-to-profile in viewer

## Obiettivo

Aggiungere interattività ai viewer: hover su asteroide mostra mini legenda, click apre modal profilo.

## Dettagli

- **3D:** Raycaster per rilevare hover/click su particelle asteroidi
- **2D:** Hit detection sul canvas per hover/click
- **Hover:** Mostra tooltip con nome, distanza, dimensione
- **Click:** Apre la modal profilo asteroide (riutilizzando la logica del prototipo)

## Dipendenze

- Feature #6 (3D/2D Viewer)

## Stack

- Three.js (Raycaster)
- Canvas 2D API

## Output atteso

- Hover su asteroide → tooltip fluttuante con info base
- Click su asteroide → modal profilo con dettagli
- Stesso comportamento in 3D e 2D

## Status

[x] Completata
Completata il: 2026-07-04
Note: AsteroidModal, raycaster 3D (hover + click), hit detection 2D (hover + click), tooltip nella viewer page. 44 test passati. PR #28.
