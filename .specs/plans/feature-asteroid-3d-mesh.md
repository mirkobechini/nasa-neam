# Feature: Render asteroids as 3D mesh objects (not points)

## Obiettivo

Renderizzare gli asteroidi come mesh 3D visibili (rocce dettagliate) invece di puntini, simile all'immagine di riferimento (asteroide realistico con crateri).

## Dettagli

- Attualmente: Asteroidi sono punti (Points material)
- Nuovo: Mesh 3D con geometria casuale (icosaedro distorto) per ogni asteroide
- Dimensione proporzionale alla grandezza effettiva
- Texture rocciosa o colorazione in base alla composizione
- Click su asteroide → modal profilo (già funzionante)

## Implementazione

- Generare geometria casuale per ogni asteroide
- Colorare in base a hazardous (rosso) o normal (azzurro)
- Aggiungere dettagli visivi (crateri simulati con bump map o normale map)
- Mantenere performance (max 40 asteroidi visibili)

## Stack

- Three.js: IcosahedronGeometry, distorsione casuale, MeshPhongMaterial

## Benefici

- Migliore riconoscibilità degli oggetti
- Esperienza visiva più coinvolgente
- Coerente con tema anime/sci-fi

## Status

[x] Completata — PR #54 (2026-07-05)

- Implementato createAsteroidMesh con IcosahedronGeometry
- Distorsione casuale per effetto roccia
- Colorazione hazardous (rosso) vs normal (blu)
- Scaling logaritmico per visibilità
- Integrato nel viewer-3d: sostituiti Points con Mesh 3D
- Raycaster aggiornato per colpire i mesh individuali
- Animazione mesh con rotazione
- 73 test totali (+1 nuovo), tutti passanti
