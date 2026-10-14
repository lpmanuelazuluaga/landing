import "./landing.css";

/*
  Layout de la landing "__SLUG__": su clase de ámbito y, si hacen falta, sus
  fuentes y providers (modal, scroll suave…). Lo que se declare aquí no afecta
  a ninguna otra landing.

  Fuentes de marca: declararlas con next/font y aplicar font.variable en este
  div (ver docs/CONVENTIONS.md, "Fuentes"). Así solo se precargan en esta
  landing.

  La metadata va en cada página, no aquí, para que la página de gracias no
  herede el canonical de la landing.
*/
export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="lp-__SLUG__ min-h-svh">{children}</div>;
}
