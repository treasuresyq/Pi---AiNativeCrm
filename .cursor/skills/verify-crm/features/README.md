# CRM workbench verification map

This directory is the maintained source for verifying the user-facing Agent–CRM workbench. Read this index, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-crm/scripts/control-crm launch` so the app, worker, Redis pair, and Supabase stack belong to this run.
- The app is usable at `http://127.0.0.1:3011/login` unless `VERIFY_CRM_PORT` says otherwise. Ready means `GET /login` is HTTP 200.
- `scripts/seed-e2e-catalogo-opencode.ts` has already upserted `opencode` / `cat-jam-free` with `supports_tools` true (`OPENCODE_E2E_MODEL_ID=cat-jam-free`). The CI default of that script remains `space-bunny-free` when the variable is unset.
- Launch sets `OPENCODE_BASE_URL` to `https://opencode.ai/zen/go/v1` when it is unset. Empty in the product stays `https://opencode.ai/zen/v1`. Calls send `x-opencode-session` (`crm` when `OPENCODE_SESSION` is empty).
- `control-crm doctor` shows `catalog.supports_tools: true` for `cat-jam-free`. `worth_driving` stays false until the owner has saved a key the product marks validated and `organizations.settings.llm` is `opencode` / `cat-jam-free`.
- `AI_INTEGRATION_BINDINGS` is unset, so customer memory stays on the local path in `lib/ai/integrations/mem0.ts`.
- `OPENCODE_API_KEY` is present only in the drive process. Empty falls back to `VERIFY_CRM_MODEL_API_KEY`. It is never an argument and never a file in the repo. `OPENCODE_MODEL`, when set, is the seed id (`OPENCODE_E2E_MODEL_ID`).
- Never drive an instance this verification run did not start.

## Driving conventions

- Start every recipe from the baseline unless its preconditions say otherwise.
- Prefer ARIA roles, accessible names, and the ids in the feature file over coordinates.
- The workbench chrome is the Chinese copy in `AgentCrmWorkbench.tsx`. Onboarding and login follow the org locale. A fresh `pnpm e2e:env` owner is pt-BR, so the login button is `Entrar`.
- `control-crm drive workbench-run` is the whole workbench journey. The browser lines in that feature file are a breakdown of that command, not extra steps.
- Drive exit 2 after the timeline is visible is the note `doctor exited 2 after the timeline was visible`, not a failed proof. Any other non-zero drive exit is a failed proof. Do not mark a skipped entry point as verified through a different one.
- `control-crm observe-unreachable` opens each other screen once and stores a screenshot plus the unmet precondition read from the page.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot where the workbench region or the login form is visible.
- Mutation proof includes a second read-only view in the same signed-in UI (`最近运行`, the lead title, or the mission line). A direct SQL update is not that view.
- Record the feature id and the entry point with the artifacts.
- Report an unreachable path with the command you ran and the unmet precondition.
- Do not weaken a journey so that it passes. A missing lead, an unvalidated key, or a model error is a failed proof.

## Feature entry contract

Each feature file starts with an H1 and one paragraph, then exactly four H2 sections in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with control-crm`, `Gotchas`.

## Features

- [Workbench run and resumable timeline](./workbench-run.md) — start an inspect run and read the SSE-backed timeline in the workbench.
- [Proposal approve and revoke](./proposal-approve-revoke.md) — approve a pending CRM write and undo a reversible one.
- [Mission pause, resume, and owner direction](./mission-send-and-direction.md) — customer-send gate and a follow-up direction, from the workbench and from the kanban.
- [Expert sub-run collaboration](./expert-collaboration.md) — supervisor run that shows durable specialist sub-runs.
- [Eval results and Judge](./eval-judge.md) — deterministic eval delivery and an explicit semantic Judge.
