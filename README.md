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
| **Barra superior** | Franja blanca de dalt de tot: logo de FESTO, el text «Estacions didàctiques» (enllaç per tornar a la pàgina inicial) i el logo de l'Escola del Treball (dreta). |
| **Banda del títol** | Franja grisa amb el títol gran. |
| **Targetes** | Els tres requadres de la pantalla inicial (foto + nom de l'estació). |
| **Fitxa de l'estació** | Pantalla de cada estació: imatge a l'esquerra i descripció a la dreta. |
| **Botons** | "Esquemes", "Entrades/Sortides PLC", "Grafcet" i "Components". |
| **Panell de contingut** | Requadre gris que s'obre sota els botons. |
| **Reproductor ampliat** | Vídeo en gran que apareix després de passar el ratolí per la imatge. |
| **Peu de pàgina** | Franja de baix de tot: descripció i autoria de la web, enllaços a l'InfoPortal de Festo i a l'Escola del Treball, llicència (CC BY-NC-SA 4.0), avís de web no oficial i «Torna a dalt». |

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
- `{ catalog: ... }` mostra el catàleg de components (MA1B4, MA2B4, MA3B4).
- `{ grafcet: ... }` dibuixa el grafcet de l'estació (ara: MA1B3).
- `{ io: ... }` mostra la taula d'entrades i sortides del PLC (MA1B2, MA2B2 i MA3B2).
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

## Grafcet (MA1B3)

Grafcet de l'estació segons la norma IEC 60848, dibuixat a la mateixa pàgina (SVG) a partir de
les dades de `GRAFCET_DISTRIBUTING`. Té tres grafcets parcials jerarquitzats:

| Grafcet | Què fa |
| --- | --- |
| **GS · Seguretat** | Seta d'emergència o STOP mantingut 3 s: ho atura tot i obliga a fer RESET. Força GC i GP. |
| **GC · Conducció** | Panell de comandament: RESET (només en MAN), estació preparada, AUTO (cicles seguits) o MAN (un cicle). Un STOP curt deixa acabar el cicle i atura l'automàtic. La llum de magatzem buit segueix sempre el sensor. Força GP. |
| **GP · Producció** | La seqüència de l'estació segons Festo Didactic. |

RESET, STOP i la llum de magatzem buit es comporten com al programa de PLC oficial de Festo.

- Es pot veure en tres nivells: **Funcional** (en paraules), **Tecnològic** (etiquetes dels esquemes)
  i **PLC** (adreces). Les adreces són les de la documentació de Festo (byte 0 = estació, byte 1 = panell).
- Passant el ratolí per sobre (o tocant) una etapa o una transició se'n veu l'explicació, i a la taula
  es ressalten els senyals que fa servir. **Amplia** mostra el grafcet en gran.
- **Descarrega en PDF** genera a la mateixa pàgina (sense llibreries externes) un PDF A4 amb el nivell seleccionat:
  una pàgina per a cada grafcet (vertical o apaïsada, la que el faci més gran) i, al final, la taula de senyals i les
  notes de cada etapa i transició. Dins de Google Sites es descarrega des d'una pestanya nova, com el PDF de la taula
  d'entrades i sortides.
- `vars`: cada senyal amb l'adreça (`plc`), l'etiqueta (`tag`) i la descripció (`desc`). Les sortides que
  fan d'acció porten també `fn` (text de l'acció al nivell funcional) i, si cal, `tagAct` (text al nivell
  tecnològic, p. ex. `G1MA1 endavant`).
- Condicions de les transicions (`c`): noms de `vars`, `X12` = etapa 12 activa, `*` = I, `+` = O,
  `/` = negat, `^` = flanc de pujada i `3s/` = temporització (`3s//stop`: STOP premut durant 3 s).
  `fn` és la mateixa condició en paraules.
- Accions de les etapes (`act`): `{ v: "senyal" }`, condicionada `{ v: "senyal", cond: "condició", condFn: "en paraules" }`,
  o ordre de forçat `{ force: "GP", to: "INIT" }` (`"INIT"` = situació inicial, `""` = cap etapa activa, `"8"` = etapa 8).

## Entrades/Sortides PLC (MA1B2, MA2B2, MA3B2)

Taula d'entrades i sortides del PLC de l'estació: adreça, etiqueta, què vol dir que valgui 1, component,
cablejat SysLink (borne i color del cable), terminal d'E/S, nom de la variable als programes de Festo i
observacions. Es pot filtrar per tipus i cercar.

- Les dades es llegeixen d'un **full de càlcul de Google** (`IO_SHEET` a `index.html`; ara el full
  [Taula_Entrades_Sortides_PLC](https://docs.google.com/spreadsheets/d/1bfW_ojUxIs_cTEsquKxMJyKHq8XLHFUZHT5bAMV0rog/edit)
  del compte de l'escola). Qualsevol canvi que s'hi faci es veu a la web en recarregar la pàgina, sense tocar
  el codi. El full ha d'estar compartit com a "Qualsevol persona amb l'enllaç (lector)".
- El botó **Descarrega en PDF** genera a la mateixa pàgina (sense llibreries externes) un PDF A4 apaïsat amb totes
  les files de la taula, agrupades com a la web, encara que hi hagi filtres o una cerca. Dins de Google Sites el
  fitxer es descarrega des d'una pestanya nova, perquè el bloc incrustat pot tenir les descàrregues bloquejades.
  El full de càlcul es pot continuar baixant en Excel des de Google Sheets (Fitxer › Baixa).
- Cada estació llegeix la pestanya que diu el seu `tab`: `MA1` (`IO_DISTRIBUTING`), `MA2` (`IO_PICK_PLACE`) i
  `MA3` (`IO_SORTING`). Cada configuració porta també les fonts de l'estació (esquemes, manual i programa de Festo).
- La web reconeix les columnes pel nom de la capçalera (fila 1), sense tenir en compte accents ni majúscules:
  `Tipus`, `Adreça PLC`, `Bit`, `Borne SysLink`, `Color del fil`, `Terminal E/S`, `Etiqueta`, `Variable Festo`,
  `Descripció`, `Quan val 1`, `Component`, `Mòdul`, `Esquema (pàg.)` i `Observacions`. `Tipus`, `Adreça PLC` i
  `Descripció` són imprescindibles. Les columnes noves es mostren als detalls de la fila.
- `Tipus` és `Entrada`, `Sortida` o `Alimentació` (la taula s'agrupa per tipus i mòdul). Si la descripció és
  `Lliure`, la fila es mostra com a bit lliure.
- Tot el full ha d'estar en format **Text sense format** (Format › Número): si una columna té números i text barrejats,
  Google només envia un dels dos tipus i les altres cel·les arriben buides (la web n'avisa).
- Si `IO_SHEET` és buit, el full no es pot llegir o hi falta alguna columna imprescindible, es mostra la còpia
  guardada a la configuració de l'estació (i un avís).
