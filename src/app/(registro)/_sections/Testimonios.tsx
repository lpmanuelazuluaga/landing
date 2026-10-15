import { Reveal } from "@/components/ui/Reveal";
import { TESTIMONIOS } from "../content";
import portada1 from "../_assets/testimonio-1.jpg";
import portada2 from "../_assets/testimonio-2.jpg";
import portada3 from "../_assets/testimonio-3.jpg";
import portada4 from "../_assets/testimonio-4.jpg";
import portada5 from "../_assets/testimonio-5.jpg";
import portada6 from "../_assets/testimonio-6.jpg";
import { IconPlay } from "../_components/icons";
import { CtaButton } from "../_components/Registration";
import { TestimonialsCarousel } from "../_components/TestimonialsCarousel";
import { Title } from "../_components/text";

/* El número conserva la asociación explícita entre cada portada y su video. */
const POSTERS = { 1: portada1, 2: portada2, 3: portada3, 4: portada4, 5: portada5, 6: portada6 };

export function Testimonios() {
  return (
    <section aria-labelledby="testimonios-titulo" className="fondo-luz relative overflow-clip">
      <p
        aria-hidden="true"
        className="marca-agua pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap font-serif text-[clamp(4.5rem,15vw,14rem)] uppercase leading-none md:top-14"
      >
        {TESTIMONIOS.watermark}
      </p>

      <div className="relative mx-auto max-w-[66rem] px-gutter pb-20 pt-[clamp(4.5rem,11vw,9.5rem)] text-center sm:px-gutter-lg md:pb-24">
        <Reveal>
          <Title id="testimonios-titulo" lines={TESTIMONIOS.title} />
          <p className="mx-auto mt-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-malva/40 bg-crema/70 px-5 py-3 text-[0.9375rem] leading-snug text-tierra">
            <IconPlay className="size-5 shrink-0 text-burgundy" />
            {TESTIMONIOS.hint}
          </p>
        </Reveal>

        <Reveal delayMs={120} className="mt-12">
          <TestimonialsCarousel items={TESTIMONIOS.items.map((item) => ({ ...item, poster: POSTERS[item.id] }))} />
        </Reveal>

        <CtaButton className="mt-10" />
      </div>
    </section>
  );
}
