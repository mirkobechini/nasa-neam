# Fix: Tooltip testo nero in bubble chart (dark mode)

## Obiettivo

Il tooltip del bubble chart Recharts mostra testo nero su sfondo scuro perché non è forzato il colore chiaro.

## Causa

Recharts tooltip `contentStyle` non include `color: #fff`.

## Soluzione

Aggiungere `color: "#e8e8f0"` al `contentStyle` del Tooltip in `bubble-chart.tsx`.

## Status

[ ] Non iniziata
