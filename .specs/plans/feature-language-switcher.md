# Feature: Language switcher (IT/EN)

## Obiettivo

Aggiungere un selettore di lingua nella navbar per passare da IT a EN.

## Dipendenze

- next-intl già configurato (Feature #1)

## Stack

- next-intl (useRouter, usePathname)
- Shadcn UI (Select o Button)

## Output atteso

- Pulsante/Select nella navbar per cambiare lingua
- Cambio lingua senza ricaricare la pagina (client-side navigation)
- IT/EN visibile nella UI (es. flag o abbreviazione)

## Status

[x] Completata
Completata il: 2026-07-04
Note: LanguageSwitcher nella navbar con bandierine IT/EN, route switching via next-intl. 47 test passati. PR #30.
