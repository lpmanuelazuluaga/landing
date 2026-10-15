"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PlaceholderTag } from "./decor";

/*
  Tarjetas de testimonio con el estilo de la referencia (comentarios oscuros,
  escalonados). En escritorio se ven las tres; en móvil es un carrusel con
  scroll-snap nativo y puntos para saltar entre tarjetas. Sin librería.
*/

type Testimonial = { name: string; text: string };

/* Escalonado vertical de la referencia (solo en escritorio). */
const OFFSET = ["lg:mt-10", "lg:mt-14", "lg:mt-0"] as const;

export function TestimonialsCarousel({ items, placeholder }: { items: readonly Testimonial[]; placeholder: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: list, threshold: 0.6 },
    );
    list.querySelectorAll("li").forEach((li) => observer.observe(li));
    return () => observer.disconnect();
  }, []);

  function goTo(index: number) {
    const item = listRef.current?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  return (
    <div>
      <ul
        ref={listRef}
        className="-mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2 [scrollbar-width:none] sm:-mx-gutter-lg sm:px-gutter-lg lg:mx-0 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5 lg:overflow-visible lg:px-0"
      >
        {items.map((item, index) => (
          <li
            key={index}
            data-index={index}
            className={cn("w-[85%] shrink-0 snap-center sm:w-[58%] lg:w-auto", OFFSET[index % OFFSET.length])}
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
        ))}
      </ul>

      {/* Puntos: área táctil de 24 px con el punto de 12 px de la referencia. */}
      <div className="mt-6 flex justify-center">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ver testimonio ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            className="grid size-6 place-items-center lg:pointer-events-none"
          >
            <span
              className={cn(
                "size-3 rounded-full bg-burgundy transition-opacity",
                index === active ? "opacity-100" : "opacity-30 lg:opacity-100",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
