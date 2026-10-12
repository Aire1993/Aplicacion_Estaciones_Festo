# Estacions de Festo

Aplicació web (un sol fitxer `index.html`) per publicar a Google Sites.

## Nomenclatura

| Abreviatura | Significat |
| --- | --- |
| **PP** | Pàgina Principal (tria d'estació) |
| **MA1 / MA2 / MA3** | Menú Apartat 1 (Distributing Conveyor), 2 (Pick and Place), 3 (Sorting) |
| **MAxB1…B4** | Botons de l'apartat x: B1 Esquemes, B2 Entrades/Sortides PLC, B3 Grafcet, B4 Components |

## Parts de la pàgina (noms per demanar canvis)

| Nom | On és |
| --- | --- |
| **Barra superior** | Franja blanca de dalt de tot: logo de FESTO (esquerra) i logo de l'Escola del Treball (dreta). |
| **Banda del títol** | Franja grisa amb la ruta de navegació ("Inici › …") i el títol gran. |
| **Targetes** | Els tres requadres de la pantalla inicial (foto + nom de l'estació). |
| **Fitxa de l'estació** | Pantalla de cada estació: imatge a l'esquerra i descripció a la dreta. |
| **Botons** | "Esquemes", "Entrades/Sortides PLC", "Grafcet" i "Components". |
| **Panell de contingut** | Requadre gris que s'obre sota els botons. |
| **Reproductor ampliat** | Vídeo en gran que apareix després de passar el ratolí per la imatge. |
| **Peu de pàgina** | Franja de baix de tot (ara buida, pendent de contingut). |

## Vídeos

En passar el ratolí per sobre de la imatge d'una estació es reprodueix el seu vídeo
i, al cap de 3 segons, s'amplia amb línia de temps, pausa/reprendre i pantalla completa.

Els vídeos es carreguen des de Google Drive. Els originals estan en format HEVC (H.265),
que alguns navegadors no poden reproduir: en aquest cas la web obre automàticament el
reproductor de Google Drive en clicar la imatge.

Per a la màxima compatibilitat, a la carpeta `videos/` hi ha els mateixos vídeos en
format H.264. Es poden pujar a Drive com a **versió nova** del fitxer original
(clic dret › Informació del fitxer › Gestiona les versions › Penja una versió nova), així
l'enllaç no canvia i no cal tocar el codi.

## Publicar a Google Sites

1. A Google Sites: **Insereix → Insereix (Embed) → Insereix codi**.
2. Enganxa tot el contingut de `index.html` i ajusta l'alçada del bloc.

Les imatges i els vídeos es carreguen des de Google Drive, per tant els fitxers han d'estar
compartits com a "Qualsevol persona amb l'enllaç".

## Afegir contingut als botons

A `index.html`, cada estació de `STATIONS` té un objecte `sections` amb el contingut
de cada botó (`esquemes`, `io-plc`, `grafcet`, `components`):

- `{ pdf: "ID de Google Drive" }` mostra el PDF dins de la pàgina amb el visor de Drive
  (ara: MA1B1, MA2B1 i MA3B1).
- Un text HTML per a contingut escrit.

Els PDF han d'estar compartits com a "Qualsevol persona amb l'enllaç".

## Components (MA1B4, MA2B4, MA3B4)

Catàleg de components de cada estació amb dades del Festo Didactic InfoPortal i de les fitxes
tècniques del fabricant. Els mòduls i components es defineixen una sola vegada a
`FESTO_COMPONENTS` i cada estació indica quins en té (`festoCatalog(...)`), de manera que les
peces repetides comparteixen les mateixes dades.

- `FESTO_DRIVE_IMAGES`: fotos pujades a Google Drive (ruta de la foto a Festo → ID de Drive).
  Les que no hi són, o que fallen, es carreguen des de la web de Festo.
- `FESTO_DRIVE_PDFS`: fitxes tècniques pujades a Google Drive. Les que no hi són s'obren des de Festo.
