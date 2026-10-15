import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { DECOR, PARA_TI } from "../content";
import { Logo, RotatingSeal, ScrollHint } from "../_components/decor";
import { ICONS } from "../_components/icons";
import { CtaButton } from "../_components/Registration";
import { Divider, Title } from "../_components/text";

/*
  "Este evento es para ti si…": reproduce la sección oscura de la metodología
  de la referencia. Las cuatro baldosas (M-E-S-S) pasan a ser 01-04, con el
  sello del logo en el centro, los íconos en las esquinas exteriores y los
  cuatro textos alrededor (01 y 03 a la izquierda, 02 y 04 a la derecha).

  El gráfico es decorativo (aria-hidden): la lista ordenada lleva el contenido
  en el orden de lectura correcto.
*/

/* Baldosa de cada número: vino con número crema, o crema con número vino. */
const TILE = [
  "left-0 top-0 rounded-[1.9rem] bg-[linear-gradient(135deg,#3a0a0e_0%,var(--color-burgundy)_45%,var(--color-malva)_100%)] text-crema",
  "right-0 top-0 rounded-[1.9rem] bg-[linear-gradient(135deg,var(--color-arena)_0%,var(--color-crema)_55%,var(--color-papel)_100%)] text-burgundy",
  "bottom-0 left-0 rounded-[1.9rem] bg-[linear-gradient(135deg,var(--color-arena)_0%,var(--color-crema)_55%,var(--color-papel)_100%)] text-burgundy",
  "bottom-0 right-0 rounded-[1.9rem] bg-[linear-gradient(135deg,#3a0a0e_0%,var(--color-burgundy)_45%,var(--color-malva)_100%)] text-crema",
] as const;

/* Ícono de cada baldosa: arriba en las superiores, abajo en las inferiores. */
const BADGE = [
  "-top-7 left-[23%]",
  "-top-7 left-[77%]",
  "-bottom-7 left-[23%]",
  "-bottom-7 left-[77%]",
] as const;

/* Posición de cada texto alrededor del gráfico (escritorio). */
const PLACE = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
] as const;

function Quadrant({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative aspect-square w-full max-w-[22rem]", className)}>
      {PARA_TI.items.map((item, index) => {
        const Icon = ICONS[item.icon];
        return (
          <div key={index}>
            <div className={cn("absolute grid size-[47.5%] place-items-center shadow-[0_20px_40px_-24px_rgb(0_0_0/0.8)]", TILE[index])}>
              <span className="font-serif text-[clamp(3.6rem,7vw,5.25rem)] leading-none">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <span
              className={cn(
                "absolute z-10 grid size-14 -translate-x-1/2 place-items-center rounded-full border border-rosa/50 bg-papel text-burgundy shadow-md",
                BADGE[index],
              )}
            >
              <Icon className="size-6" />
            </span>
          </div>
        );
      })}

      {/* Centro: aro oscuro con el sello del logo. */}
      <div className="absolute inset-[27%] rounded-full bg-noche p-[7%]">
        <div className="relative grid size-full place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-malva),var(--color-burgundy)_70%)] text-crema">
          <RotatingSeal id="sello-para-ti" text={DECOR.seal} center="none" className="absolute inset-[6%] size-[88%] text-rosa" />
          <Logo className="w-[46%]" />
        </div>
      </div>
    </div>
  );
}

export function ParaTi() {
  return (
    <section aria-labelledby="para-ti-titulo" className="fondo-noche tono-oscuro">
      <div className="mx-auto max-w-[68rem] px-gutter py-16 sm:px-gutter-lg md:py-24">
        <ScrollHint className="text-crema/80" />
        <Reveal>
          <Title id="para-ti-titulo" lines={PARA_TI.title} tone="oscuro" className="mt-8 text-center" />
          <Divider align="centro" tone="oscuro" className="mt-7" />
        </Reveal>

        <div className="relative mt-16 md:mt-20">
          <Quadrant className="mx-auto mb-14 lg:absolute lg:left-1/2 lg:top-1/2 lg:mb-0 lg:-translate-x-1/2 lg:-translate-y-1/2" />

          <ol className="grid gap-9 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[1fr_24rem_1fr] lg:gap-x-6 lg:gap-y-20">
            {PARA_TI.items.map((item, index) => (
              <li key={index} className={PLACE[index]}>
                <Reveal delayMs={index * 90}>
                  <p className="flex items-baseline gap-2 font-serif text-rosa">
                    <span className="text-[2.5rem] leading-none">{String(index + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true" className="text-2xl">–</span>
                  </p>
                  <p className="mt-2 text-[1.0625rem] leading-relaxed text-crema/90">{item.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-16 text-center md:mt-20">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}
