/*
  Registro de landings PUBLICADAS. Es el único interruptor por página:

    · una ruta listada aquí recibe index,follow (si el sitio es indexable) y
      entra en el sitemap;
    · una ruta que no está, sigue en noindex aunque exista y funcione.

  Añadir una entrada es el acto consciente de publicar. Las páginas de gracias,
  las variantes y los borradores no se añaden nunca.
*/

export type PublishedLanding = {
  /** Ruta pública, empezando por "/". */
  path: string;
  /** Fecha ISO de la última modificación relevante (opcional, para el sitemap). */
  lastModified?: string;
};

export const PUBLISHED_LANDINGS: readonly PublishedLanding[] = [];

export function isPublished(path: string): boolean {
  return PUBLISHED_LANDINGS.some((landing) => landing.path === path);
}
