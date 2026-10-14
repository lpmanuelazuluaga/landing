"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso en milisegundos para encadenar apariciones. */
  delayMs?: number;
};

/**
 * Aparición al entrar en pantalla (fundido + desplazamiento), una sola vez.
 * Sin librería de animación: IntersectionObserver y transiciones CSS.
 *
 * - Con prefers-reduced-motion, el contenido aparece sin animar.
 * - Sin JavaScript (variante noscript:), el contenido se ve igual.
 * - No usarlo en el hero ni en el elemento del LCP: lo retrasaría.
 */
export function Reveal({ children, className, delayMs }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    /* Se marca el DOM y no el estado de React: no hace falta re-renderizar
       para cambiar una clase de CSS. */
    const show = () => {
      element.dataset.visible = "true";
    };
    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={cn(
        "translate-y-6 opacity-0 transition duration-700 ease-out",
        "data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        "noscript:translate-y-0 noscript:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
