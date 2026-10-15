"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useLeadForm } from "@/lib/leads/useLeadForm";
import { ui } from "@/content/ui";
import { CTA, LANDING } from "../content";
import { COUNTRIES, DEFAULT_COUNTRY, findCountry } from "./countries";
import { IconArrowCircle, IconChevronDown } from "./icons";

/*
  Formulario de registro de la masterclass (vive en el modal). La lógica
  (validación, idempotencia, doble envío, conversión y redirección a /gracias
  solo tras un 200) está en useLeadForm; aquí va solo la UI, con el lenguaje de
  la referencia: campos rectos, borde rosa, botón con degradado.

  Se conservan los name="" y el honeypot hp_check. Nombre, correo y WhatsApp
  son obligatorios (site.leads.requirePhone). El WhatsApp se envía con el
  prefijo del país elegido delante ("+57 300 000 0000").
*/

/** Antepone el prefijo salvo que la persona ya haya escrito uno (+…). Vacío
    sigue vacío, para que la validación diga "Escribe tu número". */
function withDialCode(number: string, dial: string): string {
  const value = number.trim();
  if (!value || value.startsWith("+")) return value;
  return `${dial} ${value}`;
}

const FIELD =
  "mt-1.5 block min-h-12 w-full rounded-[3px] border bg-white/75 px-3.5 text-base text-tierra placeholder:text-tierra/45 transition-colors focus:border-malva focus:bg-white";

export function LeadForm({ beforeNavigate }: { beforeNavigate?: () => void | Promise<void> }) {
  const { status, errors, submit } = useLeadForm({
    source: LANDING.leadSource,
    thanksPath: LANDING.thanksPath,
    beforeNavigate,
  });
  const id = useId();
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY);
  const country = findCountry(countryIso);
  const busy = status === "submitting" || status === "success";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void submit({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: withDialCode(String(data.get("phone") ?? ""), country.dial),
      consent: data.get("consent") === "on",
      hp: String(data.get("hp_check") ?? ""),
    });
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4 text-left" aria-describedby={`${id}-status`}>
      <Field id={`${id}-name`} label={ui.form.name} error={errors.name}>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Tu nombre"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          className={cn(FIELD, errors.name ? "border-danger" : "border-rosa")}
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
          placeholder={ui.form.emailPlaceholder}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          className={cn(FIELD, errors.email ? "border-danger" : "border-rosa")}
        />
      </Field>

      <Field
        id={`${id}-phone`}
        label={site.leads.requirePhone ? ui.form.phone : `${ui.form.phone} ${ui.form.optional}`}
        error={errors.phone}
      >
        <div
          className={cn(
            "mt-1.5 flex min-h-12 rounded-[3px] border bg-white/75 transition-colors focus-within:border-malva focus-within:bg-white has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus",
            errors.phone ? "border-danger" : "border-rosa",
          )}
        >
          {/* Prefijo: el <select> nativo (transparente) cubre la bandera y el
              prefijo visibles, así se conserva el selector del sistema y su
              accesibilidad (en móvil abre la rueda o la hoja nativa). */}
          <div className="relative flex shrink-0 items-center gap-1.5 border-r border-rosa/70 pl-3 pr-2.5 text-base text-tierra has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-focus">
            <country.Flag aria-hidden="true" className="h-[0.95rem] w-auto rounded-[2px] shadow-[0_0_0_1px_rgb(74_58_50/0.18)]" />
            <IconChevronDown className="size-3.5 text-tierra/60" />
            <span className="tabular-nums">{country.dial}</span>
            <select
              name="phone_country"
              value={country.iso}
              onChange={(event) => setCountryIso(event.target.value)}
              aria-label={ui.form.phoneCountry}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {COUNTRIES.map((option) => (
                <option key={option.iso} value={option.iso}>
                  {option.name} ({option.dial})
                </option>
              ))}
            </select>
          </div>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={site.leads.requirePhone}
            placeholder={country.iso === DEFAULT_COUNTRY ? "300 000 0000" : ui.form.phonePlaceholder}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className="min-w-0 flex-1 bg-transparent px-3 text-base text-tierra outline-none placeholder:text-tierra/45"
          />
        </div>
      </Field>

      {site.leads.requireConsent ? (
        <div>
          <label className="flex items-start gap-3 text-[0.9375rem] leading-snug text-tierra">
            <input
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              className="mt-0.5 size-5 shrink-0 accent-burgundy"
            />
            <span>
              {ui.form.consentBefore}{" "}
              <Link href={site.legal.privacyPath} target="_blank" className="font-medium text-burgundy underline underline-offset-2">
                {ui.form.consentLink}
              </Link>
            </span>
          </label>
          {errors.consent ? (
            <p id={`${id}-consent-error`} className="mt-1.5 text-sm text-danger">
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
        className="btn-cta flex min-h-15 w-full items-center justify-center gap-3 px-6 text-[0.9375rem] font-semibold uppercase tracking-[0.04em] text-crema disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? ui.form.submitting : CTA.label}
        <IconArrowCircle className="size-5 shrink-0" />
      </button>

      <p id={`${id}-status`} role="status" aria-live="polite" className="min-h-5 text-center text-sm">
        {status === "success" ? <span className="text-success">{ui.form.success}</span> : null}
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
      <label htmlFor={id} className="text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-tierra">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
