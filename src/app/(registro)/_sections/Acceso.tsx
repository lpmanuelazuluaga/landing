import Image from "next/image";
import { ACCESO, DECOR, PLACEHOLDERS } from "../content";
import fotoTemporal from "../_assets/hero-desktop.jpg";
import { Kicker, LogoSeal, PlaceholderTag } from "../_components/decor";
import { EventDetails } from "../_components/EventDetails";
import { CtaButton } from "../_components/Registration";
import { Divider, Title } from "../_components/text";

/*
  "El acceso": reproduce "O que você terá acesso" de la referencia. Foto de
  fondo en duotono oscuro y tarjeta de papel con el sello del logo sobre el
  borde, ✦✦✦, título, los detalles del evento como lista con checks y el
  botón. Sin precio (la masterclass es gratuita).

  FOTO TEMPORAL (PLACEHOLDERS.accessPhoto): se reutiliza la del hero hasta
  recibir la definitiva.
*/
export function Acceso() {
  return (
    <section aria-labelledby="acceso-titulo" className="tono-oscuro relative isolate overflow-clip bg-noche">
      <Image
        src={fotoTemporal}
        alt={ACCESO.photoAlt}
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[70%_30%] opacity-90 [filter:sepia(0.55)_saturate(0.75)_brightness(0.62)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(30_20_18/0.35)_0%,rgb(30_20_18/0.2)_40%,var(--color-noche)_100%)]" />
      {PLACEHOLDERS.accessPhoto ? (
        <PlaceholderTag className="absolute left-4 top-4 bg-noche/60 text-crema md:left-6 md:top-6">Foto temporal</PlaceholderTag>
      ) : null}

      <div className="mx-auto max-w-content px-gutter pb-20 pt-28 sm:px-gutter-lg md:pb-28 md:pt-36">
        <div className="fondo-papel relative mx-auto max-w-[40rem] rounded-[1.25rem] border border-rosa/50 px-6 pb-10 pt-16 text-center text-tierra shadow-[0_40px_80px_-30px_rgb(0_0_0/0.85)] [--color-focus:var(--color-malva)] sm:px-14 sm:pb-12">
          <LogoSeal id="sello-acceso" text={DECOR.seal} />
          <Kicker className="justify-center text-malva">{ACCESO.kicker}</Kicker>
          <Title id="acceso-titulo" lines={ACCESO.title} className="mt-3" />
          <Divider align="centro" className="my-8" />
          <EventDetails variant="lista" className="mx-auto w-fit text-left" />
          <Divider align="centro" className="my-8" />
          <CtaButton block />
        </div>
      </div>
    </section>
  );
}
