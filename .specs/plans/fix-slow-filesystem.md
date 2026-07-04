# Bug: Slow filesystem warning in Next.js 16

## Obiettivo

Risolvere il warning "Slow filesystem detected" all'avvio di Next.js.

## Causa

Il warning compare quando `.next/dev` è su un filesystem lento. Su Windows con MINGW64 può capitare.

## Soluzione

Warning non blocca l'app. Nessuna azione tecnica possibile — warning noto di Next.js Turbopack su Windows.

## Status

[x] Completata
Completata il: 2026-07-04
Note: Nessuna modifica al codice — warning innocuo. Ignorare.
