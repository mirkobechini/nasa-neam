# Feature: Setup Next.js + Prisma + i18n

## Obiettivo

Inizializzare il progetto Next.js 14+ con App Router, Shadcn UI, Prisma (SQLite), next-intl (IT/EN) e struttura delle cartelle.

## Dipendenze

Nessuna — è il punto di partenza.

## Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Prisma (SQLite)
- next-intl (IT + EN)

## Output atteso

- Progetto Next.js funzionante
- Prisma configurato con SQLite (schema iniziale per cache asteroidi)
- next-intl configurato con IT e EN
- Shadcn UI installato con tema scuro personalizzato
- Struttura cartelle: `app/`, `components/`, `lib/`, `locales/`, `prisma/`
- Tema anime spazio (dark mode) impostato come default

## Status

[x] Completata
Completata il: 2026-07-03
Note: Next.js 16.2.10 (non 14+), Prisma 7.8.0 con SQLite, Shadcn UI con tema anime spazio custom, next-intl IT/EN con routing. 7 test di validazione passati. Merge PR #2.
