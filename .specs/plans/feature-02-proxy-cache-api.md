# Feature: Proxy Cache API (NASA NeoWs)

## Obiettivo
Implementare le API Routes Next.js che fanno da proxy verso NASA NeoWs, con caching su SQLite per rispettare il rate limit (1000 req/h).

## Dipendenze
- Feature 01 (Setup Next.js + Prisma)

## Stack
- Next.js API Routes
- Prisma (SQLite)
- NASA NeoWs API

## Output atteso
- `GET /api/neo/feed` — fetch lista asteroidi con caching (max 7 giorni)
- `GET /api/neo/{id}` — fetch singolo asteroide con caching
- `GET /api/neo/stats` — statistiche dashboard
- `GET /api/neo/rate-limit` — contatore chiamate API residue
- Cache database: tabelle Prisma per asteroidi, chiamate API, preferenze
- API key NASA protetta (server-side, variabile d'ambiente)
- Rate limit monitor visibile in UI

## Status
[ ] Non iniziata