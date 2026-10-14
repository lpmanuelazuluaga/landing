import type { MetadataRoute } from "next";
import { siteIndexable, siteUrl } from "@/lib/seo";
import { PUBLISHED_LANDINGS } from "@/lib/landings";

/* Solo las landings publicadas (src/lib/landings.ts), y solo si el sitio es indexable. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteIndexable) return [];
  return PUBLISHED_LANDINGS.map(({ path, lastModified }) => ({
    url: new URL(path, siteUrl).href,
    ...(lastModified ? { lastModified } : {}),
  }));
}
