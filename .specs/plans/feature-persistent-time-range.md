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

## Status

[x] Completata — Risolto in PR #46

## Implementazione eseguita

- **TimeRangeContext.tsx** — Context e hook useTimeRange per stato globale
- **ClientProviders.tsx** — Wrapper centralizzato per i provider (Theme, TimeRange, etc.)
- **time-range-filter.tsx** — Integrato con useTimeRange per persistence
- **navbar-wrapper.tsx** — TimeRangeFilter globale nella navbar
- **dashboard page** — Usa useTimeRange per recuperare selezione persistente
- **Tests** — persistent-time-range.test.ts e dashboard.test.ts aggiornati

## Note

- Merge effettuato 2026-07-05
- Suite: 14 test files, 63 test — tutti passati ✓
- Il filtro persiste tra tutte le schede/navigazioni
