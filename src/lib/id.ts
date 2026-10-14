/**
 * Identificador aleatorio para claves de idempotencia y event_id.
 *
 * crypto.randomUUID solo existe en contextos seguros (https o localhost): al
 * probar desde el móvil contra la IP de la red local no está disponible, y por
 * eso hay alternativa con getRandomValues, que sí existe en http.
 */
export function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
