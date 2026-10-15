import "server-only";
import type { Lead } from "@/lib/leads/schema";
import { deliverToGhl, readGhlConfig, type GhlConfig } from "@/lib/leads/server/ghl";
import { deliverToWebhook, readWebhookConfig, type WebhookConfig } from "@/lib/leads/server/webhook";

/*
  Elección del destino y entrega con deduplicación por clave de idempotencia.

  Destino: la API de GoHighLevel si GHL_API_TOKEN y GHL_LOCATION_ID están
  definidas; si no, el webhook genérico (LEADS_WEBHOOK_URL). Uno solo por
  despliegue.

  ALCANCE REAL de esta deduplicación: memoria de la instancia del servidor.
  Cubre el doble clic y el reintento inmediato (la misma petición en vuelo o
  recién entregada), pero no sobrevive a un reinicio ni se comparte entre
  instancias. La deduplicación durable la hace el receptor: GHL actualiza el
  contacto existente en vez de duplicarlo; con el webhook, event_id viaja en el
  payload y en la cabecera Idempotency-Key. Con una base de datos (ver
  docs/INTEGRATIONS.md) la clave pasa a ser un índice único.
*/

export type DeliveryResult = { ok: true } | { ok: false; reason: string };

export type Destination =
  | { kind: "ghl"; config: GhlConfig }
  | { kind: "webhook"; config: WebhookConfig };

export type DestinationResult =
  | { status: "ok"; destination: Destination }
  | { status: "missing" }
  | { status: "invalid"; detail: string };

export function readDestination(): DestinationResult {
  const ghl = readGhlConfig();
  if (ghl.status === "ok") return { status: "ok", destination: { kind: "ghl", config: ghl.config } };
  if (ghl.status === "invalid") {
    return { status: "invalid", detail: "GHL_API_TOKEN y GHL_LOCATION_ID deben definirse juntas" };
  }

  const webhook = readWebhookConfig();
  if (webhook.status === "ok") {
    return { status: "ok", destination: { kind: "webhook", config: webhook.config } };
  }
  if (webhook.status === "invalid") return { status: "invalid", detail: "LEADS_WEBHOOK_URL inválida" };
  return { status: "missing" };
}

function deliverTo(lead: Lead, destination: Destination): Promise<DeliveryResult> {
  return destination.kind === "ghl"
    ? deliverToGhl(lead, destination.config)
    : deliverToWebhook(lead, destination.config);
}

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

export async function deliverLead(lead: Lead, destination: Destination): Promise<LeadOutcome> {
  const key = lead.idempotencyKey;
  const now = Date.now();
  prune(now);

  if (delivered.has(key)) return { ok: true, duplicate: true };

  const pending = inFlight.get(key);
  if (pending) {
    const result = await pending;
    return result.ok ? { ok: true, duplicate: true } : result;
  }

  const attempt = deliverTo(lead, destination);
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
