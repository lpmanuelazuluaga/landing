import { Container } from "@/components/ui/Container";
import { HERO } from "../content";
import { LeadForm } from "../_components/LeadForm";

/*
  Estructura mínima, sin diseño: un h1, su texto y el formulario. Se reemplaza
  por el hero real del cliente.

  Imagen del hero: si cambia de encuadre entre móvil y escritorio, usar
  getImageProps + <picture> con loading="eager" y fetchPriority="high" para
  que solo se descargue una (docs/CONVENTIONS.md, "Imágenes").
*/
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="py-section">
      <Container narrow>
        <h1 id="hero-title" className="text-4xl font-semibold tracking-tight">
          {HERO.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{HERO.intro}</p>
        <div className="mt-8">
          <LeadForm />
        </div>
      </Container>
    </section>
  );
}
