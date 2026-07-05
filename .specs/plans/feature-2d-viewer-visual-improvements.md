# Feature: 2D Viewer Visual Improvements - Anime-style Earth and Asteroids

## Obiettivo

Migliorare la visualizzazione 2D del viewer mantenendo il **tema anime**: sostituire emoji e forme semplici con disegni anime-style proporzioni corrette.

## Dettagli

### Current State (2D viewer now)

- Terra: emoji 🌍 + cerchio blu circolare
- Asteroidi: cerchietti semplici (punti)
- Contorni: solo per visualizzazione hit area, non per pericolo

### Proposed Changes - ANIME STYLE

1. **Terra 2D Anime-style**: Disegno anime della Terra
   - Canvas 2D con continenti stilizzati (tema anime, NON foto)
   - Grande proporzionato (diametro ~200-300px)
   - Stile coerente con createEarthTexture 3D

2. **Asteroidi 2D Anime-style**: Immagini anime contornate
   - Disegni anime-style per asteroidi (NON foto)
   - Contorno **BLU** (#4fc3f7) per asteroidi safe
   - Contorno **ROSSO** (#ef5350) per asteroidi hazardous
   - **IMPORTANTE**: Proporzionamento per sizeM
     - sizeM grande → sprite asteroidе grande
     - sizeM piccolo → sprite asteroide piccolo
   - Label nome + distanza
   - Scontorni puliti

3. **Hit Detection**: Raycasting per immagini contornate

## Dipendenze

- PR #52 (Earth texture)
- PR #54 (3D mesh pattern)

## Implementazione

1. Creare `createEarth2DAnime()` in lib/earth-texture.ts (disegno anime)
2. Creare `createAsteroid2DSprite(name, sizeM, isHazardous)` in lib/earth-texture.ts
   - Canvas con disegno anime asteroid
   - Scale basato su sizeM (mappatura range sizeM → range scale)
3. Aggiornare Viewer2D component
4. Test proporzionamento e contorni

## Benefici

- Coerenza visiva 2D/3D mantenendo tema anime
- Migliore riconoscibilità per dimensione asteroide
- Pericolo chiaro da colore contorno

## Status

[ ] Non iniziata
