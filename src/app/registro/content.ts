/*
  Contenido y configuración de la landing "registro".

  Todo lo que se edita sin tocar diseño vive aquí: textos, fechas, enlaces y la
  etiqueta del lead. Los componentes leen de este archivo; no escriben copy.
*/

export const LANDING = {
  slug: "registro",
  /** Ruta pública. Para indexarla, añadirla a PUBLISHED_LANDINGS (src/lib/landings.ts). */
  path: "/registro",
  thanksPath: "/registro/gracias",
  /** Etiqueta del lead en el CRM. Una variante A/B lleva la suya (p. ej. "registro-b"). */
  leadSource: "registro",
} as const;

export const META = {
  title: "Registro",
  description: "TODO: descripción de 150-160 caracteres para buscadores y redes sociales.",
};

export const HERO = {
  title: "TODO: titular de Registro",
  intro: "TODO: subtítulo con la promesa principal.",
};

export const THANKS = {
  metaTitle: "Gracias",
  title: "TODO: confirmación del registro",
  body: "TODO: el siguiente paso que tiene que dar quien se registró.",
};
