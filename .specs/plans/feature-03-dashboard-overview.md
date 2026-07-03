# Feature: Dashboard Overview

## Obiettivo

Pagina principale con panoramica live: statistiche eroe, grafici Recharts (bubble + bar), filtro temporale.

## Dipendenze

- Feature 02 (Proxy Cache API)

## Stack

- Next.js (Server Components + Client Components)
- Recharts
- Shadcn UI (Card, Skeleton)

## Output atteso

- Hero stats: asteroidi tracciati, hazardous count, velocità media, distanza minima
- Bubble chart: velocity vs distance (size = estimated size, color = hazard)
- Bar chart: classification by size range
- Filtro temporale: 3 giorni, 7 giorni, intervallo custom
- Skeleton loading, error state, empty state
- Test per i componenti principali

## Status

[x] Completata
Completata il: 2026-07-03
Note: 4 componenti UI (HeroStats, BubbleChart, HazardBarChart, TimeRangeFilter) + stats endpoint + pagina dashboard. 19 test passati. Merge PR #6. Fix Prisma 7.x adapter per SQLite (PrismaLibSql).
