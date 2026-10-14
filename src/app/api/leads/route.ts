import { validateLead } from "@/lib/leads/schema";
import { readWebhookConfig } from "@/lib/leads/server/webhook";
import { deliverLead } from "@/lib/leads/server/deliver";

/*
  POST /api/leads — recepción de leads de cualquier formulario del sitio.

  Respuestas:
    200 { ok: true, duplicate }   entregado a un destino real (o ya entregado antes)
    400 { ok: false, errors }     datos inválidos (errores por campo)
    413 / 415                     cuerpo demasiado grande / no es JSON
    502 { ok: false }             el destino falló: el formulario ofrece reintentar
    503 { ok: false }             no hay destino configurado

  NUNCA se responde éxito si el lead no llegó a un destino real: el visitante
  creería que se registró y el dato se perdería. Los logs no llevan datos
  personales, solo event_id y motivo.
*/

const MAX_BODY_BYTES = 10_000;

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const result = validateLead(data);
  if (!result.ok) {
    /* El honeypot se responde como cualquier dato inválido, sin pistas. */
    const errors = result.reason === "invalid" ? result.errors : {};
    return json({ ok: false, error: "invalid", errors }, 400);
  }

  const destination = readWebhookConfig();
  if (destination.status !== "ok") {
    console.error(
      `[leads] sin destino (${destination.status === "invalid" ? "LEADS_WEBHOOK_URL inválida" : "LEADS_WEBHOOK_URL vacía"}) event_id=${result.lead.idempotencyKey}`,
    );
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const outcome = await deliverLead(result.lead, destination.config);
  if (!outcome.ok) {
    console.error(`[leads] entrega fallida reason=${outcome.reason} event_id=${result.lead.idempotencyKey}`);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }

  return json({ ok: true, duplicate: outcome.duplicate }, 200);
}
