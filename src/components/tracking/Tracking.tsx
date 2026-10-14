import Script from "next/script";
import { trackingConfig, usesBuiltinConsent } from "@/lib/tracking-config";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { ConsentGatedScripts } from "@/components/tracking/ConsentGatedScripts";
import { ConsentBanner } from "@/components/tracking/ConsentBanner";

/*
  Único punto donde entran scripts de terceros. Sin IDs configurados no
  renderiza nada: ni GTM, ni Clarity, ni Pixel, ni banner.

  DOS VÍAS, elegir una por proyecto (ver docs/INTEGRATIONS.md):

  A) GTM (recomendada). Se carga GTM con Google Consent Mode v2 en "denied" por
     defecto si el consentimiento es obligatorio. La CMP y las demás etiquetas
     (GA4, Pixel, Clarity) se configuran DENTRO del contenedor, con sus
     condiciones de consentimiento. "denied" por defecto NO autoriza a cargar
     Clarity o Pixel: eso lo decide la CMP.

  B) Directa (sin GTM). Clarity y/o Pixel se cargan desde aquí, pero solo
     después de que el visitante acepte en el banner integrado.

  Con las dos vías a la vez habría dos banners: no está soportado.
*/
export function Tracking() {
  const { gtmId, gtmOrigin, clarityId, metaPixelId, consentRequired } = trackingConfig;

  return (
    <>
      {gtmId ? (
        <GoogleTagManager id={gtmId} origin={gtmOrigin} consentRequired={consentRequired} />
      ) : null}
      {clarityId || metaPixelId ? (
        <ConsentGatedScripts
          clarityId={clarityId}
          metaPixelId={metaPixelId}
          consentRequired={consentRequired}
        />
      ) : null}
      {usesBuiltinConsent ? <ConsentBanner /> : null}
    </>
  );
}

function GoogleTagManager({
  id,
  origin,
  consentRequired,
}: {
  id: string;
  origin: string;
  consentRequired: boolean;
}) {
  const initial = consentRequired ? "denied" : "granted";
  const key = JSON.stringify(CONSENT_STORAGE_KEY);
  const src = JSON.stringify(`${origin}/gtm.js?id=${id}`);

  /* El valor por defecto de Consent Mode tiene que existir ANTES de que cargue
     GTM, por eso va en el mismo script y por delante del loader. Si el
     visitante ya decidió en el banner integrado, se reaplica su decisión. */
  const code = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'${initial}',ad_user_data:'${initial}',ad_personalization:'${initial}',analytics_storage:'${initial}',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var c=JSON.parse(localStorage.getItem(${key})||'null');if(c&&typeof c.analytics==='boolean'){var m=c.marketing?'granted':'denied';gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:m,ad_user_data:m,ad_personalization:m});}}catch(e){}
dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
(function(d){var s=d.createElement('script');s.async=true;s.src=${src};var f=d.getElementsByTagName('script')[0];f.parentNode.insertBefore(s,f);})(document);`;

  return (
    <>
      {/* id distinto de cualquier global de los snippets (dataLayer, gtag…):
          todo elemento con id se expone como window[id] y rompería el snippet. */}
      <Script id="ls-gtm" strategy="afterInteractive">
        {code}
      </Script>
      {/* El iframe noscript carga el contenedor sin ningún control de
          consentimiento, así que solo se emite donde no se exige. */}
      {consentRequired ? null : (
        <noscript>
          <iframe
            src={`${origin}/ns.html?id=${id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  );
}
