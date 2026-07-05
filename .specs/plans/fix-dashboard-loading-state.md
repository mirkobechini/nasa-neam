# Fix: Dashboard loading state — add text indicator

## Obiettivo

Aggiungere un messaggio di testo "Loading..." o "Fetching data..." durante il caricamento della dashboard, accanto agli skeleton loader. Migliora il feedback dell'utente.

## Dettagli

- Attualmente mostra solo skeleton elements (linee grigie)
- Utente non sa se il caricamento è normale o bloccato
- Aggiungere testo tipo "Loading asteroid data..." nella pagina dashboard

## Posizione

Nel componente `src/app/[locale]/page.tsx` (dashboard principale) o nei sotto-componenti (HeroStats, BubbleChart, etc.)

## Soluzione proposta

Aggiungere uno stato `isLoading` che mostra un overlay o testo durante il fetch dei dati dalla NASA API.

## Status

[ ] Non iniziata
