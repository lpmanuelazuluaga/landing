import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { DECOR, PARA_TI } from "../content";
import { Logo, RotatingSeal, ScrollHint } from "../_components/decor";
import { Escenario } from "../_components/Escenario";
import { ICONS } from "../_components/icons";
import { CtaButton } from "../_components/Registration";
import { Divider, Title } from "../_components/text";

/*
  "Este evento es para ti si…": reproduce la sección oscura de la metodología
  de la referencia. Las cuatro baldosas (M-E-S-S) pasan a ser 01-04, con el
  sello del logo en el centro, los íconos en las esquinas exteriores y los
  cuatro textos alrededor.

  Escritorio (lg), al aparecer la sección (Escenario): cada baldosa se va
  despacio a una esquina distinta y los textos se juntan en el centro; el
  círculo central no se mueve. Cada pieza declara su posición inicial
  (--desde) y final (--hasta) como valores de `translate` desde el centro del
  escenario; las esquinas se calculan con unidades de contenedor (cqw/cqh).

  Móvil y tablet: gráfico arriba y lista debajo. Las tarjetas de vidrio de
  móvil tienen un reflejo tenue que recorre su superficie.

  El gráfico es decorativo (aria-hidden): la lista ordenada lleva el contenido
  en el orden de lectura correcto.
*/

/* Baldosa de cada número: vino con número crema, o crema con número vino. */
const TILE = [
  "rounded-[1.9rem] bg-[linear-gradient(135deg,#3a0a0e_0%,var(--color-burgundy)_45%,var(--color-malva)_100%)] text-crema",
  "rounded-[1.9rem] bg-[linear-gradient(135deg,var(--color-arena)_0%,var(--color-crema)_55%,var(--color-papel)_100%)] text-burgundy",
  "rounded-[1.9rem] bg-[linear-gradient(135deg,var(--color-arena)_0%,var(--color-crema)_55%,var(--color-papel)_100%)] text-burgundy",
  "rounded-[1.9rem] bg-[linear-gradient(135deg,#3a0a0e_0%,var(--color-burgundy)_45%,var(--color-malva)_100%)] text-crema",
] as const;

/* Posición de cada baldosa dentro del cuadrado (móvil y tablet). */
const TILE_POS = [
  "max-lg:left-0 max-lg:top-0",
  "max-lg:right-0 max-lg:top-0",
  "max-lg:bottom-0 max-lg:left-0",
  "max-lg:bottom-0 max-lg:right-0",
] as const;

/* Ícono de cada baldosa: arriba en las superiores, abajo en las inferiores. */
const BADGE = ["-top-7", "-top-7", "-bottom-7", "-bottom-7"] as const;

/* Movimiento de las baldosas (escritorio): juntas en el centro → esquinas. */
const TILE_MOTION = [
  { desde: "calc(-100% - 0.55rem) calc(-100% - 0.55rem)", hasta: "-50cqw -50cqh" },
  { desde: "0.55rem calc(-100% - 0.55rem)", hasta: "calc(50cqw - 100%) -50cqh" },
  { desde: "calc(-100% - 0.55rem) 0.55rem", hasta: "-50cqw calc(50cqh - 100%)" },
  { desde: "0.55rem 0.55rem", hasta: "calc(50cqw - 100%) calc(50cqh - 100%)" },
] as const;

/* Movimiento de los textos (escritorio): a los costados → en el centro,
   dejando libre el círculo central (radio 5rem). */
const TEXT_MOTION = [
  { desde: "-50cqw calc(-6.5rem - 50%)", hasta: "calc(-100% - 6rem) calc(-100% - 1.25rem)" },
  { desde: "calc(50cqw - 100%) calc(-6.5rem - 50%)", hasta: "6rem calc(-100% - 1.25rem)" },
  { desde: "-50cqw calc(6.5rem - 50%)", hasta: "calc(-100% - 6rem) 1.25rem" },
  { desde: "calc(50cqw - 100%) calc(6.5rem - 50%)", hasta: "6rem 1.25rem" },
] as const;

/* Móvil: tarjeta de vidrio muy transparente para 01 y 03 (se intercalan con
   02 y 04 sin tarjeta) y así cada punto queda separado. */
const GLASS =
  "para-ti-tarjeta max-md:rounded-2xl max-md:border max-md:border-rosa/20 max-md:bg-[linear-gradient(135deg,rgb(238_228_218/0.08),rgb(238_228_218/0.025))] max-md:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_18px_36px_-24px_rgb(0_0_0/0.8)] max-md:backdrop-blur-[3px]";

const motion = ({ desde, hasta }: { desde: string; hasta: string }) =>
  ({ "--desde": desde, "--hasta": hasta }) as CSSProperties;

export function ParaTi() {
  return (
    <section aria-labelledby="para-ti-titulo" className="fondo-noche tono-oscuro">
      <div className="mx-auto max-w-[68rem] px-gutter py-16 sm:px-gutter-lg md:py-24">
        <ScrollHint className="text-crema/80" />
        <Reveal>
          <Title id="para-ti-titulo" lines={PARA_TI.title} tone="oscuro" className="mt-8 text-center" />
          <Divider align="centro" tone="oscuro" className="mt-7" />
        </Reveal>

        <Escenario className="relative mt-16 lg:mt-20">
          {/* Gráfico: en móvil y tablet, un cuadrado; en escritorio sus piezas
              se ubican directamente en el escenario. */}
          <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[22rem] lg:static lg:aspect-auto lg:max-w-none">
            {PARA_TI.items.map((item, index) => {
              const Icon = ICONS[item.icon];
              return (
                <div
                  key={index}
                  data-pieza="baldosa"
                  style={motion(TILE_MOTION[index])}
                  className={cn(
                    "absolute grid place-items-center shadow-[0_20px_40px_-24px_rgb(0_0_0/0.8)] max-lg:size-[47.5%] lg:size-[9.5rem] xl:size-[10.5rem]",
                    TILE[index],
                    TILE_POS[index],
                  )}
                >
                  <span className="font-serif text-[clamp(3.6rem,7vw,5.25rem)] leading-none">{String(index + 1).padStart(2, "0")}</span>
                  <span
                    className={cn(
                      "absolute left-1/2 z-10 grid size-14 -translate-x-1/2 place-items-center rounded-full border border-rosa/50 bg-papel text-burgundy shadow-md",
                      BADGE[index],
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
                </div>
              );
            })}

            {/* Centro: aro oscuro con el sello del logo. No se mueve. */}
            <div className="absolute inset-[27%] z-20 rounded-full bg-noche p-[7%] lg:inset-auto lg:left-1/2 lg:top-1/2 lg:size-[10rem] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:p-[0.7rem]">
              <div className="relative grid size-full place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-malva),var(--color-burgundy)_70%)] text-crema">
                <RotatingSeal id="sello-para-ti" text={DECOR.seal} center="none" className="absolute inset-[6%] size-[88%] text-rosa" />
                <Logo className="w-[46%]" />
              </div>
            </div>
          </div>

          <ol className="mt-14 grid gap-4 md:grid-cols-2 md:gap-x-12 md:gap-y-9 lg:mt-0 lg:block">
            {PARA_TI.items.map((item, index) => (
              <li key={index} data-pieza="texto" style={motion(TEXT_MOTION[index])} className={cn("max-md:px-5 max-md:py-5 lg:w-[14rem] xl:w-[15rem]", index % 2 === 0 && GLASS)}>
                <p className="inline-flex items-baseline gap-2 font-serif text-rosa">
                  <span className="text-[2.5rem] leading-none">{String(index + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="text-2xl">–</span>
                </p>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-crema/90">{item.text}</p>
              </li>
            ))}
          </ol>
        </Escenario>

        <div className="mt-16 text-center md:mt-20">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}
