"use client";

import Script from "next/script";
import { useConsent } from "@/lib/useConsent";

/*
  Clarity y Meta Pixel cargados directo (vía B de Tracking.tsx).

  Con consentimiento obligatorio NO se cargan hasta que el visitante acepta la
  categoría correspondiente en el banner. Antes de hidratar el estado es
  "unknown" y tampoco se carga nada: nunca hay un script en el HTML del
  servidor.

  Revocar no descarga un script ya ejecutado: el botón de preferencias recarga
  la página (ver ConsentBanner), y en la recarga ya no se inyecta.
*/
export function ConsentGatedScripts({
  clarityId,
  metaPixelId,
  consentRequired,
}: {
  clarityId: string | null;
  metaPixelId: string | null;
  consentRequired: boolean;
}) {
  const consent = useConsent();
  if (consent.status === "unknown") return null;

  const choice = consent.status === "decided" ? consent.choice : null;
  const analytics = !consentRequired || choice?.analytics === true;
  const marketing = !consentRequired || choice?.marketing === true;

  return (
    <>
      {clarityId && analytics ? (
        /* id "ms-clarity" y nunca "clarity": el elemento ocuparía
           window.clarity antes del snippet y Clarity no grabaría nada. */
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});`}
        </Script>
      ) : null}
      {metaPixelId && marketing ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
