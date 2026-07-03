# Feature: 3D/2D Trajectory Viewer

## Obiettivo

Visualizzazione orbite asteroidi con switch tra Three.js (3D) e Canvas 2D, con Terra riconoscibile e asteroidi leggibili.

## Dipendenze

- Feature 02 (Proxy Cache API)

## Stack

- Three.js (3D)
- Canvas 2D API (2D)
- Shadcn UI (Tabs/Switch)

## Output atteso

- Viewer 3D: Terra con texture/glow, anelli orbitali colorati, asteroidi in movimento con colori hazard
- Viewer 2D: Canvas con orbite proiettate, legenda, etichette
- Switch 3D/2D con animazione fluida
- Label/Tooltip sugli asteroidi (nome, distanza)
- Skeleton loading durante inizializzazione WebGL
- Empty state se WebGL non supportato

## Status

[ ] Non iniziata
