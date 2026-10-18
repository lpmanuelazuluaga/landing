/*
  Contenido y configuración de la landing "registro" (masterclass gratuita
  "El amor no se sana").

  Todo lo que se edita sin tocar diseño vive aquí: textos, fechas, enlaces y la
  etiqueta del lead. Los componentes leen de este archivo; no escriben copy.

  - El copy es el aprobado por la agencia (2026-10-14), con las correcciones
    de ortografía autorizadas. No cambiar el texto sin autorización.
  - Los textos decorativos (marquesina, sello, textos verticales, marcas de
    agua, antetítulos) salen solo de frases del copy.
  - En los textos, { strong: "…" } marca las palabras destacadas en color.
*/

export type Segment = string | { strong: string };
export type Rich = readonly Segment[];
/** Elemento de la marquesina: admite además la bandera de Colombia. */
export type MarqueeItem = readonly (Segment | { flag: "co" })[];

export const LANDING = {
  slug: "registro",
  /** Ruta pública: la raíz del dominio (route group "(registro)", sin segmento en la URL).
      Para indexarla, añadirla a PUBLISHED_LANDINGS (src/lib/landings.ts). */
  path: "/",
  thanksPath: "/gracias",
  /** Etiqueta del lead en el CRM. Una variante A/B lleva la suya (p. ej. "registro-b"). */
  leadSource: "registro",
} as const;

/**
 * Contenido PROVISIONAL todavía visible en la página. Cada uno se muestra con
 * una etiqueta y, mientras alguno siga en true, el build falla si la landing se
 * añade a PUBLISHED_LANDINGS (ver page.tsx). Pasar a false al reemplazarlo.
 */
export const PLACEHOLDERS = {
  /** Seis testimonios en video y sus portadas entregados por el cliente. */
  testimonials: false,
  /** Fondo definitivo de "El acceso", con puerta para escritorio y móvil. */
  accessPhoto: false,
  /** Grupo de WhatsApp confirmado y enlazado en la página de gracias. */
  thanksNextStep: false,
} as const;

export const META = {
  title: "El amor no se sana · Masterclass gratuita",
  description:
    "Masterclass gratuita y en vivo con Manuela Zuluaga: entiende por qué sigues repitiendo las mismas relaciones. 25 de octubre, 10 am (Colombia).",
};

export const CTA = {
  label: "Reservar mi lugar ahora",
} as const;

/** Detalles del evento (hero, modal, "El acceso" y gracias). */
export const EVENT = {
  date: "25 de oct · 10 am Colombia",
  /** Fecha y hora separadas para los detalles del hero. */
  heroDate: "25 de octubre",
  heroTime: "10am Colombia",
  format: "Online en vivo",
  price: "Masterclass gratuita",
  /** Inicio para la cuenta regresiva: hora de Colombia (UTC−5, sin horario de verano). */
  startsAt: "2026-10-25T10:00:00-05:00",
} as const;

/** Barra fija superior con la cuenta regresiva. */
export const COUNTDOWN = {
  title: [["El amor ", { strong: "no se sana" }]] as readonly Rich[],
  label: "Faltan",
  units: { days: "Días", hours: "Horas", minutes: "Min", seconds: "Seg" },
  /** Cuando llega la hora, en lugar de los números. */
  started: EVENT.format,
} as const;

/** Textos decorativos derivados del copy. */
export const DECOR = {
  seal: "MANUELA ZULUAGA · EL AMOR NO SE SANA · MASTERCLASS GRATUITA · ",
  heroVertical: { first: "Masterclass gratuita", second: "Manuela Zuluaga" },
  marquee: [
    ["El amor ", { strong: "no se sana" }],
    ["Masterclass ", { strong: "gratuita" }],
    ["25 de octubre · 10 am ", { flag: "co" }],
    ["Online ", { strong: "en vivo" }],
  ] as readonly MarqueeItem[],
} as const;

export const HERO = {
  /** "El amor NO se sana": se muestra en mayúsculas con la segunda parte destacada. */
  title: [["El amor"], [{ strong: "no se sana" }]] as readonly Rich[],
  subtitle:
    "Sanar te está perjudicando, y es justo la razón por la que sigues repitiendo las mismas relaciones.",
  body: "No necesitas más terapia. No necesitas más talleres ni cursos. No necesitas más libros ni más podcast. Necesitas entender de dónde viene todo y romperlo, el resto será consecuencia.",
  photoAlt: "Manuela Zuluaga con un micrófono, lista para la masterclass en vivo",
};

export const TE_ENTIENDO = {
  title: [["Te"], [{ strong: "entiendo..." }]] as readonly Rich[],
  /** Texto vertical decorativo junto a la foto: grande + pequeño. */
  vertical: { big: "El amor", small: "no se sana" },
  paragraphs: [
    [
      "Sé que intentaste de todo. Sé que intentas “sanar” hace años con terapia, constelaciones, talleres, cursos, libros y podcasts, aun así, sigues repitiendo las mismas relaciones y te sigues sintiendo ",
      { strong: "cada vez más vacía y frustrada" },
      ".",
    ],
    [
      "Todo lo que has hecho para “sanar”: poner límites, perdonar, trabajar tu amor propio, sanar niña interior, entender la historia de tus padres, etc. — ",
      { strong: "es justamente lo que hace que sigas en el mismo bucle" },
      ".",
    ],
  ] as readonly Rich[],
  photoAlt: "Manuela Zuluaga abrazada a su pareja",
};

export const RECOMPENSA = {
  kicker: "Recompensa",
  title: [["¿Qué vas a llevarte de esta"], [{ strong: "masterclass gratuita?" }]] as readonly Rich[],
  /** Cada punto del copy, partido en su primera palabra (título) y el resto. */
  items: [
    { icon: "descubrir", lead: "Descubrir", rest: "por qué por más que “sanes”, la misma historia se repite SIEMPRE" },
    { icon: "raiz", lead: "Entender", rest: "la raíz de todo y por qué atraes siempre las mismas relaciones" },
    { icon: "camino", lead: "El paso a paso", rest: "exacto para dejar de atraer las mismas relaciones y terminar con el ciclo de sanación" },
  ],
} as const;

export const PARA_TI = {
  title: [["Este evento es"], [{ strong: "para ti" }, " si..."]] as readonly Rich[],
  items: [
    { icon: "ciclo", text: "Ya hiciste terapia, talleres, cursos, constelaciones, leíste de todo... y aun así sigues regresando al mismo punto." },
    { icon: "anillos", text: "Repites relaciones con personas que no están disponibles o tus relaciones terminan siempre igual." },
    { icon: "corazon", text: "Por más que intentaste “enfocarte en ti”, te sigues sintiendo desconectada, vacía y sin saber qué hacer con todo lo que sientes." },
    { icon: "brujula", text: "Te sientes estancada y sabes que ha llegado el momento de dejar de sanar de la misma forma para poder dejar de repetir la misma historia." },
  ],
} as const;

export const QUIEN_ES = {
  kicker: "Sobre",
  question: "¿Quién es",
  name: [["Manuela ", { strong: "Zuluaga?" }]] as readonly Rich[],
  vertical: "Manuela Zuluaga",
  paragraphs: [
    ["Viví toda mi vida desconectada y sin saber quién era realmente yo, me aferraba a las expectativas ajenas, lo que los otros esperaban de mí y construí mi identidad en base a eso."],
    ["Esa desconexión me llevó a manifestar afuera cosas que me hacían sentir vacía e insuficiente, entre ellas, relaciones que nunca hubiese elegido por mí misma."],
    ["Pero siempre sentí que había algo más y gracias a ir más profundo, pude encontrar la raíz de esa desconexión en mi historia de vida y sanarla, muchas cosas en mi vida cambiaron: propósito, relaciones, economía, estilo de vida y conexión con Dios."],
  ] as readonly Rich[],
  quote: "Ya no vivo desde la fuerza ni desde la culpa, vivo desde mí mientras todo afuera se alinea por consecuencia.",
  closing: [
    "Hoy vivo de ayudar a cientos de personas a que logren lo mismo, pero de manera acelerada, ",
    { strong: "algo que me costó 30 años, las personas lo han podido lograr en semanas" },
    ".",
  ] as Rich,
  photoAlt: "Manuela Zuluaga sentada en un sofá",
};

export const QUE_ES = {
  kicker: "Entiende",
  title: [["¿Qué es “El amor"], [{ strong: "no se sana" }, "”?"]] as readonly Rich[],
  cardTitle: "El amor no se sana",
  text: "Una masterclass gratuita diseñada para mostrarte por qué todo lo que has hecho hasta ahora para sanar tus relaciones no ha sido suficiente, y no solo eso, sino que es justamente lo que está perjudicando tus relaciones. Y te vas a ir con el paso a paso real para dejar de repetir la misma historia y salir del ciclo interminable de sanación.",
  photoAlt: "Manuela Zuluaga reflejada en un espejo",
};

export const TESTIMONIOS = {
  title: [["Testimonios"]] as readonly Rich[],
  watermark: "Testimonios",
  hint: "Toca una portada para ver el testimonio completo.",
  listLabel: "Testimonios en video",
  play: "Reproducir testimonio",
  playWithSound: "Reproducir con sonido",
  goTo: "Ir al testimonio",
  watch: "Ver video",
  pause: "Pausar carrusel",
  resume: "Reanudar carrusel",
  close: "Cerrar video",
  error: "No pudimos cargar este video. Puedes abrirlo directamente o intentar de nuevo.",
  retry: "Intentar de nuevo",
  openVideo: "Abrir video",
  /** El número identifica tanto el video como la portada entregada. */
  items: [
    {
      id: 1,
      title: "Testimonio 1",
      playbackUrl: "/videos/testimonios/video-1.mp4",
      videoUrl: "https://assets.cdn.filesafe.space/Uj5GpDUT4CBazRPjpFJv/media/6ab48cf3ec718870e147750d.mov",
    },
    {
      id: 2,
      title: "Testimonio 2",
      playbackUrl: "/videos/testimonios/video-2.mp4",
      videoUrl: "https://assets.cdn.filesafe.space/Uj5GpDUT4CBazRPjpFJv/media/6ab48f5e1bd7d8efc80a6e29.mov",
    },
    {
      id: 3,
      title: "Testimonio 3",
      playbackUrl: "/videos/testimonios/video-3.mp4",
      videoUrl: "https://assets.cdn.filesafe.space/Uj5GpDUT4CBazRPjpFJv/media/6ab48f94ec718870e147af8b.mov",
    },
    {
      id: 4,
      title: "Testimonio 4",
      playbackUrl: "/videos/testimonios/video-4.mp4",
      videoUrl: "https://assets.cdn.filesafe.space/Uj5GpDUT4CBazRPjpFJv/media/6ab48fbefb1f2e9eeb94f1aa.mov",
    },
    {
      id: 5,
      title: "Testimonio 5",
      playbackUrl: "/videos/testimonios/video-5.mp4",
      videoUrl: "https://assets.cdn.filesafe.space/Uj5GpDUT4CBazRPjpFJv/media/6ab490108d8128ee4cb935d9.mov",
    },
    {
      id: 6,
      title: "Testimonio 6",
      playbackUrl: "/videos/testimonios/video-6.mp4",
      videoUrl: "https://assets.cdn.filesafe.space/Uj5GpDUT4CBazRPjpFJv/media/6ab490591bd7d8efc80a85e0.mov",
    },
  ],
} as const;

export const ACCESO = {
  kicker: "El acceso",
  title: [["¿Estás lista para cerrar"], [{ strong: "con el ciclo interminable de sanación?" }]] as readonly Rich[],
  /** La puerta es un fondo decorativo. */
  photoAlt: "",
};

export const MODAL = {
  kicker: "Masterclass gratuita",
  title: [["El amor"], [{ strong: "no se sana" }]] as readonly Rich[],
  close: "Cerrar",
};

export const THANKS = {
  metaTitle: "Gracias",
  kicker: "Masterclass gratuita",
  /** Mensaje de sistema: solo se llega aquí tras un registro confirmado. */
  title: [["Registro"], [{ strong: "confirmado" }]] as readonly Rich[],
  welcome: "Hoy diste un paso para ti. Qué alegría que estés aquí.",
  lastStep: "Último paso",
  nextStep: "Únete al grupo de WhatsApp de la masterclass.",
  transition: {
    title: "El lugar ya es tuyo",
    body: "Qué alegría que estés aquí.",
  },
  whatsappLabel: "Unirme al grupo de WhatsApp",
  whatsappUrl: "https://chat.whatsapp.com/CLZq3r83NfYJOAlWP2Pu5Y?s=cl&p=i&mlu=4&ilr=4",
};

export const FOOTER = {
  rights: "Todos los derechos reservados.",
} as const;
