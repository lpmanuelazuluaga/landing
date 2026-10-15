import { Cormorant_Garamond, DM_Sans } from "next/font/google";

/*
  Tipografías de la marca, solo para esta landing (docs/CONVENTIONS.md,
  "Fuentes"). Las dos son variables en Google Fonts: un archivo por familia.
  next/font las sirve desde el propio dominio, sin peticiones a Google desde el
  navegador.

  - Títulos: Cormorant Garamond (aprobada el 2026-10-14; la de la referencia).
  - Cuerpo: DM Sans (elegida por el cliente).
*/
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const sans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});
