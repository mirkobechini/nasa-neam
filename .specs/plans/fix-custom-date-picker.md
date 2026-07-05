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

[x] Completata — PR #50 (2026-07-05)

- isCustom state added to track custom picker visibility
- Click handler for 'Custom' button
- Date validation (start < end)
- Error message display for invalid ranges
- 1 new test added, 72 total tests passing
