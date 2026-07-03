# Feature: Rate Limit Monitor

## Obiettivo
Indicatore UI delle chiamate API NASA residue (1000 req/h), con alert visivo quando ci si avvicina al limite.

## Dipendenze
- Feature 02 (Proxy Cache API)

## Stack
- Next.js Client Components
- Shadcn UI (Progress, Badge)

## Output atteso
- Badge/Progress bar: "API calls: 47/1000 this hour"
- Cambio colore: verde (>50%), giallo (20-50%), rosso (<20%)
- Dati letti da `GET /api/neo/rate-limit`
- Refresh automatico ogni minuto

## Status
[ ] Non iniziata