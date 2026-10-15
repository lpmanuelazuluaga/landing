import type { Metadata } from "next";
import { noindexMetadata } from "@/lib/seo";
import { DECOR, PLACEHOLDERS, THANKS } from "../content";
import { LogoSeal, Ornament, PlaceholderTag } from "../_components/decor";
import { EventDetails } from "../_components/EventDetails";
import { Divider, Title } from "../_components/text";

/*
  Página de gracias (/gracias): siempre noindex y fuera del sitemap. Se llega
  solo tras un registro confirmado por /api/leads. Misma tarjeta de papel con
  sello que el modal, sobre fondo oscuro.

  La conversión NO se dispara aquí: ya se envió en el formulario, antes de
  navegar. Dispararla al cargar la contaría otra vez en cada recarga.

  PENDIENTE (PLACEHOLDERS.thanksNextStep): el siguiente paso (grupo de
  WhatsApp) se completa cuando el cliente lo confirme.
*/

export const metadata: Metadata = noindexMetadata(THANKS.metaTitle);

export default function ThanksPage() {
  return (
    <main className="fondo-noche-brillo-abajo tono-oscuro grid min-h-svh place-items-center px-gutter pb-16 pt-24">
      <div className="fondo-papel relative w-full max-w-[36rem] rounded-[1.25rem] border border-rosa/50 px-6 pb-10 pt-16 text-center text-tierra shadow-[0_40px_80px_-30px_rgb(0_0_0/0.85)] [--color-focus:var(--color-malva)] sm:px-12">
        <LogoSeal id="sello-gracias" text={DECOR.seal} />
        <Ornament className="mx-auto text-burgundy" />
        <p className="mt-3 text-[0.75rem] font-medium uppercase tracking-[0.5em] text-malva">{THANKS.kicker}</p>
        <Title as="h1" lines={THANKS.title} size="card" className="mt-2" />
        <Divider align="centro" className="my-7" />
        <EventDetails variant="lista" className="mx-auto w-fit text-left" />

        <div className="mt-8 rounded-lg border border-dashed border-malva/60 px-5 py-5">
          {PLACEHOLDERS.thanksNextStep ? <PlaceholderTag className="text-malva">Pendiente</PlaceholderTag> : null}
          <p className="mt-2 text-[0.9375rem] leading-relaxed">{THANKS.nextStep}</p>
        </div>
      </div>
    </main>
  );
}
