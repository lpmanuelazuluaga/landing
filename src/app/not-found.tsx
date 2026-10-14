import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ui } from "@/content/ui";

/* Atiende notFound() y cualquier URL que no exista en el sitio. */
export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center">
      <Container narrow>
        <p className="text-sm font-medium text-muted">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ui.system.notFoundTitle}</h1>
        <p className="mt-3 text-muted">{ui.system.notFoundBody}</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-5 font-medium text-accent-foreground"
        >
          {ui.system.backHome}
        </Link>
      </Container>
    </main>
  );
}
