import { cn } from "@/lib/cn";
import { EVENT } from "../content";
import { IconCalendar, IconCheckCircle, IconClock, IconLive, IconTicket } from "./icons";

/*
  Detalles del evento: fecha y hora, formato y precio.

  - "hero": fecha y hora separadas, con sus propios íconos.
  - "fila": detalles compactos en el modal de registro.
  - "lista": en la tarjeta de "El acceso", como la lista con checks.
*/

const ITEMS = [
  { icon: IconCalendar, text: EVENT.date },
  { icon: IconLive, text: EVENT.format },
  { icon: IconTicket, text: EVENT.price },
] as const;

const HERO_ITEMS = [
  { icon: IconCalendar, text: EVENT.heroDate },
  { icon: IconClock, text: EVENT.heroTime },
  ...ITEMS.slice(1),
] as const;

const TONE = {
  claro: { text: "text-tierra", icon: "text-malva" },
  oscuro: { text: "text-crema/90", icon: "text-rosa" },
} as const;

export function EventDetails({
  variant = "fila",
  tone = "claro",
  className,
}: {
  variant?: "hero" | "fila" | "lista";
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const colors = TONE[tone];

  if (variant === "lista") {
    return (
      <ul className={cn("space-y-3 text-[1.0625rem]", colors.text, className)}>
        {ITEMS.map(({ text }) => (
          <li key={text} className="flex items-center gap-3">
            <IconCheckCircle className={cn("size-6 shrink-0", colors.icon)} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[0.9375rem]", colors.text, className)}>
      {(variant === "hero" ? HERO_ITEMS : ITEMS).map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon className={cn("size-5 shrink-0", colors.icon)} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
