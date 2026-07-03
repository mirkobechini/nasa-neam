# Feature: PWA (Progressive Web App)

## Obiettivo

Rendere la webapp installabile come app su dispositivi mobile/desktop con supporto offline parziale.

## Dipendenze

- Feature 04 (Asteroid Catalog) — app completa prima di renderla PWA

## Stack

- Next.js PWA (next-pwa o Service Worker manuale)
- Web App Manifest

## Output atteso

- `manifest.json`: nome, icona, tema colore, display standalone
- Service Worker: cache static assets, fallback offline
- Icone: 192x192, 512x512 (tema spazio)
- Prompt di installazione su mobile/desktop
- Test funzionalità offline

## Note

Da implementare per ultimo, quando l'app è completa.

## Status

[ ] Non iniziata
