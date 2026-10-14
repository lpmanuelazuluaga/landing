import "server-only";
import { site } from "@/lib/site";
import type { Lead } from "@/lib/leads/schema";

/*
  Destino de leads por webhook: sirve para GoHighLevel (Inbound Webhook), Make,
  Zapier o n8n. Es el único destino implementado; ver docs/INTEGRATIONS.md
  para añadir otros (Supabase, API nativa de un CRM).
*/

const TIMEOUT_MS = 8000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export type WebhookConfig = { url: URL; secret: string | null };

export type WebhookConfigResult =
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "ok"; config: WebhookConfig };

export function readWebhookConfig(): WebhookConfigResult {
  const raw = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!raw) return { status: "missing" };
  try {
    const url = new URL(raw);
    const secure = url.protocol === "https:";
    const local = url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname);
    if (!secure && !local) return { status: "invalid" };
    return {
      status: "ok",
      config: { url, secret: process.env.LEADS_WEBHOOK_SECRET?.trim() || null },
    };
  } catch {
    return { status: "invalid" };
  }
}

/**
 * Payload plano (claves de primer nivel) a propósito: los mapeadores de GHL,
 * Make y Zapier asocian claves de primer nivel a campos, y con objetos anidados
 * el mapeo se vuelve confuso.
 */
export function toWebhookPayload(lead: Lead, submittedAt: string) {
  const [firstName, ...rest] = lead.name.split(" ");
  return {
    event_id: lead.idempotencyKey,
    source: lead.source,
    site: site.name,
    name: lead.name,
    first_name: firstName,
    last_name: rest.join(" "),
    email: lead.email,
    phone: lead.phone ?? "",
    /* Sin prefijo internacional, el receptor sabe qué país asumir. */
    phone_default_country: site.defaultCountry,
    consent: lead.consent,
    consent_at: lead.consent ? submittedAt : "",
    page_path: lead.pagePath,
    submitted_at: submittedAt,
    ...lead.attribution,
  };
}

export type DeliveryResult = { ok: true } | { ok: false; reason: string };

export async function deliverToWebhook(lead: Lead, config: WebhookConfig): Promise<DeliveryResult> {
  const submittedAt = new Date().toISOString();
  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": lead.idempotencyKey,
        ...(config.secret ? { "X-Webhook-Secret": config.secret } : {}),
      },
      body: JSON.stringify(toWebhookPayload(lead, submittedAt)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      redirect: "manual",
      cache: "no-store",
    });
    if (response.ok) return { ok: true };
    return { ok: false, reason: `http_${response.status}` };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return { ok: false, reason: timedOut ? "timeout" : "unreachable" };
  }
}
