# Fix: Viewer zoom test failure

## Obiettivo

Il test `tests/viewer-zoom.test.ts` fallisce perché cerca la stringa `handleWheel` nel file `viewer-2d.tsx`, ma il codice usa una funzione inline `hWheel`.

## Dettagli

- Test fallisce in: `viewer-zoom.test.ts:16` — `expect(content).toContain("handleWheel");`
- Il file `viewer-2d.tsx` ha la logica wheel correttamente implementata ma con nome diverso
- Necessario allineare il nome della funzione o il test

## Soluzione

Rinominare `hWheel` a `handleWheel` nel `viewer-2d.tsx` per coerenza e per far passare il test.

## Status

[x] Completata — Risolto in PR #44

## Note

- Rinominata funzione `hWheel` → `handleWheel` in viewer-2d.tsx
- Test `viewer-zoom.test.ts` ora passa
- Merge effettuato 2026-07-05
