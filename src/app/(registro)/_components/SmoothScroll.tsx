"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Suavizado leve para la landing; se retira mientras el registro está abierto.
 * El gesto táctil conserva su inercia nativa. Se usa el scroll de la ventana
 * para mantener la barra sticky y la posición real del documento.
 */
export function SmoothScroll({ paused }: { paused: boolean }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scroll: Lenis | undefined;

    function configure() {
      scroll?.destroy();
      scroll = undefined;
      if (paused || reducedMotion.matches) return;

      scroll = new Lenis({
        autoRaf: true,
        duration: 0.65,
        easing: (progress) => 1 - (1 - progress) ** 3,
        wheelMultiplier: 0.9,
        syncTouch: false,
        stopInertiaOnNavigate: true,
      });
    }

    configure();
    reducedMotion.addEventListener("change", configure);
    return () => {
      reducedMotion.removeEventListener("change", configure);
      scroll?.destroy();
    };
  }, [paused]);

  return null;
}
