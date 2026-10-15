"use client";

import { createContext, use, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import { cn } from "@/lib/cn";
import { CTA, DECOR, LANDING, MODAL, THANKS } from "../content";
import { LogoSeal, Ornament } from "./decor";
import { EventDetails } from "./EventDetails";
import { IconArrowCircle, IconCheckCircle, IconClose } from "./icons";
import { LeadForm } from "./LeadForm";
import { SmoothScroll } from "./SmoothScroll";
import { Divider, Title } from "./text";

/*
  Registro en modal. Todos los botones "Reservar mi lugar ahora" abren el mismo
  <dialog>; abrirlo no cambia la URL (ni hash ni query). Solo un registro
  confirmado por /api/leads navega a /gracias (useLeadForm).

  El modal es la tarjeta de "O que você terá acesso" de la referencia abierta
  sobre la página: papel claro, sello con el logo en el borde superior, ✦✦✦,
  título serif, detalles del evento y el formulario.
*/

const RegistrationContext = createContext<{ open: () => void } | null>(null);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => {
    router.prefetch(LANDING.thanksPath);
    setIsOpen(true);
  }, [router]);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <RegistrationContext value={value}>
      {children}
      <SmoothScroll paused={isOpen} />
      <RegistrationDialog open={isOpen} onClose={() => setIsOpen(false)} />
    </RegistrationContext>
  );
}

function useRegistration() {
  const context = use(RegistrationContext);
  if (!context) throw new Error("CtaButton debe estar dentro de RegistrationProvider.");
  return context;
}

/**
 * Botón de la referencia: rectángulo con degradado vino y flecha en círculo.
 * `block`: ocupa todo el ancho de su contenedor (dentro de tarjetas).
 */
export function CtaButton({ className, block = false }: { className?: string; block?: boolean }) {
  const { open } = useRegistration();
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className={cn(
        "btn-cta inline-flex min-h-15 w-full items-center justify-center gap-2.5 px-5 text-center text-[0.9375rem] font-semibold uppercase tracking-[0.02em] text-crema sm:min-h-[4.5rem] sm:gap-3 sm:px-7 sm:text-base sm:tracking-[0.04em]",
        !block && "sm:w-auto sm:min-w-[27.5rem]",
        className,
      )}
    >
      {CTA.label}
      <IconArrowCircle className="size-5 shrink-0" />
    </button>
  );
}

function RegistrationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  async function beforeNavigate() {
    /* Con movimiento reducido se navega directamente, sin pausa decorativa. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setConfirmed(true);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1800));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={confirmed ? "registro-exito-titulo" : "registro-titulo"}
      bare
      className="max-h-dvh w-[min(100%-1.25rem,33.5rem)] overflow-y-auto overscroll-contain pt-12 pb-3 backdrop:bg-noche/75 backdrop:backdrop-blur-[5px]"
    >
      <div className="modal-tarjeta fondo-papel relative rounded-[1.25rem] border border-rosa/60 px-5 pb-7 pt-14 text-center shadow-[0_40px_80px_-30px_rgb(30_20_18/0.8)] sm:px-10 sm:pb-9">
        <div inert={confirmed} className={confirmed ? "invisible" : undefined}>
          {/* Sello con el logo sobre el borde superior, como la tarjeta de oferta de la referencia. */}
          <LogoSeal id="sello-modal" text={DECOR.seal} />

          <Ornament className="mx-auto text-burgundy" />
          <p className="mt-3 text-[0.75rem] font-medium uppercase tracking-[0.5em] text-malva">{MODAL.kicker}</p>
          <Title id="registro-titulo" lines={MODAL.title} size="card" className="mt-2" />
          <EventDetails className="mt-4 justify-center" />
          <Divider align="centro" className="mb-6 mt-5" />

          <LeadForm beforeNavigate={beforeNavigate} />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-tierra transition-colors hover:bg-rosa/25"
          >
            <IconClose className="size-5" />
            <span className="sr-only">{MODAL.close}</span>
          </button>
        </div>

        {confirmed ? (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={-1}
            ref={(element) => element?.focus({ preventScroll: true })}
            className="registro-puente absolute inset-0 flex flex-col items-center justify-center rounded-[inherit] px-7 text-tierra outline-none sm:px-12"
          >
            <IconCheckCircle className="registro-puente-check size-20 text-burgundy" />
            <h2 id="registro-exito-titulo" className="mt-6 font-serif text-[clamp(2.5rem,7vw,3.25rem)] leading-none text-balance text-burgundy">
              {THANKS.transition.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed">{THANKS.transition.body}</p>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

