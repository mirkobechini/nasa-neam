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
[ ] Non iniziata