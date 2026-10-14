# landing-registro

Landing de Registro de **Manuela Zuluaga** (desarrollo personal, amor propio y
relaciones de pareja). Mercado principal: Colombia, español (`es-CO`).

**Estado: infraestructura técnica, sin diseño.** El sitio compila y funciona,
pero todavía no hay landing: `/` es una pantalla provisional y todo es noindex.
El diseño se construirá a partir de una landing de referencia que aún no se
entregó (ver `docs/HANDOFF.md`).

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
| `/` | Pantalla provisional "Proyecto en preparación" | No |
| `/registro` | Landing de Registro: estructura generada, **sin diseño ni copy** (carpeta `src/app/registro/`, `leadSource`: `registro`) | No (fuera de `PUBLISHED_LANDINGS`) |
| `/registro/gracias` | Confirmación de registro (placeholder) | No, nunca |
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
