import type { Metadata } from "next";
import { site } from "@/lib/site";
import { NOINDEX, siteIndexable, siteUrl } from "@/lib/seo";
import { Tracking } from "@/components/tracking/Tracking";
import { AttributionCapture } from "@/components/tracking/AttributionCapture";
import "./globals.css";

/*
  Layout raíz: solo lo común a todas las páginas. Paletas, fuentes de marca y
  providers de una landing van en el layout de esa landing, no aquí: lo que se
  declara en este archivo se aplica (y en el caso de las fuentes, se precarga)
  en todas las rutas.
*/

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  /* Barrera por defecto: cada página de landing decide la suya con
     pageMetadata(); el resto hereda noindex mientras el sitio no se publique. */
  robots: siteIndexable ? undefined : NOINDEX,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={site.lang}>
      <body>
        {children}
        <AttributionCapture />
        <Tracking />
      </body>
    </html>
  );
}
