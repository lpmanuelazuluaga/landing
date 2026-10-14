"use client";

import { useId, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useLeadForm } from "@/lib/leads/useLeadForm";
import { ui } from "@/content/ui";
import { LANDING } from "../content";

/*
  Formulario de lead de esta landing. La lógica (validación, idempotencia,
  doble envío, conversión, redirección) está en useLeadForm y es común a todo
  el sitio; este archivo es solo la UI, y se rediseña por completo para cada
  cliente conservando los name="" y el honeypot.
*/

const FIELD =
  "mt-1 block min-h-11 w-full rounded-md border bg-background px-3 text-base text-foreground placeholder:text-muted";

export function LeadForm() {
  const { status, errors, submit } = useLeadForm({
    source: LANDING.leadSource,
    thanksPath: LANDING.thanksPath,
  });
  const id = useId();
  const busy = status === "submitting" || status === "success";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void submit({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      consent: data.get("consent") === "on",
      hp: String(data.get("hp_check") ?? ""),
    });
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4" aria-describedby={`${id}-status`}>
      <Field id={`${id}-name`} label={ui.form.name} error={errors.name}>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          className={cn(FIELD, errors.name ? "border-danger" : "border-border")}
        />
      </Field>

      <Field id={`${id}-email`} label={ui.form.email} error={errors.email}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          className={cn(FIELD, errors.email ? "border-danger" : "border-border")}
        />
      </Field>

      <Field
        id={`${id}-phone`}
        label={site.leads.requirePhone ? ui.form.phone : `${ui.form.phone} ${ui.form.optional}`}
        error={errors.phone}
      >
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required={site.leads.requirePhone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          className={cn(FIELD, errors.phone ? "border-danger" : "border-border")}
        />
      </Field>

      {site.leads.requireConsent ? (
        <div>
          <label className="flex items-start gap-2 text-sm">
            <input
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              className="mt-0.5 size-5"
            />
            <span>
              {ui.form.consentBefore}{" "}
              <Link href={site.legal.privacyPath} className="underline underline-offset-2">
                {ui.form.consentLink}
              </Link>
            </span>
          </label>
          {errors.consent ? (
            <p id={`${id}-consent-error`} className="mt-1 text-sm text-danger">
              {errors.consent}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Honeypot: invisible para personas y lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          No completar
          <input name="hp_check" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-6 font-semibold text-accent-foreground disabled:opacity-60"
      >
        {status === "submitting" ? ui.form.submitting : ui.form.submit}
      </button>

      <p id={`${id}-status`} role="status" aria-live="polite" className="text-sm">
        {status === "success" ? ui.form.success : null}
        {status === "error" ? <span className="text-danger">{ui.form.error}</span> : null}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
