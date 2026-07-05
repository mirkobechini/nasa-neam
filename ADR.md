# Architecture Decision Record

**Progetto:** Near Earth Asteroid Monitor (N.E.A.M.)
**Data:** 2026-07-03
**Autore:** Mirko Bechini

## Decisione

Webapp per monitorare asteroidi near-Earth usando l'API gratuita NASA NeoWs, con visualizzazioni interattive, alert system e risorse educative. Singolo deploy su Vercel.

## Contesto

Progetto personale (poi pubblico) per visualizzare asteroidi vicini alla Terra, con dati reali NASA e interfaccia immersiva tema spazio/anime. L'utente vuole monitorare gli oggetti near-Earth e approfondire conoscenze sull'argomento.

## Piattaforme scelte

- **Frontend:** Next.js 14+ (App Router) + Shadcn UI + Tailwind CSS + Recharts + Three.js
- **Backend:** Next.js API Routes (stesso repo, proxy cache per NASA NeoWs)
- **Database:** SQLite (via Prisma)
- **Deploy:** Vercel
- **i18n:** next-intl (IT + EN, predisposto per multilingua)
- **3D:** Three.js (con switch 2D Canvas)
- **Icone:** Lucide React (nativo Shadcn) + Font Awesome (per compatibilità prototipo)

## Componenti principali

- **Dashboard** — panoramica live con statistiche e grafici (Recharts)
- **Asteroid Catalog** — lista filtrabile e ordinabile con dettagli
- **Asteroid Profile** — pagina dettaglio singolo asteroide (rotta `/neo/{id}`)
- **Alert System** — soglie personalizzabili (distanza, dimensione) con notifiche
- **Visualizzazione 3D/2D** — viewer orbite con switch tra Three.js e Canvas 2D
- **Educational Resources** — link a risorse NASA esterne
- **Proxy Cache API** — backend Next.js che chiama NASA NeoWs con caching (SQLite)
- **Rate Limit Monitor** — contatore chiamate API visibile in UI
- **Toggle Suoni** — attivazione/disattivazione effetti sonori
- **Filtro Temporale** — selezione periodo di dati (3gg, 7gg, custom) — **persistente tra tutte le schede (PR #46)**
- **Confronto Asteroidi** — side-by-side comparison (feature futura)
- **Export CSV** — download dati asteroidi (feature futura)
- **PWA** — installabile come app (feature futura, da ultimo)

## Decisioni architetturali

| Scelta                            | Alternativa                    | Motivo                                                                   |
| --------------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| **Next.js unificato**             | FastAPI + Next.js separati     | Deploy singolo su Vercel, minore complessità operativa                   |
| **SQLite**                        | PostgreSQL                     | Zero setup, nessun servizio esterno, sufficiente per cache + preferenze  |
| **next-intl**                     | react-i18next, custom          | Standard Next.js 14+, SEO nativo, URL per lingua                         |
| **Three.js**                      | Babylon.js                     | Standard de facto, già usato nel prototipo                               |
| **Toggle suoni** (non rimuoverli) | Rimozione completa dei suoni   | L'utente vuole poterli riattivare, non eliminarli                        |
| **Proxy backend (API Routes)**    | Chiamata diretta dal frontend  | Protegge API key NASA, gestisce caching server-side                      |
| **Risorse NASA esterne**          | Contenuti scritti da noi       | Zero effort di mantenimento, dati sempre aggiornati                      |
| **proxy.ts (Next.js 16)**         | middleware.ts (deprecato)      | Next.js 16 ha deprecato `middleware.ts` in favore di `proxy.ts`          |
| **Logica API condivisa (neo.ts)** | Codice duplicato in ogni route | `src/lib/neo.ts` centralizza parsing asteroidi, upsert e filtraggio data |

## Vincoli

- NASA API rate limit: 1000 richieste/ora → caching obbligatorio
- Cache dati: max 7 giorni (limite API NASA)
- Responsive: desktop, tablet, mobile
- Feedback utente: skeleton loading, error state, empty state per ogni componente
- Solo open-source, niente servizi a pagamento per core functionality
- IT + EN, predisposto per multilingua
- Nessuna autenticazione (per ora)
- Chiudere un issue richiede la validazione dei test legati all'issue e una verifica della suite completa prima dell'aggiornamento dei documenti.

## Cosa NON è in scope

- Autenticazione utente (nessun login/registrazione)
- Alert sonori reali (toggle sì, ma solo suoni Web Audio API semplici)
- Multi-lingua oltre IT/EN (solo predisposizione)
- Deploy containerizzato (Vercel gestisce tutto)
- CI/CD custom (Vercel built-in)

## Feature future pianificate

- [ ] Render asteroids as 3D mesh objects (rocce dettagliate, non puntini)
- [ ] Confronto asteroidi side-by-side
- [ ] Export CSV dati asteroidi
- [ ] PWA (installabile come app) — da ultimo

## Bug noti (da fixare)

- [x] Language switcher crash — URL invalido su cambio lingua (PR #34)
- [x] 2D viewer: legenda, drag, click/hit fix (PR #36)
- [x] Dashboard: filtro temporale non funziona (3/7gg/custom) (PR #38)
- [x] Dashboard: date range estesi (es. marzo-maggio) rimangono in "waiting" (Issue #41, risolto con chunking 7gg e cache range verification)
- [x] 3D viewer: click-drag conflict (click dopo drag apre modal) (PR #43)
- [x] 3D viewer: orbite ad anello troppo complesse (PR #45)
- [x] 3D viewer: aggiungere controllo velocità (slow/normal/fast) (PR #47)
- [x] API: gestione parametri data e caching da rivedere (PR #40)
- [ ] 3D viewer: Earth texture sembra Nettuno, labels asteroidi troppo grandi
- [ ] Time range filter: custom date picker non funziona
- [ ] Dashboard: filtro temporale dovrebbe essere in navbar (non in home)
