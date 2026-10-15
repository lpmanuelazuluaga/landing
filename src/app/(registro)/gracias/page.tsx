import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";
import { DECOR, PLACEHOLDERS, THANKS } from "../content";
import { LogoSeal, Ornament, PlaceholderTag } from "../_components/decor";
import { EventDetails } from "../_components/EventDetails";
import { IconWhatsApp } from "../_components/icons";
import { Divider, Title } from "../_components/text";

/*
  Página de gracias (/gracias): siempre noindex y fuera del sitemap. Se llega
  solo tras un registro confirmado por /api/leads. Misma tarjeta de papel con
  sello que el modal, sobre fondo oscuro.

  La conversión NO se dispara aquí: ya se envió en el formulario, antes de
  navegar. Dispararla al cargar la contaría otra vez en cada recarga.

  El siguiente paso es el grupo de WhatsApp confirmado por el cliente.
*/

export const metadata: Metadata = noindexMetadata(THANKS.metaTitle);

export default function ThanksPage() {
  return (
    <main className="gracias-pagina fondo-noche-brillo-abajo tono-oscuro grid min-h-svh place-items-center px-gutter pb-12 pt-20 sm:pb-16 sm:pt-24">
      <div className="gracias-tarjeta fondo-papel relative w-full max-w-[36rem] rounded-[1.25rem] border border-rosa/50 px-5 pb-7 pt-14 text-center text-tierra shadow-[0_40px_80px_-30px_rgb(0_0_0/0.85)] [--color-focus:var(--color-malva)] sm:px-12 sm:pb-10 sm:pt-16">
        <LogoSeal id="sello-gracias" text={DECOR.seal} />
        <Ornament className="mx-auto text-burgundy" />
        <p className="mt-3 text-[0.75rem] font-medium uppercase tracking-[0.5em] text-malva">{THANKS.kicker}</p>
        <Title as="h1" lines={THANKS.title} size="card" className="registro-confirmacion mt-2" />
        <p className="mx-auto mt-4 max-w-[25rem] text-[0.9375rem] leading-relaxed">{THANKS.welcome}</p>
        <Divider align="centro" className="my-5 sm:my-6" />
        <EventDetails variant="lista" className="gracias-detalles mx-auto w-fit text-left" />

        <section aria-labelledby="gracias-ultimo-paso" className="gracias-siguiente-paso mt-6 rounded-xl border border-malva/30 bg-white/40 px-4 pb-5 pt-4 sm:mt-7 sm:px-6">
          {PLACEHOLDERS.thanksNextStep ? <PlaceholderTag className="text-malva">Pendiente</PlaceholderTag> : null}
          <h2 id="gracias-ultimo-paso" className="inline-flex rounded-full bg-burgundy px-4 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-crema">{THANKS.lastStep}</h2>
          <p className="mx-auto mt-3 max-w-[24rem] font-serif text-[1.75rem] leading-[1.12] text-balance text-burgundy sm:text-[2rem]">{THANKS.nextStep}</p>
          <a
            href={THANKS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-whatsapp mt-4 inline-flex min-h-15 w-full items-center justify-center gap-3 px-4 py-3 text-[0.9375rem] font-semibold uppercase leading-snug tracking-[0.02em] text-whatsapp-foreground"
          >
            <IconWhatsApp className="size-6 shrink-0" />
            {THANKS.whatsappLabel}
          </a>
        </section>
      </div>
    </main>
  );
}
