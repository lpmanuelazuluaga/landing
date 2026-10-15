# Arquitectura

## Principios

1. **Un repositorio, un proyecto de Vercel y un dominio de producción por
   cliente.** Dentro del repositorio, varias landings como rutas.
2. **Dos capas con frontera clara:**
   - **Núcleo sin diseño**: `src/lib/`, `src/components/ui/`,
     `src/components/tracking/`. Formularios, tracking, consentimiento, SEO y
     utilidades. No conoce colores, fuentes ni copy.
   - **Landings**: `src/app/<slug>/`. Todo lo visual y el contenido de cada
     experiencia.
3. **Estático por defecto.** Ninguna página lee datos de la petición; todas
   salen como ○ en el build.
4. **Integraciones inactivas hasta tener su variable de entorno.** El build y la
   app funcionan sin ningún secreto.
5. **Indexación como acto consciente**, nunca como efecto del deploy.

## Árbol

```
.github/workflows/check.yml   lint + typecheck + build + smoke en PR y push a main
docs/                         esta documentación
scripts/
  new-landing.mjs             crea una landing desde templates/landing
  smoke.mjs                   pruebas sobre el build de producción
templates/landing/            plantilla de landing (se compila y se lintea como el resto)
recursos_landings/            materiales originales del cliente; el build no los usa
src/
  app/
    layout.tsx                <html lang>, metadataBase, plantilla de títulos, tracking
    globals.css               @import tailwind + tema + base mínima
    not-found.tsx             404 de cualquier URL inexistente
    error.tsx                 error de render con retry()
    robots.ts  sitemap.ts     según la regla de indexación
    (legal)/privacidad/       rutas reservadas; texto pendiente del cliente
    (legal)/cookies/
    api/leads/route.ts        recepción de leads
    <slug>/                   cada landing (creada con npm run new:landing)
    (registro)/               Landing de la masterclass en "/" (route group) y /gracias
      fonts.ts                Cormorant Garamond + DM Sans (solo en esta landing)
      content.ts              copy aprobado, textos decorativos y PLACEHOLDERS
      _sections/              Hero, TeEntiendo, Recompensa, ParaTi, QuienEs, QueEs, Testimonios, Acceso, Footer
      _components/            Registration (botón + modal), LeadForm, countries (prefijos), CountdownBar, decor, ornaments, icons, text…
      _assets/                fotos optimizadas, logo y texturas de papel (generadas, propias)
  components/
    ui/                       Container, Dialog (<dialog> nativo; opción bare sin aspecto), Reveal
    tracking/                 Tracking, ConsentGatedScripts, ConsentBanner, AttributionCapture
  content/ui.ts               textos de sistema (formularios, banner, 404, error)
  lib/
    site.ts                   configuración pública (nombre, idioma, legales, leads)
    seo.ts                    siteUrl, pageMetadata, noindexMetadata
    indexing.ts               regla única de indexación (también la usa next.config.ts)
    landings.ts               PUBLISHED_LANDINGS: el interruptor de publicación
    tracking-config.ts        IDs públicos validados y modo de consentimiento
    consent.ts useConsent.ts  estado del banner integrado + Consent Mode
    analytics.ts              trackLead (dataLayer generate_lead + Pixel Lead)
    attribution.ts            utm_* y click IDs → lead y enlaces salientes
    leads/schema.ts           validación compartida navegador/servidor
    leads/useLeadForm.ts      lógica de formulario sin UI
    leads/server/             entrega (GHL o webhook) y deduplicación, solo servidor
    cn.ts  id.ts              utilidades
  styles/theme.css            único @theme: tokens de marca
  types/global.d.ts           dataLayer, gtag, fbq
```

## Una landing

`npm run new:landing -- <slug>` copia `templates/landing/` a `src/app/<slug>/`:

| Archivo | Rol |
| --- | --- |
| `layout.tsx` | Clase de ámbito `.lp-<slug>`, fuentes y providers propios. Sin metadata |
| `page.tsx` | Server Component que solo compone secciones; exporta `pageMetadata()` |
| `content.ts` | Copy, fechas, enlaces, `leadSource` y rutas |
| `landing.css` | Tokens y estilos propios bajo `.lp-<slug>` |
| `_sections/` | Secciones (Hero, Faq…) |
| `_components/` | Piezas propias; incluye `LeadForm.tsx` (UI sobre `useLeadForm`) |
| `_assets/` | Imágenes importadas estáticamente (dimensiones y blur automáticos) |
| `gracias/page.tsx` | Confirmación, siempre noindex |

Las carpetas con `_` no generan rutas (convención de carpetas privadas de Next).
Borrar la carpeta borra la landing entera, imágenes incluidas.

**Decoraciones de Recompensa y Para ti:** la marca de agua móvil de
`Recompensa` divide el copy en «Reco» + media M arriba a la derecha y la otra
media M + «pensa» abajo a la izquierda del encabezado. Las ventanas de la M
miden `0.4175em`, la mitad de su avance en Cormorant Garamond a peso 400;
si cambia la tipografía, se debe recalibrar ese ancho. Las barras de las tres
tarjetas pulsan cada 6 s, escalonadas 1,4 s. Las tarjetas de vidrio 01 y 03
de `ParaTi` tienen un reflejo tenue cada 9 s, solo debajo de 768 px.
Son estilos de `landing.css`, sin dependencias ni eventos nuevos, activados
solo con `prefers-reduced-motion: no-preference`; no alteran el layout ni
interceptan gestos o clics.

**Testimonios en video:** `content.ts` conserva la asociación numerada entre
los seis enlaces originales y las versiones de reproducción. Las portadas
JPEG de `_assets/` se importan en `Testimonios` y se sirven con `next/image`.
`TestimonialsCarousel` usa scroll horizontal nativo y `requestAnimationFrame`
a 28 px/s sobre tres copias; las laterales no añaden paradas de teclado ni
lecturas duplicadas. Se pausa al mantener un gesto, con foco de teclado,
pestaña oculta, fuera de pantalla y mientras se reproduce un video. El hover
y el foco devuelto tras un clic no lo detienen; al soltar, incluso fuera de
la lista, retoma el avance tras 900 ms. Incluye control de pausa
y no inicia el movimiento con `prefers-reduced-motion`.

`TestimonialVideoDialog` reutiliza `Dialog` y monta un único `<video>` tras
elegir una portada; tiene controles nativos, reproducción en línea, cierre
con Esc, restauración de foco y desmontaje al cerrar. Montar el reproductor
tras un clic solicita `play()` con `muted/defaultMuted: false` y volumen 1;
si el navegador bloquea la reproducción con sonido, ofrece un botón para
iniciarla con otro gesto, sin silenciarlo. Los nombres numerados se conservan
solo para accesibilidad. `SmoothScroll` observa
la apertura de cualquier diálogo para cancelar también la inercia de fondo.
Los originales MOV usan HEVC y en Chrome de Windows se detectó reproducción
solo de audio. `public/videos/testimonios/` contiene sus copias MP4 H.264 Main
3.1 + AAC, hasta 1280 × 720 sin recortar, con `yuv420p` y `faststart`. Son
archivos con URL estable y se piden solo al abrir el modal. Se preparan con
FFmpeg fuera del build, sin añadir dependencias al proyecto; los MOV
descargados y las herramientas permanecen fuera del repositorio.

**Landing en "/":** `npm run new:landing -- <slug> --root` la crea en el route
group `src/app/(<slug>)/`. Exige retirar antes `src/app/page.tsx`: dos páginas en
"/" rompen el build.

**Variantes A/B con tráfico real:** carpeta hermana (`<slug>-b`) con su propio
`leadSource`. Nunca se añade a `PUBLISHED_LANDINGS` y se retira cuando termina la
prueba. **Rediseños y borradores:** en una rama, revisados en el deploy de
preview de Vercel; no como rutas en producción.

## Indexación

`src/lib/indexing.ts` es la única regla. El sitio es indexable solo si:

1. `NEXT_PUBLIC_SITE_INDEXABLE=true`,
2. `NEXT_PUBLIC_SITE_URL` está definida, y
3. en Vercel, el entorno es Production.

Mientras no lo sea:

- toda respuesta lleva `X-Robots-Tag: noindex, nofollow` (desde `next.config.ts`);
- toda página lleva `<meta name="robots" content="noindex, nofollow">`;
- el sitemap está vacío;
- `robots.txt` **no** bloquea el rastreo. Con `Disallow` los buscadores no
  podrían leer el noindex, y una URL enlazada desde fuera podría indexarse sin
  contenido.

Cuando el sitio es indexable, una página solo se indexa si su ruta está en
`PUBLISHED_LANDINGS` (`src/lib/landings.ts`). Canonical y `og:url` se emiten solo
con `NEXT_PUBLIC_SITE_URL` definida.

## Tracking y consentimiento

`src/components/tracking/Tracking.tsx` es el único punto de entrada de scripts de
terceros. Sin IDs no renderiza nada. Hay dos vías, y se usa una por proyecto:

- **A — GTM (recomendada).** Carga GTM con Consent Mode v2:
  - con consentimiento obligatorio, `denied` por defecto, en el mismo script y
    antes del loader;
  - la CMP y el resto de etiquetas (GA4, Pixel, Clarity) se configuran dentro del
    contenedor con sus condiciones de consentimiento;
  - el iframe `noscript` solo se emite si el consentimiento no es obligatorio,
    porque carga el contenedor sin control.
- **B — Directa.**
  - Clarity y/o Meta Pixel desde `ConsentGatedScripts`. Con consentimiento
    obligatorio, solo después de aceptar la categoría en `ConsentBanner`
    (analítica → Clarity; marketing → Pixel).
  - Nunca hay un script de terceros en el HTML del servidor.
  - Revocar recarga la página.

Eventos: `trackLead()` envía `generate_lead` (evento recomendado de GA4) a
`dataLayer` con `event_id` y `lead_source`, y `Lead` a Pixel si existe, con
`eventID` para deduplicar contra Conversions API.

## Leads

```
LeadForm (UI de la landing)
  └─ useLeadForm: valida (schema.ts) · idempotencyKey · bloqueo de doble envío
       └─ POST /api/leads
            ├─ 415/413/400  tipo, tamaño, validación (mismo schema.ts) y honeypot
            ├─ 503          sin destino configurado (GHL_* ni LEADS_WEBHOOK_URL)
            ├─ deliverLead  dedupe en memoria (en vuelo + entregados, 15 min)
            │    ├─ ghl      upsert de contacto (API v2), timeout 8 s; prioridad
            │    └─ webhook  POST plano, timeout 8 s, Idempotency-Key, X-Webhook-Secret
            ├─ 502          el destino falló → el formulario ofrece reintentar
            └─ 200          entregado (o duplicado de uno ya entregado)
  └─ trackLead (antes de navegar, una vez) → router.push(gracias)
```

En `registro`, `useLeadForm.beforeNavigate` permite mostrar una confirmación
visual de 1,8 s después de la entrega y de la conversión. Es opcional, sin
estilos en el núcleo, y sus errores no bloquean la navegación. El modal
precarga `/gracias` al abrirse; durante la confirmación conserva su altura,
vuelve inerte el formulario y lleva el foco al mensaje. Con reducción de
movimiento se omite la pausa. La entrada de la tarjeta de gracias y del bloque
«Último paso» usa CSS local, sin nuevas dependencias ni eventos de conversión.

- **Nunca hay éxito sin entrega.** El navegador solo muestra éxito con un 200.
- **Deduplicación.** La de memoria es por instancia y no sobrevive a reinicios.
  La durable es responsabilidad del receptor (`event_id` y cabecera
  `Idempotency-Key`; el CRM actualiza el contacto por email) o de una base de
  datos con índice único (ver `INTEGRATIONS.md`).
- **Atribución.** `utm_*` y click IDs (gclid, fbclid…) capturados al entrar
  viajan con el lead. Para checkout: `withAttribution(url)`.
- **Logs.** Solo `event_id` y motivo, nunca datos personales.

## Estilos

- `src/styles/theme.css` tiene el único `@theme`, con nombres semánticos
  (`background`, `foreground`, `surface`, `muted`, `border`, `accent`,
  `accent-foreground`, `focus`, `danger`, `success`) y tokens de layout
  (`max-w-page`, `max-w-narrow`, `px-gutter`, `py-section`).
- Una landing que se aparta del tema redefine esos tokens en `.lp-<slug>`.
  Tailwind compila las utilidades a `var(--token)`, así que el cambio queda
  limitado a ese subárbol.
- `globals.css` es mínimo: base, foco visible, inputs de 16 px, bloqueo de scroll
  con `<dialog>` abierto, reduced motion y la variante `noscript:`.

## Dependencias

| Paquete | Por qué |
| --- | --- |
| `next` 16.3.8, `react`/`react-dom` 19.2.4 | Framework. Next 16.3.8 y no 16.2.9: la línea 16.2 tiene avisos de seguridad críticos sin parche (ver HANDOFF) |
| `typescript`, `@types/*` | Tipado estricto; `tsc` como barrera |
| `tailwindcss`, `@tailwindcss/postcss` | Estilos con tokens |
| `eslint`, `eslint-config-next` | Reglas de Core Web Vitals, accesibilidad y hooks |
| `country-flag-icons` 1.6.20 (exacta, MIT, sin dependencias) | Banderas del selector de prefijo de WhatsApp en el modal de registro. SVG y no emojis porque Windows no muestra los emojis de banderas (aparecen como dos letras). Se importa país por país desde `country-flag-icons/react/3x2`, así que el bundle solo lleva las ~28 banderas de `_components/countries.ts` |
| `lenis` 1.3.26 (exacta, MIT) | Suavizado leve del scroll solicitado para toda la landing: 0,65 s de inercia y multiplicador de rueda 0,9. Lo administra `_components/SmoothScroll.tsx`, montado solo por `RegistrationProvider`; se destruye al abrir el modal, con reducción de movimiento y al abandonar la landing. El gesto táctil y el carrusel horizontal usan su desplazamiento nativo |

Las banderas y el suavizado del scroll responden a pedidos de diseño concretos.
Lenis usa el scroll de la ventana, sin transformar el contenido ni importar su
CSS global: no se usan `autoToggle` ni su bloqueo de scroll, y la altura del
documento ya es automática. El modal conserva el bloqueo nativo de `Dialog`.
`server-only` se importa sin paquete: Next lo
resuelve internamente (`docs/02-guides/data-security.md`). Las dependencias
opcionales y su criterio de activación están en `INTEGRATIONS.md` y
`CONVENTIONS.md`.
