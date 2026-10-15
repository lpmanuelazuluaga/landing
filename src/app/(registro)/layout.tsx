import "./landing.css";
import { display, sans } from "./fonts";

/*
  Layout de la landing "registro" (en la raíz del sitio) y de su página de
  gracias: clase de ámbito y fuentes. Lo que se declare aquí no afecta a
  ninguna otra landing.

  La metadata va en cada página, no aquí, para que la página de gracias no
  herede el canonical de la landing.
*/
export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`lp-registro ${display.variable} ${sans.variable} min-h-svh`}>{children}</div>;
}
