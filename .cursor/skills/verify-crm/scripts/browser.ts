/**
 * Persistent Playwright session for one verification run.
 * The profile lives under the run state dir. Evidence paths are copied to the
 * artifact dir. The model API key is never accepted as an argument.
 */
import fs from "node:fs";
import path from "node:path";

import { chromium, type Page } from "playwright";

import { valorEhChaveDeModelo } from "../../../../scripts/verify-crm/credenciais";

interface Instance {
  runId: string;
  baseUrl: string;
}

function instance(): Instance {
  const file = process.env.VERIFY_CRM_INSTANCE;
  if (!file) throw new Error("VERIFY_CRM_INSTANCE is required");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Instance;
}

function profileDir(runId: string): string {
  return path.join("/tmp/verify-crm", runId, "browser-profile");
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function requireArg(name: string): string {
  const value = arg(name);
  if (!value) throw new Error(`missing ${name}`);
  return value;
}

async function withPage(run: (page: Page, baseUrl: string) => Promise<void>): Promise<void> {
  const info = instance();
  fs.mkdirSync(profileDir(info.runId), { recursive: true });
  const context = await chromium.launchPersistentContext(profileDir(info.runId), {
    headless: true,
    viewport: { width: 1280, height: 800 },
  });
  const page = context.pages()[0] ?? (await context.newPage());
  try {
    await run(page, info.baseUrl);
  } finally {
    await context.close();
  }
}

function writeProof(target: string, body: string | Buffer): void {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
  const artifactRoot = process.env.VERIFY_CRM_ARTIFACT;
  const evidenceRoot = process.env.VERIFY_CRM_EVIDENCE;
  if (artifactRoot && evidenceRoot && target.startsWith(evidenceRoot)) {
    const copy = path.join(artifactRoot, path.relative(evidenceRoot, target));
    fs.mkdirSync(path.dirname(copy), { recursive: true });
    fs.writeFileSync(copy, body);
  }
}

async function main(): Promise<void> {
  const command = process.argv[2];
  if (!command) throw new Error("browser command required");
  await withPage(async (page, baseUrl) => {
    if (command === "goto") {
      const route = requireArg("--path");
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      return;
    }
    if (command === "click") {
      const role = requireArg("--role") as "button" | "link";
      const name = requireArg("--name");
      await page.getByRole(role, { name }).click();
      return;
    }
    if (command === "fill") {
      const label = arg("--label");
      const id = arg("--id");
      const value = requireArg("--value");
      if (valorEhChaveDeModelo(value, process.env)) {
        throw new Error(
          "refusing to pass the model key through --value; the drive script reads the env",
        );
      }
      const locator = id ? page.locator(`#${id}`) : page.getByLabel(label ?? "");
      await locator.fill(value);
      return;
    }
    if (command === "select") {
      const id = arg("--id");
      const label = arg("--label");
      const value = arg("--value");
      const option = arg("--option");
      const locator = id ? page.locator(`#${id}`) : page.getByLabel(label ?? "");
      if (id && label) await locator.selectOption({ label });
      else if (option) await locator.selectOption({ label: option });
      else if (value) await locator.selectOption(value);
      else throw new Error("select needs --label, --option, or --value");
      return;
    }
    if (command === "check") {
      await page.getByRole("checkbox").first().check();
      return;
    }
    if (command === "snapshot") {
      const target = requireArg("--path");
      const body = await page.locator("body").ariaSnapshot();
      writeProof(target, body);
      return;
    }
    if (command === "screenshot") {
      const target = requireArg("--path");
      const png = await page.screenshot({ fullPage: true });
      writeProof(target, png);
      return;
    }
    throw new Error(`unknown browser command ${command}`);
  });
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "browser_failed";
  process.stderr.write(`control-crm browser: ${message}\n`);
  process.exit(1);
});
