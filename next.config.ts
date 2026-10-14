import type { NextConfig } from "next";
import { isSiteIndexable } from "./src/lib/indexing";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    /* Lista blanca obligatoria desde Next 16: una calidad que no esté aquí se
       ignora en silencio y se sirve la por defecto. Añadir valores con motivo. */
    qualities: [75],
  },

  async redirects() {
    /* El sitio tiene una sola landing, en /registro. La raíz redirige ahí y
       conserva la query (utm_*, click IDs). 307 mientras la URL no sea
       definitiva (AGENTS.md, regla 14). */
    return [{ source: "/", destination: "/registro", permanent: false }];
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
