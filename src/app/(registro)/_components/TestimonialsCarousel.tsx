"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PlaceholderTag } from "./decor";

/*
  Carrusel infinito de testimonios con el estilo de la referencia (comentarios
  oscuros, escalonados en escritorio). Sin librería: scroll-snap nativo.

  - Las tarjetas se renderizan tres veces seguidas. Se arranca en la copia del
    medio y, cada vez que el desplazamiento termina en una copia lateral, se
    salta (sin animación) a la tarjeta equivalente de la del medio: nunca se
    llega a un final, ni deslizando ni con los puntos.
  - Solo se desplaza la lista (scrollTo): nunca scrollIntoView, que también
    movería ancestros como la sección.
  - Las copias laterales van con aria-hidden: los lectores de pantalla leen
    cada testimonio una sola vez.
  - Móvil: una tarjeta por vista; tablet: casi dos; escritorio: tres.
*/

type Testimonial = { name: string; text: string };

const COPIES = 3;
/* Escalonado vertical de la referencia (solo en escritorio). */
const OFFSET = ["lg:mt-10", "lg:mt-14", "lg:mt-0"] as const;

export function TestimonialsCarousel({ items, placeholder }: { items: readonly Testimonial[]; placeholder: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const total = items.length;
  const loop = Array.from({ length: COPIES }, () => items).flat();

  /** Centra en la lista la tarjeta del índice dado (sobre la lista triplicada). */
  const centerOn = useCallback((index: number, smooth: boolean) => {
    const list = listRef.current;
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: smooth && !reduce ? "smooth" : "instant",
    });
  }, []);

  /** Índice (sobre la lista triplicada) de la tarjeta más cercana al centro. */
  const centered = useCallback(() => {
    const list = listRef.current;
    if (!list) return total;
    const middle = list.scrollLeft + list.clientWidth / 2;
    let best = 0;
    let distance = Infinity;
    Array.from(list.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - middle);
      if (d < distance) {
        distance = d;
        best = index;
      }
    });
    return best;
  }, [total]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || total === 0) return;

    /* Arranque en la copia del medio (en escritorio, con la segunda tarjeta en
       el centro para que se vean las tres primeras). */
    const desktop = window.matchMedia("(min-width: 64rem)").matches;
    centerOn(total + (desktop && total > 1 ? 1 : 0), false);

    let timer: number | undefined;
    const settle = () => {
      let index = centered();
      if (index < total) index += total;
      else if (index >= total * 2) index -= total;
      if (index !== centered()) centerOn(index, false);
      setActive(index % total);
    };
    /* scrollend donde exista; si no, fin del desplazamiento por inactividad. */
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 140);
    };
    const supportsScrollEnd = "onscrollend" in window;
    if (supportsScrollEnd) list.addEventListener("scrollend", settle);
    else list.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => centerOn(centered(), false);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      list.removeEventListener("scrollend", settle);
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [total, centerOn, centered]);

  /** Punto i: la tarjeta i de la copia del medio, por el camino más corto. */
  function goTo(target: number) {
    const current = centered();
    const base = current - (current % total);
    let index = base + target;
    if (index - current > total / 2) index -= total;
    if (current - index > total / 2) index += total;
    centerOn(index, true);
  }

  return (
    <div>
      <ul
        ref={listRef}
        data-lenis-prevent-horizontal=""
        className="relative -mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-gutter pb-12 pt-1 [scrollbar-width:none] sm:-mx-gutter-lg sm:px-gutter-lg lg:-mx-5 lg:items-start lg:gap-5 lg:px-5 lg:[mask-image:linear-gradient(90deg,transparent,black_1.25rem,black_calc(100%-1.25rem),transparent)]"
      >
        {loop.map((item, index) => {
          const copy = index < total || index >= total * 2;
          return (
            <li
              key={index}
              aria-hidden={copy || undefined}
              className={cn(
                "w-[85%] shrink-0 snap-center sm:w-[58%] lg:w-[calc((100%-2.5rem)/3)]",
                OFFSET[index % OFFSET.length],
              )}
            >
              <figure className="rounded-lg bg-[#141010] p-5 text-left text-crema shadow-[0_24px_40px_-24px_rgb(30_20_18/0.7)]">
                <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-rosa/30 text-sm font-semibold text-rosa">
                    {item.name.charAt(0)}
                  </span>
                  <span className="text-[0.9375rem] text-crema/80">{item.name}</span>
                  {placeholder ? <PlaceholderTag className="ml-auto text-rosa">Ejemplo</PlaceholderTag> : null}
                </figcaption>
                <blockquote className="mt-3 text-[1rem] leading-relaxed text-crema/95">{item.text}</blockquote>
              </figure>
            </li>
          );
        })}
      </ul>

      {/* Puntos: área táctil de 24 px con el punto de 12 px de la referencia. */}
      <div className="mt-1 flex justify-center">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ver testimonio ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            className="grid size-6 place-items-center"
          >
            <span className={cn("size-3 rounded-full bg-burgundy transition-opacity", index === active ? "opacity-100" : "opacity-30")} />
          </button>
        ))}
      </div>
    </div>
  );
}
