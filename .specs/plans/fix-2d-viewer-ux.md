# Fix: 2D viewer improvements

## Obiettivo

Migliorare il viewer 2D: legenda più grande, drag fluido senza scatti.

## Dettagli

- **Legenda safe/hazardous:** aumentare dimensione font e padding
- **Drag a scatti:** il problema è che il redraw cancella e ridisegna tutto su ogni movimento. Soluzione: usare un canvas overlay per il drag o limitare i redraw

## Status

[ ] Non iniziata
