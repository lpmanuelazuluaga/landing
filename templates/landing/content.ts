/*
  Contenido y configuración de la landing "__SLUG__".

  Todo lo que se edita sin tocar diseño vive aquí: textos, fechas, enlaces y la
  etiqueta del lead. Los componentes leen de este archivo; no escriben copy.
*/

export const LANDING = {
  slug: "__SLUG__",
  /** Ruta pública. Para indexarla, añadirla a PUBLISHED_LANDINGS (src/lib/landings.ts). */
  path: "__PATH__",
  thanksPath: "__THANKS_PATH__",
  /** Etiqueta del lead en el CRM. Una variante A/B lleva la suya (p. ej. "__SLUG__-b"). */
  leadSource: "__SLUG__",
} as const;

export const META = {
  title: "__TITLE__",
  description: "TODO: descripción de 150-160 caracteres para buscadores y redes sociales.",
};

export const HERO = {
  title: "TODO: titular de __TITLE__",
  intro: "TODO: subtítulo con la promesa principal.",
};

export const THANKS = {
  metaTitle: "Gracias",
  title: "TODO: confirmación del registro",
  body: "TODO: el siguiente paso que tiene que dar quien se registró.",
};
