import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { QUE_ES } from "../content";
import espejo from "../_assets/espejo.jpg";
import { Kicker, Ornament } from "../_components/decor";
import { MirrorFrame } from "../_components/ornaments";
import { CtaButton } from "../_components/Registration";
import { Divider, Title } from "../_components/text";

/*
  "¿Qué es El amor no se sana?": reproduce "O que é a escola?" de la
  referencia. Oscura con brillo cálido arriba a la izquierda; espejo tallado
  con la foto; a la derecha antetítulo, título y la tarjeta con el texto y el
  botón. El contador provisional de plazas se retiró a pedido de la agencia.
*/
export function QueEs() {
  return (
    <section aria-labelledby="que-es-titulo" className="fondo-noche-brillo-izq tono-oscuro relative">
      {/* Orden del DOM (y de lectura en móvil): título, espejo, tarjeta.
          En escritorio, espejo a la izquierda; título y tarjeta a la derecha. */}
      <div className="mx-auto grid max-w-[66rem] gap-10 px-gutter py-16 sm:px-gutter-lg md:py-24 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-5 lg:gap-y-6">
        <Reveal className="lg:col-start-2 lg:row-start-1">
          <Kicker className="text-crema/90">{QUE_ES.kicker}</Kicker>
          <Title id="que-es-titulo" lines={QUE_ES.title} tone="oscuro" className="mt-4" />
          <Divider tone="oscuro" className="mt-6" />
        </Reveal>

        <Reveal className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <MirrorFrame className="mx-auto w-full max-w-[25rem] lg:max-w-[29rem]">
            <Image src={espejo} alt={QUE_ES.photoAlt} fill sizes="(min-width: 768px) 22rem, 70vw" placeholder="blur" className="object-cover" />
          </MirrorFrame>
          <div aria-hidden="true" className="mx-auto -mt-2 h-6 w-3/4 rounded-[50%] bg-black/45 blur-xl" />
        </Reveal>

        <Reveal delayMs={120} className="lg:col-start-2 lg:row-start-2 lg:mt-3">
          <div className="h-full rounded-xl border border-rosa/35 bg-noche/45 px-5 py-10 sm:px-7 md:px-11">
            <Ornament className="text-crema" />
            <h3 className="mt-6 text-[clamp(1.75rem,1.4rem+1.2vw,2.15rem)] font-semibold leading-tight text-crema">{QUE_ES.cardTitle}</h3>
            <p className="mt-5 text-[1.0625rem] leading-[1.8] text-crema/90">{QUE_ES.text}</p>
            <CtaButton block className="mt-9" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
