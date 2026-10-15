/*
  Íconos lineales propios de la landing (SVG en línea, sin librerías), dibujados
  con el trazo de los de la referencia: 1,5 px, extremos redondeados y
  currentColor. Decorativos: siempre aria-hidden.
*/

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M8 13h2M14 13h2M8 16.5h2" />
    </Svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Svg>
  );
}

export function IconLive(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" />
      <path d="M5.4 5.4a9.3 9.3 0 0 0 0 13.2M18.6 5.4a9.3 9.3 0 0 1 0 13.2" />
    </Svg>
  );
}

export function IconTicket(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4Z" />
      <path d="M14.5 6v2.2M14.5 10.9v2.2M14.5 15.8V18" />
    </Svg>
  );
}

export function IconArrowCircle(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M13 8.8l3.2 3.2-3.2 3.2" />
    </Svg>
  );
}

export function IconWhatsApp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.5 7.3l-4.5 1.5L5 16a8.4 8.4 0 1 1 15.5-4.4Z" />
      <path d="m8.2 7.4 1.3-.2.9 2.3-1 1.1a7.3 7.3 0 0 0 3.7 3.7l1.1-1 2.3.9-.2 1.3c-.1.7-.7 1.2-1.4 1.2-4.4-.2-7.9-3.7-8.1-8.1 0-.7.5-1.3 1.2-1.4Z" />
    </Svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" pathLength="1" />
      <path d="m8.3 12.3 2.5 2.5 5-5.3" pathLength="1" />
    </Svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconStar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="currentColor"
        d="m12 2.8 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"
      />
    </svg>
  );
}

/* ── Recompensa ── */

export function IconDescubrir(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v1.6M5.2 3.6l.9 1.3M18.8 3.6l-.9 1.3" />
    </Svg>
  );
}

/* Brote con raíces: "entender la raíz". */
export function IconRaiz(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 13.5V7" />
      <path d="M12 9.2C12 5.8 14.6 3.4 18.4 3.4c0 3.6-2.6 5.8-6.4 5.8Z" />
      <path d="M12 10.6c0-2.9-2.3-5-5.6-5 0 3.1 2.3 5 5.6 5Z" />
      <path d="M4 13.5h16" strokeDasharray="0.1 2.6" />
      <path d="M12 13.5v7M12 16c-1.4.3-2.6 1.2-3.3 2.6M12 16c1.4.3 2.6 1.2 3.3 2.6M12 18.4c-.8.3-1.4.9-1.7 1.7M12 18.4c.8.3 1.4.9 1.7 1.7" />
    </Svg>
  );
}

/* Escalones con bandera en la cima: "el paso a paso". */
export function IconCamino(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 20.5h4.5V16H12v-4.5h4.5V7H21" />
      <path d="M18.5 7V2.8l3 1.4-3 1.4" />
    </Svg>
  );
}

/* ── Para ti si… ── */

export function IconCiclo(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19.5 9.5A8 8 0 0 0 5 7.2" />
      <path d="M4.5 4v3.6h3.6" />
      <path d="M4.5 14.5A8 8 0 0 0 19 16.8" />
      <path d="M19.5 20v-3.6h-3.6" />
    </Svg>
  );
}

export function IconAnillos(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="13.5" r="5.5" />
      <circle cx="15" cy="13.5" r="5.5" />
      <path d="m10.6 4.6 1.4-1.6 1.4 1.6-1.4 1.6Z" />
    </Svg>
  );
}

export function IconCorazon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 20s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
      <path d="M12 7.4 10.6 11l2.6 1.6L11.6 16" />
    </Svg>
  );
}

export function IconBrujula(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2.2 5-5 2.2 2.2-5Z" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21" />
    </Svg>
  );
}

export const ICONS = {
  descubrir: IconDescubrir,
  raiz: IconRaiz,
  camino: IconCamino,
  ciclo: IconCiclo,
  anillos: IconAnillos,
  corazon: IconCorazon,
  brujula: IconBrujula,
} as const;

export type IconName = keyof typeof ICONS;
