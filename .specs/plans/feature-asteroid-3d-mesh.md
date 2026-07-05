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

[ ] Non iniziata
