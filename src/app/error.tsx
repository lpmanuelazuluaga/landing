"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ui } from "@/content/ui";

/*
  Error de render en cualquier segmento bajo el layout raíz. En Next 16.3,
  retry() vuelve a pedir y renderizar el segmento (reset() solo limpia el
  estado sin volver a pedir datos).
*/
export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    /* digest identifica el error en los logs del servidor sin exponer detalles. */
    console.error(error.digest ?? error);
  }, [error]);

  return (
    <main className="flex min-h-svh items-center">
      <Container narrow>
        <h1 className="text-3xl font-semibold tracking-tight">{ui.system.errorTitle}</h1>
        <p className="mt-3 text-muted">{ui.system.errorBody}</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-5 font-medium text-accent-foreground"
        >
          {ui.system.retry}
        </button>
      </Container>
    </main>
  );
}
