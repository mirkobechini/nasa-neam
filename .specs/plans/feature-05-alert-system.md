# Feature: Alert System

## Obiettivo

Pannello alert con soglie personalizzabili (distanza, dimensione), notifiche toast e toggle suoni.

## Dipendenze

- Feature 04 (Asteroid Catalog)

## Stack

- Next.js Client Components
- Shadcn UI (Slider, Toast, Switch)
- Web Audio API (suoni)

## Output atteso

- Alert panel: critici (hazardous) + cautela (non hazardous) con soglie
- Slider custom: max distanza (km), min dimensione (m)
- Notifiche toast per alert critici
- Toggle suoni on/off (pulsante UI)
- Web Audio API: suono alert per critici, click per interazioni
- Empty state "All Clear" quando nessun alert attivo
- Test per logica alert e soglie

## Status

[ ] Non iniziata
