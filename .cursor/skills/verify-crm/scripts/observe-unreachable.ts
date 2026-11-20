/**
 * Opens each verified-unreachable screen once. Stores a screenshot and the
 * unmet precondition taken from the page text. Does not copy jornadas.ts,
 * does not start a run, does not click Judge, and does not insert a lead.
 */
import fs from "node:fs";
import path from "node:path";

import { chromium, type Page } from "playwright";

import {
  precondicaoObservada,
  TELAS_PARA_ABRIR,
  type ObservacaoGravada,
} from "../../../../scripts/verify-crm/observar";

interface Instance {
  runId: string;
  baseUrl: string;
}

function readEnvFile(root: string): Record<string, string> {
  const out: Record<string, string> = {};
  const text = fs.readFileSync(path.join(root, ".env.e2e"), "utf8");
  for (const line of text.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)=(.*)$/.exec(line);
    if (!match?.[1]) continue;
    out[match[1]] = (match[2] ?? "").replace(/^"(.*)"$/, "$1");
  }
  return out;
}

async function garantirSessao(
  page: Page,
  baseUrl: string,
  env: Record<string, string>,
): Promise<void> {
  await page.goto(`${baseUrl}/app/ai/workbench`, { waitUntil: "domcontentloaded" });
  if (!page.url().includes("/login")) return;
  const email = env.OWNER_EMAIL;
  const password = env.OWNER_PASSWORD;
  if (!email || !password) throw new Error("owner identity missing from .env.e2e");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /Entrar|登录/ }).click();
  await page.waitForURL(/\/(onboarding|app)\//, { timeout: 30_000 });
}

async function main(): Promise<void> {
  const instancePath = process.env.VERIFY_CRM_INSTANCE;
  const root = process.env.VERIFY_CRM_ROOT;
  const evidence = process.env.VERIFY_CRM_EVIDENCE;
  const artifact = process.env.VERIFY_CRM_ARTIFACT;
  if (!instancePath || !root || !evidence || !artifact) {
    throw new Error("verification paths are required");
  }
  const info = JSON.parse(fs.readFileSync(instancePath, "utf8")) as Instance;
  const env = readEnvFile(root);
  const profile = path.join("/tmp/verify-crm", info.runId, "browser-profile");
  fs.mkdirSync(profile, { recursive: true });
  const destino = path.join(evidence, "unreachable");
  const copia = path.join(artifact, "unreachable");
  fs.mkdirSync(destino, { recursive: true });
  fs.mkdirSync(copia, { recursive: true });
  const context = await chromium.launchPersistentContext(profile, {
    headless: true,
    viewport: { width: 1280, height: 800 },
  });
  const page = context.pages()[0] ?? (await context.newPage());
  try {
    await garantirSessao(page, info.baseUrl, env);
    for (const tela of TELAS_PARA_ABRIR) {
      await page.goto(`${info.baseUrl}${tela.caminho}`, { waitUntil: "domcontentloaded" });
      const texto = await page.locator("body").innerText();
      const png = await page.screenshot({ fullPage: true });
      const arquivo = path.join(destino, `${tela.id}.png`);
      fs.writeFileSync(arquivo, png);
      fs.writeFileSync(path.join(copia, `${tela.id}.png`), png);
      const observacao: ObservacaoGravada = {
        id: tela.id,
        url: page.url(),
        screenshot: arquivo,
        precondicaoObservada: precondicaoObservada(page.url(), texto),
      };
      const json = `${JSON.stringify(observacao, null, 2)}\n`;
      fs.writeFileSync(path.join(destino, `${tela.id}.json`), json);
      fs.writeFileSync(path.join(copia, `${tela.id}.json`), json);
    }
  } finally {
    await context.close();
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "observe_failed";
  process.stderr.write(`control-crm observe: ${message}\n`);
  process.exit(1);
});
