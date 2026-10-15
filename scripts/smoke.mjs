#!/usr/bin/env node
/*
  Smoke test sobre el build de producción: npm run build && npm run smoke

  Arranca `next start` en un puerto local, comprueba el comportamiento que
  todo proyecto debe cumplir y apaga el servidor. Lee las mismas variables de
  entorno que Next (.env*, process.env); conviene ejecutarlo con el mismo
  entorno con el que se hizo el build.

  Nunca envía un lead a un destino real: si LEADS_WEBHOOK_URL está definida,
  la prueba de entrega se omite.
*/
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(ROOT, false);

const PORT = Number(process.env.SMOKE_PORT ?? 3210);
const BASE = `http://127.0.0.1:${PORT}`;
const env = process.env;
/* Misma regla que src/lib/indexing.ts (un .mjs no puede importar ese .ts). */
const indexable =
  env.NEXT_PUBLIC_SITE_INDEXABLE === "true" &&
  Boolean(env.NEXT_PUBLIC_SITE_URL) &&
  !(env.VERCEL === "1" && env.VERCEL_ENV !== "production");

if (!existsSync(join(ROOT, ".next", "BUILD_ID"))) {
  console.error("✖ No hay build de producción. Antes hay que ejecutar: npm run build");
  process.exit(1);
}

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
}
function skip(name, detail) {
  results.push({ name, ok: null, detail });
}

/* Si otro programa ya escucha en el puerto, next start no arranca y las
   pruebas responderían contra ese otro servidor: se aborta antes. */
const portBusy = await fetch(BASE, { signal: AbortSignal.timeout(1500) }).then(
  () => true,
  () => false,
);
if (portBusy) {
  console.error(`✖ El puerto ${PORT} ya está en uso. Usar otro: SMOKE_PORT=3290 npm run smoke`);
  process.exit(1);
}

const server = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "start", "-p", String(PORT), "-H", "127.0.0.1"],
  { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] },
);
let serverLog = "";
server.stdout.on("data", (chunk) => (serverLog += chunk));
server.stderr.on("data", (chunk) => (serverLog += chunk));

function stopServer() {
  if (server.exitCode !== null) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
}

async function waitForServer(timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (server.exitCode !== null) throw new Error(`next start terminó:\n${serverLog}`);
    try {
      await fetch(BASE, { signal: AbortSignal.timeout(2000) });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`next start no respondió en ${timeoutMs / 1000}s:\n${serverLog}`);
}

const postLead = (body, contentType = "application/json") =>
  fetch(`${BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

try {
  await waitForServer();

  /* ── Páginas ── */
  const home = await fetch(`${BASE}/`);
  const homeHtml = await home.text();
  check("GET / responde 200", home.status === 200, `status ${home.status}`);

  const missing = await fetch(`${BASE}/__smoke-ruta-inexistente`);
  check("Ruta inexistente responde 404", missing.status === 404, `status ${missing.status}`);

  if (!indexable) {
    const header = home.headers.get("x-robots-tag") ?? "";
    check("Cabecera X-Robots-Tag noindex", header.includes("noindex"), header || "sin cabecera");
    check(
      'Meta robots "noindex" en /',
      /<meta name="robots" content="noindex/.test(homeHtml),
      "",
    );
  } else {
    skip("Barreras noindex", "sitio marcado como indexable");
  }

  const robots = await fetch(`${BASE}/robots.txt`);
  const robotsTxt = await robots.text();
  check("robots.txt responde 200", robots.status === 200, `status ${robots.status}`);
  if (!indexable) {
    check(
      "robots.txt sin Disallow total (deja leer el noindex)",
      !/^Disallow:\s*\/\s*$/im.test(robotsTxt),
      "",
    );
  }

  const sitemap = await fetch(`${BASE}/sitemap.xml`);
  const sitemapXml = await sitemap.text();
  check("sitemap.xml responde 200", sitemap.status === 200, `status ${sitemap.status}`);
  if (!indexable) check("sitemap vacío mientras no se publica", !sitemapXml.includes("<url>"), "");

  /* ── Tracking: sin ID no se carga nada ── */
  const trackers = [
    ["NEXT_PUBLIC_GTM_ID", "GTM", /googletagmanager\.com|gtm\.js/],
    ["NEXT_PUBLIC_CLARITY_ID", "Clarity", /clarity\.ms/],
    ["NEXT_PUBLIC_META_PIXEL_ID", "Meta Pixel", /fbevents\.js|connect\.facebook\.net/],
  ];
  for (const [variable, label, pattern] of trackers) {
    if (env[variable]) {
      skip(`${label} ausente por defecto`, `${variable} definida`);
    } else {
      check(`${label} no se carga sin ${variable}`, !pattern.test(homeHtml), "");
    }
  }
  if (!env.NEXT_PUBLIC_GTM_ID) {
    check("Sin GTM no hay Consent Mode inyectado", !homeHtml.includes("'consent','default'"), "");
  }

  /* ── /api/leads ── */
  const getLeads = await fetch(`${BASE}/api/leads`);
  check("GET /api/leads responde 405", getLeads.status === 405, `status ${getLeads.status}`);

  const wrongType = await postLead("nombre=x", "application/x-www-form-urlencoded");
  check("POST sin JSON responde 415", wrongType.status === 415, `status ${wrongType.status}`);

  const invalid = await postLead({ name: "", email: "no-es-email", source: "smoke", idempotencyKey: "smoke-invalid-000001" });
  const invalidBody = await invalid.json().catch(() => ({}));
  check(
    "POST inválido responde 400 con errores por campo",
    invalid.status === 400 && Boolean(invalidBody.errors?.email),
    `status ${invalid.status}`,
  );

  const bot = await postLead({
    name: "Persona Prueba",
    email: "prueba@example.com",
    consent: true,
    hp: "spam",
    source: "smoke",
    idempotencyKey: "smoke-honeypot-0000001",
  });
  check("Honeypot lleno responde 400", bot.status === 400, `status ${bot.status}`);

  const valid = {
    name: "Persona Prueba",
    email: "prueba@example.com",
    /* Con teléfono: el lead tiene que ser válido aunque site.leads.requirePhone
       sea true (este proyecto pide WhatsApp obligatorio). */
    phone: "+57 300 000 0000",
    consent: true,
    hp: "",
    source: "smoke",
    idempotencyKey: `smoke-${Date.now()}-valid`,
    attribution: { utm_source: "smoke" },
    pagePath: "/",
  };
  if (env.LEADS_WEBHOOK_URL) {
    skip("Lead válido sin destino → 503", "LEADS_WEBHOOK_URL definida: no se envían datos a un destino real");
  } else {
    const response = await postLead(valid);
    const body = await response.json().catch(() => ({}));
    check(
      "Lead válido sin destino responde 503 (nunca éxito falso)",
      response.status === 503 && body.ok === false,
      `status ${response.status}`,
    );
  }
} catch (error) {
  check("Servidor de producción", false, error instanceof Error ? error.message : String(error));
} finally {
  stopServer();
}

let failed = 0;
for (const { name, ok, detail } of results) {
  const mark = ok === null ? "–" : ok ? "✔" : "✖";
  if (ok === false) failed += 1;
  console.log(`${mark} ${name}${detail ? `  (${detail})` : ""}`);
}
console.log(failed ? `\n${failed} comprobación(es) fallida(s).` : "\nSmoke test aprobado.");
process.exit(failed ? 1 : 0);
