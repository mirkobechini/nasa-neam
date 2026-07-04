# Bug: Language switcher produces invalid URLs

## Obiettivo

Fixare il LanguageSwitcher che genera URL invalidi (es. `http://viewer/`) causando crash.

## Causa

La costruzione dell'href nel `Link` non gestisce correttamente path relativi quando la lingua è cambiata. La stringa risultante viene interpretata come URL assoluto dal browser.

## Soluzione proposta

Usare `useRouter` di next-intl (`useRouter().replace()`) per cambiare lingua senza costruire manualmente URL.

## Status

[ ] Non iniziata
