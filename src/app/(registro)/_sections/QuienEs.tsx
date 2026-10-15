import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { DECOR, QUIEN_ES } from "../content";
import quienEs from "../_assets/quien-es-manuela.jpg";
import { Kicker, RotatingSeal } from "../_components/decor";
import { Stamp } from "../_components/ornaments";
import { CtaButton } from "../_components/Registration";
import { Divider, RichText } from "../_components/text";

/*
  "¿Quién es Manuela Zuluaga?": reproduce "Quem será sua mentora?" de la
  referencia. Papel claro, texto a la izquierda (pregunta pequeña + nombre
  grande, párrafos y cita con barra), foto en arco apoyada abajo y pegada a la
  franja derecha con el nombre gigante en vertical, sello giratorio y
  estampilla en la esquina.

  La foto no es un recorte sin fondo: va enmarcada en el arco, con un arco de
  color desplazado detrás que recuerda al de la referencia.
*/
export function QuienEs() {
  return (
    <section aria-labelledby="quien-es-titulo" className="fondo-papel relative overflow-clip lg:min-h-[58rem]">
      {/* Celulares: "SOBRE" gigante y tenue de fondo, cortado por el borde derecho
          (se ve "SOB" y parte de la "R"), como la palabra de fondo de Testimonios. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-[55vw] top-8 whitespace-nowrap font-serif text-[20vw] uppercase leading-none text-tierra/[0.13] sm:hidden"
      >
        {QUIEN_ES.kicker}
      </p>
      <Stamp className="pointer-events-none absolute -left-7 -top-9 w-24 -rotate-[18deg] opacity-90 md:-left-4 md:-top-6 md:w-32" />

      {/* Franja derecha con el nombre en vertical (escritorio). */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[clamp(5.5rem,8.5vw,9rem)] items-center justify-center lg:flex">
        <p className="vertical whitespace-nowrap bg-[linear-gradient(0deg,var(--color-burgundy),var(--color-malva)_55%,var(--color-rosa))] bg-clip-text font-serif text-[clamp(3.2rem,4.7vw,5rem)] uppercase leading-none text-transparent">
          {QUIEN_ES.vertical}
        </p>
      </div>

      {/* Orden: encabezado → foto → texto. En móvil y tablet la foto queda entre
          la pregunta y el texto; desde lg es absoluta (a la derecha) y el
          encabezado y el texto se leen seguidos en la columna izquierda. */}
      <div className="relative z-10 mx-auto max-w-content px-gutter sm:px-gutter-lg">
        <Reveal className="pt-16 md:pt-24 lg:max-w-[min(31rem,48%)]">
          <Kicker className="text-tierra">{QUIEN_ES.kicker}</Kicker>
          <h2 id="quien-es-titulo" className="mt-5">
            <span className="block text-[1.5rem] font-semibold text-burgundy">{QUIEN_ES.question}</span>
            <span className="mt-1 block font-serif text-[clamp(2.125rem,1.45rem+2.6vw,3.35rem)] uppercase leading-[1.1] text-tierra">
              {QUIEN_ES.name.map((line, index) => (
                <span key={index} className="block">
                  {line.map((segment, i) =>
                    typeof segment === "string" ? segment : <strong key={i} className="font-bold text-burgundy">{segment.strong}</strong>,
                  )}
                </span>
              ))}
            </span>
          </h2>
          <Divider className="mt-6" />
        </Reveal>
      </div>

      {/* Foto en arco: bajo la pregunta en móvil y tablet; apoyada abajo, junto a la franja, en escritorio. */}
      <div className="relative ml-12 mr-gutter -mt-20 sm:mx-auto sm:mt-12 sm:max-w-[30rem] lg:absolute lg:bottom-0 lg:right-[clamp(5.5rem,8.5vw,9rem)] lg:m-0 lg:h-[90%] lg:w-[min(32vw,31rem)] lg:max-w-none">
        <div aria-hidden="true" className="arco absolute inset-0 -translate-x-4 translate-y-4 bg-[linear-gradient(160deg,var(--color-malva),var(--color-rosa))] max-sm:[mask-image:linear-gradient(180deg,transparent_0%,transparent_24%,black_38%)] sm:-translate-y-4 lg:-translate-x-6 lg:-translate-y-6" />
        <div className="arco relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-full">
          <Image
            src={quienEs}
            alt={QUIEN_ES.photoAlt}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 30rem, 90vw"
            placeholder="blur"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <RotatingSeal id="sello-quien-es" text={DECOR.seal} className="absolute -left-12 top-[30%] hidden size-28 text-tierra lg:block" />
      </div>

      <div className="mx-auto max-w-content px-gutter sm:px-gutter-lg">
        <Reveal className="pb-16 pt-10 md:pb-24 lg:max-w-[min(31rem,48%)] lg:pt-7">
          <div className="space-y-5 text-[1.0625rem] leading-[1.75]">
            {QUIEN_ES.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <RichText value={paragraph} />
              </p>
            ))}
            <blockquote className="border-l-[3px] border-malva pl-5 text-[1.0625rem] italic leading-[1.7] text-tierra">
              {QUIEN_ES.quote}
            </blockquote>
            <p>
              <RichText value={QUIEN_ES.closing} />
            </p>
          </div>
          <CtaButton className="mt-9" />
        </Reveal>
      </div>
    </section>
  );
}
