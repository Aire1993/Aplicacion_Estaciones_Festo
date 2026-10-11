# Estacions de Festo

Aplicació web (un sol fitxer `index.html`) per publicar a Google Sites.

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

A `index.html`, afegeix a cada estació de `STATIONS` un objecte `sections`
amb l'HTML de cada botó (`esquemes`, `io-plc`, `grafcet`, `components`).
