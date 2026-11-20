# Overnight contract — verify-crm

Filled in for `helsome/AiNativeCrm`. Do not renegotiate this file in the session that is running it. Source: `uploads/poteto_methodology.md` stage 8, and <https://raw.githubusercontent.com/cursor/plugins/main/pstack/docs/guide/07-overnight.md>. The loop shape is one change, one check, one [decisions.tsv](./decisions.tsv) row. A change that did not help is discarded. The finish line does not get quieter to declare victory.

## Goal

Keep `.cursor/skills/verify-crm` honest and run the pipeline in [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md) on this repository: daily maintain-verification, encode a repeated mistake only after it has happened twice, an independent non-author verdict on each PR, and user-feedback triage. Product behavior changes only in a session whose report names the product gap and whose diff is outside a maintain pass.

## Done means

All of these are true, or the run has stopped on an escape hatch and written why:

- Stage 3 outcome is exactly one of `clean`, `changed`, or `blocked`. Every feature file under `features/` was read from source and either driven live or recorded `verified-unreachable` with the prerequisite and the route.
- A `changed` PR edits only `.cursor/skills/verify-crm/` and `.cursor/skills/maintain-verify-crm/`, and was re-driven live before it was pushed.
- A product gap is a written report. It is not a product diff in the maintain PR.
- `.github/workflows/verify-crm-verifier.yml` has posted `PASS`, `PASS+NOTES`, or `FAIL` on the PR. Green `ci.yml` is not the text of the verdict. The workflow posts that comment; it does not merge.
- [decisions.tsv](./decisions.tsv) has one row per iteration. No row contains a secret.
- `git status` does not show `.env`, `.env.e2e`, `.env.local`, or a key.

## Fresh worktree and branch

- Until pull request 12 is on `main`, stay on `cursor/verify-crm-skill-41b3`. Do not open a worktree from `origin/main` for this pipeline: that branch does not contain the harness yet.
- After pull request 12 merges, fetch `origin` and add a new worktree from `origin/main` of `helsome/AiNativeCrm`. Do not start from a fork's `main`.
- Name the branch for the task. Do not append a fixed suffix.
- Do not `reset --hard`. Do not force-push `main`. Do not touch a dirty worktree that belongs to another session.
- If the branch is behind `origin/main`, merge `origin/main` in. Do not rebase a branch someone else is using.

## Pre-authorized

These do not need another question:

- `control-crm launch`, `doctor`, `drive`, `browser`, and `cleanup`.
- Export `OPENCODE_API_KEY` into `VERIFY_CRM_MODEL_API_KEY` for the drive process only.
- Export `OPENCODE_BASE_URL` and `OPENCODE_E2E_MODEL_ID` from `OPENCODE_MODEL` as [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#secrets) says.
- Commit and push the task branch. Update the draft pull request.
- Read CI logs. Append rows to `decisions.tsv`.
- During a maintain pass, edit only files under `.cursor/skills/verify-crm/` and `.cursor/skills/maintain-verify-crm/`.
- Do not add a second scheduler. The daily trigger is `.github/workflows/verify-crm-maintain.yml`. The PR verifier is `.github/workflows/verify-crm-verifier.yml`. The pre-merge proof is `.github/workflows/verify-crm-pr.yml`.
- Do not declare a GitHub Environment. Required reviewers are unavailable on this private repository without GitHub Pro. `verify-crm-pr` runs `control-crm` and `scripts/verify-crm` from the default branch only. One-time setup of the three repository secrets is in [HANDOFF.md](./HANDOFF.md): Settings > Secrets and variables > Actions > New repository secret.

## Forbidden

- Never edit an existing file in `supabase/migrations/`. Add a new file with the next free `NNNN` only. Before pushing it, `pnpm checar:colisao-de-migration` must pass. That command is the migration-number conflict check in `.github/workflows/ci.yml`.
- Do not touch inherited base code — Portuguese-commented code, and migrations `0001` through `0380` — unless the written report states why that file has to change.
- Never send a real outbound message (WhatsApp, Feishu, or any other channel). A reply that needs to leave the building stops at draft or pending.
- Never connect to a production database. Local Supabase only. `scripts/gerar-env-e2e.sh` exits 1 and prints `RECUSADO` when `API_URL` or `DB_URL` is not `127.0.0.1`, `localhost`, or `[::1]`. `destinoEhLocal` in `scripts/lib/env-de-teste.ts` classifies the host; `anunciarDestino` warns and does not itself exit. Do not bypass the `RECUSADO` guard.
- Never modify `.github/workflows/release.yml` or `.github/workflows/publish-image.yml`.
- Never print or pass on the command line `OPENCODE_API_KEY` or `VERIFY_CRM_MODEL_API_KEY`. `.cursor/skills/verify-crm/opencode.env` is the fallback when Actions secrets are empty; a non-empty secret wins. The key is in git history permanently. Deleting the file is not enough. The owner must revoke it at OpenCode after the proof.
- Never edit product code during a maintain-verification pass. A product gap is reported and left out of that PR.
- Never post `PASS`, `PASS+NOTES`, or `FAIL` on a PR you authored. Never merge on your own verdict.
- Never set `validated_at` in SQL, click `Pular tudo (DEV)`, start `infra/local-agent-services/compose.yml`, or add a MemoraX adapter. Memory stays on `lib/ai/integrations/mem0.ts` with `AI_INTEGRATION_BINDINGS` unset.
- Never kill a process by name. Cleanup kills the pids this run recorded.

## Escape hatch

Stop, write one `decisions.tsv` row with `result` `blocked`, and do not keep iterating, when any of these is true:

- `supabase start` stops at `Initialising schema` with `LegacyDbSetupError` or `timeout expired`. Launch's ERR trap restores `supabase/migrations` and prints `control-crm: restored supabase/migrations`. Confirm with `git status --porcelain -- supabase/migrations supabase/config.toml` (empty). Do not GET `http://127.0.0.1:3011/login`. Run `pnpm exec tsx scripts/verify-crm/cold-start.ts` first. `stop: do not launch` means this hatch is already open on this machine — do not launch again. `next: .cursor/skills/verify-crm/scripts/control-crm launch` allows one launch, and the second identical failure is this hatch. Do not pass `--network host`. Do not edit `supabase/config.toml`. See [HANDOFF.md](./HANDOFF.md).
- The same command fails the same way twice.
- `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`, or `OPENCODE_MODEL` is missing.
- The finish condition would have to be relaxed to call the run done.
- You are about to take a forbidden action to get unstuck.

A plateau is a pivot to a different allowed change, not a quieter definition of done. A dead end is a stop with a written reason.

## Morning audit

Source: the same overnight guide, section "The morning audit", and `/show-me-your-work` (<https://raw.githubusercontent.com/cursor/plugins/main/pstack/skills/show-me-your-work/SKILL.md>).

The log is [decisions.tsv](./decisions.tsv). Columns, in order: `time`, `phase`, `decision`, `reason`, `evidence`, `result`. `time` is ISO-8601 UTC. `evidence` is a path or a URL, never a secret. `result` is `kept`, `discarded`, or `blocked`.

When you are back:

1. Read the rows whose `result` is `blocked` or `discarded` before the rows marked `kept`. That is the Attention section. Do not start by re-reading the whole night.
2. If a second model family is available, have it read the TSV and the session transcript and add nothing but an Attention list. If it is not available, the human reads Attention first anyway.
3. Check each Attention row's evidence path on disk. A row whose evidence is missing is unaudited.
4. Confirm no secret landed in the TSV, the PR body, or the diff.
5. The template row shipped with this file is the inherited Supabase blocker. It is not a new measurement. Replace nothing; append.

The running log stays in the worktree. Commit new rows only when a reviewer needs the trail to trust the result, and only after the secret check. The header row and the inherited example stay.
