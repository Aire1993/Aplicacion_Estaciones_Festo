# Estacions de Festo

Aplicació web (un sol fitxer `index.html`) per publicar a Google Sites.

- Pantalla inicial amb les tres estacions: Distributing Conveyor, Pick and Place i Sorting.
- Pantalla de cada estació: imatge, text descriptiu i els botons
  "Esquemes", "Entrades/Sortides PLC", "Grafcet" i "Components".

## Publicar a Google Sites

1. A Google Sites: **Insereix → Insereix (Embed) → Insereix codi**.
2. Enganxa tot el contingut de `index.html` i ajusta l'alçada del bloc.

Les imatges es carreguen des de Google Drive, per tant els fitxers han d'estar
compartits com a "Qualsevol persona amb l'enllaç".

## Afegir contingut als botons

A `index.html`, afegeix a cada estació de `STATIONS` un objecte `sections`
amb l'HTML de cada botó (`esquemes`, `io-plc`, `grafcet`, `components`).
