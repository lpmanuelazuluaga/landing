"use client";

/**
 * Sierra Launch Kit · navegador (v1)
 *
 * <SierraTracking />  va UNA vez en el layout raíz: mide las visitas de
 *                     todas las rutas del proyecto (también al navegar entre
 *                     páginas sin recargar). Sin cookies.
 * <SierraCampos />    va DENTRO de cada <form>: agrega la ruta y los UTM como
 *                     campos ocultos, para que el servidor los reciba con
 *                     atribucionDe(formData).
 * leerAtribucion()    lo mismo para formularios que envían con fetch/JSON.
 * recordarPersona()   guarda el correo de quien se registró (90 días) para
 *                     asociar sus clics posteriores a esa persona.
 * sierraEvento()      reporta un clic (WhatsApp o checkout) hecho por JS.
 *
 * Además, <SierraTracking /> captura solo los clics en enlaces a grupos de
 * WhatsApp (chat.whatsapp.com) y a checkouts. Se puede forzar con
 * data-sierra="whatsapp" | "checkout" y nombrar con data-sierra-target.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
type Utm = Partial<Record<(typeof UTM)[number], string>>;

const CLAVE_UTM = "sl_utm";
/* Quien entra por un anuncio y vuelve otro día sigue atribuido a ese anuncio. */
const VIGENCIA_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * UTM de la URL; si no trae, los guardados de una visita anterior (hasta 7
 * días). Una URL con UTM reemplaza el juego completo: último toque.
 */
function leerUtm(): Utm {
  const resultado: Utm = {};
  try {
    const consulta = new URLSearchParams(window.location.search);
    for (const nombre of UTM) {
      const valor = consulta.get(nombre);
      if (valor) resultado[nombre] = valor.slice(0, 120);
    }
    if (Object.keys(resultado).length > 0) {
      window.localStorage.setItem(CLAVE_UTM, JSON.stringify({ utm: resultado, t: Date.now() }));
      return resultado;
    }

    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_UTM) ?? "null") as { utm?: Utm; t?: number } | null;
    if (guardado?.utm && typeof guardado.t === "number" && Date.now() - guardado.t < VIGENCIA_MS) {
      for (const nombre of UTM) {
        const valor = guardado.utm[nombre];
        if (typeof valor === "string" && valor) resultado[nombre] = valor.slice(0, 120);
      }
      return resultado;
    }

    // Visitas que empezaron antes del cambio a localStorage.
    for (const nombre of UTM) {
      const valor = window.sessionStorage.getItem(`sl_${nombre}`);
      if (valor) resultado[nombre] = valor.slice(0, 120);
    }
  } catch {
    /* almacenamiento bloqueado: sin UTM guardados */
  }
  return resultado;
}

export function leerAtribucion(): { path: string; utm: Utm } {
  return { path: window.location.pathname, utm: leerUtm() };
}

const CLAVE_PERSONA = "sl_persona";
const VIGENCIA_PERSONA_MS = 90 * 24 * 60 * 60 * 1000;

/** Guarda el correo (en minúsculas) de quien acaba de registrarse. Nunca lanza. */
export function recordarPersona(email: string): void {
  try {
    const e = String(email ?? "").trim().toLowerCase();
    if (!e || !e.includes("@") || e.length > 200) return;
    window.localStorage.setItem(CLAVE_PERSONA, JSON.stringify({ e, t: Date.now() }));
  } catch {
    /* almacenamiento bloqueado: el clic se reporta sin correo */
  }
}

function personaGuardada(): { e: string; t: number } | null {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_PERSONA) ?? "null") as { e?: unknown; t?: unknown } | null;
    if (guardado && typeof guardado.e === "string" && typeof guardado.t === "number" && Date.now() - guardado.t < VIGENCIA_PERSONA_MS) {
      return { e: guardado.e, t: guardado.t };
    }
  } catch {
    /* almacenamiento bloqueado o dato corrupto */
  }
  return null;
}

type TipoEvento = "whatsapp_click" | "checkout_click";

/** Reporta un clic al panel. Nunca lanza ni espera: no puede frenar la navegación. */
export function sierraEvento(tipo: TipoEvento, destino?: string): void {
  try {
    const panel = process.env.NEXT_PUBLIC_SIERRA_URL;
    const sitio = process.env.NEXT_PUBLIC_SIERRA_SITE_KEY;
    if (!panel || !sitio) return;
    const cuerpo = JSON.stringify({
      s: sitio,
      p: window.location.pathname,
      k: tipo,
      e: personaGuardada()?.e,
      t: destino ? String(destino).slice(0, 80) : undefined,
      u: leerUtm(),
    });
    const url = `${panel.replace(/\/+$/, "")}/api/e`;
    if (navigator.sendBeacon) navigator.sendBeacon(url, cuerpo);
    else void fetch(url, { method: "POST", body: cuerpo, keepalive: true, mode: "no-cors" });
  } catch {
    /* la landing sigue funcionando aunque el conteo falle */
  }
}

function esCheckout(host: string, ruta: string): boolean {
  if (["buy.stripe.com", "checkout.stripe.com", "link.fastpaydirect.com", "pay.hotmart.com", "mpago.la"].includes(host)) return true;
  if (host.endsWith(".hotmart.com")) return /checkout|payment|purchase/i.test(ruta);
  if (/^(www\.)?mercadopago\./.test(host)) return /checkout/i.test(ruta);
  return false;
}

function clasificarClic(origen: EventTarget | null): { tipo: TipoEvento; destino: string } | null {
  if (!(origen instanceof Element)) return null;
  const forzado = origen.closest("[data-sierra]");
  const enlace = origen.closest("a[href]") as HTMLAnchorElement | null;
  const marca = forzado?.getAttribute("data-sierra");

  let tipo: TipoEvento | null = marca === "checkout" ? "checkout_click" : marca === "whatsapp" ? "whatsapp_click" : null;
  let host = "";
  if (enlace) {
    try {
      const url = new URL(enlace.href, window.location.href);
      host = url.hostname.toLowerCase();
      if (!tipo) {
        if (host === "chat.whatsapp.com") tipo = "whatsapp_click";
        else if (esCheckout(host, url.pathname)) tipo = "checkout_click";
      }
    } catch {
      /* href inválido: se ignora */
    }
  }
  if (!tipo) return null;

  const elemento = forzado ?? enlace;
  const nombrado = elemento?.getAttribute("data-sierra-target")?.trim() || enlace?.getAttribute("data-sierra-target")?.trim();
  const texto = (elemento?.textContent ?? "").replace(/\s+/g, " ").trim();
  return { tipo, destino: (nombrado || texto || host).slice(0, 80) };
}

export function SierraTracking() {
  const ruta = usePathname();

  useEffect(() => {
    const alHacerClic = (evento: MouseEvent) => {
      try {
        const clasificado = clasificarClic(evento.target);
        if (clasificado) sierraEvento(clasificado.tipo, clasificado.destino);
      } catch {
        /* nunca interferir con el clic */
      }
    };
    document.addEventListener("click", alHacerClic, { capture: true, passive: true });
    return () => document.removeEventListener("click", alHacerClic, { capture: true });
  }, []);

  useEffect(() => {
    const panel = process.env.NEXT_PUBLIC_SIERRA_URL;
    const sitio = process.env.NEXT_PUBLIC_SIERRA_SITE_KEY;
    if (!panel || !sitio || !ruta) return;
    try {
      const cuerpo = JSON.stringify({ s: sitio, p: ruta, r: document.referrer || "", u: leerUtm() });
      const destino = `${panel.replace(/\/+$/, "")}/api/t`;
      // Texto plano: no dispara preflight CORS ni demora la página.
      if (navigator.sendBeacon) navigator.sendBeacon(destino, cuerpo);
      else void fetch(destino, { method: "POST", body: cuerpo, keepalive: true, mode: "no-cors" });
    } catch {
      /* la landing sigue funcionando aunque el conteo falle */
    }
  }, [ruta]);

  return null;
}

export function SierraCampos() {
  const contenedor = useRef<HTMLSpanElement>(null);

  // En el navegador (en el servidor no hay URL ni sessionStorage): se
  // completan los campos directamente, sin estado ni renders extra.
  useEffect(() => {
    const raiz = contenedor.current;
    if (!raiz) return;
    const { path, utm } = leerAtribucion();
    const poner = (nombre: string, valor: string) => {
      const campo = raiz.querySelector<HTMLInputElement>(`input[name="${nombre}"]`);
      if (campo) campo.value = valor;
    };
    poner("sl_path", path);
    for (const nombre of UTM) poner(nombre, utm[nombre] ?? "");
  }, []);

  return (
    <span ref={contenedor} hidden>
      <input type="hidden" name="sl_path" defaultValue="" />
      {UTM.map((nombre) => (
        <input key={nombre} type="hidden" name={nombre} defaultValue="" />
      ))}
    </span>
  );
}
