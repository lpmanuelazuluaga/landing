# Integraciones

Toda integración está **inactiva** hasta que se define su variable de entorno.
Las variables `NEXT_PUBLIC_*` se incrustan en el build: cambiarlas en Vercel exige
un redeploy.

## Estado en la plantilla

| Integración | Estado | Activación |
| --- | --- | --- |
| Google Tag Manager + Consent Mode v2 | Implementada, inactiva | `NEXT_PUBLIC_GTM_ID` (+ `NEXT_PUBLIC_GTM_ORIGIN` para server-side) |
| Microsoft Clarity directo | Implementada, inactiva | `NEXT_PUBLIC_CLARITY_ID` |
| Meta Pixel directo | Implementada, inactiva | `NEXT_PUBLIC_META_PIXEL_ID` |
| Banner de consentimiento integrado | Implementado; solo aparece con Clarity/Pixel directos y consentimiento obligatorio | automático |
| Formulario → GoHighLevel (API v2, upsert de contacto) | Implementado; tiene prioridad sobre el webhook | `GHL_API_TOKEN` + `GHL_LOCATION_ID` |
| Formulario → webhook (Make, Zapier, n8n) | Implementado; solo si GHL no está configurado (sin ninguno, `/api/leads` responde 503) | `LEADS_WEBHOOK_URL` (+ `LEADS_WEBHOOK_SECRET`) |
| Atribución (utm_*, click IDs) | Implementada, siempre activa (sessionStorage, sin cookies) | — |
| GA4 | Sin código: se configura dentro de GTM | — |
| Supabase (respaldo de leads) | **No implementado.** Receta abajo | — |
| Systeme.io nativo | **No implementado.** Usar webhook vía Make/Zapier | — |
| Vercel Analytics / Speed Insights | **No instalados** | ver abajo |

## Google Tag Manager (vía A, recomendada)

1. Cargar `NEXT_PUBLIC_GTM_ID` en Vercel → entorno **Production** (y en Preview
   solo si se quiere probar con un entorno de GTM de prueba).
2. `NEXT_PUBLIC_CONSENT_MODE` vacío o `required` en la UE: Consent Mode arranca en
   `denied` para `ad_storage`, `ad_user_data`, `ad_personalization` y
   `analytics_storage`.
3. **En el contenedor (humano):**
   - instalar la plantilla de la CMP elegida, que actualiza el consentimiento;
   - configurar GA4, Meta Pixel, Clarity, etc. con sus condiciones de
     consentimiento;
   - el evento de conversión es `generate_lead`, con `event_id`, `lead_source` y,
     si se activó, `user_data`.
4. Server-side tagging: `NEXT_PUBLIC_GTM_ORIGIN=https://sgtm.cliente.com`. El
   contenedor de servidor debe servir `/gtm.js`. Los loaders personalizados de
   proveedores (con parámetros ofuscados) no están soportados tal cual: hay que
   adaptar `Tracking.tsx`.
5. **No** definir a la vez Clarity/Pixel directos: habría dos banners.

## Clarity y Meta Pixel directos (vía B, sin GTM)

- Con consentimiento obligatorio, `ConsentBanner` pregunta y `ConsentGatedScripts`
  carga Clarity solo con "analítica" y Pixel solo con "marketing". Antes de
  decidir no hay ningún script ni petición a esos dominios (verificado en un
  Chrome headless, ver HANDOFF).
- `NEXT_PUBLIC_CONSENT_MODE=not-required` los carga sin preguntar. **Solo con
  validación legal del mercado del cliente.**
- La página `/cookies` muestra "Cambiar preferencias de cookies", que borra la
  decisión y recarga la página.
- Pixel envía `PageView` al cargar y `Lead` (con `eventID`) desde `trackLead`.
  La navegación del cliente no genera nuevos `PageView`.

## Formulario → GoHighLevel (API)

Con `GHL_API_TOKEN` y `GHL_LOCATION_ID` definidas, `/api/leads` crea o actualiza
el contacto con `POST https://services.leadconnectorhq.com/contacts/upsert`
(cabecera `Version: 2021-07-28`). Adaptador: `src/lib/leads/server/ghl.ts`.

- **Sin costo por ejecución**, a diferencia del trigger Inbound Webhook (premium).
- La deduplicación la hace GHL según "Allow Duplicate Contact" de la subcuenta.
- Las automatizaciones se arman en GHL con el trigger **Contact Created** (no
  premium), filtrando por el campo `Lead Source`.
- Definir solo una de las dos variables es un error de configuración (503).

Configuración en la subcuenta:

1. Settings → **Private Integrations** → crear una con el scope
   `contacts.write` (y `locations/customFields.readonly` para poder listar los
   campos). Copiar el token (`pit-…`): GHL lo muestra una sola vez.
2. Settings → Business Profile: el **Location ID** de la subcuenta.
3. Settings → Custom Fields (objeto Contact, tipo Single line): `Lead Source`,
   `Event ID`, `UTM Source`, `UTM Medium`, `UTM Campaign`. Sus **ids** van en
   `FIELD_IDS` de `ghl.ts` (la API exige el id, no el key); listarlos con
   `GET /locations/{locationId}/customFields?model=contact`.
4. Cargar `GHL_API_TOKEN` y `GHL_LOCATION_ID` en Vercel (solo servidor) y
   redeploy.

| Contacto GHL | Origen |
| --- | --- |
| `firstName`, `lastName`, `name` | nombre, separado en la primera palabra |
| `email`, `phone` | tal como se validaron (`phone` se omite si está vacío) |
| `source` (campo estándar) | `leadSource` de la landing |
| `Lead Source`, `Event ID`, `UTM *` | campos personalizados; los vacíos no se envían |

## Formulario → webhook

`LEADS_WEBHOOK_URL` es el destino de `/api/leads` cuando GHL no está
configurado:

- debe ser `https` (`http` solo para `localhost`/`127.0.0.1`);
- una URL insegura o mal formada se trata como no configurada (503).

Payload (JSON plano, una clave por campo):

| Campo | Contenido |
| --- | --- |
| `event_id` | clave de idempotencia; también en la cabecera `Idempotency-Key` |
| `source` | `leadSource` de la landing |
| `site` | `site.name` |
| `name`, `first_name`, `last_name` | nombre normalizado y separado en la primera palabra |
| `email` | en minúsculas |
| `phone` | tal como se escribió (vacío si no hay) |
| `phone_default_country` | país a asumir si el teléfono no trae prefijo |
| `consent`, `consent_at` | aceptación de la política de privacidad y su fecha ISO |
| `page_path`, `submitted_at` | ruta del formulario y fecha ISO |
| `utm_*`, `gclid`, `fbclid`… | atribución capturada, si existe |

Cabecera opcional `X-Webhook-Secret` (= `LEADS_WEBHOOK_SECRET`) para que el
receptor descarte peticiones ajenas.

**GoHighLevel por webhook** (trigger premium, con costo por ejecución; preferir
la API de arriba):

1. Automation → Workflows → trigger **Inbound Webhook**; copiar la URL.
2. Enviar un lead de prueba para que GHL "aprenda" los campos.
3. Acción **Create/Update Contact** mapeando `email`, `first_name`, `last_name`,
   `phone`; `source`, `event_id` y `utm_*` a campos personalizados.
   Create/Update por email es la deduplicación durable.
4. Cargar la URL en `LEADS_WEBHOOK_URL` (Production; en Preview, un workflow de
   prueba).

**Make / Zapier / n8n:** trigger "Custom webhook" con la misma URL. Deduplicar por
`event_id` (data store) o actualizar el contacto por email en el destino.

**Systeme.io:** por defecto, vía Make o Zapier con el webhook anterior. Una
integración nativa con su API requiere una clave de servidor y un adaptador nuevo
en `src/lib/leads/server/`. **No verificado:** el contrato actual de su API.

## Supabase como respaldo (no implementado)

Para clientes con volumen de pauta o requisito de auditoría. Pasos:

1. `npm install @supabase/supabase-js` (solo se usa en el servidor, no pesa en el
   bundle).
2. Tabla, con RLS activo y sin policies (solo la clave de servidor puede
   escribir):

   ```sql
   create table public.leads (
     id uuid primary key default gen_random_uuid(),
     created_at timestamptz not null default now(),
     event_id text not null unique,          -- deduplicación durable
     source text not null,
     name text not null,
     email text not null,
     phone text,
     consent boolean not null default false,
     attribution jsonb not null default '{}'::jsonb,
     status text not null default 'pending', -- pending | sent | failed
     detail text
   );
   create index leads_status_idx on public.leads (status);
   alter table public.leads enable row level security;
   ```

3. Adaptador `src/lib/leads/server/supabase.ts` con `import "server-only"`:
   - insertar con `on conflict (event_id) do nothing` **antes** de llamar al
     webhook;
   - después, actualizar `status`.
4. En `deliverLead`, considerar el lead entregado si el insert fue correcto,
   aunque el webhook falle (queda `failed` para reenviarlo). Así el 200 sigue
   significando "guardado de forma durable".
5. Variables: `SUPABASE_URL` y la clave de servidor. **No verificado:** Supabase
   está migrando de las claves `anon`/`service_role` a `publishable`/`secret`;
   confirmar el nombre vigente al integrar.

## Vercel Analytics / Speed Insights (no instalados)

`npm install @vercel/analytics` (o `@vercel/speed-insights`) y montar el
componente en `src/app/layout.tsx`. Activarlo antes en el dashboard del proyecto.
Speed Insights aporta Core Web Vitals de campo. **No verificado:** el coste según
el plan de Vercel de cada cliente.

## Checkout y enlaces salientes

- Las URLs de checkout van en el `content.ts` de la landing.
- `withAttribution(url)` (`src/lib/attribution.ts`) añade los `utm_*` guardados
  sin pisar los del enlace. Como usa `sessionStorage`, se llama en el navegador
  (en un handler `onClick` o en un componente cliente).
- La gracias post-pago se configura como URL de éxito en la plataforma de pago
  (humano). Ruta no deducible y noindex.

## Seguridad

- Secretos solo en variables sin `NEXT_PUBLIC_`, leídos en `src/lib/leads/server/`
  (marcados con `import "server-only"`: importarlos desde un componente cliente
  rompe el build).
- Los IDs públicos se validan por formato antes de inyectarse en un script
  inline (`src/lib/tracking-config.ts`).
- `/api/leads` limita el cuerpo a 10 KB, exige JSON, valida en servidor, usa un
  honeypot y un timeout de 8 s, y registra solo `event_id` y motivo.
- Sin rate limiting propio. Si hay abuso, reglas del firewall de Vercel
  (**no verificado** según plan) o un servicio dedicado.
