# Fix: Custom date range picker not working

## Obiettivo

Il custom date range selector si è rotto — fix per ripristinare funzionalità.

## Dettagli

- Attualmente: Click su "Custom" non mostra il date picker
- Nuovo: Far funzionare il date picker e salvare la selezione in localStorage
- Validazione: inizio < fine
- Feedback: messaggio di errore se date non validi

## Stack

- next-intl for translations
- TimeRangeContext for persistence
- localStorage fallback

## Status

[ ] Non iniziata
