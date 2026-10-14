import type { MetadataRoute } from "next";
import { siteIndexable, siteUrl } from "@/lib/seo";

/*
  Mientras el sitio no esté publicado NO se usa "Disallow: /". Bloquear el
  rastreo impediría a los buscadores leer el noindex (cabecera X-Robots-Tag y
  meta robots), y una URL enlazada desde fuera podría acabar indexada sin
  contenido. El noindex es lo que mantiene el sitio fuera del índice.
*/
export default function robots(): MetadataRoute.Robots {
  if (!siteIndexable) {
    return { rules: { userAgent: "*", allow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
