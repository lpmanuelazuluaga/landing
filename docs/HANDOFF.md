# Handoff: Landing de Registro (Manuela Zuluaga)

Para: Bruno y cualquier desarrollador que continúe el proyecto.
Estado al 2026-10-15. **Fase: diseño desplegado en Vercel, en revisión de la
agencia.** Los seis testimonios reales ya reemplazan el contenido provisional.
Antes de lanzar la campaña falta configurar el destino de los leads y completar
las tareas de publicación (ver "Tareas pendientes").

## Datos del proyecto

| Dato | Valor |
| --- | --- |
| Cliente | Manuela Zuluaga |
| Proyecto | Landing de Registro |
| Nombre técnico | `landing-registro` (`package.json`; npm y Vercel exigen minúsculas, por eso no `Landing-Registro`) |
| Temática | Desarrollo personal, amor propio y relaciones de pareja |
| Idioma y mercado | Español de Colombia: `lang="es-CO"`, `og:locale` `es_CO`, país por defecto `CO` |
| Landing | Una sola, `registro`, en la raíz `/`; gracias en `/gracias` |
| Ruta local | `C:\Users\Bruno\Desktop\Manuela Zuluaga` |
| Repositorio GitHub | https://github.com/lpmanuelazuluaga/landing (público, rama `main`) |
| Proyecto Vercel | `landing`, equipo `manuela-zuluaga` (plan Hobby), conectado al repositorio (ver "Vercel") |
| URL de producción | https://landing-omega-one-60.vercel.app/ (versión de revisión, noindex) |
| Materiales del cliente | `recursos_landings/` (originales, versionados a pedido; ver "Materiales") |
| Dominio definitivo | **Pendiente**: no conectar hasta que el cliente lo defina |
| Plantilla de origen | `landing-starter`, commit `28d7cef` (copia limpia, sin su historial) |

## Stack

Next.js 16.3.8 (App Router, Turbopack) · React 19.2.4 · TypeScript 5.9 estricto ·
Tailwind CSS 4.3 · ESLint 9 (`eslint-config-next` 16.3.8) · npm 11 · Node 24
(`.nvmrc` y `engines`).

Next 16.3.8 y no 16.2.x: la línea 16.2 tiene avisos de seguridad críticos sin
parche (RCE en servidores Windows, en la optimización de imágenes AVIF y en
`next/og`); 16.3.8 es la primera versión que los corrige todos. No se añadió
ninguna dependencia respecto de la plantilla salvo `country-flag-icons` (banderas
del selector de prefijo) y `lenis` (suavizado del scroll), justificadas en
`docs/ARCHITECTURE.md` → "Dependencias".

## Qué hay y qué no hay

- **Bienvenida y último paso (2026-10-15):** tras una entrega confirmada,
  el modal muestra «Tu lugar ya es tuyo» durante 1,2 s y después navega a
  `/gracias`, precargada al abrir el registro. La tarjeta aparece suavemente
  y da una bienvenida cálida; el bloque «Último paso» destaca la invitación
  a unirse al grupo de WhatsApp. Conserva el enlace confirmado y el botón
  verde. La conversión sigue ocurriendo una sola vez antes de la transición;
  un fallo de entrega nunca muestra la confirmación. Con reducción de
  movimiento se navega directamente y los bloques quedan estáticos.
  Verificado sobre el build en Chrome a 360, 390, 768 y 1440 px, con ambas
  preferencias: sin desbordamiento horizontal. API interceptada solo en la
  prueba local: validación y error 502 sin éxito, doble envío bloqueado,
  una conversión antes del mensaje y ninguna al recargar gracias. `check`
  y smoke (17/17) aprobados.

**Hay:**

- `src/lib/site.ts` con nombre de marca, idioma, locale y país del cliente;
  WhatsApp obligatorio en el formulario (`leads.requirePhone`) y casilla de
  privacidad desactivada (`leads.requireConsent: false`) mientras no haya
  política: ver "Pendientes".
- Una sola landing, en la raíz del dominio (`/`), con su página de gracias en
  `/gracias`. El registro se hace en un modal dentro de la landing: abrirlo no
  cambia la URL. Solo tras un registro confirmado se navega a `/gracias`.
- **La landing diseñada** de la masterclass gratuita "El amor no se sana"
  (ver "Diseño de la landing").
- Paleta del cliente en `src/styles/theme.css`; fuentes de marca solo en la
  landing.
- SEO con indexación consciente, 404 y error, `/api/leads` sin destino (503),
  tracking y consentimiento implementados pero inactivos, atribución, generador
  de landings, smoke test y CI.

**No hay, a propósito:** preguntas frecuentes, garantía, soporte por WhatsApp
ni precio (secciones de la referencia sin copy del cliente). El diseño se hizo
con Tailwind, CSS y SVG propios, con dependencias para las banderas del selector
de prefijo y el suavizado del scroll.

## Diseño de la landing

Reproduce la estructura, la composición y el estilo de una landing de
referencia (captura de escritorio entregada por la agencia, no versionada) con
el copy, las fotos y la marca de Manuela Zuluaga. No se usó ningún texto, logo
ni foto de la referencia.

| # | Sección (`_sections/`) | Diseño de la referencia que reproduce |
| --- | --- | --- |
| 0 | `CountdownBar` (`_components/`) | Agregada a pedido (no está en la referencia): barra fija superior de vidrio esmerilado sobre papel claro, "El amor no se sana" y cuenta regresiva (la fecha solo como texto para lectores de pantalla) a `EVENT.startsAt` (25 de octubre, 10 am, hora de Colombia). Al llegar la hora muestra "Online en vivo" |
| 1 | `Hero` | Hero (opción A aprobada: foto a sangre en lugar del recorte en arco). Escritorio: foto a la derecha, texto sobre degradado y franja vertical; el texto se acerca al borde izquierdo (~13 % del ancho: 256 px a 1909, 193 a 1440) y a 1024 px queda en la columna normal. Tablet: foto arriba. Móvil: foto vertical con el texto sobre la mesa |
| 2 | `Marquee` | Banda con texto en movimiento (se repite antes de Testimonios). La fecha lleva la bandera de Colombia en SVG (los emojis de banderas no se ven en Windows) |
| 3 | `TeEntiendo` | "É preciso aprender…": foto en sepia, texto vertical y sello |
| 4 | `Recompensa` | "A tríade": tres tarjetas con barra superior e ícono |
| 5 | `ParaTi` | "Metodologia" oscura: cuatro baldosas 01-04 con el sello del logo. En escritorio, al aparecer la sección (una vez, 1,6 s), las baldosas se van a las cuatro esquinas y los textos se juntan en el centro, centrados en su propio eje; el círculo central no se mueve (`_components/Escenario.tsx` + `.escenario` en `landing.css`). Con reducción de movimiento o sin JavaScript se ve el estado final |
| 6 | `QuienEs` | "Quem será sua mentora": foto en arco, nombre vertical, estampilla. En móvil y tablet la foto va entre la pregunta y el texto |
| 7 | `QueEs` | "O que é a escola?": espejo tallado (SVG propio) y tarjeta |
| 8 | `Testimonios` | Palabra de fondo y seis portadas de video escalonadas en un carrusel infinito con avance continuo. Cada portada abre su video en un modal. Copias laterales ocultas para accesibilidad; controles de pausa y navegación. Móvil: una tarjeta por vista; escritorio: tres |
| 9 | `Acceso` | Puerta de fondo, con imágenes distintas para móvil y escritorio, y tarjeta con sello (sin precio) |
| 10 | `Footer` | Pie con logo y derechos. Sin enlaces legales (decisión de la agencia) |

- **Detalles del hero (2026-10-14):** fecha y hora en elementos separados:
  "25 de octubre" (calendario) y "10am Colombia" (reloj), a pedido de Bruno.
  Textos en `EVENT.heroDate` y `EVENT.heroTime`; variante `hero` de `EventDetails`.
  Verificado en Chrome a 360, 390 y 1440 px, con y sin reducción de movimiento:
  cuatro elementos legibles y sin scroll horizontal. `check` y smoke aprobados.
- **Ajustes pedidos por Bruno (2026-10-14):** «El amor» del título del hero en
  cursiva; retirada la tarjeta «Plazas registradas» y su dato provisional;
  retirado el enlace «Volver a la página» de `/gracias`. El espejo y la tarjeta
  de «¿Qué es?» ocupan la grilla sin la fila del contador.
  Landing y gracias verificadas en Chrome a 360, 390 y 1440 px, con y sin
  reducción de movimiento (12 casos): sin scroll horizontal, un solo `h1` por
  página y cursiva solo en la primera línea del hero. `check` y smoke aprobados.
- **Versiones integradas:** los cuatro commits de `feat/registro-diseno`
  posteriores al primer PR (`c41a6b6` a `9432165`) se incorporan a `main`, junto
  con los ajustes posteriores del hero y gracias. Incluyen barra sin fecha
  visible, «Sobre» de fondo en móvil, tarjetas de vidrio en «Para ti», carrusel
  infinito, prefijo de WhatsApp con bandera y posición del hero en escritorio.
  Integración comprobada con `check`, smoke (17/17) y Chrome a 360, 390, 768,
  1024 y 1440 px, con y sin reducción de movimiento (20 casos). Se verificó
  además el carrusel sin mover la página, el modal sin cambio de URL, sus tres
  campos obligatorios, el selector de país y el cierre con Esc. El servidor de
  desarrollo en `localhost:3000` ya responde con «Sobre» y la barra sin fecha.
  `main` y `feat/registro-diseno` se sincronizan para que producción y preview
  partan de este mismo código; el trabajo local permanece en `main`.
- **Registro:** todos los botones "Reservar mi lugar ahora" abren el mismo modal
  (`_components/Registration.tsx`, sobre `Dialog` con `bare`). El modal es la
  tarjeta de oferta de la referencia: papel, sello con el logo, título, detalles
  del evento y formulario. Errores por campo, Esc y clic fuera cierran, el foco
  vuelve al botón.
- **WhatsApp con prefijo:** selector de país con bandera y prefijo (Colombia
  +57 por defecto, 28 países en `_components/countries.ts`). Es un `<select>`
  nativo transparente sobre la bandera, así que usa el selector del sistema y
  es accesible. El número se envía como `+57 300 000 0000`; si la persona ya
  escribe un prefijo (`+…`), se respeta.
- **Gracias:** grupo de WhatsApp confirmado y enlazado desde el botón «Unirme
  al grupo de WhatsApp» (`THANKS.whatsappUrl`); `thanksNextStep: false`.
  Los tres checks se dibujan en secuencia al cargar y «Confirmado» tiene un
  barrido de luz de izquierda a derecha con pausa entre pasadas. Con reducción
  de movimiento quedan estáticos y legibles. No se disparan conversiones aquí.
- **Ajustes del 2026-10-15:** puerta definitiva en «El acceso» con `<picture>`
  y `getImageProps` (móvil por debajo de 768 px, carga diferida, una sola imagen
  descargada); `accessPhoto: false`. «Recompensa» tiene la misma palabra de
  fondo recortada que «Sobre», solo en móvil. El botón de WhatsApp es verde con
  ícono de chat y teléfono, texto blanco con contraste AA (4,89:1 como mínimo)
  y hover más oscuro. El ejemplo del correo del modal es `ejemplo@correo.com`
  (`ui.form.emailPlaceholder`).
  Verificado en Chrome a 360, 390, 768, 1024 y 1440 px, con y sin reducción de
  movimiento (20 casos): encuadre correcto y una sola descarga de la puerta,
  marca de agua solo en móvil, correo de ejemplo y contraste del botón verde
  tanto normal como en hover. `check` y smoke (17/17) aprobados.
- **Encuadre de «Recompensa» (2026-10-15):** la palabra de fondo mantiene su
  ventana en el 45 % derecho del móvil, a la misma altura, pero ahora muestra
  el final de la palabra. La tipografía baja de `20vw` a `16vw` para que entre
  una porción mayor. El recorte queda limitado a esa ventana y sigue siendo
  decorativo (`aria-hidden`) y estático. Verificado en Chrome a 360, 390, 430,
  768 y 1440 px con ambas preferencias de movimiento, sin desbordamiento
  horizontal; `check` y smoke (17/17) aprobados.
- **Palabra partida y efectos sutiles (2026-10-15):** la marca de agua de
  «Recompensa» muestra «RECO» y media M arriba a la derecha; la otra media M
  y «PENSA» aparecen abajo a la izquierda del encabezado, antes del divisor.
  El fragmento inferior se bajó otros 10 px a pedido del cliente (`bottom: -2px`).
  Tipografía de `14.6vw`; cada mitad usa un recorte de `0.4175em`, medido en
  Cormorant Garamond. Las barras de las tres tarjetas tienen un pulso de luz
  de 6 s con desfase; las tarjetas de vidrio 01 y 03 de «Para ti» reciben un
  reflejo suave de 9 s, solo en móvil. Todo se mantiene estático con reducción
  de movimiento. QA en Chrome a 360, 390, 430, 768 y 1440 px y ambas
  preferencias de movimiento: mitades y esquinas correctas, sin desbordamiento
  horizontal, fases distintas de luz y reflejo verificadas. `check` y smoke
  (17/17) aprobados. El cliente confirmó que el audio funciona; este ajuste
  conserva el reproductor existente.
- **Testimonios reales (2026-10-15):** seis portadas numeradas asociadas a los
  seis enlaces entregados, con aviso para pulsarlas y modal de reproducción.
  Reemplazan los comentarios de ejemplo y la valoración provisional;
  `testimonials: false`. Avance continuo a 28 px/s, con pausa manual,
  interacción, hover, foco, fuera de pantalla y con el modal abierto.
  Con reducción de movimiento conserva navegación manual y puntos. El video
  solo se monta al elegir una portada; cerrar con botón, Esc o fondo detiene
  la reproducción y devuelve el foco. Los MOV originales son HEVC y Chrome
  de Windows solo reproducía audio: se sirven copias MP4 H.264/AAC con inicio
  rápido, conservando los originales en `content.ts`. Portadas JPEG a 1280 px;
  los seis PNG entregados también quedan versionados. Los seis MP4 pesan
  28,8 MB en total y conservan exactamente la duración de los originales;
  decodificación completa de imagen y audio verificada con FFmpeg.
  QA en Chrome a 360, 390, 768, 1024 y 1440 px con y sin reducción de
  movimiento: sin scroll horizontal, avance continuo y vuelta al inicio
  sin salto. Las seis portadas abren el video correcto, con fotogramas
  decodificados, sonido habilitado y controles nativos. Cierres con Esc,
  botón y fondo, pausa al cerrar, retorno del foco, swipe y toque en móvil,
  error de red y reintento probados. No se pide ningún video antes del clic;
  el modal cancela la inercia de Lenis. `check` y smoke (17/17) aprobados.
- **Pulido de hero y testimonios (2026-10-15):** debajo de 768 px se elimina
  el margen de 28 px entre logo y título, subiendo todo el contenido posterior.
  Desde 1024 px solo el logo baja 44 px para aproximar la separación visual
  a la de móvil, conservando la posición del resto del bloque. En testimonios,
  el hover no
  pausa el avance y el foco devuelto a una portada tras un clic tampoco: la
  pausa por foco queda reservada a la navegación de teclado. Soltar el gesto
  dentro o fuera de la lista permite retomar tras 900 ms; se mantiene la pausa
  manual y la preferencia de movimiento reducido. Se ocultan los nombres
  numerados tanto en las tarjetas como en el encabezado del modal, conservando
  sus etiquetas accesibles. Cada apertura solicita reproducción explícita con
  volumen 1 y sin mute; si el navegador la bloquea, muestra «Reproducir con
  sonido», sin recurrir a reproducción silenciada. QA en Chrome a 360, 390,
  768, 1024 y 1440 px con ambas preferencias de movimiento: separación del
  hero y ausencia de nombres visibles verificadas. El carrusel avanza con
  hover y tras los seis cierres, pausa al mantener pulsado y retoma al soltar
  fuera de la lista; conserva la pausa por teclado y vuelve a avanzar con
  interacción de puntero. Los seis videos decodifican audio a volumen 1 sin
  mute; se midió señal real con Web Audio y se probó silenciar uno y abrir
  otro con sonido. Apertura táctil, reintento de red y recuperación del
  bloqueo de autoplay aprobados. `check` y smoke (17/17) en verde.
- **Hero y scroll (2026-10-15):** en escritorio (desde 1024 px), «Online en
  vivo» pasa a la segunda fila, a la derecha de «Masterclass gratuita». La
  landing tiene un suavizado leve de scroll con Lenis 1.3.26: duración 0,65 s,
  easing cúbico de salida y `wheelMultiplier: 0.9`. Se monta solo en `/`, se
  retira al abrir el modal o activar reducción de movimiento y se limpia al
  salir. El tacto, el teclado y el desplazamiento horizontal del carrusel
  conservan su manejo nativo. No se añade CSS global de Lenis. QA en Chrome
  con 360, 390, 768, 1024 y 1440 px y ambas preferencias de movimiento: sin
  desbordamiento horizontal y filas correctas. Un gesto de rueda de 300 px
  termina en 270 px con transición gradual; con reducción de movimiento
  conserva 300 px. Teclado, scroll táctil, modal con scroll interno y carrusel
  horizontal probados sin interferencias ni errores de JavaScript. `check`
  y smoke (17/17) aprobados.
- **Cursor y cursiva:** cursor de mano en botones habilitados, enlaces,
  selectores y casillas de la landing y gracias. La primera línea del título
  del hero lleva la clase `italic` directamente (`Title.italicFirstLine`).
  Verificados en Chrome a 360, 390 y 1440 px, con y sin reducción de movimiento
  (12 casos): sin scroll horizontal, enlace de WhatsApp exacto, dibujo completo
  de los checks y barrido del brillo hacia la derecha. `check` y smoke aprobados.
- **Sin casilla de privacidad** (2026-10-14, a pedido): no hay política todavía.
  Reactivarla es un solo cambio (`site.leads.requireConsent = true`) y debe
  hacerse antes de lanzar anuncios (Ley 1581 de 2012).
- **Tipografías:** Cormorant Garamond (títulos, la de la referencia) y DM Sans
  (cuerpo, elección del cliente), con `next/font` en `fonts.ts`.
- **Texturas de papel** (`_assets/paper-*.jpg`): generadas para el proyecto
  con ruido procedural (SVG `feTurbulence` + iluminación), una sola imagen
  grande por tono, sin repetición.
- **Textos decorativos** (marquesina, sello, textos verticales, palabra de
  fondo, antetítulos): salen solo de frases del copy (`DECOR` en `content.ts`).
- **Responsive:** escritorio fiel a la referencia desde 1024 px; entre 768 y
  1023 px las composiciones a dos columnas se apilan; probado sin scroll
  horizontal a 360, 390, 768, 1024 y 1440 px.
- **Movimiento:** marquesina, sello giratorio, aparición al hacer scroll y
  entrada del modal, todo con CSS; se anula con `prefers-reduced-motion`.

### Contenido provisional (`PLACEHOLDERS` en `content.ts`)

| Qué | Cómo se ve hoy | Qué falta |
| --- | --- | --- |
| Testimonios | Seis videos entregados por el cliente, con sus portadas y modal de reproducción | Resuelto (`testimonials: false`); ya no se muestran ejemplos ni la valoración provisional |

**Después del evento:** la barra superior pasa a mostrar "Online en vivo" y la
landing sigue invitando a registrarse. Pasado el 25 de octubre, actualizar
`EVENT` (fecha y `startsAt`) o retirar la landing.

**Barrera de publicación:** mientras algún valor de `PLACEHOLDERS` sea `true`,
añadir la landing a `PUBLISHED_LANDINGS` hace fallar el build (`page.tsx`).
Al reemplazar cada contenido, poner su valor en `false`.

## Estructura de carpetas

```
.github/workflows/check.yml   CI: lint + typecheck + build + smoke (PR y push a main)
docs/                         ARCHITECTURE, CONVENTIONS, INTEGRATIONS, HANDOFF
recursos_landings/            materiales originales del cliente (no los usa el build)
scripts/                      new-landing.mjs (generador), smoke.mjs
templates/landing/            molde que copia el generador
src/
  app/
    layout.tsx                layout raíz
    favicon.ico icon.png apple-icon.png   íconos con la M del logo (todo el sitio)
    not-found.tsx error.tsx   404 y error
    robots.ts  sitemap.ts     según la regla de indexación
    (legal)/privacidad|cookies  rutas legales (texto pendiente del cliente)
    api/leads/route.ts        recepción de leads
    (registro)/               Landing de Registro, en "/" (route group: no suma segmento a la URL)
      page.tsx layout.tsx     composición de secciones, clase .lp-registro y fuentes
      fonts.ts                Cormorant Garamond + DM Sans
      content.ts              copy aprobado, detalles del evento, DECOR y PLACEHOLDERS
      landing.css             fondos con textura, botón, divisores, arco, animaciones
      _sections/              Hero, TeEntiendo, Recompensa, ParaTi, QuienEs, QueEs, Testimonios, Acceso, Footer
      _components/            Registration (botón + modal), LeadForm, CountdownBar + Countdown, EventDetails, TestimonialsCarousel,
                              decor (✦✦✦, sello, logo…), ornaments (espejo, estampilla, marquesina), icons, text
      _assets/                fotos optimizadas, logo recortado, texturas de papel
      gracias/page.tsx        confirmación (noindex siempre)
  components/ui/              Container, Dialog (<dialog> nativo; opción bare), Reveal
  components/tracking/        Tracking, ConsentBanner, ConsentGatedScripts, AttributionCapture
  content/ui.ts               textos de sistema (formulario, banner, 404, error)
  lib/                        site, seo, indexing, landings, tracking, consent, leads/…
  styles/theme.css            único @theme (tokens)
```

Detalle de cada capa en `docs/ARCHITECTURE.md`.

## Materiales

`recursos_landings/Landing-Registro/Img/` guarda los originales entregados para
la Landing de Registro (`hero/` móvil y escritorio, `main/`). Se versionan por
decisión de la agencia, sabiendo que el repositorio es público: cualquiera puede
descargarlos. Revisados el 2026-10-14: sin GPS ni datos de autor en los
metadatos.

- No se importan desde el código. Las copias que usa la landing están en
  `src/app/(registro)/_assets/`, en JPG de calidad alta (`docs/CONVENTIONS.md`,
  "Imágenes"): hero escritorio y móvil, `quien-es-manuela` (1600 px), `espejo`
  (recorte cuadrado centrado en Manuela) y `relacion` (era un JPEG con extensión
  `.png`; la copia ya es `.jpg`). El logo, recortado y en PNG con transparencia.
- El PNG móvil del hero se reemplazó el 2026-10-14 por una versión a color
  completo (684×2160). El de escritorio sigue en 256 colores: en degradados
  oscuros puede haber bandas; si existe el original en JPG, reemplazarlo.
- El 2026-10-15 se incorporaron `main/puerta-seccion.png` (1672×941) y
  `main/seccion-puerta-mobile.png` (941×1672), sin EXIF ni XMP. Las copias de
  la landing son `_assets/acceso-desktop.jpg` y `acceso-mobile.jpg`, JPG de
  calidad 94 y menos de 400 KB cada una. Los originales se conservan.
- No guardar aquí nada que no pueda ser público (contratos, datos personales,
  documentos internos).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm ci` | Instala exactamente lo del lockfile |
| `npm run dev` | Desarrollo en http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run build` | Build de producción |
| `npm run check` | lint + typecheck + build (**obligatorio en verde antes de entregar**) |
| `npm run smoke` | Tras un build: 404, noindex, tracking ausente, contrato de `/api/leads` (puerto 3210; otro con `SMOKE_PORT=3290`) |
| `npm run new:landing -- <slug> [--root]` | Crea una landing desde `templates/landing/` |

## Cómo generar landings

```bash
npm run new:landing -- <slug>          # → src/app/<slug>/  (/<slug>)
npm run new:landing -- <slug> --root   # → src/app/(<slug>)/  (/), exige que no haya otra página en "/"
```

- Slug en kebab-case y en español (`masterclass`, `lista-de-espera`). Nunca
  sobrescribe; rechaza slugs reservados (`api`, `gracias`, `privacidad`…).
- Después: completar `content.ts`, construir `_sections/`, añadir la ruta a la
  tabla del README.
- **Decisión del 2026-10-14:** la Landing de Registro ocupa la raíz, dentro del
  route group `src/app/(registro)/` (los paréntesis no generan segmento en la
  URL). No existe `src/app/page.tsx`: dos páginas en `/` rompen el build. Una
  landing nueva iría en `src/app/<slug>/` (`/<slug>`).
- Publicar (indexar) una ruta = añadirla a `PUBLISHED_LANDINGS`
  (`src/lib/landings.ts`) **y** activar las variables de indexación. Hoy está
  vacío a propósito.

## Cómo incorporar componentes

- Antes de crear uno, revisar `src/components/ui/` (Container, Dialog, Reveal).
- Componentes con identidad visual de la landing → `src/app/(registro)/_components/`
  o `_sections/`. Al núcleo (`src/components/ui/`) solo sube lo que no tiene
  diseño propio.
- Una landing nunca importa de otra.
- Copy en `content.ts`; nunca hex en JSX (tokens semánticos `bg-accent`,
  `text-muted`…); nunca clases interpoladas (`bg-${x}`).
- Fuentes con `next/font` en `src/app/(registro)/layout.tsx`, no en el layout
  raíz. Imágenes importadas desde `_assets/`. Hero con `loading="eager"` +
  `fetchPriority="high"` (`priority` está deprecado en Next 16).
- Formularios: la UI es de la landing, la lógica siempre `useLeadForm` +
  `/api/leads`. Conservar `name="name|email|phone|consent"` y el honeypot
  `hp_check`.
- Dependencias nuevas (animación, carrusel…) solo con necesidad concreta, y
  justificadas en `docs/ARCHITECTURE.md` → "Dependencias".
- Leer `node_modules/next/dist/docs/` del tema antes de tocar APIs de Next.

Reglas completas en `AGENTS.md` y `docs/CONVENTIONS.md`.

## Variables de entorno

Todas vacías hoy; vacías, cada integración queda inactiva y el build pasa sin
secretos. No hay `.env.local` en el repositorio (`.gitignore` ignora `.env*`
salvo `.env.example`).

| Variable | Ámbito | Estado | Efecto |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | público | vacía | URL real: canonical, og:url, sitemap |
| `NEXT_PUBLIC_SITE_INDEXABLE` | público | vacía | `true` solo el día de publicar |
| `NEXT_PUBLIC_CONSENT_MODE` | público | vacía (= `required`) | `not-required` solo con validación legal |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GTM_ORIGIN` | público | vacías | GTM con Consent Mode v2 |
| `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | público | vacías | Carga directa tras consentimiento |
| `GHL_API_TOKEN`, `GHL_LOCATION_ID` | servidor | vacías | Destino de `/api/leads`: GoHighLevel (prioridad) |
| `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` | servidor | vacías | Destino alternativo si GHL no está configurado |

Las `NEXT_PUBLIC_*` se incrustan en el build: cambiarlas en Vercel exige
redeploy. Los valores reales salen de las cuentas del cliente y se cargan solo
en Vercel, nunca en el repositorio.

## Integraciones pendientes

| Integración | Estado | Qué falta |
| --- | --- | --- |
| Destino de leads: GoHighLevel por API | Implementado, inactivo | Token de Private Integration y Location ID; cargar `GHL_API_TOKEN` y `GHL_LOCATION_ID` en Vercel |
| GTM / GA4 / Meta Pixel / Clarity | Implementado, inactivo | IDs del cliente y decisión GTM (vía A) o directo (vía B) |
| Consentimiento | Banner integrado listo; por defecto `required` | Confirmar el criterio legal para Colombia (Ley 1581 de 2012, habeas data) |
| Textos legales (`/privacidad`, `/cookies`) | Rutas reservadas con aviso "PENDIENTE" | Texto del cliente |
| Favicon | ✔ M del logo en crema sobre burdeos: `src/app/favicon.ico` (16/32/48), `icon.png` (512), `apple-icon.png` (180) | — |
| Imagen para redes (OG) | No hay | Diseñarla con la marca (`opengraph-image.jpg` en `src/app/(registro)/`) |
| Vercel Analytics / Speed Insights | No instalados | Decidir según plan y coste |
| Dominio propio | No conectado | Que el cliente lo defina |

Guía de activación de cada una en `docs/INTEGRATIONS.md`.

## Estado de verificaciones (2026-10-14, Windows 11, Node 24.18.0, npm 11.16.0)

| Verificación | Resultado |
| --- | --- |
| Carpeta del proyecto vacía antes de copiar | ✔ |
| Copia limpia de la plantilla (`git archive` del commit `28d7cef`) | ✔ 63 archivos; sin `.git`, `node_modules`, `.next`, `.vercel`, `.env.local` ni `tsbuildinfo` de la plantilla |
| Plantilla `landing-starter` sin modificar | ✔ solo lectura |
| `npm ci` | ✔ 358 paquetes; lockfile idéntico al de la plantilla salvo el campo `name` |
| Versiones instaladas | ✔ next 16.3.8, react 19.2.4, tailwindcss 4.3.3, typescript 5.9.3 |
| `npm audit --omit=dev` | ✔ 0 vulnerabilidades |
| `npm audit` completo | ⚠ 5 "high" en `braces` → `micromatch` → `fast-glob` → `@next/eslint-plugin-next`: solo herramienta de lint, sin versión corregida; no llega al build ni a producción |
| `npm run lint` | ✔ 0 errores, 0 warnings |
| `npm run typecheck` | ✔ |
| `npm run build` | ✔ todas las páginas estáticas (○); solo `/api/leads` dinámica (ƒ) |
| `npm run check` | ✔ |
| `npm run smoke` | ✔ 17/17 |
| `/`, `/gracias`, `/privacidad`, `/cookies` | ✔ 200, `X-Robots-Tag` y meta `noindex, nofollow`, sin canonical, `lang="es-CO"`, `og:locale` `es_CO`, sin GTM/Clarity/Pixel |
| `/` (landing en la raíz) | ✔ responde 200 directo, sin redirección; un solo `h1`, título "El amor no se sana · Masterclass gratuita \| Manuela Zuluaga", honeypot presente. `/registro` y `/registro/gracias` dan 404 |
| Diseño a 360, 390, 768, 1024 y 1440 px (capturas en Chrome headless) | ✔ sin scroll horizontal; revisado contra la referencia sección por sección |
| Registro de punta a punta (build de producción + webhook falso en 127.0.0.1 + Chrome) | ✔ 23/23: el modal abre sin cambiar la URL, foco al primer campo, Esc cierra y devuelve el foco, envío vacío marca los 3 campos sin enviar nada, sin casilla ni enlace de privacidad, selector con Colombia (+57) por defecto y 28 países, elegir Argentina muestra +54, envío válido → 1 lead con fuente `registro`, WhatsApp `+54 11 2345 6789`, país `CO`, `consent: false`, `utm_*` y `X-Webhook-Secret` → navega a `/gracias`; `generate_lead` una sola vez con el mismo `event_id` que `Idempotency-Key` |
| Contraste de los colores del diseño | ✔ todos AA (error 7:1, textos semitransparentes sobre noche ≥ 8,4:1, malva sobre papel ≥ 5,1:1) |
| `npm run smoke` con WhatsApp obligatorio | ✔ 17/17. El lead válido del smoke ahora lleva teléfono: sin él, `requirePhone` lo rechazaba con 400 antes de probar el 503 |
| Sitemap | ✔ vacío; `PUBLISHED_LANDINGS` vacío |
| Formularios sin destino real | ✔ `LEADS_WEBHOOK_URL` vacía → `/api/leads` responde 503, nunca éxito falso |
| `.gitignore` | ✔ ignora `.env*` (salvo `.env.example`), `.vercel`, `.next/`, `node_modules/`, `*.tsbuildinfo`, `next-env.d.ts` |
| Secretos y datos privados en lo versionado | ✔ ninguno (búsqueda de claves, tokens, URLs de webhooks, emails y referencias a otros clientes) |
| Repositorio remoto | ✔ existe, público, rama por defecto `main`, vacío antes del primer push |
| Primer push a `main` | ✔ 71 archivos, autor `lpmanuelazuluaga` (noreply); sin `.env`, `node_modules` ni `.next` en el remoto |
| CI en GitHub Actions (workflow `check`) | ✔ en verde en el primer push: `npm ci`, lint, typecheck, build y smoke |
| Diseño en `main` y despliegue de Vercel | ✔ PR #1 integrado en `e7f1f87`; CI en verde y estado Vercel `success`. La URL de producción responde 200 con el diseño y los últimos ajustes del hero móvil (`pt-[72vw]` y degradado fijo), `X-Robots-Tag: noindex, nofollow` y sin GTM/Clarity/Pixel en el HTML |
| Verificación local tras integrar el diseño | ✔ `npm run check` y `npm run smoke` (17/17) aprobados el 2026-10-14 |
| Vercel: plan y uso comercial | ✔ docs de Vercel (actualizadas 2026-09-14): Hobby es solo para uso personal no comercial; cobrar por crear o alojar el sitio es uso comercial → **requiere Pro** |

Avisos conocidos y no bloqueantes: `npm warn deprecated eslint@9.39.5` (heredado
de la plantilla, no se cambia de mayor sin motivo) y `npm warn allow-scripts`
de `unrs-resolver` (dependencia del lint; funciona sin aprobar el script).

## NO VERIFICADO

- **Preview de Vercel:** la URL de `feat/registro-diseno` requiere login, así
  que no se revisó su contenido desde fuera. La URL pública de producción
  (`landing-omega-one-60.vercel.app`) sí se comprobó en Chrome.
- **Animaciones en movimiento:** las capturas se tomaron con reducción de
  movimiento; marquesina, sello y apariciones se revisaron en código, no en video.
- **Rendimiento** (Lighthouse, Core Web Vitals): requiere despliegue.
- **Dispositivos reales** (Safari iOS, Android). Solo Chrome emulado.
- **Adecuación legal** del banner y de los textos para Colombia.

## GitHub

- Remoto `origin` → `https://lpmanuelazuluaga@github.com/lpmanuelazuluaga/landing.git`
  (el usuario en la URL indica a Git Credential Manager qué cuenta usar).
- Identidad de commits **solo en este repositorio** (`git config --local`):
  `lpmanuelazuluaga <342586824+lpmanuelazuluaga@users.noreply.github.com>`.
  No expone emails personales.
- Rama `main`. Nunca force push ni reescritura de historial publicado.
- Producción y el trabajo local usan `main`; el preview con
  `git-feat-registro-diseno` en la URL muestra la rama `feat/registro-diseno`.
  Subir commits a esa rama solo actualiza su preview: hay que integrarlos en
  `main` para actualizar `landing-omega-one-60.vercel.app`.
- **Credenciales en una máquina con varias cuentas de GitHub:** el primer push
  devolvió 403 porque Git Credential Manager entregó la credencial de otra
  cuenta guardada. Se resolvió así (2026-10-14), con una ventana privada del
  navegador con la sesión de `lpmanuelazuluaga`:

  ```bash
  git credential-manager github login --username lpmanuelazuluaga --device --force --no-ui
  # abrir github.com/login/device en esa ventana privada e introducir el código
  git credential-manager github list   # debe aparecer lpmanuelazuluaga
  git push --dry-run                   # comprueba permisos sin escribir
  ```

  El flujo `--browser` falló con `ERR_CONNECTION_REFUSED` en `127.0.0.1`
  (el proceso que espera la respuesta ya se había cerrado); `--device` no
  depende de él.
- El repositorio es **público**: nada de secretos, datos personales ni documentos
  internos de la agencia.
- Ramas y commits según `docs/CONVENTIONS.md` (`feat/registro-<cambio>`,
  `feat(registro): …`).
- Subir `.github/workflows/` por HTTPS requiere que la credencial tenga el scope
  `workflow` (con GitHub CLI: `gh auth refresh -s workflow`).

## Vercel

Estado (2026-10-14):

- Proyecto **`landing`** en el equipo **`manuela-zuluaga`**, creado por la web
  con la cuenta del cliente (GitHub `lpmanuelazuluaga` vinculado). Conectado a
  `lpmanuelazuluaga/landing`: producción desde `main`, previews por rama y PR.
- Diseño integrado en `main` mediante PR #1 (`e7f1f87`) y desplegado con éxito.
  URL pública comprobada: https://landing-omega-one-60.vercel.app/.
  Se usa para revisión, conserva noindex y no activa el destino de leads.
- **Plan: Hobby.** Según los términos de Vercel, Hobby es solo para uso personal
  no comercial, y el trabajo pagado para un cliente cuenta como comercial
  ([Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)).
  Pro cuesta USD 20 al mes por desarrollador. **Decisión pendiente de la agencia.**
- **Primer deploy fallido:** `No Output Directory named "public" found after the
  Build completed`. El proyecto se creó con el repositorio todavía vacío, Vercel
  no detectó Next.js y lo dejó con **Framework Preset "Other"**. Corrección:
  Settings → Build and Deployment → Framework Preset **Next.js**, sin override de
  Build Command, Output Directory ni Install Command. El código no tiene nada que
  ver: el mismo commit compila en GitHub Actions. **Corregido el 2026-10-14:** el
  deploy de `6162f58` compiló (29 s).
- Sin variables de entorno ni dominio, a propósito.

Para un proyecto nuevo: crearlo **después** del primer push (así detecta
Next.js), sin variables y sin dominio. Root directory `./`; Node 24.x sale de
`engines`.

CLI instalada en esta máquina: `vercel@61.1.0` (publicada el 2026-09-29),
sin sesión. Sintaxis comprobada con `--help` de esa versión:

```bash
vercel login
vercel whoami                         # confirmar que es la cuenta del cliente
vercel link --yes --project landing --team manuela-zuluaga
vercel inspect <deployment-url> --logs
```

`vercel link` crea `.vercel/` en local (ignorado por Git).

Comprobar tras el primer deploy: la URL `*.vercel.app` responde `X-Robots-Tag:
noindex, nofollow` y no carga ningún script de tracking.

## Limitaciones conocidas

- **Deduplicación de leads:** en memoria, por instancia (15 min). La durable es
  del receptor (`event_id`, actualizar contacto por email).
- **Un destino de leads por despliegue:** GoHighLevel por API si está
  configurado; si no, el webhook genérico.
- **Revocar consentimiento** recarga la página.
- **Smoke test** usa el puerto 3210; si está ocupado, `SMOKE_PORT=3290 npm run smoke`.

## Tareas pendientes para Bruno

1. Revisar y aprobar el diseño en https://landing-omega-one-60.vercel.app/.
   La rama del diseño ya está integrada en `main` y desplegada.
2. Contenido provisional reemplazado: todos los valores de `PLACEHOLDERS`
   están en `false`. Mantener la barrera para futuros contenidos de ejemplo.
3. Destino de los leads: `GHL_API_TOKEN` y `GHL_LOCATION_ID` en Vercel (ver
   docs/INTEGRATIONS.md, "Formulario → GoHighLevel").
   Sin él, el formulario muestra error a quien intente registrarse: **no
   lanzar anuncios hasta configurarlo**.
4. Textos legales (privacidad, con la autorización de la Ley 1581, y cookies).
   Con la política lista, volver a activar la casilla del formulario
   (`site.leads.requireConsent = true`): hoy está apagada y el registro no
   recoge autorización expresa para tratar los datos.
5. Originales del hero en mejor calidad y, si existe, el logo en vector.
6. Decidir el plan de Vercel (Hobby frente a Pro) por el uso comercial.
7. Herramientas de tracking (GTM o directo) y criterio de consentimiento;
   dominio definitivo.
8. Solo al publicar: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_INDEXABLE=true` y
   la ruta en `PUBLISHED_LANDINGS`.
