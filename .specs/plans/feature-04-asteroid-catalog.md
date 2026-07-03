# Feature: Asteroid Catalog

## Obiettivo
Lista completa asteroidi con filtri, sorting, e pagina profilo dettaglio `/neo/{id}`.

## Dipendenze
- Feature 02 (Proxy Cache API)

## Stack
- Next.js (Server Components + Client Components)
- Shadcn UI (Table, Select, Input, Skeleton)
- Recharts (per mini-chart profilo)

## Output atteso
- Lista asteroidi con filtri: sorting (distanza, size, velocità, nome), hazard filter
- Ogni riga: nome, size, velocità, distanza, indicatore hazard
- Pagina profilo `/neo/{id}`: dettagli completi (nome, distanza, size, velocità, traiettoria, risk)
- Skeleton loading, empty state, error state
- Confronto asteroidi (feature futura, solo predisposizione UI)
- Export CSV (feature futura, solo predisposizione UI)

## Status
[ ] Non iniziata