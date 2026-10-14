/*
  Globales que crean los scripts de terceros en tiempo de ejecución. Son
  opcionales a propósito: un bloqueador, la falta de consentimiento o un ID sin
  configurar hacen que no existan, así que todo uso va con ?. o comprobación.
*/
export {};

declare global {
  interface Window {
    /** Cola de Google Tag Manager / gtag. */
    dataLayer?: unknown[];
    /** gtag de Consent Mode, definido por el script de GTM de components/tracking. */
    gtag?: (...args: unknown[]) => void;
    /** Meta Pixel, solo si se cargó con consentimiento de marketing. */
    fbq?: (...args: unknown[]) => void;
  }
}
