# Feature: Improved 3D viewer with Earth texture and labels

## Obiettivo

Migliorare il viewer 3D con texture della Terra in stile anime, label sugli asteroidi, e indicatori di distanza.

## Dettagli

- **Texture Terra:** Caricare texture da CDN (stile anime/glow) invece del colore piatto
- **Label asteroidi:** Usare THREE.Sprite con testo per mostrare nome e distanza
- **Distanze:** Mostrare la distanza relativa dalla Terra per ogni asteroide visibile
- **Stile:** Mantenere tema anime con colori neon e glow

## Dipendenze

- Feature #6 (3D/2D Viewer)

## Stack

- Three.js (Sprite, SpriteMaterial, TextureLoader)

## Output atteso

- Terra con texture anime-style riconoscibile
- Asteroidi con label nome e distanza visibili
- Distanze relative in scala
- Click su asteroide → modal profilo

## Status

[ ] Non iniziata
