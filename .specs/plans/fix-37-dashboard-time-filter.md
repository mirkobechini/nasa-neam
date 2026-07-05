# Bug: Dashboard time filter not working (custom + 3/7 days)

## Obiettivo

Il filtro temporale nella Dashboard (3gg, 7gg, custom) non cambia effettivamente i dati mostrati.

## Dettagli

- Il componente `TimeRangeFilter` usa lo stato `timeRange` nella Dashboard page e lo passa alla fetch
- L'API `/api/neo/stats` però non accetta parametri `start_date`/`end_date` quando la cache è già popolata
- Il filtro "Custom" non ha funzionalità di date picker funzionante

## Status

[x] Completata

- **Completata il:** 2026-07-05
- **Note:** Aggiunto filtro per `closeApproach` date nel database invece di `fetchedAt`. API route ora accetta `start_date`/`end_date` dalla query. DashboardPage passa parametri data per tutti i range (3d, 7d, custom). Custom range con date picker funzionante.
