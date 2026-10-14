"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  parseConsent,
  readConsentRaw,
  subscribeConsent,
  type ConsentState,
} from "@/lib/consent";

/*
  Separado de consent.ts para que los Server Components puedan importar la
  clave y los tipos sin arrastrar hooks de React.

  El snapshot es el string crudo, no el objeto parseado: useSyncExternalStore
  compara por referencia y un objeto nuevo en cada lectura provocaría renders
  en bucle. En el servidor el snapshot es undefined ("unknown").
*/
export function useConsent(): ConsentState {
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, () => undefined);
  return useMemo<ConsentState>(() => {
    if (raw === undefined) return { status: "unknown" };
    const choice = parseConsent(raw);
    return choice ? { status: "decided", choice } : { status: "undecided" };
  }, [raw]);
}
