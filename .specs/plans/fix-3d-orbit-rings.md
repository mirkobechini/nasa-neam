# Fix: Simplify 3D orbit rings

## Obiettivo

Rimuovere o rendere meno invadenti gli anelli orbitali colorati nel viewer 3D.

## Dettagli

- Attualmente ci sono 5 anelli colorati che complicano la visuale
- Opzioni: ridurre opacità, rimuoverli del tutto, o renderli optional con toggle
- Preferenza utente: le orbite complicate più che aiutare confondono

## Status

[x] Completata — Risolto in PR #45

## Soluzione implementata

- Ridotto il numero di anelli da 5 a 2
- Ridotta ulteriormente l'opacità (da 0.1-0.18 a 0.04-0.06)
- Spaziatura aumentata tra gli anelli per visibilità migliore
- Mantiene comunque il riferimento orbitale

## Note

- Merge effettuato 2026-07-05
- Visuale molto più pulita e meno confusa
