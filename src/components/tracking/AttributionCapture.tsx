"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Guarda utm_* y click IDs de la URL de entrada. No renderiza nada. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
