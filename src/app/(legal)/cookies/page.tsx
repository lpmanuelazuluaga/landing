import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ConsentPreferencesButton } from "@/components/tracking/ConsentBanner";
import { noindexMetadata } from "@/lib/seo";
import { usesBuiltinConsent } from "@/lib/tracking-config";
import { ui } from "@/content/ui";

/*
  Ruta reservada para la política de cookies: la enlaza el banner de
  consentimiento. El texto lo entrega el cliente.

  El botón de preferencias solo aparece con el banner integrado; con una CMP en
  GTM, es la CMP la que ofrece reabrir las preferencias.
*/

export const metadata: Metadata = noindexMetadata("Política de cookies");

export default function CookiesPage() {
  return (
    <main className="py-section">
      <Container narrow>
        <h1 className="text-3xl font-semibold tracking-tight">Política de cookies</h1>
        <p className="mt-4 text-muted">{ui.system.legalPending}</p>
        {usesBuiltinConsent ? (
          <p className="mt-6">
            <ConsentPreferencesButton />
          </p>
        ) : null}
      </Container>
    </main>
  );
}
