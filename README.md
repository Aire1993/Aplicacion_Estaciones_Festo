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
| **Peu de pàgina** | Franja de baix de tot: descripció i autoria de la web, enllaç al glossari i opció per no subratllar-ne les paraules, enllaços a l'InfoPortal de Festo i a l'Escola del Treball, llicència (CC BY-NC-SA 4.0), avís de web no oficial i «Torna a dalt». |
| **Glossari** | Pàgina amb les paraules tècniques de la web (s'hi arriba des del peu de pàgina). |
| **Definició** | Finestreta que s'obre en tocar una paraula subratllada amb punts. |

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

**Al mòbil**, Google Sites posa la web en un recuadre baix amb la seva pròpia barra de desplaçament (l'alçada
del bloc al mòbil la decideix Google Sites a partir de la de l'ordinador, i no es pot canviar des del codi).
Per això, al mòbil i dins de Google Sites, a dalt de la web surt l'avís **«Obre a pantalla completa»**: obre la
web publicada a **GitHub Pages** (<https://aire1993.github.io/Aplicacion_Estaciones_Festo/>, `FULL_URL` a
`index.html`) en una pestanya nova, a tota la pantalla i a la mateixa estació. L'avís es pot tancar amb la ×
(no es recorda: torna a sortir quan es carrega la pàgina) i l'enllaç també és al peu de pàgina. GitHub Pages publica la branca `main`: el que
s'hi puja es veu en aquesta adreça al cap d'un o dos minuts.

Configuració del lloc de Google Sites:

- **Nom del lloc** (a la capçalera, «Introdueix el nom del lloc»): Estacions didàctiques Festo MPS · Escola del Treball
- **Favicon**: `icona/icona-512.png` (vegeu [Icona](#icona-favicon)).
- **Estadístiques de visites**: Google Analytics (GA4), a **Configuració → Analytics** amb l'ID de mesura
  (`G-…`). No hi ha cap codi a `index.html`: es compten les visites al lloc de Google Sites, no el que es fa dins
  del bloc incrustat ni les visites a GitHub Pages.

Google Sites no permet escriure una descripció només per als cercadors (la «meta descripció»): Google la treu
del text visible del lloc, i no llegeix el que hi ha dins del bloc incrustat. S'ha decidit no afegir-hi cap text
de presentació, així que als resultats de cerca sortirà sobretot el nom del lloc.

Les imatges i els vídeos es carreguen des de Google Drive, per tant els fitxers han d'estar
compartits com a "Qualsevol persona amb l'enllaç".

## Icona (favicon)

A la carpeta `icona/` hi ha la icona de la web (una cinta amb una peça, blanca sobre el blau de Festo):
`icona.svg` i els PNG de 512, 192 i 48 px.

- **Google Sites**: la icona de la pestanya i dels resultats de cerca és la del lloc. Es puja a
  **Configuració (engranatge) → Imatges de marca → Favicon** (`icona-512.png`) i després cal **Publicar**.
- **A la web**: la mateixa icona és a `SITE_ICON` (`index.html`). Surt a la pestanya que s'obre per
  descarregar un PDF i quan s'obre la pàgina sola. Si es canvia la icona, cal canviar-la als dos llocs.

## Afegir contingut als botons

A `index.html`, cada estació de `STATIONS` té un objecte `sections` amb el contingut
de cada botó (`esquemes`, `io-plc`, `grafcet`, `components`):

- `{ pdf: "ID de Google Drive" }` mostra el PDF dins de la pàgina amb el visor de Drive
  (ara: MA1B1, MA2B1 i MA3B1).
- `{ catalog: ... }` mostra el catàleg de components (MA1B4, MA2B4, MA3B4).
- `{ grafcet: ... }` dibuixa el grafcet de l'estació (MA1B3, MA2B3 i MA3B3).
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

## Grafcet (MA1B3, MA2B3, MA3B3)

Grafcet de cada estació segons la norma IEC 60848, dibuixat a la mateixa pàgina (SVG) a partir de
les dades de `GRAFCET_DISTRIBUTING`, `GRAFCET_PICK_PLACE` i `GRAFCET_SORTING`. Cada estació té tres
grafcets parcials jerarquitzats:

| Grafcet | Què fa |
| --- | --- |
| **GS · Seguretat** | Seta d'emergència o STOP mantingut 3 s: ho atura tot i obliga a fer RESET. Força GC i GP. Igual a les tres estacions (`gfSafety`). |
| **GC · Conducció** | Panell de comandament: RESET (només en MAN), estació preparada, AUTO (cicles seguits) o MAN (un cicle). Un STOP curt deixa acabar el cicle i atura l'automàtic. Força GP. |
| **GP · Producció** | La seqüència de l'estació segons Festo Didactic. |

Cada estació segueix el seu programa de PLC oficial de Festo:

| Estació | Particularitats |
| --- | --- |
| **Distributing** (MA1B3) | La llum MAGATZEM BUIT segueix sempre el sensor; si el magatzem és buit, la producció espera a l'etapa 0. |
| **Pick and Place** (MA2B3) | La ventosa agafa la peça insert (mínim 1,2 s); si al cap de 3 s no l'ha agafada, la producció va a l'etapa 10 (llum ERROR) i la conducció torna a l'etapa 20: cal fer RESET. A la posada a zero, primer puja la ventosa i després es recull el carro. |
| **Sorting** (MA3B3) | Divergència en O de tres branques (vermella, metàl·lica, negra) que tornen a ajuntar-se (convergència en O). La llum RAMPA PLENA s'encén quan el sensor de les rampes fa 1 s que està actiu; si passa amb la producció en repòs, cal buidar la rampa i fer RESET. |

Els senyals del panell (`GF_PANEL_VARS`), el grafcet de seguretat (`gfSafety`) i les transicions de
RESET i START de la conducció (`GF_GC_TRANS`) són comuns a les tres estacions.

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
- Posició: cada etapa té una fila (`row`) i, si no és a la primera, una columna (`col`). Les branques d'una divergència
  en O van a columnes diferents i, si tornen a una etapa d'una altra columna, s'hi ajunten amb una convergència en O.
  Una transició pot portar `col` per triar-ne la columna (p. ex. dues transicions que surten de la mateixa etapa i
  tornen enrere: les de la primera columna tornen per l'esquerra i les altres per la dreta).
- Temporitzacions: `3s/`, `500ms/`, `1200ms/X2` (l'etapa 2 fa 1,2 s que és activa).

### Simulació

El botó **Simula** posa en marxa els tres grafcets de l'estació alhora, segons la norma IEC 60848
(transicions franquejades alhora, evolució fugaç, temporitzacions en temps real i forçats per ordre de
jerarquia). L'alumne fa de màquina:

- **Panell de comandament**: START i RESET (amb la llum quan s'encén), STOP (normalment tancat: es pot
  mantenir premut 3 s), el selector AUTO/MAN i la seta, que es queda premuda.
- **Sensors**: cada entrada es pot posar a 0 o a 1. Amb *Els actuadors es mouen sols*, els sensors de posició
  dels cilindres (marcats amb «auto») canvien sols quan s'activen les sortides; els de les peces els canvia l'alumne.
- **Sortides**: llums que mostren quines sortides estan activades.
- Al dibuix es marquen les etapes actives (amb la marca de la norma), les accions actives i les transicions
  que s'esperen; a la llista *S'espera* hi ha aquestes transicions i el temps de les temporitzacions en marxa.

Dades de cada estació per a la simulació:

- `rest: 1` en una entrada de `vars`: val 1 en repòs (p. ex. STOP, que és normalment tancat, o G1BG3,
  que dona 1 quan el final de la cinta és lliure). Les altres comencen a 0.
- `motions`: com es mouen els actuadors. `{ out: "expulsor", val: 1, start: { recollit: 0 }, time: 0.6, end: { avancat: 1 } }`
  vol dir que, quan la sortida `expulsor` val 1, `recollit` passa a 0 de seguida i `avancat` a 1 al cap de 0,6 s.
- `simHint`: el text que explica què ha d'activar l'alumne.

El motor de la simulació (`gfSimCreate`) no toca la pàgina: les proves el fan servir directament.

## Glossari

Paraules tècniques de la web explicades en català (`GLOSSARY` a `index.html`), agrupades per temes
(`GLOSSARY_CATS`): grafcet i modes de marxa, PLC i senyals, sensors, pneumàtica i actuadors, i les estacions.

- **Pàgina** `#glossari`, des de la columna «Glossari» del peu de pàgina: cercador i filtre per tema.
  `#glossari/biestable` obre la pàgina amb aquesta paraula marcada.
- **Als textos** (descripció de l'estació, grafcet, taula d'entrades i sortides, components i el mateix glossari),
  les paraules del glossari surten subratllades amb punts la primera vegada que apareixen en cada text (a la taula
  d'entrades i sortides, un sol cop a tota la taula). En tocar-les s'obre la definició, amb un enllaç al glossari.
- **Opció del peu de pàgina** «Subratlla les paraules del glossari als textos»: si es desmarca, les paraules
  tornen a ser text normal (sense subratllat ni definició) a tota la web. Cada navegador recorda l'opció triada.
- Cada paraula: `{ id, cat, term, def }` i, si cal, `words` (com pot sortir als textos, p. ex. en plural),
  `also` (altres noms, que també es mostren) i `mark: false` (no es marca als textos perquè surt a tot arreu,
  com «etapa» o «PLC»).

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

## Proves

A la carpeta `tests` hi ha proves automàtiques per comprovar la web abans de publicar un canvi:

| Fitxer | Què comprova |
| --- | --- |
| `grafcet-data.js` | Les dades dels tres grafcets: senyals, etapes, transicions, accions, forçats i moviments. |
| `glossary-data.js` | Les dades del glossari: noms únics, temes i definicions completes. |
| `sim-distributing.js`, `sim-pick-place.js`, `sim-sorting.js` | Situacions de cada grafcet (cicle, RESET, STOP curt i de 3 s, seta, errors, rampa plena…) amb el motor de simulació de la pàgina. |
| `sim-motions.js` | La simulació amb els actuadors que es mouen sols. |
| `web-smoke.js` | Tota la web: inici, les tres estacions i els quatre botons, a l'ordinador, al mòbil i incrustada com a Google Sites, sense errors. |
| `web-grafcet.js` | Els dibuixos dels grafcets (cap text a sobre d'un altre o d'una línia), les explicacions, la finestra ampliada i el mòbil. |
| `web-simulator.js` | El simulador a la pàgina: polsadors (també mantenint-los premuts i amb el teclat), sensors, dibuix, mòbil i Google Sites. |
| `web-glossary.js` | El glossari: enllaç del peu, cercador, temes, enllaç a una paraula, les definicions als textos (també dins de les fitxes, al mòbil i a Google Sites) i l'opció per no subratllar-les. |
| `web-fullscreen.js` | L'avís «Obre a pantalla completa»: només al mòbil dins de Google Sites; obre GitHub Pages a la mateixa estació, es pot tancar (torna a sortir en recarregar) i l'enllaç queda al peu. |
| `web-pdf.js` | Els PDF del grafcet i de la taula d'entrades i sortides, també dins de Google Sites. |

Cal tenir [Node.js](https://nodejs.org/). La primera vegada:

```
npm install
npx playwright install chromium
```

I després:

```
npm test            # totes les proves (un parell de minuts)
npm run test:sim    # només les de dades i simulació, sense navegador (un segon)
node tests/run.js -v   # totes, amb el detall de cada comprovació
```

Les proves amb navegador no surten a Internet: Google Drive i el full de càlcul es substitueixen per
respostes locals (la taula d'entrades i sortides fa servir la còpia guardada a la pàgina). Les captures i els
PDF que generen queden a `tests/out` (no es pugen al repositori).

## Memòria i codis QR

A `memoria/img` hi ha les imatges de la memòria del projecte (captures de la web a l'ordinador i al mòbil,
el full de càlcul, l'esbós de les pantalles i els PDF) i els codis QR de les tres estacions. Cada QR obre
la seva estació a GitHub Pages, a pantalla completa:

| Estació | Imatge | Adreça del QR |
|---|---|---|
| Distributing Conveyor Station | `qr-distributing-conveyor.png` | https://aire1993.github.io/Aplicacion_Estaciones_Festo/#distributing-conveyor |
| Pick and Place Station | `qr-pick-and-place.png` | https://aire1993.github.io/Aplicacion_Estaciones_Festo/#pick-and-place |
| Sorting Station | `qr-sorting.png` | https://aire1993.github.io/Aplicacion_Estaciones_Festo/#sorting |
