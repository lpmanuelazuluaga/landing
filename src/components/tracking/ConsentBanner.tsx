"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { clearConsent, saveConsent } from "@/lib/consent";
import { useConsent } from "@/lib/useConsent";
import { site } from "@/lib/site";
import { ui } from "@/content/ui";

/*
  Banner mínimo para la vía directa (Clarity/Pixel sin GTM). Rechazar está al
  mismo nivel que aceptar y hay configuración por categoría.

  Es una base técnica, no asesoramiento legal: textos, categorías y política de
  cookies los valida el cliente. Sin estilos de marca: usa los tokens del tema
  y cada proyecto lo adapta.
*/
export function ConsentBanner() {
  const consent = useConsent();
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleId = useId();

  if (consent.status !== "undecided") return null;

  const buttonClass =
    "min-h-11 rounded-md border border-border px-4 text-sm font-medium transition-colors hover:bg-surface";

  return (
    <section
      aria-labelledby={titleId}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background py-4 shadow-[0_-4px_24px_rgb(0_0_0/0.08)]"
    >
      <Container>
        <h2 id={titleId} className="text-base font-semibold">
          {ui.consent.title}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {ui.consent.body}{" "}
          <Link href={site.legal.cookiesPath} className="underline underline-offset-2">
            {ui.consent.more}
          </Link>
        </p>

        {configuring ? (
          <fieldset className="mt-3 space-y-2 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
              />
              <span>{ui.consent.analytics}</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />
              <span>{ui.consent.marketing}</span>
            </label>
          </fieldset>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonClass}
            onClick={() => saveConsent({ analytics: false, marketing: false })}
          >
            {ui.consent.reject}
          </button>
          {configuring ? (
            <button
              type="button"
              className={buttonClass}
              onClick={() => saveConsent({ analytics, marketing })}
            >
              {ui.consent.save}
            </button>
          ) : (
            <button type="button" className={buttonClass} onClick={() => setConfiguring(true)}>
              {ui.consent.configure}
            </button>
          )}
          <button
            type="button"
            className={buttonClass}
            onClick={() => saveConsent({ analytics: true, marketing: true })}
          >
            {ui.consent.accept}
          </button>
        </div>
      </Container>
    </section>
  );
}

/**
 * Reabre el banner. Recarga la página porque un script ya ejecutado no se
 * puede descargar: tras la recarga solo entra lo que se vuelva a aceptar.
 */
export function ConsentPreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className ?? "underline underline-offset-2"}
      onClick={() => {
        clearConsent();
        window.location.reload();
      }}
    >
      {ui.consent.reopen}
    </button>
  );
}
