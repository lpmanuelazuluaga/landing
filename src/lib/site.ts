/*
  Configuración pública del sitio: segura para importar en servidor y en
  cliente. Nada sensible va aquí; los secretos se leen solo en los route
  handlers.

  Cliente: Manuela Zuluaga. Mercado principal: Colombia (es-CO).
  La descripción definitiva y las reglas del formulario se confirman con el
  briefing visual (ver docs/HANDOFF.md).
*/
export const site = {
  /** Nombre de marca: título por defecto, plantilla de títulos y og:site_name. */
  name: "Manuela Zuluaga",
  /** Descripción por defecto (las páginas definen la suya). */
  description: "Proyecto en preparación.",
  /** Atributo lang de <html>. */
  lang: "es-CO",
  /** og:locale. */
  locale: "es_CO",
  /** País por defecto para interpretar teléfonos sin prefijo (ISO 3166-1 alfa-2). */
  defaultCountry: "CO",
  legal: {
    privacyPath: "/privacidad",
    cookiesPath: "/cookies",
  },
  leads: {
    /** Si el teléfono es obligatorio en todos los formularios del sitio.
        Manuela Zuluaga: sí (WhatsApp), decisión del 2026-10-14. */
    requirePhone: true,
    /** Exigir la casilla de aceptación de la política de privacidad.
        Manuela Zuluaga: desactivada el 2026-10-14 porque todavía no hay
        política. La Ley 1581 de 2012 exige autorización para tratar datos
        personales: volver a true en cuanto exista la política. */
    requireConsent: false,
  },
} as const;
