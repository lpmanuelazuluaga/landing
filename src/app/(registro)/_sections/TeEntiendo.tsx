import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { DECOR, TE_ENTIENDO } from "../content";
import relacion from "../_assets/relacion.jpg";
import { Ornament, RotatingSeal, ScrollHint } from "../_components/decor";
import { CtaButton } from "../_components/Registration";
import { Divider, RichText, Title } from "../_components/text";

/*
  "Te entiendo…": reproduce "É preciso aprender a ser esposa" de la
  referencia. Foto en tono sepia con sombra difusa desplazada, texto vertical
  grande + pequeño a su izquierda y sello giratorio en la esquina; a la derecha
  ✦✦✦, título, divisor, párrafos con destacados y botón.
*/
export function TeEntiendo() {
  return (
    <section aria-labelledby="te-entiendo-titulo" className="fondo-luz relative">
      <div className="mx-auto max-w-[66rem] px-gutter py-16 sm:px-gutter-lg md:py-20">
        <ScrollHint className="text-tierra" />

        <div className="mt-10 grid items-center gap-14 lg:mt-8 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
          <Reveal>
            {/* Columna: texto vertical (4,5 rem) + foto. */}
            <div className="relative mx-auto w-full max-w-[22rem] lg:ml-[4.5rem] lg:w-[calc(100%-4.5rem)] lg:max-w-none">
              <p
                aria-hidden="true"
                className="vertical absolute bottom-1 right-[calc(100%+1rem)] hidden whitespace-nowrap font-serif uppercase leading-[0.8] lg:block"
              >
                <span className="text-[clamp(3rem,4.6vw,4.4rem)] text-burgundy">{TE_ENTIENDO.vertical.big}</span>{" "}
                <span className="text-[clamp(1.9rem,2.9vw,2.75rem)] text-tierra">{TE_ENTIENDO.vertical.small}</span>
              </p>
              <RotatingSeal id="sello-te-entiendo" text={DECOR.seal} className="absolute -left-3 -top-11 z-10 size-24 text-rosa lg:-left-12 lg:-top-14 lg:size-32" />

              <div className="relative aspect-[5/8]">
                {/* Sombra difusa desplazada abajo a la izquierda, como en la referencia. */}
                <div aria-hidden="true" className="absolute inset-0 -translate-x-[7%] translate-y-[4%] rounded-2xl bg-tierra/55 blur-2xl" />
                <Image
                  src={relacion}
                  alt={TE_ENTIENDO.photoAlt}
                  fill
                  sizes="(min-width: 768px) 26rem, 22rem"
                  placeholder="blur"
                  className="foto-sepia rounded-2xl object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <Ornament className="text-tierra" />
            <Title id="te-entiendo-titulo" lines={TE_ENTIENDO.title} className="mt-4" />
            <Divider className="mt-7" />
            <div className="mt-7 space-y-6 text-[1.0625rem] leading-[1.75] md:text-[1.125rem]">
              {TE_ENTIENDO.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  <RichText value={paragraph} />
                </p>
              ))}
            </div>
            <CtaButton className="mt-9" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
