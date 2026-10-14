# Convenciones

## Nombres

| Qué | Convención | Ejemplo |
| --- | --- | --- |
| Slug de landing y carpeta | kebab-case, en el idioma del mercado, legible en una URL compartida | `masterclass`, `lista-de-espera` |
| Variante A/B | `<slug>-<letra>` | `masterclass-b` |
| Clase de ámbito | `.lp-<slug>` | `.lp-masterclass` |
| `leadSource` | igual que la carpeta | `masterclass-b` |
| Componentes | PascalCase; las secciones por su función | `Hero`, `Testimonios`, `Faq`, `Cierre` |
| Hooks | `useX` | `useLeadForm` |
| Constantes de contenido | UPPER_SNAKE en `content.ts` | `HERO`, `THANKS` |
| Variables de entorno | `NEXT_PUBLIC_` solo para valores públicos (IDs, URL) | `NEXT_PUBLIC_GTM_ID`, `LEADS_WEBHOOK_URL` |
| Ramas | `feat/<slug>-<cambio>`, `fix/<slug>-<bug>`, `chore/<tema>` | `feat/masterclass-hero` |
| Commits | `tipo(<slug>\|core): descripción` | `feat(masterclass): sección de bonos` |

## Idioma y voz

- Código e identificadores en inglés; comentarios, commits y documentación en
  español.
- La voz del copy (tuteo, voseo, usted) la define el cliente y se escribe en el
  `AGENTS.md` del proyecto. Los textos de sistema están en `src/content/ui.ts`
  (tuteo neutro por defecto).

## CSS

- Utilidades semánticas (`bg-background`, `text-muted`, `bg-accent`), nunca hex en
  JSX. Una excepción se comenta.
- Nunca interpolar nombres de clase. Para variantes, un mapa de strings
  completos:

  ```ts
  const TONE = { light: "bg-background text-foreground", dark: "bg-foreground text-background" } as const;
  ```

- Estilos que no se resuelven con utilidades: en el `landing.css` de la
  landing, bajo `.lp-<slug>` y dentro de `@layer components`.
- Nada de estilos de landing en `globals.css`.
- Animaciones: preferir CSS (`transition`, `@keyframes` en `landing.css`) y
  `Reveal`. Toda animación respeta `prefers-reduced-motion` (`motion-reduce:` o
  la regla global). Para animaciones con estado o gestos, `motion` como
  dependencia opcional.

## Imágenes

- Fuente: JPG o WebP de calidad alta, como máximo unos 2400 px de ancho. Nada de
  PNG para fotos. Revisar todo archivo de más de 500 KB.
- Se importan estáticamente desde `_assets/`: `import foto from "../_assets/foto.jpg"`.
  Así `next/image` recibe dimensiones y `placeholder="blur"`.
- `sizes` siempre que la imagen no ocupe el ancho completo.
- **Hero / LCP:** `loading="eager"` + `fetchPriority="high"`. `priority` está
  deprecado en Next 16. Si cambia de encuadre entre móvil y escritorio:

  ```tsx
  import { getImageProps } from "next/image";

  const common = { alt: "…", fill: true, sizes: "100vw" } as const;
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: heroDesktop });
  const { props: { srcSet: mobile, ...rest } } = getImageProps({
    ...common, src: heroMobile, loading: "eager", fetchPriority: "high",
  });

  <picture>
    <source media="(min-width: 1024px)" srcSet={desktop} />
    <img {...rest} srcSet={mobile} alt={rest.alt} className="object-cover" />
  </picture>
  ```

- La calidad se pide solo entre las de `images.qualities` (`next.config.ts`).
- `public/` solo para archivos que necesitan una URL estable (PDF descargable).
  Favicon e imagen OG se resuelven con las convenciones de archivo de Next
  (`icon.png`, `apple-icon.png`, `opengraph-image.jpg`) en la carpeta de la ruta.

## Fuentes

Declararlas donde se usan, nunca en el layout raíz salvo que todo el sitio las
comparta:

```tsx
// src/app/<slug>/fonts.ts
import { Inter } from "next/font/google";
export const landingFont = Inter({ subsets: ["latin"], variable: "--font-landing", display: "swap" });

// src/app/<slug>/layout.tsx
<div className={`lp-<slug> ${landingFont.variable} min-h-svh`}>{children}</div>
```

```css
/* src/app/<slug>/landing.css */
.lp-<slug> {
  --font-sans: var(--font-landing), ui-sans-serif, system-ui, sans-serif;
  font-family: var(--font-sans);
}
```

- Solo los pesos usados; variable fonts cuando existan.
- Fuentes locales (`next/font/local`) con archivos en la carpeta de la landing o
  en `src/fonts/`, **nunca en `public/`** (quedarían descargables). Verificar que
  la licencia cubra el uso web.

## Formularios

- La UI es de cada landing; la lógica es siempre `useLeadForm`.
- Conservar `name="name|email|phone|consent"` y el honeypot `hp_check`.
- Campos con `<label>` visible y altura mínima de 44 px. Errores con
  `aria-invalid`, `aria-describedby` y texto (no solo color).
- Nada de `text-sm` en los inputs en móvil.

## Componentes y dependencias

- Antes de crear un componente en una landing, revisar `src/components/ui/`.
  Antes de subir algo al núcleo, comprobar que no tiene identidad visual.
- WebGL, gsap y librerías de carrusel son dependencias de cliente: van con
  `next/dynamic`, con un fondo estático de reserva y fuera del hero salvo
  necesidad.

## Checklist de PR

- [ ] `npm run check` en verde; `npm run smoke` aprobado.
- [ ] Probado a 360/390, 768, 1024 y 1440 px; sin scroll horizontal.
- [ ] Teclado y `prefers-reduced-motion` revisados.
- [ ] Ninguna landing importa de otra; sin hex ni clases interpoladas.
- [ ] Tabla de rutas del README y `docs/` actualizados.
- [ ] Sin secretos ni valores reales en el diff (`.env.example` sin valores).
