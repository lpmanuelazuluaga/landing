import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LANDING, META } from "./content";
import { Hero } from "./_sections/Hero";

/*
  La página solo compone secciones, en el orden del diseño, y sigue siendo un
  Server Component. Las secciones nuevas van en _sections/ y las piezas propias
  en _components/.
*/

export const metadata: Metadata = pageMetadata({ ...META, path: LANDING.path });

export default function LandingPage() {
  return (
    <main>
      <Hero />
    </main>
  );
}
