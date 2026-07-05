# Fix: 3D viewer click-drag conflict

## Obiettivo

Evitare che il click su un asteroide dopo un drag (trascinamento visuale) apra la modal.

## Causa

Il `click` event listener sul renderer Three.js scatta anche dopo un `pointermove` + drag. Occorre distinguere tra click e drag.

## Soluzione proposta

Tracciare la distanza tra `pointerdown` e `pointerup`. Se è maggiore di una soglia (es. 5px), è un drag → non aprire modal.

## Status

[x] Completata — Risolto in PR #43

## Note

- Aggiunto tracking di `pointerDown`, `hasDragged`, `dragThreshold` nel component viewer-3d
- Test aggiunto in viewer-interaction.test.ts per verificare la presenza della nuova logica
- Merge effettuato 2026-07-05
