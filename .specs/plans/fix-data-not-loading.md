# Bug: Dashboard data not loading (empty state)

## Obiettivo

Risolvere il problema per cui i dati degli asteroidi non arrivano e la dashboard resta vuota.

## Possibili cause

- Cache SQLite vuota (nessun fetch NASA ancora eseguito)
- API key NASA non valida o rate-limited
- Errore nella chiamata `/api/neo/feed` non gestito correttamente
- Nessun seed/mock data iniziale

## Soluzioni possibili

1. Aggiungere seed data di esempio al primo avvio
2. Migliorare la gestione errori nel feed API
3. Aggiungere un trigger manuale "Fetch data from NASA"
4. Mock data automatico se la NASA API non risponde

## Status

[x] Completata
Completata il: 2026-07-03
Note: /api/neo/stats ora fetcha automaticamente da NASA NeoWs se la cache SQLite è vuota. Stessa logica di /api/neo/feed. PR #20.
