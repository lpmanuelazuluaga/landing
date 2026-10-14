/*
  Estado de consentimiento del banner integrado (components/tracking/ConsentBanner).

  Solo gobierna los scripts que este proyecto carga directamente (Clarity y
  Meta Pixel sin GTM). Si el proyecto usa una CMP dentro de GTM, la decisión
  vive en la CMP y este módulo no interviene.

  Al decidir también se actualiza Google Consent Mode, por si además hay GTM.
*/

export type ConsentChoice = { analytics: boolean; marketing: boolean };

export type ConsentState =
  | { status: "unknown" } // servidor o antes de hidratar: no se sabe todavía
  | { status: "undecided" }
  | { status: "decided"; choice: ConsentChoice };

/* El script inline de GTM lee esta misma clave (Tracking.tsx). */
export const CONSENT_STORAGE_KEY = "ls-consent-v1";
const CHANGE_EVENT = "ls:consent-change";

export function readConsentRaw(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null; // almacenamiento bloqueado: se trata como "sin decidir"
  }
}

export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      typeof (value as ConsentChoice).analytics === "boolean" &&
      typeof (value as ConsentChoice).marketing === "boolean"
    ) {
      const { analytics, marketing } = value as ConsentChoice;
      return { analytics, marketing };
    }
  } catch {
    /* valor corrupto: se vuelve a preguntar */
  }
  return null;
}

function updateGoogleConsent(choice: ConsentChoice) {
  const ads = choice.marketing ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

export function saveConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ ...choice, decidedAt: new Date().toISOString() }),
    );
  } catch {
    /* sin almacenamiento la decisión dura lo que dure la página */
  }
  updateGoogleConsent(choice);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* nada que borrar */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // otras pestañas
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
