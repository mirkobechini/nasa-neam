# Bug: Slow filesystem warning in Next.js 16

## Obiettivo

Risolvere il warning "Slow filesystem detected" all'avvio di Next.js.

## Causa

Il warning compare quando `.next/dev` è su un filesystem lento. Su Windows con MINGW64 può capitare.

## Possibili soluzioni

- Spostare il progetto in una cartella con percorso più corto
- Aggiungere `--no-turbopack` al dev script
- Ignorare il warning (è solo un avviso, non un errore)

## Status

[ ] Non iniziata
