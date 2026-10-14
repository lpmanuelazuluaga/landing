import "server-only";
import type { Lead } from "@/lib/leads/schema";
import { deliverToWebhook, type DeliveryResult, type WebhookConfig } from "@/lib/leads/server/webhook";

/*
  Entrega con deduplicación por clave de idempotencia.

  ALCANCE REAL de esta deduplicación: memoria de la instancia del servidor.
  Cubre el doble clic y el reintento inmediato (la misma petición en vuelo o
  recién entregada), pero no sobrevive a un reinicio ni se comparte entre
  instancias. La deduplicación durable la hace el receptor: event_id viaja en el
  payload y en la cabecera Idempotency-Key, y el CRM debe actualizar el contacto
  por email en vez de duplicarlo. Con una base de datos (ver
  docs/INTEGRATIONS.md) la clave pasa a ser un índice único.
*/

const TTL_MS = 15 * 60 * 1000;
const MAX_ENTRIES = 1000;

const delivered = new Map<string, number>();
const inFlight = new Map<string, Promise<DeliveryResult>>();

function prune(now: number) {
  for (const [key, at] of delivered) {
    if (now - at > TTL_MS || delivered.size > MAX_ENTRIES) delivered.delete(key);
  }
}

export type LeadOutcome = { ok: true; duplicate: boolean } | { ok: false; reason: string };

export async function deliverLead(lead: Lead, config: WebhookConfig): Promise<LeadOutcome> {
  const key = lead.idempotencyKey;
  const now = Date.now();
  prune(now);

  if (delivered.has(key)) return { ok: true, duplicate: true };

  const pending = inFlight.get(key);
  if (pending) {
    const result = await pending;
    return result.ok ? { ok: true, duplicate: true } : result;
  }

  const attempt = deliverToWebhook(lead, config);
  inFlight.set(key, attempt);
  try {
    const result = await attempt;
    if (!result.ok) return result;
    delivered.set(key, Date.now());
    return { ok: true, duplicate: false };
  } finally {
    inFlight.delete(key);
  }
}
