/*
  Textos de las piezas de sistema (formularios, banner de consentimiento, 404,
  error). Un solo sitio para adaptar la voz del cliente: está en tuteo neutro;
  cambiar a voseo o a usted aquí si el cliente lo pide.

  El copy de cada landing NO va aquí: va en el content.ts de su carpeta.
*/
export const ui = {
  form: {
    name: "Nombre",
    email: "Correo electrónico",
    /* El teléfono que se pide es el de WhatsApp (recordatorios del evento). */
    phone: "WhatsApp",
    optional: "(opcional)",
    consentBefore: "He leído y acepto la",
    consentLink: "política de privacidad",
    submit: "Enviar",
    submitting: "Enviando…",
    success: "Datos recibidos.",
    error: "No se pudo enviar el formulario. Inténtalo de nuevo en unos segundos.",
  },
  validation: {
    name: "Escribe tu nombre.",
    email: "El correo electrónico no es válido.",
    phone: "El número de WhatsApp no es válido.",
    phoneRequired: "Escribe tu número de WhatsApp.",
    consent: "Debes aceptar la política de privacidad.",
  },
  consent: {
    title: "Cookies",
    body: "Usamos cookies de analítica y de marketing solo si las aceptas. Puedes cambiar tu decisión cuando quieras.",
    more: "Más información",
    accept: "Aceptar",
    reject: "Rechazar",
    configure: "Configurar",
    save: "Guardar selección",
    analytics: "Analítica: medir visitas y comportamiento en la página.",
    marketing: "Marketing: medir y personalizar campañas publicitarias.",
    reopen: "Cambiar preferencias de cookies",
  },
  system: {
    preparingTitle: "Proyecto en preparación",
    preparingBody: "Este sitio todavía no está publicado.",
    notFoundTitle: "Página no encontrada",
    notFoundBody: "La dirección no existe o ya no está disponible.",
    backHome: "Ir al inicio",
    errorTitle: "Algo salió mal",
    errorBody: "No se pudo mostrar esta sección.",
    retry: "Reintentar",
    legalPending: "PENDIENTE: el texto legal lo provee el cliente.",
  },
} as const;
