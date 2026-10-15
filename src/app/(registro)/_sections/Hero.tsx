import { getImageProps } from "next/image";
import { DECOR, HERO } from "../content";
import heroDesktop from "../_assets/hero-desktop.jpg";
import heroMobile from "../_assets/hero-mobile.jpg";
import { Logo, RotatingSeal } from "../_components/decor";
import { EventDetails } from "../_components/EventDetails";
import { CtaButton } from "../_components/Registration";
import { Title } from "../_components/text";

/*
  Hero (opción A aprobada): foto de Manuela a sangre en lugar del recorte en
  arco de la referencia. Se conservan el resto de piezas del hero de la
  referencia: logo sobre el título, título serif en mayúsculas con la segunda
  parte destacada, bloque con barra lateral, botón, fila de detalles (en lugar
  de los sellos de confianza), sello giratorio y franja con texto vertical.

  Foto LCP con cambio de encuadre: getImageProps + <picture>, con
  loading="eager" y fetchPriority="high"; el navegador descarga solo una
  (AGENTS.md, regla 4).
*/
export function Hero() {
  const common = { alt: HERO.photoAlt, fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: heroDesktop });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: heroMobile, loading: "eager", fetchPriority: "high" });

  return (
    <section aria-labelledby="hero-titulo" className="tono-oscuro relative isolate overflow-hidden bg-noche">
      {/* Foto + degradados para leer el texto (izquierda en escritorio, abajo en móvil). */}
      <div className="absolute inset-x-0 top-0 -z-10 h-full md:h-[56.25vw] lg:bottom-0 lg:right-[clamp(5.5rem,8.5vw,9rem)] lg:h-auto">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktop} />
          <img {...rest} srcSet={mobile} alt={rest.alt} className="object-cover object-top lg:object-[72%_center]" />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(30_20_18/0)_0%,rgb(30_20_18/0)_31%,rgb(30_20_18/0.82)_39%,var(--color-noche)_47%)] md:bg-[linear-gradient(180deg,rgb(30_20_18/0)_50%,var(--color-noche)_100%)] lg:bg-[linear-gradient(90deg,rgb(30_20_18/0.95)_0%,rgb(30_20_18/0.86)_30%,rgb(30_20_18/0.35)_52%,rgb(30_20_18/0)_66%)]" />
        <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(0deg,rgb(30_20_18/0.75),rgb(30_20_18/0))] lg:block" />
      </div>

      {/* Franja con texto vertical (escritorio), como la de la referencia. */}
      <div
        aria-hidden="true"
        className="fondo-papel absolute inset-y-0 right-0 hidden w-[clamp(5.5rem,8.5vw,9rem)] items-center justify-center lg:flex"
      >
        <p className="vertical flex items-center gap-6 whitespace-nowrap font-serif text-[clamp(1.3rem,1.75vw,1.95rem)] uppercase leading-none tracking-[0.05em] text-tierra">
          <span>{DECOR.heroVertical.first}</span>
          <span className="h-14 w-px bg-tierra/70" />
          <span className="text-burgundy">{DECOR.heroVertical.second}</span>
        </p>
      </div>

      {/* Sello giratorio entre el texto y la foto. */}
      <RotatingSeal
        id="sello-hero"
        text={DECOR.seal}
        className="absolute left-[54.5%] top-[69%] hidden size-24 text-rosa/85 lg:block"
      />

      <div className="mx-auto flex max-w-content flex-col justify-center px-gutter pb-14 pt-[118vw] sm:px-gutter-lg md:pb-16 md:pt-[50vw] lg:min-h-[clamp(42rem,56vw,58rem)] lg:py-24">
        <div className="max-w-[31rem]">
          <Logo className="w-36 text-crema md:w-44" />
          <Title as="h1" id="hero-titulo" lines={HERO.title} tone="oscuro" size="hero" className="mt-7 md:mt-9" />
          <p className="mt-7 border-l-[3px] border-rosa pl-5 text-[1.1875rem] leading-snug text-crema md:text-[1.3125rem]">
            {HERO.subtitle}
          </p>
          <p className="mt-4 text-[1rem] leading-relaxed text-crema/75 md:text-[1.0625rem]">{HERO.body}</p>
          <CtaButton className="mt-8 md:mt-9" />
          <EventDetails tone="oscuro" className="mt-6" />
        </div>
      </div>
    </section>
  );
}
