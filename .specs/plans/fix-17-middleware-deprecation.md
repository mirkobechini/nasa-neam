# Fix: Middleware deprecation in Next.js 16

## Obiettivo

Rinominare `middleware.ts` in `proxy.ts` per eliminare il warning di deprecazione di Next.js 16.

## Causa

Next.js 16 ha deprecato il nome `middleware.ts` in favore di `proxy.ts`.

## Soluzione

- Creato `src/proxy.ts` con lo stesso contenuto
- Rimosso `src/middleware.ts`
- Build verificata senza warning

## Status

[x] Completata
Completata il: 2026-07-03
