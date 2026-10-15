import { cn } from "@/lib/cn";
import logo from "../_assets/logo.png";

/*
  Piezas decorativas de la referencia, recreadas para la marca: ✦✦✦, antetítulo
  espaciado, mouse de scroll, sello circular giratorio, logo teñido y etiqueta
  de contenido provisional. Todo lo puramente decorativo es aria-hidden.
*/

const STAR = "M12 0C12.6 7.2 16.8 11.4 24 12 16.8 12.6 12.6 16.8 12 24 11.4 16.8 7.2 12.6 0 12 7.2 11.4 11.4 7.2 12 0Z";

/** ✦✦✦ */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 84 24" aria-hidden="true" focusable="false" className={cn("h-3 w-auto", className)}>
      {[0, 30, 60].map((x) => (
        <path key={x} d={STAR} transform={`translate(${x} 0)`} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Antetítulo de la referencia: mayúsculas muy espaciadas seguidas de ✦✦✦. */
export function Kicker({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-[0.8125rem] font-medium uppercase tracking-[0.55em]", className)}>
      {children ? <span>{children}</span> : null}
      <Ornament className="h-2.5" />
    </p>
  );
}

/** Mouse con rueda animada que abre las secciones de la referencia. */
export function ScrollHint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 34" aria-hidden="true" focusable="false" className={cn("mx-auto h-8 w-auto", className)}>
      <rect x="1" y="1" width="18" height="32" rx="9" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <g className="scroll-rueda">
        <path d="M10 9v9M6.8 15 10 18.2 13.2 15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/**
 * Sello circular con texto girando alrededor y una línea horizontal en el
 * centro, como el de la referencia. El texto se ajusta exactamente a la
 * circunferencia con textLength.
 */
export function RotatingSeal({
  id,
  text,
  className,
  center = "line",
}: {
  /** id único del trazo circular en la página (hay varios sellos). */
  id: string;
  text: string;
  className?: string;
  /** Contenido del centro: una línea (referencia) o nada. */
  center?: "line" | "none";
}) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("overflow-visible", className)}>
      <defs>
        <path id={id} d={`M50 50m-${r} 0a${r} ${r} 0 1 1 ${2 * r} 0a${r} ${r} 0 1 1 -${2 * r} 0`} />
      </defs>
      <g className="girar-lento" style={{ transformOrigin: "50px 50px" }}>
        <text fontSize="7.4" letterSpacing="0.6" fill="currentColor" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href={`#${id}`} textLength={circumference} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
      {center === "line" ? <path d="M22 50h56" stroke="currentColor" strokeWidth="0.6" /> : null}
    </svg>
  );
}

/**
 * Logo del cliente teñido con el color del texto (currentColor) usando el PNG
 * como máscara: el mismo archivo sirve sobre fondos claros y oscuros.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Manuela Zuluaga"
      className={cn("logo-mascara block", className)}
      style={{
        aspectRatio: `${logo.width} / ${logo.height}`,
        maskImage: `url(${logo.src})`,
        WebkitMaskImage: `url(${logo.src})`,
      }}
    />
  );
}

/**
 * Sello con el logo apoyado sobre el borde superior de una tarjeta, con la
 * barra horizontal detrás (tarjeta de oferta de la referencia). La tarjeta
 * debe ser `relative`.
 */
export function LogoSeal({ id, text }: { id: string; text: string }) {
  return (
    <div aria-hidden="true" className="absolute -top-11 left-1/2 flex -translate-x-1/2 items-center">
      <span className="h-1 w-14 rounded-full bg-burgundy" />
      <span className="relative grid size-[5.5rem] place-items-center rounded-full bg-burgundy text-crema shadow-lg ring-4 ring-papel">
        <RotatingSeal id={id} text={text} center="none" className="absolute inset-1.5 size-[calc(100%-0.75rem)] text-rosa" />
        <Logo className="w-12" />
      </span>
      <span className="h-1 w-14 rounded-full bg-burgundy" />
    </div>
  );
}

/**
 * Bandera de Colombia en SVG (los emojis de banderas no se ven en Windows):
 * amarillo, azul y rojo en proporción 2:1:1. Decorativa: el país, si hace
 * falta, se nombra como texto oculto junto a ella.
 */
export function FlagCO({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" aria-hidden="true" focusable="false" className={cn("inline-block h-[0.82em] w-auto shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(0_0_0/0.15)]", className)}>
      <rect width="3" height="1" fill="#fcd116" />
      <rect y="1" width="3" height="0.5" fill="#003893" />
      <rect y="1.5" width="3" height="0.5" fill="#ce1126" />
    </svg>
  );
}

/** Etiqueta visible de contenido provisional (nunca debe llegar a publicarse). */
export function PlaceholderTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-current px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]",
        className,
      )}
    >
      {children}
    </span>
  );
}
