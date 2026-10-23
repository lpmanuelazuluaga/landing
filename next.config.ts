import type { NextConfig } from "next";
import { isSiteIndexable } from "./src/lib/indexing";

/* Link personal del webinar (/vivo/<token>?e=<email>): lo atiende el panel de
   Sierra, pero el contacto ve el dominio de la landing. El panel registra el
   ingreso y redirige al Zoom; la redirección pasa tal cual por el rewrite. */
const panelSierra = process.env.NEXT_PUBLIC_SIERRA_URL?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    /* Lista blanca obligatoria desde Next 16: una calidad que no esté aquí se
       ignora en silencio y se sirve la por defecto. Añadir valores con motivo. */
    qualities: [75],
  },

  async rewrites() {
    return panelSierra ? [{ source: "/vivo/:token", destination: `${panelSierra}/w/:token` }] : [];
  },

  async headers() {
    if (isSiteIndexable()) return [];

    /* Mientras el sitio no se publique conscientemente, toda respuesta lleva
       noindex. Es la barrera que funciona aunque una página olvide su
       metadata, y cubre también PDFs y otros archivos de public/. */
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
