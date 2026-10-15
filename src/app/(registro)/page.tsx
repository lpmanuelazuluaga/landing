import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { isPublished } from "@/lib/landings";
import { DECOR, LANDING, META, PLACEHOLDERS } from "./content";
import { CountdownBar } from "./_components/CountdownBar";
import { Marquee } from "./_components/ornaments";
import { RegistrationProvider } from "./_components/Registration";
import { Acceso } from "./_sections/Acceso";
import { Footer } from "./_sections/Footer";
import { Hero } from "./_sections/Hero";
import { ParaTi } from "./_sections/ParaTi";
import { QueEs } from "./_sections/QueEs";
import { QuienEs } from "./_sections/QuienEs";
import { Recompensa } from "./_sections/Recompensa";
import { TeEntiendo } from "./_sections/TeEntiendo";
import { Testimonios } from "./_sections/Testimonios";

/*
  Landing de la masterclass "El amor no se sana", en la raíz del dominio. La
  página solo compone secciones, en el orden del copy, y sigue siendo un
  Server Component. El registro es un modal (RegistrationProvider): abrirlo no
  cambia la URL; un registro confirmado navega a /gracias.
*/

/* Barrera de publicación: con contenido provisional a la vista, añadir la
   landing a PUBLISHED_LANDINGS hace fallar el build. */
if (isPublished(LANDING.path) && Object.values(PLACEHOLDERS).some(Boolean)) {
  throw new Error(
    "La landing está en PUBLISHED_LANDINGS pero todavía muestra contenido provisional (PLACEHOLDERS en content.ts).",
  );
}

export const metadata: Metadata = pageMetadata({ ...META, path: LANDING.path });

export default function LandingPage() {
  return (
    <RegistrationProvider>
      <CountdownBar />
      <main>
        <Hero />
        <Marquee items={DECOR.marquee} />
        <TeEntiendo />
        <Recompensa />
        <ParaTi />
        <QuienEs />
        <QueEs />
        <Marquee items={DECOR.marquee} />
        <Testimonios />
        <Acceso />
      </main>
      <Footer />
    </RegistrationProvider>
  );
}
