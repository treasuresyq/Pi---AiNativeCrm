# Workbench run and resumable timeline

A manager sends one task to a built-in agent and watches that run's status and event timeline update in the workbench. The timeline is the UI over the resumable run events, not a separate admin page.

## Sub-features

- `workbench-open` shows region `Agent 对话` for a manager whose organization has a default model. The page also has a visually hidden heading `Agent–CRM 工作台`; that heading is not the region the drive waits for.
- `workbench-start` creates one inspect run from the composer.
- `workbench-timeline` shows `运行状态：` and `执行时间线` for that run, including a run chosen again from `最近运行`.

## How to get to it (user POV)

- Sign in and open `IA` → the workbench destination `/app/ai/workbench`.
- On a brand-new owner, finish onboarding far enough that the app layout no longer redirects to `/onboarding`, then open the same URL.
- After a run exists, open `运行详情` and choose that task under `最近运行`.

## Driving it with control-crm

Preconditions:

- `control-crm launch` has exited 0 and `control-crm doctor` reports `catalog.supports_tools: true` for `opencode` / `cat-jam-free`.
- `OPENCODE_API_KEY` is set in the environment and is not passed on the command line. Empty falls back to `VERIFY_CRM_MODEL_API_KEY`.
- The built-in agent `CRM 情报员` is listed in `#agent-picker`.
- Doctor may still report `credential_missing` until the key is saved by the command below. Do not start the run while `model_tool_calling_unsupported` is in `reasons`.

The whole journey is one command:

```bash
control-crm drive workbench-run
```

That command logs in, finishes onboarding (including saving the key), selects `CRM 情报员`, fills the task, and clicks `运行 Agent`. It then opens `运行详情` and waits until `执行时间线` is on the page before reading the timeline. Do not run the browser commands as extra steps before or after it. A second click of `运行 Agent` starts a second run.

What that one command does, as a breakdown and not as more steps:

- Sign in on `/login?next=%2Fapp%2Fai%2Fworkbench` with `OWNER_EMAIL` and `OWNER_PASSWORD` from `.env.e2e`, button `Entrar` or `登录`. The next URL is `/onboarding/welcome` or `/app/ai/workbench`.
- When the URL is still under `/onboarding`, walk the wizard: `#display_name`, the terms checkbox, `Continuar`, `Pular por enquanto` on WhatsApp, `#provedor_da_ia` value `opencode`, `#api_key_da_ia`, `Guardar a chave`, and `Criar e continuar`. It does not click `Pular tudo (DEV)`. Login can show `/app/ai/workbench` before the layout redirects to `/onboarding`; the command waits until `#display_name` or the conversation region is visible before choosing. The workbench region `Agent 对话` is visible when this part finishes.
- Select `#agent-picker` label `CRM 情报员` and `#run-mode` value `inspect` (`只读检查`).
- Fill `#agent-task` with `Liste o que você consegue ler nesta organização vazia, sem alterar nada.` The button `运行 Agent` is enabled, and the command clicks it once.
- Open `运行详情`, wait for the text `执行时间线`, then read it. The summary reads `执行时间线 · N 条事件` with N at least 1, and `最近运行` lists the same task.
- Evidence is `03-before-run` and `04-after-run` under `/tmp/verify-crm-evidence/$RUN_ID/workbench-run/`. The command runs doctor again after the timeline is visible. `worth_driving` is true only when the credential is validated and the org model is `cat-jam-free`. Doctor exit 2 at that point, with `运行状态：` and `执行时间线` already on the page, is the note `doctor exited 2 after the timeline was visible`. It is not a second journey.

## Gotchas

- Launch seeds `cat-jam-free` before the first visit and before `Guardar a chave`. If the catalog row is missing, saving the key keeps the previous organization model (`sem_modelo_no_catalogo`) and the preflight returns 422 `model_not_configured` or `model_tool_calling_unsupported`. Doctor must show `supports_tools: true` before the click. The seed refuses to overwrite a row that already exists without tool support.
- `POST /api/v1/ai/workbench/runs` returns 422 `model_credentials_missing` when `validated_at` is null, and 503 `model_configuration_unavailable` when config cannot be read. No model request is made. Do not set `validated_at` in SQL and do not set `INTERNAL_AGENT_RUN_STUB`.
- Launch exports `OPENCODE_BASE_URL=https://opencode.ai/zen/go/v1` when that variable is unset. The credential validator and the Pi adapter both read it (empty stays `https://opencode.ai/zen/v1`) and send `x-opencode-session` (`OPENCODE_SESSION`, or `crm` when empty). The providers screen still does not accept a custom OpenCode base URL. A run that shows `该模型没有有效凭据` means `validated_at` is still null — wait for validation, do not write it in SQL.
- The worker pid must stay alive. A timeline that never grows past the queued event is not a completed proof.
- `AI_INTEGRATION_BINDINGS` stays unset, so memory status is `local`, not a remote Mem0 hit. `local_fallback` would mean a binding exists and search failed. Do not start the local agent-services compose for this run. Feishu (`向飞书同事提问`) and WeKnora are not configured here and are not part of this proof.
- A fresh baseline has no demo lead. This inspect run does not need one. Do not point the browser at the disconnected demo server on port 3008.
