import "server-only";
import type { Lead } from "@/lib/leads/schema";
import type { DeliveryResult } from "@/lib/leads/server/deliver";

/*
  Destino de leads por la API v2 de GoHighLevel: crea o actualiza el contacto
  con POST /contacts/upsert y un token de Private Integration de la subcuenta
  (scope contacts.write). A diferencia del trigger Inbound Webhook, no usa
  triggers premium: no tiene costo por ejecución.

  La deduplicación durable la hace GHL: el upsert busca el contacto existente
  según la regla "Allow Duplicate Contact" de la subcuenta (email/teléfono).
*/

const ENDPOINT = "https://services.leadconnectorhq.com/contacts/upsert";
const API_VERSION = "2021-07-28";
const TIMEOUT_MS = 8000;

export type GhlConfig = { token: string; locationId: string };

export type GhlConfigResult =
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "ok"; config: GhlConfig };

export function readGhlConfig(): GhlConfigResult {
  const token = process.env.GHL_API_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token && !locationId) return { status: "missing" };
  /* Una sola de las dos es un error de configuración, no "sin destino". */
  if (!token || !locationId) return { status: "invalid" };
  return { status: "ok", config: { token, locationId } };
}

/**
 * IDs de los campos personalizados del contacto en la subcuenta de Manuela
 * Zuluaga (Settings → Custom Fields). La API exige el id; el key solo se anota
 * como referencia. Si un campo se borra y se vuelve a crear, cambia su id:
 * listarlos con GET /locations/{locationId}/customFields?model=contact.
 */
const FIELD_IDS = {
  leadSource: "V81iteZiiA65LrqPuUYJ", // contact.lead_source
  eventId: "q23Uaatt08hanPzodJZG", // contact.event_id
  utmSource: "Z4TGpm6OkxrPM8YG1Tc0", // contact.utm_source
  utmMedium: "rhomdt11xyM5R2hfyLHJ", // contact.utm_medium
  utmCampaign: "FAlSDVK7qP0qHmKAYAET", // contact.utm_campaign
} as const;

/**
 * Un campo vacío no se envía: el upsert no pisa con "" un valor que el
 * contacto ya tenía de un registro anterior.
 */
function customFields(lead: Lead) {
  const values: [string, string | undefined][] = [
    [FIELD_IDS.leadSource, lead.source],
    [FIELD_IDS.eventId, lead.idempotencyKey],
    [FIELD_IDS.utmSource, lead.attribution.utm_source],
    [FIELD_IDS.utmMedium, lead.attribution.utm_medium],
    [FIELD_IDS.utmCampaign, lead.attribution.utm_campaign],
  ];
  return values
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([id, field_value]) => ({ id, field_value }));
}

export function toGhlContact(lead: Lead, config: GhlConfig) {
  const [firstName, ...rest] = lead.name.split(" ");
  return {
    locationId: config.locationId,
    name: lead.name,
    firstName,
    ...(rest.length > 0 ? { lastName: rest.join(" ") } : {}),
    email: lead.email,
    ...(lead.phone ? { phone: lead.phone } : {}),
    source: lead.source,
    customFields: customFields(lead),
  };
}

export async function deliverToGhl(lead: Lead, config: GhlConfig): Promise<DeliveryResult> {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Version: API_VERSION,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toGhlContact(lead, config)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "manual",
      cache: "no-store",
    });
    /* El cuerpo de error de GHL puede repetir datos del contacto: solo se
       informa el código, para que los logs no lleven datos personales. */
    if (response.ok) return { ok: true };
    return { ok: false, reason: `ghl_http_${response.status}` };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return { ok: false, reason: timedOut ? "ghl_timeout" : "ghl_unreachable" };
  }
}
