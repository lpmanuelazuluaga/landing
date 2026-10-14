/*
  Única regla de indexación del proyecto. La usan next.config.ts (cabecera
  X-Robots-Tag), robots.ts, sitemap.ts y los metadatos de cada página.

  Indexar es una decisión explícita, nunca un efecto secundario del deploy: un
  proyecto recién creado se publica en un dominio temporal de Vercel con
  VERCEL_ENV=production, y eso no puede bastar para que Google lo indexe.

  Hacen falta las tres condiciones:
    1. NEXT_PUBLIC_SITE_INDEXABLE === "true"
    2. NEXT_PUBLIC_SITE_URL definida (la URL pública real)
    3. En Vercel, el entorno Production (los previews nunca)

  Sin imports a propósito: next.config.ts lo carga fuera del bundler de la app.
*/
export function isSiteIndexable(): boolean {
  if (process.env.NEXT_PUBLIC_SITE_INDEXABLE !== "true") return false;
  if (!process.env.NEXT_PUBLIC_SITE_URL) return false;
  if (process.env.VERCEL === "1" && process.env.VERCEL_ENV !== "production") {
    return false;
  }
  return true;
}
