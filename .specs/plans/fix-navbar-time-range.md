# Fix: Move time range filter to navbar

## Obiettivo

Spostare la barra "3 days / 7 days / Custom" dalla home (due posizioni) alla navbar globale, così è sempre accessibile e visibile.

## Dettagli

- Attualmente: barra presente in hero section e dashboard section della home
- Nuovo: unica barra nella navbar, visibile ovunque
- Togliere le duplicate dalla home
- Persistenza tramite TimeRangeContext (già implementata)

## Benefici

- UX migliore: filtro accessibile da tutte le pagine
- Riduce clutter nella home
- Coerenza con design system

## Status

[ ] Non iniziata
