# Fix: Improve Earth texture and asteroid labels in 3D viewer

## Obiettivo

1. **Texture Terra**: Cambiare da colore piatto a texture riconoscibile come Terra (oceani blu, continenti verdi/marroni)
2. **Asteroid labels**: Ridimensionare enormemente i label (ora sono troppo grandi), renderli leggibili

## Dettagli

- Attualmente: texture sembra Nettuno (gradiente blu/azzurro)
- Nuovo: texture realistica con dettagli riconoscibili (vedere esempio di Giove nella foto)
- Labels: Ridurre dimensioni e posizionare meglio (offset rispetto asteroide)
- Font più piccolo, layout compatto

## Dipendenze

- PR #49 (Earth texture generator)

## Status

[x] Completata — PR #52 (2026-07-05)

- Texture Terra completamente rivista: oceani blu realistici, continenti con colori vari (verdi, marroni, arancioni)
- Aggiunti più continenti (Groenlandia, Nuova Zelanda, Antartide)
- Aggiunto effetto nuvole e atmosfera
- Asteroid labels ridotti da 256x128 a 120x60
- Font ridotti: nome 24px → 10px, distanza 14px → 8px
- Sprite scale ridotta da (2,1,1) a (0.8,0.4,1)
- 72 test totali, tutti passanti
