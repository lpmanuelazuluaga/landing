import { site } from "@/lib/site";
import { sanitizeAttribution, type Attribution } from "@/lib/attribution";
import { ui } from "@/content/ui";

/*
  Validación de leads compartida por el navegador (useLeadForm) y el servidor
  (/api/leads). Una sola implementación: el servidor vuelve a validar todo lo
  que el navegador ya validó, porque una petición puede llegar sin pasar por la
  página.
*/

/** Lo que el visitante rellena en el formulario. */
export type LeadFields = {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  /** Honeypot: campo oculto que una persona deja vacío. */
  hp: string;
};

/** Lo que el navegador envía a /api/leads. */
export type LeadPayload = LeadFields & {
  source: string;
  idempotencyKey: string;
  attribution: Attribution;
  pagePath: string;
};

/** Lead ya validado y normalizado. */
export type Lead = {
  name: string;
  email: string;
  phone: string | null;
  consent: boolean;
  source: string;
  idempotencyKey: string;
  attribution: Attribution;
  pagePath: string;
};

export type LeadField = "name" | "email" | "phone" | "consent";
export type LeadFieldErrors = Partial<Record<LeadField, string>>;

export type LeadValidation =
  | { ok: true; lead: Lead }
  | { ok: false; reason: "invalid"; errors: LeadFieldErrors }
  | { ok: false; reason: "bot" };

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;
const SOURCE_RE = /^[a-z0-9][a-z0-9:_-]{0,63}$/;
const KEY_RE = /^[A-Za-z0-9-]{16,64}$/;

const MAX = { name: 120, email: 254, phone: 32, path: 200 } as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidPhone(phone: string): boolean {
  if (phone.length > MAX.phone || !PHONE_CHARS_RE.test(phone)) return false;
  const digits = phone.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15; // E.164 admite hasta 15 dígitos
}

export function validateLead(data: unknown): LeadValidation {
  const input = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;

  if (text(input.hp) !== "") return { ok: false, reason: "bot" };

  const name = text(input.name).replace(/\s+/g, " ");
  const email = text(input.email).toLowerCase();
  const phone = text(input.phone);
  const consent = input.consent === true;
  const source = text(input.source);
  const idempotencyKey = text(input.idempotencyKey);
  const rawPath = text(input.pagePath);

  const errors: LeadFieldErrors = {};
  if (name.length < 2 || name.length > MAX.name) errors.name = ui.validation.name;
  if (email.length > MAX.email || !EMAIL_RE.test(email)) errors.email = ui.validation.email;
  if (phone) {
    if (!isValidPhone(phone)) errors.phone = ui.validation.phone;
  } else if (site.leads.requirePhone) {
    errors.phone = ui.validation.phoneRequired;
  }
  if (site.leads.requireConsent && !consent) errors.consent = ui.validation.consent;

  /* source e idempotencyKey los pone el código, no el visitante: si fallan es
     un error de integración, y el formulario no tiene un campo donde
     mostrarlo. */
  if (!SOURCE_RE.test(source) || !KEY_RE.test(idempotencyKey)) {
    return { ok: false, reason: "invalid", errors };
  }
  if (Object.keys(errors).length > 0) return { ok: false, reason: "invalid", errors };

  return {
    ok: true,
    lead: {
      name,
      email,
      phone: phone || null,
      consent,
      source,
      idempotencyKey,
      attribution: sanitizeAttribution(input.attribution),
      pagePath: rawPath.startsWith("/") ? rawPath.slice(0, MAX.path) : "/",
    },
  };
}
