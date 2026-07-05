# Feature: Persistent Time Range Filter across all tabs

## Obiettivo

Aggiungere il time range filter (3 days, 7 days, custom) a tutte le schede (dashboard, catalog, education, viewer) e mantenerlo sincronizzato quando si naviga tra le schede.

## Dettagli

- Attualmente il filtro temporale è solo nella dashboard
- Quando l'utente cambia scheda, il periodo non viene mantenuto
- Necessario un contexto globale o state management per sincronizzazione

## Posizione

- Navbar o layout globale: aggiungere il time range selector
- Context/Provider: `src/app/[locale]/layout.tsx` o nuovo context
- Consultare l'API con il periodo selezionato in tutte le schede

## Dipendenze

- Feature #3 Dashboard già implementata (contiene il TimeRangeFilter component)
- API routes (`/api/neo/feed`, `/api/neo/[id]`, etc.) già supportano `dateMin` e `dateMax`

## Sub-tasks

1. Creare TimeRangeContext per condividere stato globale
2. Spostare TimeRangeFilter dalla dashboard page al layout/navbar
3. Usare il contexto in dashboard, catalog, e altre pagine
4. Testare persistenza tra cambio schede

## Status

[ ] Non iniziata
