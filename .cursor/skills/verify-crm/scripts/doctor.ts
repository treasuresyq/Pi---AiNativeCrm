/**
 * Read-only: is the instance this run started worth driving?
 * Prints one JSON object. Never prints secrets, database URLs, or API keys.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import pg from "pg";

interface Instance {
  runId: string;
  port: number;
  baseUrl: string;
  appPid: number;
  workerPid: number;
  modelId: string;
  provider: string;
}

function alive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function isDescendant(pid: number, ancestor: number): boolean {
  let current = pid;
  for (let hop = 0; hop < 8; hop += 1) {
    if (current === ancestor) return true;
    try {
      const status = fs.readFileSync(`/proc/${current}/status`, "utf8");
      const parent = Number(/^PPid:\s+(\d+)/m.exec(status)?.[1] ?? 0);
      if (!parent || parent === current) return false;
      current = parent;
    } catch {
      return false;
    }
  }
  return false;
}

function envValue(pid: number, key: string): string | null {
  try {
    const raw = fs.readFileSync(`/proc/${pid}/environ`);
    const parts = raw.toString("utf8").split("\0");
    const hit = parts.find((row) => row.startsWith(`${key}=`));
    if (!hit) return null;
    return hit.slice(key.length + 1);
  } catch {
    return null;
  }
}

function bindingState(pid: number): "unset" | "empty" | "configured" | "unreadable" {
  if (!alive(pid)) return "unreadable";
  const value = envValue(pid, "AI_INTEGRATION_BINDINGS");
  if (value === null) return "unset";
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "[]") return "empty";
  return "configured";
}

function loadDbUrl(root: string): string {
  const file = path.join(root, ".env.e2e");
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    const match = /^\s*SUPABASE_DB_URL=(.*)$/.exec(line);
    if (match?.[1]) return match[1].replace(/^"(.*)"$/, "$1").trim();
  }
  throw new Error("SUPABASE_DB_URL missing from .env.e2e");
}

async function main(): Promise<void> {
  const instancePath = process.env.VERIFY_CRM_INSTANCE;
  const root = process.env.VERIFY_CRM_ROOT;
  if (!instancePath || !root) throw new Error("VERIFY_CRM_INSTANCE and VERIFY_CRM_ROOT are required");
  const instance = JSON.parse(fs.readFileSync(instancePath, "utf8")) as Instance;
  const reasons: string[] = [];
  const appAlive = alive(instance.appPid);
  const workerAlive = alive(instance.workerPid);
  if (!appAlive) reasons.push("app_pid_dead");
  if (!workerAlive) reasons.push("worker_pid_dead");

  let loginStatus = 0;
  try {
    const code = execFileSync(
      "curl",
      ["-s", "-o", "/dev/null", "-w", "%{http_code}", `${instance.baseUrl}/login`],
      { encoding: "utf8" },
    ).trim();
    loginStatus = Number(code);
  } catch {
    loginStatus = 0;
  }
  if (loginStatus !== 200) reasons.push("login_not_ready");

  let listenerPid: number | null = null;
  try {
    const ss = execFileSync("ss", ["-ltnp"], { encoding: "utf8" });
    const line = ss.split("\n").find((row) => row.includes(`:${instance.port}`) && row.includes("pid="));
    const match = line ? /pid=(\d+)/.exec(line) : null;
    listenerPid = match ? Number(match[1]) : null;
  } catch {
    listenerPid = null;
  }
  const portOwnedByUs =
    listenerPid !== null && (listenerPid === instance.appPid || isDescendant(listenerPid, instance.appPid));
  if (listenerPid === null) reasons.push("port_owner_unreadable");
  else if (!portOwnedByUs) reasons.push("port_not_owned_by_this_run");

  const bindings = bindingState(instance.appPid);
  if (bindings === "configured") reasons.push("integration_bindings_set");
  if (bindings === "unreadable") reasons.push("app_environ_unreadable");

  const pool = new pg.Pool({ connectionString: loadDbUrl(root) });
  let catalog: { supports_tools: boolean; deprecated: boolean } | null = null;
  let orgLlm: { provider: string | null; model: string | null } = { provider: null, model: null };
  let credential: { validated: boolean; validation_error: string | null } | null = null;
  try {
    const model = await pool.query<{ supports_tools: boolean; deprecated: boolean }>(
      `select supports_tools, deprecated_at is not null as deprecated
         from ai_models where provider = $1 and model_id = $2`,
      [instance.provider, instance.modelId],
    );
    catalog = model.rows[0] ?? null;
    if (!catalog) reasons.push("catalog_row_missing");
    else if (!catalog.supports_tools) reasons.push("model_tool_calling_unsupported");
    else if (catalog.deprecated) reasons.push("model_deprecated");

    const org = await pool.query<{ provider: string | null; model: string | null }>(
      `select settings#>>'{llm,provider}' as provider,
              settings#>>'{llm,default_model}' as model
         from organizations
        order by created_at asc
        limit 1`,
    );
    orgLlm = org.rows[0] ?? orgLlm;
    if (orgLlm.provider !== instance.provider || orgLlm.model !== instance.modelId) {
      reasons.push("org_llm_not_seeded_model");
    }

    const cred = await pool.query<{ validated: boolean; validation_error: string | null }>(
      `select validated_at is not null as validated, validation_error
         from ai_provider_credentials
        where provider = $1 and is_active = true
        order by created_at desc
        limit 1`,
      [instance.provider],
    );
    credential = cred.rows[0] ?? null;
    if (!credential) reasons.push("credential_missing");
    else if (!credential.validated || credential.validation_error) reasons.push("credential_not_validated");
  } finally {
    await pool.end();
  }

  const worth = reasons.length === 0;
  const report = {
    worth_driving: worth,
    reasons,
    run_id: instance.runId,
    base_url: instance.baseUrl,
    login_status: loginStatus,
    port_owned_by_us: portOwnedByUs,
    worker_alive: workerAlive,
    catalog: catalog
      ? {
          provider: instance.provider,
          model_id: instance.modelId,
          supports_tools: catalog.supports_tools,
          deprecated: catalog.deprecated,
        }
      : null,
    org_llm: orgLlm,
    credential: credential
      ? { validated: credential.validated, validation_error: credential.validation_error }
      : null,
    integration_bindings: bindings,
    memory: bindings === "unset" || bindings === "empty" ? "local" : "binding_configured",
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(worth ? 0 : 2);
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "doctor_failed";
  process.stderr.write(`control-crm doctor: ${message}\n`);
  process.exit(1);
});
