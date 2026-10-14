<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reglas del proyecto para agentes de IA

Proyecto creado desde `landing-starter`: infraestructura para landings de alta
conversión. Arquitectura en `docs/ARCHITECTURE.md`; convenciones en
`docs/CONVENTIONS.md`; integraciones en `docs/INTEGRATIONS.md`; estado y
pendientes en `docs/HANDOFF.md`.

## Este proyecto

- Cliente: **Manuela Zuluaga**. Proyecto: Landing de Registro
  (`landing-registro`).
- Temática: desarrollo personal, amor propio y relaciones de pareja.
- Mercado e idioma: español de Colombia (`es-CO`, `es_CO`, país `CO`).
- Una sola landing: `registro` → `src/app/registro/` (`/registro`), más su
  página de gracias. El registro es un modal dentro de la landing, sin ruta
  propia. La raíz `/` redirige a `/registro` (`next.config.ts`).
- Repositorio **público**: nada de secretos, datos personales ni documentos
  internos en el código, los commits o `docs/`.
- **Fase actual: solo infraestructura.** El diseño reproducirá una landing de
  referencia que todavía no se entregó. Hasta recibirla, no diseñar secciones,
  no fijar paleta ni tipografías, no escribir copy comercial ni instalar
  dependencias de animación o efectos.
- Voz del copy (tuteo o usted): PENDIENTE de definir con el cliente.
  `src/content/ui.ts` sigue en tuteo neutro.

## Antes de escribir código

- Leer la guía de `node_modules/next/dist/docs/` del tema que se va a tocar. Esta
  versión (16.3) cambia APIs respecto de versiones anteriores: por ejemplo,
  `error.tsx` recibe `retry()`, `middleware` se llama `proxy`, `next/image`
  usa `preload` en lugar de `priority`, `images.qualities` es obligatorio y
  `next build` ya no ejecuta el lint.
- No añadir dependencias sin una utilidad concreta. Toda dependencia nueva se
  justifica en `docs/ARCHITECTURE.md` (sección "Dependencias").

## Comandos

- `npm run dev`: desarrollo.
- `npm run check`: lint + typecheck + build. **Obligatorio en verde antes de dar
  algo por terminado.**
- `npm run smoke` (después de un build): 404, noindex, tracking ausente por
  defecto, contrato de `/api/leads`.
- `npm run new:landing -- <slug> [--root]`: crear una landing desde la plantilla.

## Arquitectura (resumen)

- Una landing = `src/app/<slug>/` con `page.tsx`, `layout.tsx`, `content.ts`,
  `landing.css`, `_sections/`, `_components/`, `_assets/` y `gracias/`.
- Núcleo sin diseño: `src/lib/`, `src/components/ui/`, `src/components/tracking/`.
  No conoce colores, fuentes ni copy de ninguna landing.
- **Una landing nunca importa de otra landing.** Lo que comparten va al núcleo
  (lógica) o a `src/content/` (contenido de la marca).
- Copy y datos editables en el `content.ts` de cada landing; textos de sistema
  en `src/content/ui.ts`.

## Reglas heredadas de producción

1. **Tailwind v4 solo genera clases que ve como strings estáticos.** Nunca
   construir nombres de clase por interpolación (`bg-${color}`).
2. **Fuentes solo en el layout que las usa.** Lo declarado en el layout raíz se
   precarga en TODAS las rutas. Ver `docs/CONVENTIONS.md`, "Fuentes".
3. **Nada de estilos de landing en `globals.css`.** Van en el `landing.css` de
   cada landing, bajo `.lp-<slug>` y dentro de `@layer components`.
4. **Hero con cambio de encuadre:** `getImageProps` + `<picture>`, con
   `loading="eager"` y `fetchPriority="high"`, para que solo se descargue una
   imagen. Nunca dos `<Image>` alternados con `display:none`.
5. **Scripts de terceros solo en `src/components/tracking/`**, con IDs desde
   variables de entorno. El `id` de un `<Script>` inline nunca puede coincidir
   con una global del snippet (`clarity`, `fbq`, `dataLayer`, `gtag`): el elemento
   se expone como `window[id]` y rompe el snippet.
6. **Consentimiento:** Consent Mode en `denied` no autoriza a cargar Clarity o
   Pixel. Directos, solo se cargan tras aceptar en el banner; vía GTM, lo decide
   la CMP.
7. **Formularios:**
   - siempre `useLeadForm` + `/api/leads`, nunca un `fetch` del navegador a un CRM;
   - el servidor vuelve a validar con el mismo `schema.ts`;
   - los secretos solo están en el servidor (nunca `NEXT_PUBLIC_`);
   - nunca se muestra éxito sin confirmación de entrega.
8. **Conversión antes de navegar y una sola vez**, con `event_id`. Las páginas
   de gracias no disparan conversiones.
9. **Inputs con al menos 16 px en móvil** (iOS hace zoom por debajo). No poner
   `text-sm` en campos.
10. **Accesibilidad:** un `<h1>` por página, `<label>` en cada campo, errores
    con `aria-invalid` y `aria-describedby`, foco visible, `<button>` para
    acciones y `<a>` para navegar. Toda animación respeta
    `prefers-reduced-motion`.
11. **Modales con `<dialog>` nativo** (`src/components/ui/Dialog.tsx`). En WebKit,
    un ancestro con overflow recortado anula `backdrop-filter`; la top layer lo
    evita.
12. **Páginas estáticas:** no leer `headers()`, `cookies()` ni `searchParams` en
    una página salvo necesidad justificada; la vuelve dinámica. Los datos del
    visitante se piden desde un route handler.
13. **Indexación consciente:** una ruta solo se indexa si está en
    `PUBLISHED_LANDINGS` y el sitio es indexable (`src/lib/indexing.ts`).
    Gracias, variantes y borradores nunca se publican.
14. **Rewrites que pisan una ruta existente** van en `beforeFiles`; los
    redirects provisionales son 307 hasta que la URL sea definitiva.

## Definition of Done

- `npm run check` en verde y `npm run smoke` aprobado.
- Probado a 360-390 px sin scroll horizontal.
- Revisado con `prefers-reduced-motion` activado.
- README (tabla de rutas) y `docs/` actualizados en el mismo cambio.
