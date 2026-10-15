# landing-registro

Landing de Registro de **Manuela Zuluaga** (desarrollo personal, amor propio y
relaciones de pareja). Mercado principal: Colombia, español (`es-CO`).

**Estado: diseño implementado, en revisión.** La landing de la masterclass
gratuita "El amor no se sana" reproduce una landing de referencia con el copy,
las fotos y la marca del cliente. Todavía tiene contenido provisional marcado
(testimonios de ejemplo) y todo es noindex. Detalle y pendientes
en `docs/HANDOFF.md`.

Versión de revisión en Vercel: https://landing-omega-one-60.vercel.app/.

Producción se despliega desde `main`. El preview de `feat/registro-diseno`
muestra esa rama; sus commits deben integrarse en `main` para aparecer en la
URL de producción. El trabajo local continúa en `main` con ambas versiones
integradas.

Next.js 16.3.8 (App Router, Turbopack) · React 19.2.4 · TypeScript estricto ·
Tailwind CSS 4 · npm · Node 24.

Incluye: SEO base con indexación consciente, 404 y error, tracking inactivo por
defecto y con consentimiento, formulario de leads con validación en servidor y
sin éxitos falsos, atribución de campaña, generador de landings, smoke test y CI.

## Puesta en marcha

Creado a partir de la plantilla interna `landing-starter` (commit `28d7cef`).

```bash
git clone https://github.com/lpmanuelazuluaga/landing.git
cd landing
npm ci
cp .env.example .env.local   # opcional: todas las variables pueden quedar vacías
npm run dev
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run check` | lint + typecheck + build (obligatorio antes de entregar) |
| `npm run smoke` | Tras un build: 404, noindex, tracking ausente por defecto, contrato de `/api/leads`. Puerto con `SMOKE_PORT` (por defecto 3210) |
| `npm run new:landing -- <slug> [--root]` | Crea `src/app/<slug>/` desde `templates/landing/`; nunca sobrescribe |
| `npm run typecheck` | `next typegen && tsc --noEmit` |
| `npm run lint` | ESLint (`eslint-config-next`) |

## Rutas

| URL | Qué es | Indexable |
| --- | --- | --- |
| [`/`](https://landing-omega-one-60.vercel.app/) | Landing de la masterclass "El amor no se sana" (única del sitio). Carpeta `src/app/(registro)/` (route group), `leadSource`: `registro`. Hero con «El amor» en cursiva y fecha y hora separadas; «Online en vivo» junto a «Masterclass gratuita» en la segunda fila de escritorio. Scroll suavizado leve; barra superior sin fecha visible, «Sobre» y «Recompensa» de fondo en móvil, puerta como fondo de «El acceso» y sin contador de plazas. El registro es un modal: no cambia la URL | No (fuera de `PUBLISHED_LANDINGS`) |
| [`/gracias`](https://landing-omega-one-60.vercel.app/gracias) | Confirmación tras un registro entregado, checks animados, brillo en «Confirmado» y botón verde con ícono de WhatsApp al grupo. Sin enlace de regreso | No, nunca |
| `/privacidad`, `/cookies` | Rutas legales reservadas (texto pendiente del cliente) | No |
| `/api/leads` | Recepción de leads (POST) | — |
| `/robots.txt`, `/sitemap.xml` | Según la regla de indexación | — |

Al crear landings, añadirlas a esta tabla con su carpeta y su `leadSource`.

## Variables de entorno

Todas opcionales; vacías, cada integración queda inactiva. Detalle en
`.env.example` y `docs/INTEGRATIONS.md`.

| Variable | Ámbito | Efecto |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | público | URL real: canonical, og:url, sitemap |
| `NEXT_PUBLIC_SITE_INDEXABLE` | público | `true` solo al publicar conscientemente |
| `NEXT_PUBLIC_CONSENT_MODE` | público | `required` (defecto) o `not-required` |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GTM_ORIGIN` | público | GTM con Consent Mode v2 |
| `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | público | Carga directa tras consentimiento |
| `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` | servidor | Destino de `/api/leads` |

## Documentación

- `AGENTS.md`: reglas para agentes de IA (y para personas).
- `docs/ARCHITECTURE.md`: capas, árbol, indexación, tracking, leads y dependencias.
- `docs/CONVENTIONS.md`: nombres, CSS, imágenes, fuentes, formularios y checklist de PR.
- `docs/INTEGRATIONS.md`: qué está implementado, cómo activarlo y qué no.
- `docs/HANDOFF.md`: estado verificado, pendientes y pasos con GitHub y Vercel.
