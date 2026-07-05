# Fix: Time range persistence - data mismatch across pages

## Obiettivo

Risolvere bug dove il periodo selezionato persiste tra le pagine (grazie a TimeRangeContext), MA i dati mostrati non corrispondono al periodo selezionato.

## Problema

- **Sintomo**: Seleziono periodo 7 giorni nella home → vedo dati home corretti. Vado al viewer → il periodo è ancora 7 giorni (✓ corretto), ma i dati/asteroidi mostrati nel viewer non corrispondono a quel periodo.
- **Causa probabile**: Il viewer non effettua una nuova fetch quando il periodo cambia, oppure usa dati cached che non corrispondono.

## Dettagli

- TimeRangeContext mantiene correttamente dateMin/dateMax (persistenza ✓)
- Home page: fetch `/api/neo/stats?start_date=${dateMin}&end_date=${dateMax}` quando dateMin/dateMax cambiano
- Viewer page: carica asteroidi ma potrebbe non aggiornare quando il periodo cambia via navbar
- Possibili soluzioni:
  1. Aggiungere dependency array corretto nei useEffect del viewer
  2. Verificare che il viewer effettui fetch quando dateMin/dateMax cambiano
  3. Controllare il caching API (se troppo aggressivo)

## Dipendenze

- PR #50 (custom date picker)
- PR #51 (navbar time range)

## Status

[x] Completata — PR #53 (2026-07-05)

- Importato useTimeRange nel viewer page
- Aggiunto dateMin, dateMax al fetchData
- API call ora inclusa parametri start_date e end_date
- Dependency array corretto: [dateMin, dateMax]
- Viewer ora ricarica dati quando il periodo cambia nella navbar
- 72 test totali, tutti passanti
