import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { noindexMetadata } from "@/lib/seo";
import { THANKS } from "../content";

/*
  Página de gracias: siempre noindex y fuera del sitemap. Un solo objetivo y un
  solo CTA (grupo, calendario, acceso).

  La conversión NO se dispara aquí: ya se envió en el formulario, antes de
  navegar. Dispararla al cargar la contaría otra vez en cada recarga.

  Si es la gracias de un pago, usar una ruta no deducible (p. ej.
  gracias-<sufijo>/) y configurarla como URL de éxito en la plataforma de
  pago. Es ocultación, no seguridad: aquí no va nada que deba protegerse.
*/

export const metadata: Metadata = noindexMetadata(THANKS.metaTitle);

export default function ThanksPage() {
  return (
    <main className="py-section">
      <Container narrow>
        <h1 className="text-3xl font-semibold tracking-tight">{THANKS.title}</h1>
        <p className="mt-4 text-lg text-muted">{THANKS.body}</p>
      </Container>
    </main>
  );
}
