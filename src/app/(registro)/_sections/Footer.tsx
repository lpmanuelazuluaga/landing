import { site } from "@/lib/site";
import { FOOTER } from "../content";
import { Logo } from "../_components/decor";

/*
  Pie de la referencia: línea, logo y derechos sobre fondo oscuro con brillo.
  Sin enlaces legales (decisión de la agencia, 2026-10-14): la política de
  privacidad sigue enlazada desde la casilla de consentimiento del formulario.
*/
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="fondo-noche-brillo-abajo tono-oscuro">
      <div className="mx-auto max-w-content px-gutter pb-10 pt-12 sm:px-gutter-lg">
        <div aria-hidden="true" className="h-px bg-rosa/30" />
        <div className="mt-8 flex flex-col items-center gap-6 text-center text-[0.9375rem] md:flex-row md:justify-between md:text-left">
          <Logo className="w-36 text-rosa" />
          <p className="text-crema/85">
            © {year} <strong className="font-semibold text-rosa">{site.name}</strong>.
            <br className="md:hidden" />{" "}
            {FOOTER.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
