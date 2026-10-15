import Link from "next/link";
import { site } from "@/lib/site";
import { FOOTER } from "../content";
import { Logo } from "../_components/decor";

/* Pie de la referencia: línea, logo, derechos y enlaces legales sobre fondo oscuro con brillo. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="fondo-noche-brillo-abajo tono-oscuro">
      <div className="mx-auto max-w-content px-gutter pb-10 pt-12 sm:px-gutter-lg">
        <div aria-hidden="true" className="h-px bg-rosa/30" />
        <div className="mt-8 flex flex-col items-center gap-6 text-center text-[0.9375rem] md:flex-row md:justify-between md:text-left">
          <Logo className="w-36 text-rosa" />
          <p className="text-crema/85">
            © {year} <strong className="font-semibold text-rosa">{site.name}</strong>. {FOOTER.rights}
          </p>
          <nav aria-label="Enlaces legales">
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-crema/85">
              {FOOTER.links.map((link, index) => (
                <li key={link.href} className="flex items-center gap-3">
                  {index > 0 ? <span aria-hidden="true">|</span> : null}
                  <Link href={link.href} className="underline-offset-4 hover:text-rosa hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
