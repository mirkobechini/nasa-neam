# Reflections — Week 1

## Il codice fa quello che ho chiesto?

**Sì, per la fase di prototipo.** Il brief chiedeva esplicitamente _"don't build the entire app without human review and feedback"_ — l'agente ha rispettato questo vincolo.

Cose che funzionano bene nel prototipo:

- ☑️ Dashboard interattiva con Chart.js (bubble chart + bar chart)
- ☑️ Catalog asteroidi con 30 oggetti mock, filtri (sorting + hazard)
- ☑️ Alert System con soglie custom (distanza e dimensione)
- ☑️ Schermata 3D Three.js (Terra orbitante + asteroidi)
- ☑️ 6 schede Educational Resources
- ☑️ Tema anime spazio profondo (starfield, particelle, scanline, neon)
- ☑️ Skeleton loading, empty state, error state per ogni componente
- ☑️ Effetti sonori (Web Audio API)
- ☑️ Responsive (desktop/tablet/mobile)
- ☑️ Modal profilo asteroide con dati dettagliati
- ☑️ Notifiche toast per alert critici

Cose rimandate alla build reale (Next.js + FastAPI):

- ❌ Integrazione API NASA NeoWs reale (mock dati nel prototipo)
- ❌ Backend proxy con caching (FastAPI + Redis/cache)
- ❌ Rotta `/neo/{id}` con proxy e caching
- ❌ Database PostgreSQL
- ❌ Autenticazione utente
- ❌ Recharts (sostituito da Chart.js nel prototipo standalone)
- ❌ Refresh dati real-time via WebSocket/SSE (simulato con setInterval)

## L'agente ha rispettato lo stack?

**Parzialmente, ma in modo giustificato.** Il brief indicava lo stack `FastAPI / Next.js / Shadcn UI / Recharts`, ma la richiesta era di produrre un **HTML Prototype**. È corretto che l'agente abbia usato un singolo file HTML con CDN invece di montare l'intero stack:

| Tecnologia          | Brief | Prototipo | Note                                    |
| ------------------- | ----- | --------- | --------------------------------------- |
| FastAPI + Python    | ✅    | ❌        | Sarà per la build reale                 |
| PostgreSQL          | ✅    | ❌        | Sarà per la build reale                 |
| Next.js             | ✅    | ❌        | Prototipo HTML statico                  |
| Shadcn UI           | ✅    | ❌        | CSS custom anime-style                  |
| Recharts            | ✅    | ❌        | Chart.js (più pratico per HTML singolo) |
| Three.js            | ✅    | ✅        | Usato come da brief                     |
| NASA NeoWs          | ✅    | ❌ (mock) | API reale nella build                   |
| Cache/Rate limiting | ✅    | ❌        | Backend necessario                      |

La scelta di Chart.js su Recharts è sensata: in un file HTML standalone non c'è React, e Chart.js via CDN è la soluzione più pratica per un prototipo.

## Cosa non era chiaro nel brief?

1. **Ambivalenza prototipo vs prodotto finale.** Il brief dice _"don't build the entire app without human review"_ nella sezione Expected Output, ma sotto elenca anche requisiti da app completa (auth, caching, API reale). Meglio separare nettamente "Prototype MVP" e "Production features".

2. **Stack vs formato di consegna.** Indica Next.js/Shadcn/Recharts ma chiede un HTML Prototype. Sono in contraddizione: o si vuole un prototipo HTML veloce, o un setup Next.js già avviato. Va chiarito all'inizio.

3. **"Real-time updates without page refreshes."** In un HTML statico si può solo simulare (setInterval). Il vero real-time richiede WebSocket/SSE + backend — va specificato se Mock è accettabile per il prototipo.

4. **"API accepts max 7 days of data."** È un vincolo backend che nel prototipo non ha senso (dati mock), ma nel brief crea confusione su cosa implementare ora.

5. **Estensione 3D.** Three.js è menzionato, ma non è chiaro se serva una visualizzazione orbitale realistica (dati NASA veri) o una rappresentazione simbolica (quella fatta nel prototipo).

## Cosa ho imparato sul briefing?

1. **Separare requisiti in tier.** Esempio:
   - **P0 (Prototype):** dashboard, grafici, lista asteroidi, alert base, tema visuale
   - **P1 (Build):** backend FastAPI, caching, NASA API reale, auth
   - **P2 (Polish):** 3D realistico, WebSocket, test E2E

2. **Indicare esplicitamente mock vs reale.** Specificare _"per il prototipo i dati sono mock, nella build finale si integra NASA API"_ toglie ogni ambiguità.

3. **Allineare stack e formato di consegna.** Se si vuole Next.js, chiedere Next.js. Se si vuole HTML, non elencare Recharts nel stack per il prototipo.

4. **Una sezione "Non incluso nel prototipo" eviterebbe fraintendimenti.** Elencare cosa sarà rimandato alla build successiva.

## Prossimo passo

Il prototipo è stato approvato e pushato su GitHub (branch `dev`). Il prossimo passo naturale è:

- [x] **Settimana 1** — Prototipo HTML (completato ✅)
- [ ] **Settimana 2** — Setup backend FastAPI + proxy NASA NeoWs con caching
- [ ] **Settimana 3** — Setup frontend Next.js + Shadcn UI + Recharts
- [ ] **Settimana 4** — Integrazione frontend-backend, auth utente, alert system reale
- [ ] **Settimana 5** — 3D visualization realistica, test, deploy

In attesa della tua decisione sul prossimo task. 🚀
