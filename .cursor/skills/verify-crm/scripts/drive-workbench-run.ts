/**
 * Real UI path for one workbench inspect run.
 * Login and onboarding use the screens a new owner sees. The model key is read
 * from OPENCODE_API_KEY (or VERIFY_CRM_MODEL_API_KEY when that is empty)
 * and never printed.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, type Page } from "playwright";

import { chaveDoModelo } from "../../../../scripts/verify-crm/credenciais";

interface Instance {
  runId: string;
  baseUrl: string;
  modelId: string;
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

async function shot(page: Page, evidence: string, artifact: string, name: string): Promise<void> {
  const png = await page.screenshot({ fullPage: true });
  const aria = await page.locator("body").ariaSnapshot();
  for (const root of [evidence, artifact]) {
    const dir = path.join(root, "workbench-run");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${name}.png`), png);
    fs.writeFileSync(path.join(dir, `${name}.aria.txt`), aria);
  }
}

async function clickNamed(page: Page, name: string): Promise<void> {
  await page.getByRole("button", { name }).click();
}

async function onboard(page: Page, orgName: string): Promise<void> {
  const key = chaveDoModelo(process.env);
  for (let step = 0; step < 12; step += 1) {
    const url = page.url();
    if (url.includes("/app/") && !url.includes("/onboarding")) return;
    if (url.includes("/onboarding/welcome")) {
      await page.locator("#display_name").fill(orgName);
      const about = page.locator("#o_que_faz");
      if (await about.count()) {
        const current = await about.inputValue();
        if (current.trim().length < 2) await about.fill("Loja de verificacao");
      }
      await page.getByRole("checkbox").check();
      await clickNamed(page, "Continuar");
      await page.waitForURL(/\/onboarding\/(?!welcome)/, { timeout: 30_000 });
      continue;
    }
    if (url.includes("/onboarding/connect-whatsapp")) {
      await clickNamed(page, "Pular por enquanto");
      await page.waitForURL(/\/onboarding\/(?!connect-whatsapp)/, { timeout: 30_000 });
      continue;
    }
    if (url.includes("/onboarding/setup-ai")) {
      const keyField = page.locator("#api_key_da_ia");
      if (await keyField.count()) {
        await page.locator("#provedor_da_ia").selectOption("opencode");
        await keyField.fill(key);
        await clickNamed(page, "Guardar a chave");
        await page
          .getByText(/Chave guardada|cérebro dele|cerebro dele/i)
          .waitFor({ timeout: 30_000 });
      }
      await clickNamed(page, "Criar e continuar");
      await page.waitForURL(/\/onboarding\/(?!setup-ai)/, { timeout: 60_000 }).catch(async () => {
        const draft = page.getByRole("button", { name: "Continuar sem publicar" });
        if (await draft.count()) await draft.click();
      });
      continue;
    }
    if (
      url.includes("/onboarding/funil") ||
      url.includes("/onboarding/connect-nuvemshop") ||
      url.includes("/onboarding/invite-team")
    ) {
      await clickNamed(page, "Pular por enquanto");
      await page.waitForLoadState("domcontentloaded");
      continue;
    }
    if (url.includes("/onboarding/testar")) {
      await clickNamed(page, "Pular");
      await page.waitForLoadState("domcontentloaded");
      continue;
    }
    if (url.includes("/onboarding/done")) {
      await clickNamed(page, "Começar a usar");
      await page.waitForURL(/\/app\//, { timeout: 30_000 });
      return;
    }
    return;
  }
}

async function main(): Promise<void> {
  const instancePath = process.env.VERIFY_CRM_INSTANCE;
  const root = process.env.VERIFY_CRM_ROOT;
  const evidence = process.env.VERIFY_CRM_EVIDENCE;
  const artifact = process.env.VERIFY_CRM_ARTIFACT;
  if (!instancePath || !root || !evidence || !artifact)
    throw new Error("verification paths are required");
  const info = JSON.parse(fs.readFileSync(instancePath, "utf8")) as Instance;
  const env = readEnvFile(root);
  const email = env.OWNER_EMAIL;
  const password = env.OWNER_PASSWORD;
  const orgName = env.OWNER_ORG_NAME;
  if (!email || !password || !orgName) throw new Error("owner identity missing from .env.e2e");

  const profile = path.join("/tmp/verify-crm", info.runId, "browser-profile");
  fs.mkdirSync(profile, { recursive: true });
  const context = await chromium.launchPersistentContext(profile, {
    headless: true,
    viewport: { width: 1280, height: 800 },
  });
  const page = context.pages()[0] ?? (await context.newPage());
  let exitCode = 1;
  try {
    await page.goto(`${info.baseUrl}/login?next=%2Fapp%2Fai%2Fworkbench`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("#email").fill(email);
    await page.locator("#password").fill(password);
    await shot(page, evidence, artifact, "01-login");
    await page.getByRole("button", { name: /Entrar|登录/ }).click();
    await page.waitForURL(/\/(onboarding|app)\//, { timeout: 30_000 });
    await shot(page, evidence, artifact, "02-after-login");
    // Login can commit /app/ai/workbench before the app layout redirects an
    // owner with onboarded_at null to /onboarding. The conversation region is
    // not in that document. Wait until one of the two screens is actually up.
    const conversa = page.getByRole("region", { name: "Agent 对话" });
    await conversa.or(page.locator("#display_name")).first().waitFor({ timeout: 30_000 });
    if (page.url().includes("/onboarding")) await onboard(page, orgName);
    if (!page.url().includes("/app/ai/workbench")) {
      await page.goto(`${info.baseUrl}/app/ai/workbench`, { waitUntil: "domcontentloaded" });
    }
    await conversa.waitFor({ timeout: 30_000 });
    await page.locator("#agent-picker").selectOption({ label: "CRM 情报员" });
    await page.locator("#run-mode").selectOption("inspect");
    const task = "Liste o que você consegue ler nesta organização vazia, sem alterar nada.";
    await page.locator("#agent-task").fill(task);
    await shot(page, evidence, artifact, "03-before-run");
    await page.getByRole("button", { name: "运行 Agent" }).click();
    const outcome = page.getByText(
      /运行状态：|所选模型未在 CRM 目录中声明支持工具调用|该模型没有有效凭据|运行错误：/,
    );
    await outcome.first().waitFor({ timeout: 90_000 });
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: /运行详情/ }).click();
    const timeline = page.getByText("执行时间线").first();
    await timeline.waitFor({ timeout: 30_000 });
    await timeline.click();
    await shot(page, evidence, artifact, "04-after-run");
    const body = await page.locator("body").innerText();
    const blocked =
      body.includes("所选模型未在 CRM 目录中声明支持工具调用") ||
      body.includes("该模型没有有效凭据") ||
      body.includes("运行错误：") ||
      body.includes("先配置组织默认模型");
    const started = body.includes("运行状态：") && body.includes("执行时间线");
    fs.writeFileSync(
      path.join(evidence, "workbench-run", "result.json"),
      JSON.stringify({ blocked, started, url: page.url() }, null, 2),
    );
    fs.copyFileSync(
      path.join(evidence, "workbench-run", "result.json"),
      path.join(artifact, "workbench-run", "result.json"),
    );
    if (started && !blocked) exitCode = 0;
  } catch (error) {
    await shot(page, evidence, artifact, "99-drive-failed").catch(() => undefined);
    throw error;
  } finally {
    await context.close();
  }
  try {
    const doctor = path.join(path.dirname(fileURLToPath(import.meta.url)), "doctor.ts");
    execFileSync("pnpm", ["exec", "tsx", doctor], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
  } catch {
    if (exitCode === 0) exitCode = 2;
  }
  process.exit(exitCode);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "drive_failed";
  process.stderr.write(`control-crm drive: ${message}\n`);
  process.exit(1);
});
