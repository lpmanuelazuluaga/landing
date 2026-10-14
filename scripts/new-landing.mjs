#!/usr/bin/env node
/*
  Crea una landing nueva a partir de templates/landing/.

    npm run new:landing -- <slug>          → src/app/<slug>/      (/<slug>)
    npm run new:landing -- <slug> --root   → src/app/(<slug>)/    (/)

  Nunca sobrescribe: si el destino existe, se detiene. Con --root exige que
  src/app/page.tsx (la pantalla "en preparación") ya no exista, porque dos
  páginas en "/" rompen el build; retirarla es una decisión del desarrollador.
*/
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = join(ROOT, "templates", "landing");
const APP = join(ROOT, "src", "app");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(["api", "gracias", "privacidad", "cookies", "legal", "not-found", "robots", "sitemap"]);
const TEXT_EXTENSIONS = [".ts", ".tsx", ".css", ".md"];

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const root = args.includes("--root");
const slug = args.find((arg) => !arg.startsWith("--"));

if (!slug) fail("Falta el slug. Uso: npm run new:landing -- <slug> [--root]");
if (!SLUG_RE.test(slug) || slug.length > 40) {
  fail(`Slug no válido: "${slug}". Solo minúsculas, números y guiones, hasta 40 caracteres.`);
}
if (RESERVED.has(slug)) fail(`"${slug}" es una ruta reservada del proyecto.`);
if (!existsSync(TEMPLATE)) fail("No se encuentra templates/landing/.");

const target = join(APP, root ? `(${slug})` : slug);
if (existsSync(target)) fail(`Ya existe ${relative(ROOT, target)}. No se sobrescribe.`);
if (!root && existsSync(join(APP, `(${slug})`))) {
  fail(`Ya existe src/app/(${slug})/ con el mismo nombre.`);
}
if (root && existsSync(join(APP, "page.tsx"))) {
  fail('Con --root, primero hay que eliminar src/app/page.tsx (la pantalla "en preparación").');
}

const path = root ? "/" : `/${slug}`;
const thanksPath = root ? "/gracias" : `/${slug}/gracias`;
const title = slug
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const replacements = {
  __SLUG__: slug,
  __PATH__: path,
  __THANKS_PATH__: thanksPath,
  __TITLE__: title,
};

cpSync(TEMPLATE, target, { recursive: true, errorOnExist: true, force: false });

function fill(dir) {
  for (const entry of readdirSync(dir)) {
    const file = join(dir, entry);
    if (statSync(file).isDirectory()) {
      fill(file);
      continue;
    }
    if (!TEXT_EXTENSIONS.some((ext) => file.endsWith(ext))) continue;
    let content = readFileSync(file, "utf8");
    for (const [token, value] of Object.entries(replacements)) {
      content = content.split(token).join(value);
    }
    writeFileSync(file, content);
  }
}
fill(target);

console.log(`✔ Landing creada en ${relative(ROOT, target)}`);
console.log(`  Ruta: ${path}   Gracias: ${thanksPath}   LEAD_SOURCE: ${slug}`);
console.log("  Siguientes pasos:");
console.log("  1. Completar content.ts (META, HERO, THANKS).");
console.log("  2. Construir las secciones en _sections/ y las imágenes en _assets/.");
console.log("  3. Añadir la ruta a la tabla del README.");
console.log("  4. Solo al publicar: añadir la ruta a PUBLISHED_LANDINGS (src/lib/landings.ts).");
