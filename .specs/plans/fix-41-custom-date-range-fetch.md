# Bug: Custom date range extended fetch (Issue #41)

## Obiettivo

Risolvere il problema per cui selezionando un range custom (es. Marzo - Maggio) la dashboard rimane in "Waiting for asteroid telemetry".

## Analisi Tecnica

- **Limite NASA API:** L'endpoint `/feed` della NASA accetta un massimo di 7 giorni per richiesta.
- **Cache miss:** Se l'utente chiede dati del passato non presenti in cache, l'API `/api/neo/stats` (e `feed`) attualmente non effettua un fetch dinamico se il database contiene già altri dati (controlla solo se `count === 0`).
- **Logica di Fetch:** Bisogna implementare una logica che:
  1. Verifichi se il range richiesto è coperto dalla cache.
  2. Se non lo è, divida il range in "chunk" di 7 giorni e faccia richieste multiple alla NASA (rispettando il rate limit).
  3. Gestisca il caricamento parziale dei dati.

## Acceptance Criteria

- [ ] Selezionando un range di 2 mesi, l'app recupera i dati (eventualmente con caricamento progressivo).
- [ ] Messaggio di errore chiaro se l'intervallo è troppo vasto o supera i limiti NASA (se esistenti oltre i 7gg).
- [ ] Ottimizzazione delle chiamate per non eccedere il rate limit di 1000 req/ora.

## Status

[ ] Non iniziata
