import { cn } from "@/lib/cn";
import type { Rich } from "../content";

/*
  Ornamentos grandes recreados para la marca (SVG propios):
  - MirrorFrame: marco tallado en bronce para la foto redonda (el espejo
    barroco de la referencia, no fotorrealista).
  - Stamp: estampilla con borde perforado (decoración de la sección "Sobre").
  - Marquee: banda con texto en movimiento.
*/

/* ── Marco del espejo ─────────────────────────────────────────────────── */

/* Hoja de acanto con la base en (0,0) apuntando hacia afuera (-y), con rizos
   laterales y nervio central. Se coloca alrededor del aro girada. */
const HOJA =
  "M0 0C-3.4-2.2-4.4-6.6-2.5-9.6-1.7-11-.5-11.6 0-12.8.5-11.6 1.7-11 2.5-9.6 4.4-6.6 3.4-2.2 0 0Z";
const HOJA_RIZOS = "M-2.5-9.6C-4.8-10.6-6.5-9.1-5.6-7.4M2.5-9.6C4.8-10.6 6.5-9.1 5.6-7.4";
const HOJA_NERVIO = "M0-1.2V-11.2M0-5-1.6-7M0-5 1.6-7";
/* Concha de la cresta, con la base en (0,0) y volutas a los lados. */
const CONCHA = "M0 1.5C-9.5 1.5-12.5-7.6-7.4-13.8-4.2-17.4 4.2-17.4 7.4-13.8 12.5-7.6 9.5 1.5 0 1.5Z";
const CONCHA_NERVIOS = "M0 0V-15.6M0 0-4.6-14.6M0 0 4.6-14.6M0 0-8.2-11.6M0 0 8.2-11.6M0 0-10-6.8M0 0 10-6.8";
const CONCHA_VOLUTAS = "M-9.5 1.5C-14 2.4-16.6-.6-15-3.6-13.8-5.8-10.8-5-11.2-2.8M9.5 1.5C14 2.4 16.6-.6 15-3.6 13.8-5.8 10.8-5 11.2-2.8";

export function MirrorFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const pearls = Array.from({ length: 96 }, (_, i) => i * 3.75);
  const eggs = Array.from({ length: 48 }, (_, i) => i * 7.5);
  /* Hojas grandes cada 22,5° (sin las de las crestas) y pequeñas intercaladas. */
  const big = Array.from({ length: 16 }, (_, i) => i * 22.5).filter((a) => a !== 0 && a !== 180);
  const small = Array.from({ length: 16 }, (_, i) => i * 22.5 + 11.25);
  return (
    <div className={cn("relative aspect-square", className)}>
      {/* Foto redonda dentro del marco. */}
      <div className="absolute inset-[21%] overflow-hidden rounded-full">{children}</div>

      <svg
        viewBox="-14 -14 128 128"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full drop-shadow-[0_28px_30px_rgb(0_0_0/0.55)]"
      >
        <defs>
          <linearGradient id="bronce" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ecdcc8" />
            <stop offset="0.25" stopColor="#a17a63" />
            <stop offset="0.5" stopColor="#4e362b" />
            <stop offset="0.75" stopColor="#a98068" />
            <stop offset="1" stopColor="#36241d" />
          </linearGradient>
          <linearGradient id="bronce-luz" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5e9da" />
            <stop offset="0.5" stopColor="#87604d" />
            <stop offset="1" stopColor="#2c1d17" />
          </linearGradient>
        </defs>

        {/* Hojas de acanto alrededor */}
        <g fill="url(#bronce)" stroke="#2a1b15" strokeWidth="0.3" strokeLinejoin="round">
          {small.map((angle) => (
            <g key={`s${angle}`} transform={`rotate(${angle} 50 50) translate(50 5.5) scale(0.62)`}>
              <path d={HOJA} />
              <path d={HOJA_NERVIO} fill="none" />
            </g>
          ))}
          {big.map((angle) => (
            <g key={`b${angle}`} transform={`rotate(${angle} 50 50) translate(50 5)`}>
              <path d={HOJA} />
              <path d={HOJA_RIZOS} fill="none" stroke="url(#bronce)" strokeWidth="1" strokeLinecap="round" />
              <path d={HOJA_NERVIO} fill="none" />
            </g>
          ))}
          {/* Crestas: concha grande arriba, pequeña abajo */}
          <g transform="translate(50 5.2)">
            <path d={CONCHA_VOLUTAS} fill="none" stroke="url(#bronce)" strokeWidth="1.3" strokeLinecap="round" />
            <path d={CONCHA} />
            <path d={CONCHA_NERVIOS} fill="none" strokeWidth="0.4" />
          </g>
          <g transform="rotate(180 50 50) translate(50 5.2) scale(0.72)">
            <path d={CONCHA_VOLUTAS} fill="none" stroke="url(#bronce)" strokeWidth="1.3" strokeLinecap="round" />
            <path d={CONCHA} />
            <path d={CONCHA_NERVIOS} fill="none" strokeWidth="0.4" />
          </g>
        </g>

        {/* Moldura principal */}
        <circle cx="50" cy="50" r="41.6" fill="none" stroke="url(#bronce)" strokeWidth="7.4" />
        <circle cx="50" cy="50" r="45.3" fill="none" stroke="#2a1b15" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="37.9" fill="none" stroke="#2a1b15" strokeWidth="0.4" />
        {/* Collar de perlas finas */}
        <g fill="url(#bronce-luz)">
          {pearls.map((angle) => (
            <circle key={angle} cx="50" cy="6.2" r="0.62" transform={`rotate(${angle} 50 50)`} />
          ))}
        </g>
        {/* Filete interior sólido + ovas (huevo y dardo) */}
        <circle cx="50" cy="50" r="35.65" fill="none" stroke="#3a271f" strokeWidth="4.6" />
        <g fill="url(#bronce-luz)" stroke="#2a1b15" strokeWidth="0.2">
          {eggs.map((angle) => (
            <ellipse key={angle} cx="50" cy="15.3" rx="1.25" ry="1.7" transform={`rotate(${angle} 50 50)`} />
          ))}
        </g>
        <circle cx="50" cy="50" r="33.4" fill="none" stroke="url(#bronce-luz)" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="32.6" fill="none" stroke="#1e1412" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ── Estampilla ───────────────────────────────────────────────────────── */

export function Stamp({ className }: { className?: string }) {
  const holesX = Array.from({ length: 12 }, (_, i) => 4 + i * 6.55);
  const holesY = Array.from({ length: 15 }, (_, i) => 4 + i * 6.6);
  return (
    <svg viewBox="0 0 80 100" aria-hidden="true" focusable="false" className={cn("drop-shadow-[0_10px_14px_rgb(30_20_18/0.25)]", className)}>
      <defs>
        <mask id="perforado">
          <rect width="80" height="100" fill="#fff" />
          {holesX.map((x) => (
            <g key={`x${x}`} fill="#000">
              <circle cx={x} cy="0" r="2.1" />
              <circle cx={x} cy="100" r="2.1" />
            </g>
          ))}
          {holesY.map((y) => (
            <g key={`y${y}`} fill="#000">
              <circle cx="0" cy={y} r="2.1" />
              <circle cx="80" cy={y} r="2.1" />
            </g>
          ))}
        </mask>
      </defs>
      <g mask="url(#perforado)">
        <rect width="80" height="100" fill="#e9e3dc" />
        <rect x="6" y="6" width="68" height="88" fill="#d9d1c8" stroke="#8d8178" strokeWidth="0.6" />
        {/* Motivo: corazón con hojas, en línea */}
        <g fill="none" stroke="#5c514a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 66s-14-8.6-14-18.8a7.6 7.6 0 0 1 14-4.2 7.6 7.6 0 0 1 14 4.2C54 57.4 40 66 40 66Z" />
          <path d="M40 66v14M40 74c-4-1-7 1-9 4M40 72c4-1 7 1 9 4" />
          <path d="M28 22c3-4 8-5 12-2M52 22c-3-4-8-5-12-2M40 20v-6" />
        </g>
        {/* Matasellos */}
        <g fill="none" stroke="#6f655e" strokeWidth="0.7" opacity="0.7">
          <circle cx="58" cy="30" r="12" />
          <path d="M30 86c6-3 12 3 18 0s12 3 18 0M30 81c6-3 12 3 18 0s12 3 18 0" />
        </g>
      </g>
    </svg>
  );
}

/* ── Marquesina ───────────────────────────────────────────────────────── */

const STAR = "M12 0C12.6 7.2 16.8 11.4 24 12 16.8 12.6 12.6 16.8 12 24 11.4 16.8 7.2 12.6 0 12 7.2 11.4 11.4 7.2 12 0Z";

/**
 * Banda con texto en movimiento. Repite los mismos datos del evento que ya
 * están en la página: es decorativa (aria-hidden). La pista va duplicada para
 * que el bucle no tenga salto.
 */
export function Marquee({ items }: { items: readonly Rich[] }) {
  const group = (copy: number) => (
    <div className="flex shrink-0 items-center" key={copy}>
      {items.map((item, index) => (
        <span key={`${copy}-${index}`} className="flex items-center">
          <span className="whitespace-nowrap px-5 uppercase">
            {item.map((segment, i) =>
              typeof segment === "string" ? segment : <strong key={i} className="font-bold">{segment.strong}</strong>,
            )}
          </span>
          <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" focusable="false">
            <path d={STAR} fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="fondo-marquesina relative overflow-hidden py-3.5 text-[1.0625rem] tracking-[0.02em] text-crema sm:py-4 sm:text-[1.25rem]">
      <div className="marquesina-pista flex w-max">
        {group(0)}
        {group(1)}
        {group(2)}
        {group(3)}
      </div>
    </div>
  );
}
