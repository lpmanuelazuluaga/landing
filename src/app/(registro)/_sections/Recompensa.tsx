import { Reveal } from "@/components/ui/Reveal";
import { RECOMPENSA } from "../content";
import { Kicker, ScrollHint } from "../_components/decor";
import { ICONS } from "../_components/icons";
import { CtaButton } from "../_components/Registration";
import { Divider, Title } from "../_components/text";

/*
  Recompensa: reproduce "A tríade da esposa edificada" de la referencia. Tres
  tarjetas con borde fino, barra superior, ícono lineal, título y texto
  centrados. El título de cada tarjeta es la primera palabra del punto del
  copy y el texto, el resto: se lee seguido y no se cambia ni una palabra.
*/
export function Recompensa() {
  return (
    <section aria-labelledby="recompensa-titulo" className="fondo-luz relative overflow-clip">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-[55vw] top-8 whitespace-nowrap font-serif text-[20vw] uppercase leading-none text-tierra/[0.13] sm:hidden"
      >
        {RECOMPENSA.kicker}
      </p>
      <div className="relative z-10 mx-auto max-w-content px-gutter pb-20 pt-6 text-center sm:px-gutter-lg md:pb-24">
        <ScrollHint className="text-malva" />
        <Reveal>
          <Kicker className="mt-7 justify-center text-tierra">{RECOMPENSA.kicker}</Kicker>
          <Title id="recompensa-titulo" lines={RECOMPENSA.title} className="mx-auto mt-4 max-w-[46rem]" />
          <Divider align="centro" className="mt-7" />
        </Reveal>

        <ul className="mx-auto mt-14 grid max-w-[50rem] gap-6 md:grid-cols-3 md:gap-3.5">
          {RECOMPENSA.items.map((item, index) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.lead}>
                <Reveal delayMs={index * 110} className="h-full">
                  <div className="relative h-full border border-malva/70 px-6 pb-9 pt-10">
                    <span aria-hidden="true" className="absolute -top-[3px] left-1/2 h-[5px] w-20 -translate-x-1/2 rounded-full bg-burgundy" />
                    <Icon className="mx-auto size-10 text-burgundy" />
                    <h3 className="mt-5 text-[1.75rem] font-semibold leading-tight text-burgundy">{item.lead}</h3>
                    <p className="mt-3 text-[1.0625rem] leading-relaxed text-tierra">{item.rest}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <CtaButton className="mt-12" />
      </div>
    </section>
  );
}
