"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** id del título visible del diálogo (aria-labelledby). */
  labelledBy: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Sin el aspecto por defecto (caja, fondo y padding): la landing dibuja su
   * propia tarjeta con className y children. El comportamiento no cambia.
   */
  bare?: boolean;
};

/**
 * Modal sobre <dialog> nativo con showModal(): el navegador aporta el foco
 * atrapado, Escape, el fondo inerte y la devolución del foco al cerrar.
 *
 * Al ir en la top layer no lo recorta ningún ancestro con overflow, lo que
 * también evita que WebKit anule su backdrop-filter. El bloqueo del scroll de
 * fondo está en globals.css (html:has(dialog:modal)).
 */
export function Dialog({ open, onClose, labelledBy, children, className, bare = false }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      /* Escape y dialog.close() disparan "close": el estado del padre se
         mantiene sincronizado con el del navegador. */
      onClose={onClose}
      /* Un clic cuyo destino es el propio <dialog> cae en el backdrop: el
         contenido ocupa todo el interior, porque el dialog no tiene padding. */
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        bare
          ? "m-auto bg-transparent p-0"
          : "m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,32rem)] overflow-auto rounded-lg bg-background p-0 text-foreground backdrop:bg-black/60",
        className,
      )}
    >
      {bare ? children : <div className="p-6">{children}</div>}
    </dialog>
  );
}
