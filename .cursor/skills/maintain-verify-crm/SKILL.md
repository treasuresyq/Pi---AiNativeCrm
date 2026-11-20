# Manter a verificação do CRM

Procedure for `.cursor/skills/verify-crm`. The harness is `control-crm`. The deterministic close is `scripts/verify-crm/maintain.ts`. The daily trigger is `.github/workflows/verify-crm-maintain.yml`.

This pass edits only `.cursor/skills/verify-crm/` and `.cursor/skills/maintain-verify-crm/`. It does not edit product code. A broken screen is a report, not a patch in this pass.

Source: `uploads/poteto_methodology.md` stage 3, and the maintain-verification skill at <https://raw.githubusercontent.com/cursor/plugins/main/pstack/skills/maintain-verification-skill/SKILL.md>. Where this repository is stricter, this file wins: do not SQL-insert a lead, do not send a real outbound message, and do not treat a missing live pass as `clean`.

## Outcomes

Exactly one of:

- `clean` — index matches the feature files, every feature was driven or recorded `verified-unreachable` with its prerequisite and route, and the diff is empty. No pull request.
- `changed` — the same live pass, and the diff stays inside the two skill directories above. One pull request. Re-read every changed file, then re-drive before pushing.
- `blocked` — say the blocker. No pull request. Exit non-zero. A missing live pass is `blocked` (`live_pass_missing`), never `clean`.

## Triage

- Doc drift: the user-facing map disagrees with the screen. Fix the feature file.
- Harness gap: the screen works and `control-crm` cannot drive it. Fix the harness and re-drive.
- Product gap: the screen is wrong. Report it. Do not edit product code and do not soften the feature file so the gap disappears.

## Pass

0. Read [the verify-crm skill](../verify-crm/SKILL.md) and [features/README.md](../verify-crm/features/README.md). From the repository root run `pnpm exec tsx scripts/verify-crm/cold-start.ts`. `stop: do not launch` means this pass is `blocked` before any live drive. Secrets `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`, and `OPENCODE_MODEL` are already in the environment when the secrets line says `secrets: present`. Do not print them. If one is missing, stop with `blocked`.
1. Index hygiene. `features/README.md` links every feature file. Each feature file has exactly four H2 sections, in order: `Sub-features`, `How to get to it (user POV)`, `Driving it with control-crm`, `Gotchas`. Cited `.ts`, `.tsx`, `.sql`, and `.md` paths exist.
2. Source wave. One read-only subagent per feature file, concurrently. Children do not drive and do not edit. Each returns a summary, the source entry points, drift or none, and one live recipe.
3. Reconcile. Every feature file has a summary. Merge recipes into as few app states as practical. A missing surface needs a concrete source path.
4. Live pass, even when the source wave looks clean. Skip launch when cold-start printed `stop: do not launch` (outcome `blocked`). Otherwise one instance: `control-crm launch` once, then `control-crm doctor` (exit 2 before the key is saved is expected), then `control-crm drive workbench-run`. If launch prints `LegacyDbSetupError` or `timeout expired`, stop. Do not launch a second time. Then `control-crm observe-unreachable`. That opens each of the other four screens once, writes a screenshot, and records the unmet precondition from the page text. Do not paste the prerequisite sentence from `scripts/verify-crm/jornadas.ts`. `fechar` treats that paste (`precondicao` and `rota` equal to the journey table) as `harness_gap`. Do not mark those four passed. Do not insert a lead or a mission. Drive exit 2 after the timeline was visible is `passou` with the note `doctor exited 2 after the timeline was visible`, the same note the PR verdict uses. It is not `harness_gap`. Evidence stays after `control-crm cleanup`. `control-crm cleanup --dry-run` prints the pids, containers, and files it would remove and does not remove them.
5. Close with `pnpm exec tsx scripts/verify-crm/maintain.ts --fechar --drive-exit <n>`. `clean` and `changed` exit 0. `blocked` exits 1.
6. Ship or stop. `changed` is one pull request limited to the two skill directories, re-driven live. `clean` and `blocked` open nothing.

The scheduled workflow runs the secret check, launch, doctor, drive, `observe-unreachable`, and `fechar`. It does not spawn the source-wave subagents: that step is one read-only Cursor subagent per feature file, and GitHub Actions has no Cursor runtime. It does not open the `changed` pull request. That would need `contents: write` and `pull-requests: write` plus a commit, and a schedule with those scopes would commit without the source-wave judgment. `permissions` stay `contents: read`. A person runs the source wave from step 2 and opens the one pull request when the outcome is `changed`. A red run is `blocked`. It is not a green report with an empty live pass.

## Secrets

Model credentials are GitHub Actions repository secrets. The job does not declare a GitHub Environment. The workflow reads exactly `secrets.OPENCODE_API_KEY`, `secrets.OPENCODE_BASE_URL`, and `secrets.OPENCODE_MODEL`. It maps `secrets.OPENCODE_API_KEY` to the environment names `OPENCODE_API_KEY` and `VERIFY_CRM_MODEL_API_KEY` (drive only), `secrets.OPENCODE_BASE_URL` to `OPENCODE_BASE_URL`, and `secrets.OPENCODE_MODEL` to `OPENCODE_MODEL` and `OPENCODE_E2E_MODEL_ID`. The same three names are empty in `.env.example`. For this key, `OPENCODE_BASE_URL` is `https://opencode.ai/zen/go/v1` and `OPENCODE_MODEL` is `cat-jam-free`. The schedule does not run until this workflow file is on the default branch, and only in `helsome/AiNativeCrm`.
