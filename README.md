# Aplicacion_Estaciones_Festo

Web «Estacions de Festo» para publicar en Google Sites.

Todo está en un único fichero, `index.html` (HTML + CSS + JavaScript, sin dependencias):

- **Pantalla inicial**: título «Estacions de Festo» y tres tarjetas (Distributing Conveyor Station,
  Pick and Place Station y Sorting Station) con foto y título.
- **Pantalla de cada estación**: título, imagen a la izquierda, texto descriptivo a la derecha y
  cuatro botones: *Esquemes*, *Entrades/Sortides PLC*, *Grafcet* y *Components*. De momento cada
  botón muestra «Contingut en preparació.»

La navegación usa la dirección (`#/sorting-station`, `#/sorting-station/grafcet`…), así que el
botón «atrás» del navegador funciona.

## Publicar en Google Sites

1. Abre el sitio en Google Sites → **Insertar** → **Insertar** (Incrustar) → pestaña **Insertar código**.
2. Copia todo el contenido de `index.html` y pégalo. Pulsa **Siguiente** → **Insertar**.
3. Amplía el recuadro insertado a todo el ancho de la página y dale una altura de unos 1000 px
   (Google Sites no ajusta la altura automáticamente; si el contenido no cabe, aparece una barra
   de desplazamiento dentro del recuadro).
4. **Publica** el sitio.

## Dónde está el contenido

Todo el contenido está al principio del `<script>` de `index.html`, en la lista `STATIONS`:

- `driveId`: identificador de la foto en Google Drive. Las fotos deben seguir compartidas como
  «Cualquier persona con el enlace» para que se vean.
- `localImage`: copia de la foto en la carpeta `img/` del repositorio. Solo se usa si Drive falla
  y la página se abre desde el repositorio (no desde Google Sites).
- `description`: el texto descriptivo, copiado de los documentos de Google Docs. Si se modifica un
  documento, hay que actualizar este texto a mano.
- `sections`: el contenido (HTML) de cada botón. Mientras esté vacío, se muestra
  «Contingut en preparació.»

## Tipografía

La letra es Segoe UI. Es una fuente de Windows: en Mac, iOS o Android, donde no está instalada,
el navegador usa la letra del sistema.
