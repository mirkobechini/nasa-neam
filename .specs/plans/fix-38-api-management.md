# Feature: Gestione avanzata API NASA NeoWs

## Obiettivo

Controllare e migliorare la gestione delle chiamate API NASA, inclusi parametri data, caching, e error handling.

## Punti da verificare

- `/api/neo/feed` accetta `start_date` e `end_date` ma non filtra la cache
- `/api/neo/stats` ignora i parametri data
- Caching non tiene conto del periodo richiesto dall'utente
- Errori API mostrati in modo chiaro all'utente

## Status

[ ] Non iniziata
