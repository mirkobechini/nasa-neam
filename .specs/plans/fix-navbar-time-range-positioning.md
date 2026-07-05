# Fix: Risistemare posizionamento barra periodo nel navbar

## Obiettivo

Migliorare il layout e il positioning della TimeRangeFilter nella navbar. Attualmente occupa uno spazio poco definito e il responsive potrebbe non essere ottimale.

## Dettagli

- Attualmente: barra inserita direttamente in navbar con spazio verticale (`space-y-3 md:space-y-0`)
- Problema: layout non è pulito, piccoli pulsanti e input date non hanno spaziatura coerente
- Soluzione: creare una second row separata nella navbar, con migliore allineamento e padding

## Proposte

1. **Separate subtitle row** — TimeRangeFilter in una riga separata sotto il navbar principale, con background leggermente diverso (background/50)
2. **Miglior responsive** — Assicurare che su mobile sia ben visibile e che su desktop non occupi troppo spazio
3. **Verticale alignment** — Centrare gli elementi (buttons, date inputs) correttamente

## Benefici

- Layout più pulito e organizzato
- Migliore UX su mobile e desktop
- TimeRangeFilter visivamente separato dalle navigazione principale

## Status

[ ] Non iniziata - da fare dopo altre priority
