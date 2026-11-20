---
name: verify-crm
description: "Drive the Pi Native CRM Agent–CRM workbench in a browser against a loopback Supabase the run itself started. Use to prove a workbench run, proposal approve/revoke, mission send control, specialist collaboration, or eval/judge — launch, doctor, drive, evidence, cleanup."
---

# Verify the CRM workbench

The surface is the authenticated web UI. The workbench the manager uses is `http://127.0.0.1:$PORT/app/ai/workbench`. The conversation pane is `getByRole('region', { name: 'Agent 对话' })`. Login, onboarding, kanban, and model settings are the same app. Do not prove a journey with `node scripts/serve-agent-demo.mjs` (port 3008): that demo is disconnected from this backend.

The harness is `control-crm` in this directory's `scripts/`. One run owns one loopback stack. A second launch refuses while that app pid is alive, and launch refuses when port `VERIFY_CRM_PORT` (default `3011`) is taken or when `supabase status` already reports a stack. Supabase local is pinned to ports 54321 and 54322 by `supabase/config.toml`, so two stacks cannot share a machine.

Memory stays on `lib/ai/integrations/mem0.ts`. Leave `AI_INTEGRATION_BINDINGS` unset. Do not start `infra/local-agent-services/compose.yml`. With no binding, `readConfirmedCustomerMemory` reports status `local` (provider `disabled`). Status `local_fallback` is what the same function reports when a binding exists and the search fails. Either non-remote status is acceptable for this verification run. Do not add another memory adapter.

## Launch

From the repository root, after `pnpm install`:

```bash
.cursor/skills/verify-crm/scripts/control-crm launch
```

What that command does, in order:

1. Refuses a live instance or a busy port or an already-running Supabase stack.
2. Requires Docker and `node_modules/.bin/next`.
3. Moves `supabase/migrations` aside, runs `supabase start` (CLI `2.117.0` when `supabase` is not on `PATH`), enables `uuid-ossp`, `pgcrypto`, `vector`, `citext`, and `pg_trgm`, applies `supabase/baseline.sql` with `ON_ERROR_STOP`, inserts `private.app_secrets.nuvemshop_oauth_key`, restarts the Realtime container, then puts `supabase/migrations` back. A failed launch restores that directory.
4. Starts Redis `redis:7-alpine` and `serverless-redis-http` published on `127.0.0.1:3998` with `SRH_TOKEN=e2e-placeholder-nao-e-segredo`, matching `scripts/gerar-env-e2e.sh`. Container names are `verify-crm-redis-$RUN_ID` and `verify-crm-srh-$RUN_ID`.
5. `E2E_PORT=$VERIFY_CRM_PORT pnpm e2e:env`, then `pnpm exec tsx scripts/bootstrap-owner.ts`. The owner email, password, and org name are whatever that generated `.env.e2e` contains. Read them at runtime. Do not copy them into the skill or a commit.
6. Seeds the catalog **before** anyone opens the workbench or saves a key:

```bash
OPENCODE_E2E_MODEL_ID=cat-jam-free \
OPENCODE_E2E_DISPLAY_NAME='Cat Jam Free (OpenCode Go)' \
pnpm exec tsx scripts/seed-e2e-catalogo-opencode.ts
```

The default with those variables unset is still `space-bunny-free`. The seed writes `supports_tools: true` through the normal `ai_models` upsert (`ignoreDuplicates: true`) and exits non-zero if that row already exists without tool support. It does not set `is_default_for_provider`. On a fresh database this is the only OpenCode row, so `escolherModeloDoProvedor` can select it when the owner saves the key. This is not a bypass of `POST /api/v1/ai/workbench/runs`.

7. `E2E_PORT=$VERIFY_CRM_PORT pnpm e2e:build`, then `pnpm exec playwright install chromium`. `NEXT_PUBLIC_APP_URL` is baked at build time.
8. `next start --port $PORT --hostname 127.0.0.1` and `tsx workers/agent-worker/main.ts`, both with the exported `.env.e2e` environment plus `OPENCODE_BASE_URL`. When that variable is unset, launch exports `https://opencode.ai/zen/go/v1` so the free key can validate. The product default, when the variable is empty, stays `https://opencode.ai/zen/v1`. `OPENCODE_SESSION` empty sends `x-opencode-session: crm`. `AI_INTEGRATION_BINDINGS` and `INTERNAL_AGENT_RUN_STUB` are unset. Do not use `pnpm worker`: that script loads `.env` and `.env.local`, which can point at a non-local database. Do not write the API key into `.env.e2e`.
9. Ready means `GET /login` returns HTTP 200, not merely that a pid exists. If `supabase start` stops at `Initialising schema` and exits with `LegacyDbSetupError`, launch stops there, restores `supabase/migrations`, and does not leave a database worth driving. That failure means the container applying schema could not open a connection to the database container. Do not point a browser at a port from a previous attempt.

State is `/tmp/verify-crm/$RUN_ID/instance.json`. Teardown is `control-crm cleanup` (also run automatically if launch fails after it has started something).

The model API key is not part of launch. The drive process reads `OPENCODE_API_KEY`, and if that is empty it reads `VERIFY_CRM_MODEL_API_KEY`. Never pass either as an argument and never print them. Actions secrets override `.cursor/skills/verify-crm/opencode.env`. That file's key is in git history permanently; deleting it is not enough, and the owner revokes the key at OpenCode after the proof.

## Doctor

```bash
.cursor/skills/verify-crm/scripts/control-crm doctor
```

Prints one JSON object and exits 0 only when `worth_driving` is true. It does not mutate. Immediately after launch, before the owner saves a key, these reasons are expected and the exit is 2: `org_llm_not_seeded_model`, `credential_missing`. The catalog check must already pass:

- `catalog.provider` is `opencode`
- `catalog.model_id` is `cat-jam-free`
- `catalog.supports_tools` is true
- `catalog.deprecated` is false

If `supports_tools` is missing or false, stop. The workbench preflight returns 422 `model_tool_calling_unsupported` and does not call the model. Re-run the seed. Do not skip the check in the route.

After the drive saves the key, run doctor again. `worth_driving` also requires:

- the app pid from `instance.json` is alive and the process listening on the port is that pid or a descendant
- `GET /login` is 200
- the worker pid is alive
- `organizations.settings.llm.provider` is `opencode` and `default_model` is `cat-jam-free`
- an active `ai_provider_credentials` row for `opencode` has `validated_at` set and `validation_error` null
- `AI_INTEGRATION_BINDINGS` is unset or `[]` on the app process (`memory` is then `local`)

`credential_not_validated` means the run is not worth driving. The product sets `validated_at` only after `validateOpenCodeKey` succeeds. Do not write `validated_at` from SQL.

## Drive

Generic browser commands reuse one persistent profile at `/tmp/verify-crm/$RUN_ID/browser-profile`:

```bash
.cursor/skills/verify-crm/scripts/control-crm browser goto --path /login
.cursor/skills/verify-crm/scripts/control-crm browser fill --id email --value "$OWNER_EMAIL"
.cursor/skills/verify-crm/scripts/control-crm browser click --role button --name "Entrar"
.cursor/skills/verify-crm/scripts/control-crm browser select --id agent-picker --label "CRM 情报员"
.cursor/skills/verify-crm/scripts/control-crm browser snapshot --aria --path /tmp/verify-crm-evidence/$RUN_ID/snap.aria.txt
.cursor/skills/verify-crm/scripts/control-crm browser screenshot --path /tmp/verify-crm-evidence/$RUN_ID/snap.png
```

`browser fill` refuses a `--value` equal to `OPENCODE_API_KEY` or `VERIFY_CRM_MODEL_API_KEY`. The composed journey types the key itself:

```bash
OPENCODE_API_KEY="$OPENCODE_API_KEY" \
  .cursor/skills/verify-crm/scripts/control-crm drive workbench-run
```

That command logs in as the bootstrapped owner (`#email`, `#password`, button `Entrar` or `登录`), and if the app redirects to `/onboarding` it walks the wizard: welcome (`#display_name`, the terms checkbox, `Continuar`), WhatsApp `Pular por enquanto`, setup-ai `#provedor_da_ia` = `opencode` (label OpenCode Zen), `#api_key_da_ia`, `Guardar a chave`, then `Criar e continuar`. Later steps use `Pular por enquanto` or `Pular`, then `Começar a usar` on `/onboarding/done`. It does not click `Pular tudo (DEV)`. It then opens the workbench, selects `CRM 情报员` and `#run-mode` = `inspect`, fills `#agent-task`, and clicks `运行 Agent`.

Per-feature recipes are in `features/`. A recipe that lists two entry points is not verified by driving only one of them.

## Evidence

Proof files go to `/tmp/verify-crm-evidence/$RUN_ID/` and are copied to `/opt/cursor/artifacts/verify-crm/$RUN_ID/`. Cleanup does not delete either tree.

For a passing workbench run, keep:

- a screenshot and ARIA snapshot of the composer **before** `运行 Agent` (`03-before-run`)
- a screenshot and ARIA snapshot of the resulting state (`04-after-run`) showing `运行状态：` and `执行时间线`
- `workbench-run/result.json`

The second view is the `运行详情` sheet, `最近运行`, and the timeline summary — the same signed-in UI, not a test-only endpoint. Exit 0 only when that timeline is visible and the page does not show the preflight copy (`所选模型未在 CRM 目录中声明支持工具调用`, `该模型没有有效凭据`, `先配置组织默认模型`) or `运行错误：`. A model failure stays exit non-zero. Keep the failure screenshots.

## Cleanup

```bash
.cursor/skills/verify-crm/scripts/control-crm cleanup
.cursor/skills/verify-crm/scripts/control-crm cleanup --dry-run
```

Kills the app and worker pids recorded in `instance.json`, removes only the Redis containers and network named for that run id, runs `supabase stop --no-backup` only when this launch started Supabase, and restores `supabase/migrations` if a failed launch still has them aside. It does not kill by process name and does not delete evidence. `--dry-run` prints those actions and does not perform them.

## Helpers

| Command                                                             | Role                                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `.cursor/skills/verify-crm/scripts/control-crm launch`              | Start the isolated stack through a usable `/login`.                                        |
| `.cursor/skills/verify-crm/scripts/control-crm doctor`              | Read-only `worth_driving` JSON.                                                            |
| `.cursor/skills/verify-crm/scripts/control-crm drive workbench-run` | The whole workbench journey: login, onboard, save the key, select `CRM 情报员`, fill, click `运行 Agent` once. |
| `.cursor/skills/verify-crm/scripts/control-crm observe-unreachable` | Open each verified-unreachable screen once and store a screenshot plus the unmet precondition. |
| `.cursor/skills/verify-crm/scripts/control-crm browser …`           | One Playwright action on the persistent profile. Not an extra step on top of `drive workbench-run`. |
| `.cursor/skills/verify-crm/scripts/control-crm cleanup [--dry-run]` | Stop what this run started. `--dry-run` only prints.                                       |
| `.cursor/skills/verify-crm/scripts/control-crm status`              | Print `instance.json`.                                                                     |
| `pnpm exec tsx scripts/verify-crm/cold-start.ts`                    | Read-only gate. Exit 2 prints `stop: do not launch`. Exit 0 prints the one launch command. |

`scripts/doctor.ts`, `scripts/browser.ts`, and `scripts/drive-workbench-run.ts` are the implementations those commands call. Do not invoke them with a hand-built environment that points at a Supabase this run did not start.

## Maintenance and the PR verdict

The daily procedure is [maintain-verify-crm](../maintain-verify-crm/SKILL.md). GitHub Actions runs it from `.github/workflows/verify-crm-maintain.yml` (`17 6 * * *`, repository `helsome/AiNativeCrm` only). The independent verdict after the workflow named `ci` is `.github/workflows/verify-crm-verifier.yml` (`workflow_run`, file on `main`). Green `ci.yml` is not that verdict.

The self-proof before merge is `.github/workflows/verify-crm-pr.yml` (`name: verify-crm-pr`). It runs on `pull_request` when the diff touches `.cursor/skills/verify-crm/**` or `scripts/verify-crm/**`, and on `workflow_dispatch`. Same-repo heads only, `ubuntu-latest`. It runs the default-branch copy of `control-crm` (`VERIFY_CRM_ROOT` is the pull-request checkout). Until that copy exists on the default branch the job exits `blocked: default branch has no control-crm` and does not pass `OPENCODE_API_KEY` to this pull request's script. That copy lands in pull request 13, which merges before this one. Missing `OPENCODE_*` secrets make cold-start exit 2 and the job fails. A pull request that edits that workflow file still defines the job. There is no GitHub Environment: required reviewers are unavailable on this private repository without GitHub Pro.

Model credentials are GitHub Actions secrets named `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`, and `OPENCODE_MODEL`. Those names are empty in `.env.example`. The workflows map them as: `OPENCODE_API_KEY` → `OPENCODE_API_KEY` and `VERIFY_CRM_MODEL_API_KEY` (drive only); `OPENCODE_BASE_URL` → `OPENCODE_BASE_URL`; `OPENCODE_MODEL` → `OPENCODE_MODEL` and `OPENCODE_E2E_MODEL_ID`.
