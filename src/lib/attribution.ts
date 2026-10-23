/*
  Atribución de campaña: de qué anuncio o enlace llegó el visitante.

  Se captura al entrar (components/tracking/AttributionCapture) y viaja con el
  lead al CRM, y opcionalmente al checkout (withAttribution). Vive en
  localStorage durante 7 días: quien entra por un anuncio y vuelve otro día a
  registrarse sigue atribuido a ese anuncio (con sessionStorage se perdía al
  cerrar la app o la pestaña).

  Modelo: último toque con parámetros. Una URL con utm_* o click IDs reemplaza
  lo guardado; una URL sin parámetros no borra lo anterior.
*/

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

const EXTRA_KEYS = ["landing_path", "referrer"] as const;

type AttributionKey = (typeof ATTRIBUTION_PARAMS)[number] | (typeof EXTRA_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "ls-attribution-v1";
const MAX_LENGTH = 200;
const ALLOWED_KEYS = new Set<string>([...ATTRIBUTION_PARAMS, ...EXTRA_KEYS]);

/** Acepta solo claves conocidas con strings cortos. Se usa también en el servidor. */
export function sanitizeAttribution(input: unknown): Attribution {
  const clean: Attribution = {};
  if (typeof input !== "object" || input === null) return clean;
  for (const [key, value] of Object.entries(input)) {
    if (!ALLOWED_KEYS.has(key) || typeof value !== "string") continue;
    const trimmed = value.trim().slice(0, MAX_LENGTH);
    if (trimmed) clean[key as AttributionKey] = trimmed;
  }
  return clean;
}

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function readStored(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { value?: unknown; savedAt?: number };
      if (typeof saved.savedAt === "number" && Date.now() - saved.savedAt < MAX_AGE_MS) {
        return sanitizeAttribution(saved.value);
      }
      window.localStorage.removeItem(STORAGE_KEY);
    }
    // Visitas que empezaron antes del cambio a localStorage.
    const legacy = window.sessionStorage.getItem(STORAGE_KEY);
    return legacy ? sanitizeAttribution(JSON.parse(legacy)) : null;
  } catch {
    return null;
  }
}

function store(value: Attribution) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, savedAt: Date.now() }));
  } catch {
    /* sin almacenamiento la atribución se pierde, el formulario sigue igual */
  }
}

function externalReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const ref = new URL(document.referrer);
    return ref.origin === window.location.origin ? undefined : ref.origin + ref.pathname;
  } catch {
    return undefined;
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key);
    if (value) found[key] = value;
  }

  const hasParams = Object.keys(found).length > 0;
  if (!hasParams && readStored()) return;

  store(
    sanitizeAttribution({
      ...found,
      landing_path: window.location.pathname,
      referrer: externalReferrer(),
    }),
  );
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return readStored() ?? {};
}

/**
 * Añade los utm_* guardados a un enlace saliente (checkout, agenda) sin pisar
 * los que el enlace ya trae. Los click IDs no se reenvían: pertenecen a la
 * plataforma que los emitió.
 */
export function withAttribution(href: string): string {
  const stored = getAttribution();
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  for (const key of ATTRIBUTION_PARAMS) {
    if (!key.startsWith("utm_")) continue;
    const value = stored[key];
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return url.toString();
}
