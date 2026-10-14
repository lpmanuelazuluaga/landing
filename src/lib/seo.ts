import type { Metadata } from "next";
import { site } from "@/lib/site";
import { isSiteIndexable } from "@/lib/indexing";
import { isPublished } from "@/lib/landings";

/*
  Metadatos y URLs para SEO. Uso en servidor: layouts, páginas, robots y
  sitemap.
*/

function resolveSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL no es una URL válida: "${explicit}". Debe incluir https://`,
      );
    }
  }
  /* Sin URL real se usa la de producción que expone Vercel, solo para que las
     URLs absolutas (og:image) apunten a algo que existe. No habilita canonical
     ni indexación. */
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

export const siteUrl = resolveSiteUrl();

/** Solo con una URL pública real se emiten canonical y og:url. */
export const hasRealSiteUrl = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const siteIndexable = isSiteIndexable();

export const NOINDEX = { index: false, follow: false } as const;

type PageMetadataInput = {
  title: string;
  description: string;
  /** Ruta pública de la página, empezando por "/". */
  path: string;
};

/**
 * Metadatos de una página de landing. Se indexa solo si el sitio es indexable
 * y la ruta está registrada en PUBLISHED_LANDINGS (src/lib/landings.ts).
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const indexable = siteIndexable && isPublished(path);
  return {
    title,
    description,
    alternates: hasRealSiteUrl ? { canonical: path } : undefined,
    robots: indexable ? { index: true, follow: true } : NOINDEX,
    openGraph: {
      title,
      description,
      url: hasRealSiteUrl ? path : undefined,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
  };
}

/** Páginas que nunca se indexan: gracias, legales pendientes, utilidades. */
export function noindexMetadata(title: string, description?: string): Metadata {
  return { title, description, robots: NOINDEX };
}
