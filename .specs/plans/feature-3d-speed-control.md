# Feature: 3D viewer speed controls

## Obiettivo

Aggiungere un toggle o slider per controllare la velocità di rotazione della Terra e degli asteroidi.

## Dettagli

- Velocità attuale: rotazione Terra + movimento asteroidi sincronizzato
- Opzioni: toggle "Slow/Normal/Fast" o slider continuo
- Integrazione nella viewer page accanto allo switch 3D/2D

## Status

[x] Completata — PR #47 (2026-07-05)

- SpeedControls component with Slow/Normal/Fast buttons
- Speed prop to Viewer3D applies 0.5x/1x/2x multiplier
- All rotations and movements respect speed setting
- Integrated in viewer page (visible only in 3D mode)
- 5 new tests added, 66 total tests passing
