/*
  Eventos de conversión. Todo evento pasa por aquí para que el nombre y la forma
  sean los mismos en todas las landings.

  - dataLayer: lo consume GTM (si no hay GTM, el push no tiene efecto).
  - Meta Pixel: solo existe si se cargó directo y con consentimiento.

  REGLA: llamar a trackLead ANTES de navegar a la página de gracias. La
  navegación desmonta la página y un evento posterior se pierde.
*/

export type LeadUserData = {
  email_address: string;
  phone_number?: string;
  address?: { first_name?: string; last_name?: string };
};

export function pushDataLayer(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Conversión de lead. `eventId` es la misma clave de idempotencia del envío:
 * permite deduplicar entre Pixel y Conversions API, y entre reintentos.
 * Usa el evento recomendado de GA4 `generate_lead`.
 */
export function trackLead({
  eventId,
  source,
  userData,
}: {
  eventId: string;
  source: string;
  /** Solo si el cliente usa Advanced Matching y lo cubre su política de privacidad. */
  userData?: LeadUserData;
}) {
  pushDataLayer("generate_lead", {
    event_id: eventId,
    lead_source: source,
    ...(userData ? { user_data: userData } : {}),
  });
  window.fbq?.("track", "Lead", { content_name: source }, { eventID: eventId });
}
