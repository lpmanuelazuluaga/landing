import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { noindexMetadata } from "@/lib/seo";
import { ui } from "@/content/ui";

/*
  Ruta reservada para la política de privacidad: la enlaza la casilla de
  consentimiento de los formularios. El texto lo entrega el cliente; mientras
  tanto la página dice explícitamente que está pendiente y no se indexa.
*/

export const metadata: Metadata = noindexMetadata("Política de privacidad");

export default function PrivacyPage() {
  return (
    <main className="py-section">
      <Container narrow>
        <h1 className="text-3xl font-semibold tracking-tight">Política de privacidad</h1>
        <p className="mt-4 text-muted">{ui.system.legalPending}</p>
      </Container>
    </main>
  );
}
