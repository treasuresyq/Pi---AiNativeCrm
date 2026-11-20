# Handoff — verify-crm

Start here. Then read [OVERNIGHT_CONTRACT.md](./OVERNIGHT_CONTRACT.md) and do not renegotiate it. The pipeline steps are in [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md). The handbook `uploads/poteto_methodology.md` is an owner copy and is not in git. Do not block on finding it. The committed sources are the links in the pipeline prompt.

Skill and harness: [SKILL.md](./SKILL.md). From the repository root the harness is `.cursor/skills/verify-crm/scripts/control-crm` (it is not on `PATH`).

## Where to start

Run this from the repository root. It does not start Supabase, does not print a secret, and does not append [decisions.tsv](./decisions.tsv).

```bash
pnpm exec tsx scripts/verify-crm/cold-start.ts
```

Exit 0 prints `next: .cursor/skills/verify-crm/scripts/control-crm launch`. That is permission for one launch on a machine that does not already hold the inherited failure log. Exit 2 prints `stop: do not launch`. Do not launch, do not drive, and do not skip to a product edit.

Read every line it prints. The meanings are:

| Line                                                         | Meaning                                                                                                                                                        |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch: <name>`                                             | Whatever `git branch --show-current` says. The snapshot below can be stale. Do not assume the name.                                                            |
| `secrets: present`                                           | The three names are non-empty in this process.                                                                                                                 |
| `secrets: blocked: missing NAME`                             | Stop. Append one [decisions.tsv](./decisions.tsv) row with `result` `blocked` and that line as `reason`. Do not put a value in the row.                        |
| `port 3011: free`                                            | `ss -ltn` showed nothing listening. `VERIFY_CRM_PORT` defaults to 3011.                                                                                        |
| `port 3011: free (ss missing; /dev/tcp)`                     | `ss` is not installed. Bash `echo >/dev/tcp/127.0.0.1/3011` refused the connection, the same probe `control-crm` uses. A connection that opens is `in use`.    |
| `port 3011: in use — do not GET http://127.0.0.1:3011/login` | That listener is not yours. Launch would also refuse it.                                                                                                       |
| `migrations: match git (disk=N git=N)`                       | `supabase/migrations` matches `git ls-files` and `supabase/config.toml` is clean. `N` is measured, not a frozen count.                                         |
| `migrations: dirty`                                          | Restore the directory before anything else. See the bridge section.                                                                                            |
| `workflows on origin/main: absent`                           | `schedule` and `workflow_run` do not exist on the default branch yet. Do not dispatch a workflow to create secrets.                                            |
| `workflows on origin/main: present`                          | The files are on `origin/main`. They still do nothing until a human has added the three secrets.                                                               |
| `inherited log: LegacyDbSetupError at …`                     | This machine already failed. `stop: do not launch` is the whole next step.                                                                                     |
| `inherited log: missing`                                     | The decisions row's evidence is not on this disk, so the row is unaudited. This line alone does not allow a launch.                                            |
| `one launch is allowed`                                      | Printed only on exit 0, next to `next: .cursor/skills/verify-crm/scripts/control-crm launch`. Any other stop omits it.                                          |
| `github secrets: permission denied`                          | This token cannot list Actions secrets. That is a human gap. It does not, by itself, forbid one local launch when the process env already has the three names. |
| `host networking: no flag`                                   | Do not invent `supabase start --network host`. Do not edit `supabase/config.toml`.                                                                             |
| `remote postgres: … RECUSADO`                                | Do not point the suite at a hosted database.                                                                                                                   |

The same secret check, alone:

```bash
pnpm exec tsx scripts/verify-crm/maintain.ts --exigir-segredos
```

stdout `secrets present` and exit 0 means the three names are set in this process. Stderr `blocked: missing NAME` and exit 2 means at least one is empty after trim. The value is never printed. An empty string counts as missing. This checks the process environment, not the GitHub Actions secret store.

## Supabase docker bridge

`control-crm launch` on the machine that produced the inherited row exited 1. `supabase start` printed `Initialising schema...` and then:

```text
{"_tag":"Error","error":{"code":"LegacyDbSetupError","message":"error running container: exit 1"}}
```

A later local experiment that turned Realtime off in `supabase/config.toml` was reverted and is not in the diff. Schema init then failed with `Error: timeout expired`, and the CLI pruned the database volume and `supabase_network_pi-native-crm`. A Redis container on that machine answered `PING` inside itself and timed out when another container on a user-defined bridge tried to reach it by alias. The schema container dies the same way: it cannot open a connection to the database container. That is not a CRM schema bug.

Logs from that machine, not in git: `/opt/cursor/artifacts/verify-crm/blocked-launch/` (`verify-crm-launch.log`, `verify-crm-launch2.log`, `verify-crm-launch3.log`, `supabase-start-debug.log`, `supabase-start-debug2.log`). `supabase-start-debug2.log` is the timeout after the reverted Realtime edit. If `verify-crm-launch.log` is missing, cold-start says the inherited row is unaudited. Do not treat a missing log as permission to point at hosted Postgres, and do not treat the inherited row as a reason to skip the one allowed launch on a different machine.

Confirm the tree before and after any launch:

```bash
git status --porcelain -- supabase/migrations supabase/config.toml
git ls-files 'supabase/migrations/*.sql' | wc -l
find supabase/migrations -maxdepth 1 -name '*.sql' | wc -l
```

Expected when restored: the porcelain command prints nothing, and the two counts are the same positive number. Launch's ERR trap moves `supabase/migrations` aside and puts it back; the restore line is `control-crm: restored supabase/migrations`. A nested `supabase/migrations/migrations-off-repro` means a botched repro. Cold-start treats that directory as dirty. Do not `supabase start` while the count on disk is 0.

Do not GET `http://127.0.0.1:3011/login` after a failed launch. Ready is that URL returning HTTP 200, and a failed `supabase start` does not get that far. If the port is taken, launch exits 1 with `control-crm: port 3011 is already in use. Refusing to drive an instance this run did not start.` If `supabase status` already reports a stack, launch exits 1 with `control-crm: a Supabase stack is already running. This skill refuses to share it.`

`control-crm doctor` with no instance exits 1 and prints `control-crm: no instance. Run launch first.`

Host networking was not tried because neither `control-crm` nor `supabase start` accepts `--network host`. Do not pass that flag. Do not edit `supabase/config.toml` to disable Realtime: that retry already timed out and was reverted.

`scripts/gerar-env-e2e.sh` exits 1 and prints `RECUSADO` when `API_URL` or `DB_URL` is not `127.0.0.1`, `localhost`, or `[::1]`. `destinoEhLocal` in `scripts/lib/env-de-teste.ts` classifies the host. `anunciarDestino` warns and does not itself exit. Do not bypass the `RECUSADO` guard.

Stop conditions, in order:

1. Cold-start printed `stop: do not launch`. Outcome of stage 3 is `blocked`. Do not mark a feature verified.
2. Cold-start printed `next: .cursor/skills/verify-crm/scripts/control-crm launch`. Run launch once. If stderr contains `LegacyDbSetupError` or `timeout expired` after `Initialising schema`, stop. Confirm migrations with the porcelain command. Do not launch a second time. Do not drive the port. Append one decisions row, `result` `blocked`, evidence the launch log path you just wrote (under `/tmp` or `/opt/cursor/artifacts/verify-crm`), never a secret.
3. The same command fails the same way twice. That includes a second launch on a machine that already has the inherited log.
4. A missing `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`, or `OPENCODE_MODEL` in the process. Stop before launch.

GitHub-hosted `ubuntu-latest` is a different machine. `.github/workflows/e2e.yml` already runs `supabase start` there. A red maintain job on that runner, after the workflow file is on `main` and a human has added the secrets, is a new measurement. It is not this VM's bridge failure, and it is not a reason to edit product code inside the maintain pass.

## Closing a maintain pass

From the repository root, after a drive (or after you have decided there will be no drive):

```bash
pnpm exec tsx scripts/verify-crm/maintain.ts --fechar --drive-exit N
```

`N` is the exit code of `control-crm drive workbench-run`. Exit 0 of `maintain.ts` is `clean` or `changed`. Exit 1 is `blocked`. One JSON object on stdout. Without `workbench-run/result.json` the object is:

```json
{
  "desfecho": "blocked",
  "classe": "harness_gap",
  "motivos": ["workbench-run: live fail (result.json missing)"]
}
```

That is not `clean`. A missing live pass (`aoVivo` null, which this CLI does not emit when `--drive-exit` is present) is `blocked` / `live_pass_missing`. Evidence defaults: `/tmp/verify-crm-evidence/$RUN_ID/workbench-run/result.json` with `started`, `blocked`, and `url`. The workflows set both evidence and artifact roots to `/tmp`. Do not leave evidence inside the repo: `fechar` treats those paths as a product diff.

## Current state

Branch snapshot when this file was written: `cursor/verify-crm-skill-41b3`. Draft pull request: <https://github.com/helsome/AiNativeCrm/pull/12> (base `main`). Trust `git branch --show-current`, not this sentence, if they disagree.

What is in the tree:

- Verification skill, feature map (five features), and `control-crm` (launch, doctor, drive, cleanup).
- OpenCode base URL is `OPENCODE_BASE_URL`. Empty stays `https://opencode.ai/zen/v1`. Launch exports `https://opencode.ai/zen/go/v1` when the variable is unset. The credential validator (`validateOpenCodeKey`), the Pi adapter (`resolvePiModel`), the auxiliary provider factory, and the credit probe send `x-opencode-session` (`OPENCODE_SESSION`, or `crm` when empty).
- Catalog seed `scripts/seed-e2e-catalogo-opencode.ts` writes `supports_tools: true`. Default model id without `OPENCODE_E2E_MODEL_ID` remains `space-bunny-free`.
- Unit proof of the client change, 2026-10-14: `lib/ai/opencode-endpoint.test.ts`, `lib/ai/provider-validators.test.ts`, `lib/agent-runtime/pi/model-adapter.test.ts`, and `lib/instalacao/prova-de-credito.test.ts` — 41 passed. Deleting the session header from `cabecalhosOpenCode` failed 4 of those tests; the header was restored and the four files passed again. `pnpm test:unit` for the whole repository was not run.

What passed, as a live HTTP probe on 2026-10-14, not as a UI proof: `GET https://opencode.ai/zen/go/v1/models` with `x-opencode-session: crm` returned 200 and the catalog includes `cat-jam-free`. `POST https://opencode.ai/zen/go/v1/chat/completions` for `cat-jam-free` with that header returned 200 using Node's default user agent. `GET https://opencode.ai/zen/v1/models` stayed 200 with the same header. `POST` of `cat-jam-free` to Zen stayed 403 `FreeTierError` with and without the header. The key was not written down.

What did not pass: the workbench self-proof. The bridge section is the measurement. Memory is the local path in `lib/ai/integrations/mem0.ts` (`AI_INTEGRATION_BINDINGS` unset). Do not configure MemoraX. Do not start `infra/local-agent-services/compose.yml`. Feishu and WeKnora are not part of this proof.

## Required secrets

Set in the agent environment and as GitHub Actions repository secrets. The names are the empty keys in `.env.example`. A non-empty Actions secret wins. When that secret is empty, `scripts/verify-crm/carregar-opencode-env.sh` fills it from `.cursor/skills/verify-crm/opencode.env` and does not print the value.

**The key in that file is in git history permanently.** Deleting the file is not enough: every commit that contains it still has the key. After the proof, the owner must revoke the key at OpenCode.

- `OPENCODE_API_KEY` — GitHub Actions secret, or the fallback file when the secret is empty. The drive step sets `OPENCODE_API_KEY` and `VERIFY_CRM_MODEL_API_KEY` from it. Never an argument, never printed.
- `OPENCODE_BASE_URL` — same precedence. The workflow sets `OPENCODE_BASE_URL` (the name the app reads). For this key the value is `https://opencode.ai/zen/go/v1`. Empty product default remains `https://opencode.ai/zen/v1`.
- `OPENCODE_MODEL` — same precedence. The workflow sets `OPENCODE_MODEL` and `OPENCODE_E2E_MODEL_ID`. For this key the value is `cat-jam-free`.

The daily job `.github/workflows/verify-crm-maintain.yml` and the PR verifier `.github/workflows/verify-crm-verifier.yml` read these three secrets. A missing name is `blocked` or `FAIL`. Neither workflow runs from a fork's schedule. `workflow_run` uses the file on the default branch, so the verifier starts commenting after this file is on `main`.

Mapping table: [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#secrets).

There is no GitHub Environment. Required reviewers are unavailable on this private repository without GitHub Pro, so the jobs do not declare `environment:`. The gate is the default-branch copy of `control-crm`.

One-time setup, by someone with admin on `helsome/AiNativeCrm`:

Settings > Secrets and variables > Actions > New repository secret

Add `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`, and `OPENCODE_MODEL`. A secret set here overrides `.cursor/skills/verify-crm/opencode.env`. Deleting that file does not remove the key from git history. After the proof, the owner must revoke the key at OpenCode.

Confirm locally with `--exigir-segredos`. Confirm the GitHub store with `gh secret list -R helsome/AiNativeCrm` (names only). HTTP 403 or 404 from that command means you cannot see the store. Do not create the secrets from this agent.

## Ordered checklist

Do these in order. Each item links to the section that is the procedure. The overnight contract's forbidden list applies to all of them.

1. Secrets present in the process, via cold-start or [the secrets section](./PIPELINE_PROMPT.md#secrets). Missing name: stop.
2. Stage 3, daily maintain-verification. If cold-start printed `stop: do not launch`, the outcome is `blocked` and you do not run launch. If it printed the `next:` line, one launch, then doctor, then `drive workbench-run`. Outcome `clean`, `changed`, or `blocked`. Never fix product code in this pass. The procedure is [maintain-verify-crm](../maintain-verify-crm/SKILL.md). The schedule is `.github/workflows/verify-crm-maintain.yml`. [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#stage-3-daily-maintain-verification).
3. Stage 4, encode a repeated mistake only after the second occurrence. Architecture, then types or lint, then tests, then docs. [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#stage-4-encode-repeated-mistakes). Whether a class has happened twice is a human judgment. Do not invent a second bot for it.
4. Stage 5/6, independent verifier. `.github/workflows/verify-crm-verifier.yml` posts `PASS`, `PASS+NOTES`, or `FAIL` after the workflow named `ci`. Green CI is not the verdict. The workflow does not merge. A human still lands one PR at a time from the bottom. The author of a PR does not post those words on it. [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#stage-5-6-independent-pr-verifier).
5. User-feedback triage on GitHub issues. One reply, dedup first, no outbound messages. Which issue to answer is a human judgment. Incomplete configuration writes nothing. [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#user-feedback-triage).
6. Overnight loop under [OVERNIGHT_CONTRACT.md](./OVERNIGHT_CONTRACT.md). Append [decisions.tsv](./decisions.tsv) for a new decision. Do not replace the inherited row. Morning audit is the contract section "Morning audit". [PIPELINE_PROMPT.md](./PIPELINE_PROMPT.md#overnight-contract).

The scheduled maintain job and the PR verifier are in this branch. Do not add a second scheduler. Do not edit `.github/workflows/release.yml` or `.github/workflows/publish-image.yml`.

## Pre-merge self-proof

`workflow_run` (the verifier) uses the file on `main`, so it does not prove this pull request. The proof before merge is the workflow named `verify-crm-pr` (`.github/workflows/verify-crm-pr.yml`).

It runs on GitHub-hosted `ubuntu-latest` when a same-repo pull request changes `.cursor/skills/verify-crm/**` or `scripts/verify-crm/**`. Manual re-run is `workflow_dispatch` on the branch that contains the file (Actions → verify-crm-pr → Run workflow, or `gh workflow run verify-crm-pr.yml --ref <branch>`).

Order: confirm `origin/<default>` already contains `control-crm` (`git cat-file -e`), then cold-start, Chromium libraries, launch, doctor, `drive workbench-run`, `observe-unreachable`, upload, cleanup. Launch, doctor, drive, observe, and cleanup are the default-branch copies under `/tmp/verify-crm-trusted`, with `VERIFY_CRM_ROOT` set to the pull-request checkout. Until that `git cat-file` succeeds, the job prints `blocked: default branch has no control-crm` and does not run this pull request's `control-crm` with `OPENCODE_API_KEY`. Evidence upload runs only after that trusted copy. A drive exit of 2 prints `doctor exited 2 after the timeline was visible` and does not fail the job. Any other non-zero drive exit prints `blocked: drive exited` and fails the job. Cold-start exit other than 0 prints `blocked: cold-start exited` and fails the job. Fork heads are not run.

`pull_request` still executes the workflow file from the pull request. A same-repo branch that edits `.github/workflows/verify-crm-pr.yml` defines the job. This file does not use `pull_request_target`.

This workflow does not post `PASS`, `PASS+NOTES`, or `FAIL`. The verifier on `main` still does that, after merge, and it runs `control-crm` from the default-branch copy as well.

## Known gaps

Only a human can close these. Do not guess a workaround.

1. **Revoke the OpenCode key after the proof.** `.cursor/skills/verify-crm/opencode.env` is the fallback when the three Actions secrets are empty, and a non-empty secret still wins. The key is in git history permanently. Deleting the file is not enough. The owner must revoke it at OpenCode after the proof. Do not create a GitHub Environment for this. `gh secret list -R helsome/AiNativeCrm` from the agent token used while writing this file returned HTTP 403 `Resource not accessible by integration`. Cold-start prints `github secrets: permission denied` for that result. Creating or updating the secrets is not something this agent can do.
2. **Merge pull request 13 before this draft's proof can run `control-crm`.** That pull request, off `main`, contains `.cursor/skills/verify-crm/scripts/control-crm` and the `scripts/verify-crm` modules the proof executes. `git cat-file -e origin/main:.cursor/skills/verify-crm/scripts/control-crm` fails until it is on the default branch. Until then `verify-crm-pr` prints `blocked: default branch has no control-crm` and does not run this pull request's copy with `OPENCODE_API_KEY`. The daily job and the verifier still wait for this draft: `git cat-file -e origin/main:.github/workflows/verify-crm-maintain.yml` and the same check for `verify-crm-verifier.yml`. Until those succeed, `schedule` (`17 6 * * *`) and `workflow_run` do not fire. Do not click "Run workflow" as a substitute for the secrets or for merging the harness.
3. **This PR does not get its own verdict.** The verifier runs the workflow file that is on `main`, and the author does not post `PASS`, `PASS+NOTES`, or `FAIL` on a PR they opened. A comment on pull request 12 is not produced by merging the documentation in this branch alone.
4. **Docker bridge on the machine that holds the inherited log.** There is no supported host-network flag to try next. Do not launch again on that machine. The measurement is the workflow `verify-crm-pr` on GitHub-hosted `ubuntu-latest` (the same class of runner `e2e.yml` uses). Empty Actions secrets fall back to `.cursor/skills/verify-crm/opencode.env`. If those names are empty in the secret and in the file, the job exits blocked and does not launch. A human cannot waive the loopback guard.
5. **Branch protection list.** `gh api repos/helsome/AiNativeCrm/branches/main/protection` needs admin. A 403 or 404 means you do not know the required checks. Do not paste a remembered list into a verdict.
6. **Stage 4 and issue triage.** Counting "this mistake has happened twice", and choosing which GitHub issue gets the one reply, stay with a person. Do not add a scheduler for either.
