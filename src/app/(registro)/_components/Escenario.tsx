"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/*
  Escenario de "Para ti si…": marca data-abierto="true" la primera vez que la
  sección entra en pantalla, y el CSS (landing.css, .escenario) lleva cada
  pieza de su posición inicial (--desde) a la final (--hasta), despacio.

  Solo tiene efecto en escritorio (lg); con prefers-reduced-motion o sin
  JavaScript se muestra directamente el estado final.
*/
export function Escenario({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const open = () => {
      element.dataset.abierto = "true";
    };
    if (!("IntersectionObserver" in window)) {
      open();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          open();
          observer.disconnect();
        }
      },
      { threshold: 0.55 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("escenario", className)}>
      {children}
    </div>
  );
}
