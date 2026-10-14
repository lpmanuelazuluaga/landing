import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { noindexMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { ui } from "@/content/ui";

/*
  Pantalla provisional de "/". No es una landing: se elimina cuando la landing
  principal pase a ocupar la raíz (npm run new:landing -- <slug> --root).
  Siempre noindex.
*/

export const metadata: Metadata = noindexMetadata(ui.system.preparingTitle);

export default function PreparingPage() {
  return (
    <main className="flex min-h-svh items-center">
      <Container narrow>
        <p className="text-sm font-medium text-muted">{site.name}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ui.system.preparingTitle}</h1>
        <p className="mt-3 text-muted">{ui.system.preparingBody}</p>
      </Container>
    </main>
  );
}
