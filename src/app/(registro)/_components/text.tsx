import { cn } from "@/lib/cn";
import type { Rich } from "../content";

/*
  Texto enriquecido y títulos de la referencia.

  Los títulos son serif en mayúsculas, con una o dos palabras destacadas en
  negrita y color (burdeos sobre claro, rosa sobre oscuro). El texto sale de
  content.ts; aquí solo se le da forma.
*/

type Tone = "claro" | "oscuro";

const STRONG_TEXT: Record<Tone, string> = {
  claro: "font-semibold text-burgundy",
  oscuro: "font-semibold text-rosa",
};

/** Párrafo con fragmentos destacados ({ strong }). */
export function RichText({ value, tone = "claro" }: { value: Rich; tone?: Tone }) {
  return (
    <>
      {value.map((segment, index) =>
        typeof segment === "string" ? (
          segment
        ) : (
          <strong key={index} className={STRONG_TEXT[tone]}>
            {segment.strong}
          </strong>
        ),
      )}
    </>
  );
}

const TITLE_SIZE = {
  /** Títulos de sección (~52 px en escritorio, como la referencia). */
  section: "text-[clamp(2.125rem,1.45rem+2.6vw,3.35rem)] leading-[1.18]",
  /** Hero: título corto, más grande para conservar el peso del bloque. */
  hero: "text-[clamp(2.9rem,1.6rem+5vw,5.25rem)] leading-[1.02]",
  /** Tarjetas y modal. */
  card: "text-[clamp(2rem,1.5rem+1.8vw,2.85rem)] leading-[1.1]",
} as const;

const TITLE_TONE: Record<Tone, string> = {
  claro: "text-tierra [&_strong]:text-burgundy",
  oscuro: "text-crema [&_strong]:text-rosa",
};

/** Título serif en mayúsculas; cada elemento de `lines` es una línea. */
export function Title({
  lines,
  as: Tag = "h2",
  tone = "claro",
  size = "section",
  italicFirstLine = false,
  className,
  id,
}: {
  lines: readonly Rich[];
  as?: "h1" | "h2" | "h3";
  tone?: Tone;
  size?: keyof typeof TITLE_SIZE;
  italicFirstLine?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn("font-serif font-normal uppercase text-balance", TITLE_SIZE[size], TITLE_TONE[tone], className)}>
      {lines.map((line, index) => (
        <span key={index} className={cn("block", italicFirstLine && index === 0 && "italic")}>
          {line.map((segment, i) =>
            typeof segment === "string" ? (
              segment
            ) : (
              <strong key={i} className="font-bold">
                {segment.strong}
              </strong>
            ),
          )}
        </span>
      ))}
    </Tag>
  );
}

/** Línea divisoria con degradado bajo los títulos. */
export function Divider({ align = "inicio", tone = "claro", className }: { align?: "inicio" | "centro"; tone?: Tone; className?: string }) {
  const variant = {
    "inicio-claro": "divisor-inicio",
    "centro-claro": "divisor-centro",
    "inicio-oscuro": "divisor-inicio-oscuro",
    "centro-oscuro": "divisor-centro-oscuro",
  }[`${align}-${tone}` as const];
  return <div aria-hidden="true" className={cn("h-0.5 w-full max-w-[24.5rem]", variant, align === "centro" && "mx-auto", className)} />;
}
