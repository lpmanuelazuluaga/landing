import { Reveal } from "@/components/ui/Reveal";
import { PLACEHOLDERS, TESTIMONIOS } from "../content";
import { IconStar } from "../_components/icons";
import { CtaButton } from "../_components/Registration";
import { TestimonialsCarousel } from "../_components/TestimonialsCarousel";
import { Title } from "../_components/text";

/*
  Testimonios: reproduce "Depoimentos de alunas" de la referencia. Palabra
  gigante de fondo, título, valoración, tarjetas oscuras escalonadas con
  puntos y botón. Mientras PLACEHOLDERS.testimonials sea true, cada tarjeta
  lleva la etiqueta "Ejemplo".
*/
export function Testimonios() {
  return (
    <section aria-labelledby="testimonios-titulo" className="fondo-luz relative overflow-hidden">
      <p
        aria-hidden="true"
        className="marca-agua pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap font-serif text-[clamp(4.5rem,15vw,14rem)] uppercase leading-none md:top-14"
      >
        {TESTIMONIOS.watermark}
      </p>

      <div className="relative mx-auto max-w-[66rem] px-gutter pb-20 pt-[clamp(4.5rem,11vw,9.5rem)] text-center sm:px-gutter-lg md:pb-24">
        <Reveal>
          <Title id="testimonios-titulo" lines={TESTIMONIOS.title} />
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 text-[1.0625rem] text-tierra">
            <IconStar className="size-5 text-burgundy" />
            <strong className="font-semibold text-burgundy">{TESTIMONIOS.rating.value}</strong>
            <span>— {TESTIMONIOS.rating.text}</span>
          </p>
        </Reveal>

        <Reveal delayMs={120} className="mt-12">
          <TestimonialsCarousel items={TESTIMONIOS.items} placeholder={PLACEHOLDERS.testimonials} />
        </Reveal>

        <CtaButton className="mt-10" />
      </div>
    </section>
  );
}
