# Bug: Dashboard time filter not working (custom + 3/7 days)

## Obiettivo

Il filtro temporale nella Dashboard (3gg, 7gg, custom) non cambia effettivamente i dati mostrati.

## Dettagli

- Il componente `TimeRangeFilter` usa lo stato `timeRange` nella Dashboard page e lo passa alla fetch
- L'API `/api/neo/stats` però non accetta parametri `start_date`/`end_date` quando la cache è già popolata
- Il filtro "Custom" non ha funzionalità di date picker funzionante

## Status

[ ] Non iniziata
