# Handoff: Landing de Registro (Manuela Zuluaga)

Para: Bruno y cualquier desarrollador que continúe el proyecto.
Estado al 2026-10-14. **Fase: infraestructura técnica terminada; diseño sin
empezar** (espera la landing de referencia y los materiales del cliente).

## Datos del proyecto

| Dato | Valor |
| --- | --- |
| Cliente | Manuela Zuluaga |
| Proyecto | Landing de Registro |
| Nombre técnico | `landing-registro` (`package.json`; npm y Vercel exigen minúsculas, por eso no `Landing-Registro`) |
| Temática | Desarrollo personal, amor propio y relaciones de pareja |
| Idioma y mercado | Español de Colombia: `lang="es-CO"`, `og:locale` `es_CO`, país por defecto `CO` |
| Landing inicial | `registro` → `/registro` (y `/registro/gracias`) |
| Ruta local | `C:\Users\Bruno\Desktop\Manuela Zuluaga` |
| Repositorio GitHub | https://github.com/lpmanuelazuluaga/landing (público, rama `main`) |
| Proyecto Vercel | `landing`, equipo `manuela-zuluaga` (plan Hobby), conectado al repositorio (ver "Vercel") |
| URL de producción | **Pendiente** del primer deploy correcto: dominio `*.vercel.app` por defecto |
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
ninguna dependencia respecto de la plantilla.

## Qué hay y qué no hay

**Hay** (heredado de la plantilla y adaptado):

- `src/lib/site.ts` con nombre de marca, idioma, locale y país del cliente.
- `/` provisional ("Proyecto en preparación"), funcional y siempre noindex.
- `/registro` y `/registro/gracias` generadas con `npm run new:landing`: solo
  estructura mínima (un `h1` con texto `TODO`, el formulario base y la página de
  gracias). **No es diseño ni copy**: se reemplaza entero en la fase visual.
- Tokens de color neutros, sin identidad (`src/styles/theme.css`).
- SEO con indexación consciente, 404 y error, `/api/leads` sin destino (503),
  tracking y consentimiento implementados pero inactivos, atribución, generador
  de landings, smoke test y CI.

**No hay, a propósito:** hero, secciones, paleta de marca, tipografías, imágenes,
copy comercial, animaciones ni dependencias de efectos. Llegan con el PROMPT 2
y la landing de referencia.

## Estructura de carpetas

```
.github/workflows/check.yml   CI: lint + typecheck + build + smoke (PR y push a main)
docs/                         ARCHITECTURE, CONVENTIONS, INTEGRATIONS, HANDOFF
recursos_landings/            materiales originales del cliente (no los usa el build)
scripts/                      new-landing.mjs (generador), smoke.mjs
templates/landing/            molde que copia el generador
src/
  app/
    layout.tsx  page.tsx      layout raíz y "/" provisional
    not-found.tsx error.tsx   404 y error
    robots.ts  sitemap.ts     según la regla de indexación
    (legal)/privacidad|cookies  rutas legales (texto pendiente del cliente)
    api/leads/route.ts        recepción de leads
    registro/                 Landing de Registro
      page.tsx layout.tsx     composición de secciones y clase .lp-registro
      content.ts              copy y config (LANDING, META, HERO, THANKS) — hoy TODO
      landing.css             estilos propios bajo .lp-registro
      _sections/ _components/ _assets/   secciones, piezas (LeadForm) e imágenes
      gracias/page.tsx        confirmación (noindex siempre)
  components/ui/              Container, Dialog (<dialog> nativo), Reveal
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

- No se importan desde el código. En la fase visual, las imágenes que se usen
  se convierten a JPG/WebP optimizado y se copian a `src/app/registro/_assets/`
  (`docs/CONVENTIONS.md`, "Imágenes").
- `main/relacion.png` es en realidad un JPEG con extensión `.png`; corregirlo al
  optimizarla.
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
npm run new:landing -- <slug> --root   # → src/app/(<slug>)/  (/), exige borrar antes src/app/page.tsx
```

- Slug en kebab-case y en español (`masterclass`, `lista-de-espera`). Nunca
  sobrescribe; rechaza slugs reservados (`api`, `gracias`, `privacidad`…).
- Después: completar `content.ts`, construir `_sections/`, añadir la ruta a la
  tabla del README.
- **Si la Landing de Registro debe ocupar `/`** (decisión pendiente): borrar
  `src/app/page.tsx` y mover la carpeta con
  `git mv src/app/registro "src/app/(registro)"`; luego en `content.ts` cambiar
  `path` a `/` y `thanksPath` a `/gracias`. El nombre de la clase `.lp-registro`
  no cambia.
- Publicar (indexar) una ruta = añadirla a `PUBLISHED_LANDINGS`
  (`src/lib/landings.ts`) **y** activar las variables de indexación. Hoy está
  vacío a propósito.

## Cómo incorporar componentes

- Antes de crear uno, revisar `src/components/ui/` (Container, Dialog, Reveal).
- Componentes con identidad visual de la landing → `src/app/registro/_components/`
  o `_sections/`. Al núcleo (`src/components/ui/`) solo sube lo que no tiene
  diseño propio.
- Una landing nunca importa de otra.
- Copy en `content.ts`; nunca hex en JSX (tokens semánticos `bg-accent`,
  `text-muted`…); nunca clases interpoladas (`bg-${x}`).
- Fuentes con `next/font` en `src/app/registro/layout.tsx`, no en el layout
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
| `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` | servidor | vacías | Destino de `/api/leads` (hoy responde 503) |

Las `NEXT_PUBLIC_*` se incrustan en el build: cambiarlas en Vercel exige
redeploy. Los valores reales salen de las cuentas del cliente y se cargan solo
en Vercel, nunca en el repositorio.

## Integraciones pendientes

| Integración | Estado | Qué falta |
| --- | --- | --- |
| Destino de leads (GHL, Make, Zapier, n8n…) | Implementado, inactivo | Que el cliente defina el CRM; cargar `LEADS_WEBHOOK_URL` en Vercel |
| GTM / GA4 / Meta Pixel / Clarity | Implementado, inactivo | IDs del cliente y decisión GTM (vía A) o directo (vía B) |
| Consentimiento | Banner integrado listo; por defecto `required` | Confirmar el criterio legal para Colombia (Ley 1581 de 2012, habeas data) |
| Textos legales (`/privacidad`, `/cookies`) | Rutas reservadas con aviso "PENDIENTE" | Texto del cliente |
| Favicon e imagen OG | No hay | Materiales de marca |
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
| `/`, `/registro`, `/registro/gracias`, `/privacidad`, `/cookies` | ✔ 200, `X-Robots-Tag` y meta `noindex, nofollow`, sin canonical, `lang="es-CO"`, `og:locale` `es_CO`, sin GTM/Clarity/Pixel |
| `/registro` | ✔ un solo `h1`, título "Registro \| Manuela Zuluaga", honeypot presente |
| Sitemap | ✔ vacío; `PUBLISHED_LANDINGS` vacío |
| Formularios sin destino real | ✔ `LEADS_WEBHOOK_URL` vacía → `/api/leads` responde 503, nunca éxito falso |
| `.gitignore` | ✔ ignora `.env*` (salvo `.env.example`), `.vercel`, `.next/`, `node_modules/`, `*.tsbuildinfo`, `next-env.d.ts` |
| Secretos y datos privados en lo versionado | ✔ ninguno (búsqueda de claves, tokens, URLs de webhooks, emails y referencias a otros clientes) |
| Repositorio remoto | ✔ existe, público, rama por defecto `main`, vacío antes del primer push |
| Primer push a `main` | ✔ 71 archivos, autor `lpmanuelazuluaga` (noreply); sin `.env`, `node_modules` ni `.next` en el remoto |
| CI en GitHub Actions (workflow `check`) | ✔ en verde en el primer push: `npm ci`, lint, typecheck, build y smoke |
| Vercel: plan y uso comercial | ✔ docs de Vercel (actualizadas 2026-09-14): Hobby es solo para uso personal no comercial; cobrar por crear o alojar el sitio es uso comercial → **requiere Pro** |

Avisos conocidos y no bloqueantes: `npm warn deprecated eslint@9.39.5` (heredado
de la plantilla, no se cambia de mayor sin motivo) y `npm warn allow-scripts`
de `unrs-resolver` (dependencia del lint; funciona sin aprobar el script).

## NO VERIFICADO

- **Vercel:** proyecto creado, pero sin ningún deploy correcto todavía; ni
  producción ni previews con noindex comprobados en Vercel.
- **Rendimiento** (Lighthouse, Core Web Vitals): requiere despliegue.
- **Dispositivos reales** (Safari iOS, Android).
- **Adecuación legal** del banner y de los textos para Colombia.

## GitHub

- Remoto `origin` → `https://lpmanuelazuluaga@github.com/lpmanuelazuluaga/landing.git`
  (el usuario en la URL indica a Git Credential Manager qué cuenta usar).
- Identidad de commits **solo en este repositorio** (`git config --local`):
  `lpmanuelazuluaga <342586824+lpmanuelazuluaga@users.noreply.github.com>`.
  No expone emails personales.
- Rama `main`. Nunca force push ni reescritura de historial publicado.
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
- **Plan: Hobby.** Según los términos de Vercel, Hobby es solo para uso personal
  no comercial, y el trabajo pagado para un cliente cuenta como comercial
  ([Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)).
  Pro cuesta USD 20 al mes por desarrollador. **Decisión pendiente de la agencia.**
- **Primer deploy fallido:** `No Output Directory named "public" found after the
  Build completed`. El proyecto se creó con el repositorio todavía vacío, Vercel
  no detectó Next.js y lo dejó con **Framework Preset "Other"**. Corrección:
  Settings → Build and Deployment → Framework Preset **Next.js**, sin override de
  Build Command, Output Directory ni Install Command. El código no tiene nada que
  ver: el mismo commit compila en GitHub Actions.
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
- **Un solo destino de leads** implementado (webhook).
- **Revocar consentimiento** recarga la página.
- **Smoke test** usa el puerto 3210; si está ocupado, `SMOKE_PORT=3290 npm run smoke`.

## Tareas pendientes para Bruno

1. Vercel: corregir el Framework Preset a Next.js y confirmar el primer deploy
   correcto (sección "Vercel").
2. Decidir el plan de Vercel (Hobby frente a Pro) por el uso comercial.
3. Comprobar en el deploy: `X-Robots-Tag: noindex, nofollow`, sin tracking, y un
   preview de una rama.
4. Entregar la landing de referencia y los materiales (copy, imágenes, marca)
   con el PROMPT 2.
5. Decidir con el cliente:
   - si la Landing de Registro vive en `/` o en `/registro`;
   - campos del formulario (¿teléfono obligatorio?, `site.leads.requirePhone`);
   - voz del copy (tuteo o usted) para `src/content/ui.ts`;
   - CRM o automatización de destino de los leads;
   - herramientas de tracking (GTM o directo) y criterio de consentimiento;
   - dominio definitivo.
6. Conseguir los textos legales (privacidad y cookies).
7. Solo al publicar: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_INDEXABLE=true` y
   la ruta en `PUBLISHED_LANDINGS`.
