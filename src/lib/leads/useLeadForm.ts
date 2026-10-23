"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { newId } from "@/lib/id";
import { getAttribution } from "@/lib/attribution";
import { recordarPersona } from "@/components/sierra-tracking";
import { trackLead, type LeadUserData } from "@/lib/analytics";
import { validateLead, type Lead, type LeadFieldErrors, type LeadFields } from "@/lib/leads/schema";

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";

type Options = {
  /** Etiqueta del lead en el CRM: el slug de la landing (y de su variante). */
  source: string;
  /** Página de gracias. Sin ella el formulario se queda en estado "success". */
  thanksPath?: string;
  /** Paso visual opcional tras confirmar y medir la entrega, antes de navegar. */
  beforeNavigate?: () => void | Promise<void>;
  /** Añadir user_data al evento (Advanced Matching). Solo si la política lo cubre. */
  includeUserData?: boolean;
};

/**
 * Lógica de cualquier formulario de lead, sin UI: cada landing pinta el suyo.
 *
 * - Valida con el mismo esquema que el servidor.
 * - Una sola clave de idempotencia por formulario: los reintentos tras un error
 *   llevan la misma, así el servidor y el CRM pueden descartar duplicados.
 * - Bloqueo síncrono contra el doble clic (el estado de React llega tarde).
 * - Éxito SOLO si /api/leads confirmó la entrega. La conversión se envía una
 *   vez y antes de navegar.
 */
export function useLeadForm({ source, thanksPath, beforeNavigate, includeUserData = false }: Options) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const keyRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const trackedRef = useRef<string | null>(null);

  async function submit(fields: LeadFields) {
    if (busyRef.current) return;
    keyRef.current ??= newId();
    const idempotencyKey = keyRef.current;

    const payload = {
      ...fields,
      source,
      idempotencyKey,
      attribution: getAttribution(),
      pagePath: window.location.pathname,
    };

    const check = validateLead(payload);
    if (!check.ok) {
      /* "bot": el honeypot tiene contenido. No se envía nada. */
      if (check.reason === "invalid") setErrors(check.errors);
      return;
    }

    busyRef.current = true;
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 400) {
        const body = (await response.json().catch(() => null)) as {
          errors?: LeadFieldErrors;
        } | null;
        if (body?.errors && Object.keys(body.errors).length > 0) {
          setErrors(body.errors);
          setStatus("idle");
          busyRef.current = false;
          return;
        }
      }
      if (!response.ok) throw new Error(`leads ${response.status}`);

      // Sierra: recuerda a la persona registrada para atribuir sus clics posteriores.
      recordarPersona(check.lead.email);

      if (trackedRef.current !== idempotencyKey) {
        trackedRef.current = idempotencyKey;
        trackLead({
          eventId: idempotencyKey,
          source,
          userData: includeUserData ? toUserData(check.lead) : undefined,
        });
      }

      setStatus("success");
      /* busyRef queda en true: el formulario ya cumplió y no se reenvía. */
      if (thanksPath) {
        try {
          await beforeNavigate?.();
        } catch {
          /* Un efecto visual fallido nunca debe impedir llegar a gracias. */
        }
        router.push(thanksPath);
      }
    } catch {
      busyRef.current = false;
      setStatus("error");
    }
  }

  return { status, errors, submit };
}

function toUserData(lead: Lead): LeadUserData {
  const [firstName, ...rest] = lead.name.toLowerCase().split(" ");
  const lastName = rest.join(" ");
  return {
    email_address: lead.email,
    /* Solo con prefijo internacional: sin él no se sabe a qué país pertenece. */
    ...(lead.phone?.startsWith("+") ? { phone_number: `+${lead.phone.replace(/\D/g, "")}` } : {}),
    address: { first_name: firstName, ...(lastName ? { last_name: lastName } : {}) },
  };
}
