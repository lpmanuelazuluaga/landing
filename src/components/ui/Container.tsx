import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Ancho de lectura (textos, formularios) en lugar del ancho de página. */
  narrow?: boolean;
};

/**
 * Columna centrada con el gutter del tema. Los anchos salen de los tokens
 * --container-page / --container-narrow y --spacing-gutter de theme.css.
 */
export function Container({ children, className, narrow }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-gutter sm:px-gutter-lg",
        narrow ? "max-w-narrow" : "max-w-page",
        className,
      )}
    >
      {children}
    </div>
  );
}
