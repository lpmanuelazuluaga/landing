/*
  IDs públicos de tracking, validados. Un valor con formato inesperado se
  descarta en vez de inyectarse en un script inline: los IDs terminan dentro de
  código ejecutable y no deben poder llevar otra cosa.

  Vacío o inválido = ese proveedor no se carga.
*/

function match(value: string | undefined, pattern: RegExp, name: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (pattern.test(trimmed)) return trimmed;
  console.warn(`[tracking] ${name} tiene un formato no válido y se ignora.`);
  return null;
}

function origin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error("https requerido");
    return url.origin;
  } catch {
    console.warn("[tracking] NEXT_PUBLIC_GTM_ORIGIN no es un origen https válido y se ignora.");
    return null;
  }
}

export const trackingConfig = {
  gtmId: match(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]{4,12}$/, "NEXT_PUBLIC_GTM_ID"),
  gtmOrigin: origin(process.env.NEXT_PUBLIC_GTM_ORIGIN) ?? "https://www.googletagmanager.com",
  clarityId: match(process.env.NEXT_PUBLIC_CLARITY_ID, /^[a-z0-9]{6,20}$/, "NEXT_PUBLIC_CLARITY_ID"),
  metaPixelId: match(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{10,20}$/, "NEXT_PUBLIC_META_PIXEL_ID"),
  /** Por defecto se exige consentimiento. Solo "not-required" lo desactiva. */
  consentRequired: process.env.NEXT_PUBLIC_CONSENT_MODE !== "not-required",
} as const;

/** Hay scripts directos (sin GTM) que dependen del banner integrado. */
export const usesBuiltinConsent =
  trackingConfig.consentRequired &&
  Boolean(trackingConfig.clarityId || trackingConfig.metaPixelId);
