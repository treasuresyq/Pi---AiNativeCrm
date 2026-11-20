# Pipeline prompt — verify-crm

Another agent follows this file to set up and run the verification pipeline. Do not invent a second harness. The harness is `control-crm` and the skill is [SKILL.md](./SKILL.md). The feature map is [features/README.md](./features/README.md).

Grounding handbook: `uploads/poteto_methodology.md` (owner copy; it is not in git). Citations below are the sources that handbook names. Where this repository's doctrine is stricter than the handbook, the doctrine wins and this file says so.

<a id="secrets"></a>

## Secrets

Model credentials live in GitHub Actions repository secrets. There is no GitHub Environment: required reviewers are unavailable on this private repository without GitHub Pro. One-time setup: Settings > Secrets and variables > Actions > New repository secret, for the three names below. The workflows read exactly these names and map them onto the env vars the app and the harness already use. Same three names are empty assignments in `.env.example`. Never print the values and never pass them as arguments.

When an Actions secret is empty, `scripts/verify-crm/carregar-opencode-env.sh` loads `.cursor/skills/verify-crm/opencode.env`. A non-empty secret wins. **The key in that file is in git history permanently.** Deleting the file is not enough. After the proof, the owner must revoke the key at OpenCode.

| GitHub Actions secret | Value for this free key              | Env the workflow sets                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OPENCODE_API_KEY`    | the OpenCode key; secret wins, else `opencode.env` | `OPENCODE_API_KEY` and `VERIFY_CRM_MODEL_API_KEY`. The drive script reads `OPENCODE_API_KEY` first. The browser fill path refuses a `--value` equal to either variable. The onboarding wizard stores the key. The fallback file is already in git history; deleting it does not revoke the key. |
| `OPENCODE_BASE_URL`   | `https://opencode.ai/zen/go/v1`      | `OPENCODE_BASE_URL`. That is the name the app reads. Empty in the product stays `https://opencode.ai/zen/v1`. Launch still exports the Go URL when the variable is unset.                                                                                                |
| `OPENCODE_MODEL`      | `cat-jam-free`                       | `OPENCODE_MODEL` and `OPENCODE_E2E_MODEL_ID` (the seed). Display name for that id: `Cat Jam Free (OpenCode Go)`. CI default of the seed stays `space-bunny-free` when `OPENCODE_E2E_MODEL_ID` is unset.                                                                  |

`.github/workflows/verify-crm-maintain.yml`, `.github/workflows/verify-crm-verifier.yml`, and `.github/workflows/verify-crm-pr.yml` call `scripts/verify-crm/carregar-opencode-env.sh` before the drive. They fail closed when any of the three names is empty in both the Actions secret and `opencode.env`.

`OPENCODE_SESSION` is optional. Empty sends `x-opencode-session: crm`. Do not put the API key in it.

If any of the three required names is missing, stop. Fail closed. Do not fall back to another provider and do not mark the run verified.

<a id="stage-3-daily-maintain-verification"></a>

## Stage 3 — Daily maintain-verification

Source: handbook stage 3; skill text at <https://raw.githubusercontent.com/cursor/plugins/main/pstack/skills/maintain-verification-skill/SKILL.md>; schedule note in <https://raw.githubusercontent.com/cursor/plugins/main/pstack/docs/guide/06-verify-and-ship.md> ("Run this at least once a day, ideally from a scheduled automation").

This repository schedules with GitHub Actions, which it already uses (`relogio.yml`, `vigia-de-colisao.yml`). There is no Cursor automation pack to register. The daily trigger is `.github/workflows/verify-crm-maintain.yml`: cron `17 6 * * *`, plus `workflow_dispatch`, and the job runs only when `github.repository` is `helsome/AiNativeCrm` or the run is a manual dispatch. `schedule` does not fire until the file is on the default branch, and a fork does not inherit a running cron against this repository.

The workflow checks out the default branch, requires the three secrets, pins the Supabase CLI at `2.117.0`, runs `control-crm launch`, doctor, `control-crm drive workbench-run`, and `control-crm observe-unreachable`, then `pnpm exec tsx scripts/verify-crm/maintain.ts --fechar`. `blocked` exits non-zero. The workflow does not commit and does not open a pull request. A schedule with `contents: write` and `pull-requests: write` would commit without the source-wave judgment. The source wave is one read-only Cursor subagent per feature file, and GitHub Actions has no Cursor runtime, so the cron does not spawn it. A person follows the maintain skill for that wave and for the single `changed` pull request. A pass that skips the live drive is not `clean`. `observe-unreachable` opens each verified-unreachable screen once and stores a screenshot plus the unmet precondition read from the page. Pasting the journey-table sentence is not that observation.

The agent procedure, including the source wave, is [../maintain-verify-crm/SKILL.md](../maintain-verify-crm/SKILL.md). Paste this prompt when a person runs that pass by hand:

```text
Run /maintain-verification-skill on .cursor/skills/verify-crm.
Harness: .cursor/skills/verify-crm/scripts/control-crm
Secrets already in the environment: OPENCODE_API_KEY, OPENCODE_BASE_URL, OPENCODE_MODEL.
Map them as PIPELINE_PROMPT.md#secrets says. Do not print them.
Index hygiene, then one read-only subagent per feature file, then reconcile, then a live pass of every feature even if source looks clean.
Outcome is exactly one of: clean (no PR), changed (one PR, only files under .cursor/skills/verify-crm/ and .cursor/skills/maintain-verify-crm/, re-driven live), blocked (say the exact blocker, no PR).
Triage: wrong user-POV text is doc drift (fix the map); working behavior the harness cannot drive is a harness gap (fix the harness and re-drive); broken app behavior is a product gap (report it, do not edit product code, do not paper over it in the map).
Never weaken a journey. Append one decisions.tsv row per iteration. Follow .cursor/skills/verify-crm/OVERNIGHT_CONTRACT.md.
```

Daily. One run. The target skill is this directory. Several verify skills → stop and ask. None → stop and point at `/create-verification-skill`. Do not invent a target.

Pass order, from the maintain skill:

0. Locate `.cursor/skills/verify-crm`.
1. Index hygiene on `features/README.md` and the sibling feature files.
2. Source wave: one read-only subagent per feature file, concurrently. Children do not drive and do not edit. Each returns a summary, source entry points, drift or none, and one live recipe.
3. Reconcile. Every feature file has a summary. Merge recipes into as few app states as practical. A missing surface needs a concrete source path.
4. Live pass, even when source looks clean. One long-lived instance, driven serially. Doctor before the first drive, again after any failed drive. Evidence survives cleanup. A doctor failure caused by skill drift is drift: fix it inside this directory and retry once.
5. Triage into doc drift, harness gap, or product gap. Product gap stays out of the PR.
6. Ship or stop. `changed` is one PR. Re-read every changed file first. `clean` and `blocked` open no PR.

Feature files today: `workbench-run.md`, `proposal-approve-revoke.md`, `mission-send-and-direction.md`, `expert-collaboration.md`, `eval-judge.md`. A fresh baseline has no lead. Do not SQL-insert one. An unreachable path is `verified-unreachable` only with the prerequisite and the route you tried.

<a id="stage-4-encode-repeated-mistakes"></a>

## Stage 4 — Encode repeated mistakes

Source: handbook stage 5 (the constraint ladder); <https://raw.githubusercontent.com/cursor/plugins/main/pstack/docs/guide/09-make-it-yours.md>; <https://x.com/poteto/status/2109699980248408574>; <https://x.com/poteto/status/2110149626133438732>.

The ladder, strongest first. Use the strongest rung that can express the lesson:

1. Architecture or data shape that makes the mistake impossible.
2. Types, lint, or CI, with the error text saying how to fix it.
3. A test that catches it.
4. A doc or a rule. Weakest. A reviewer who must catch the same mistake on every PR is the failure this rung admits.

Count a class only when it has happened twice. One commit per class. The new check must fail on a real historical example of that class, then pass once the constraint is in place. Say which decision the constraint changed. A principle name with no decision behind it is name-dropping (<https://raw.githubusercontent.com/cursor/plugins/main/pstack/docs/guide/08-principles.md>).

Do not run a repository-wide comment deletion. The handbook quotes a preference for deleting comments. This repository's measured comments in inherited code are the doctrine. Touching them violates the overnight contract unless the report states why. Encode the new lesson in structure, not in a fresh comment on old code.

<a id="stage-5-6-independent-pr-verifier"></a>

## Stage 5/6 — Independent PR verifier

Source: handbook stage 6; <https://raw.githubusercontent.com/cursor/plugins/main/pstack/skills/poteto-mode/playbooks/shipping.md>.

The independent job is `.github/workflows/verify-crm-verifier.yml`. It runs on `workflow_run` after the workflow named `ci` (`.github/workflows/ci.yml`) completes. GitHub uses the workflow file from the default branch, so commenting starts after that file is on `main`.

The self-proof that has to pass before that merge is `.github/workflows/verify-crm-pr.yml` (`name: verify-crm-pr`). `pull_request` on `.cursor/skills/verify-crm/**` and `scripts/verify-crm/**`, plus `workflow_dispatch`. Same-repo head, `ubuntu-latest`. It runs `control-crm` and `scripts/verify-crm` from the default branch (`git archive` into `/tmp/verify-crm-trusted`, `VERIFY_CRM_ROOT` on the pull-request checkout). Until pull request 13 has put `control-crm` on `main`, the job prints `blocked: default branch has no control-crm` and does not run the pull request's copy. Cold-start, launch, doctor, `drive workbench-run`, artifact upload, cleanup. Missing `OPENCODE_*` secrets: cold-start exits 2 and the job fails. It does not post the verdict.

An author verdict does not count. Green CI does not count. An approving bot review does not count. The comment is one of `PASS`, `PASS+NOTES`, or `FAIL`, edited in place via the marker `<!-- verify-crm-verdict -->`. The body includes parent and head SHAs and the sentence `Green ci.yml is not the verdict.`

The job drives only when the head repository is `helsome/AiNativeCrm`, `ci` concluded `success`, and the three secrets are set. A fork head is not checked out and is not run with those secrets; the comment is `FAIL`. `ci` that is not `success` also comments `FAIL` and does not drive. That `FAIL` means the user drive did not run. It is not a claim that the screen was exercised, and a green `ci.yml` would still not be the verdict.

`PASS` requires `result.json` with `started: true` and `blocked: false`, drive exit 0, and no notes. Today the other four features are `verified-unreachable` on a fresh baseline, so a successful workbench drive is `PASS+NOTES`, not `PASS`. Drive exit 2 after a visible timeline (doctor failed after the UI) is the same fact in both closers: `veredito` returns `PASS+NOTES` with the note `doctor exited 2 after the timeline was visible`, and `fechar` records that drive as `passou` with the same note. It is not `harness_gap` and not `blocked`. A blocked timeline, a missing result, or a missing secret is `FAIL` there and `blocked` in `fechar`.

The workflow does not merge. Landing stays a human decision. Also wait for the other required checks the branch protection lists — measure them, do not trust a frozen list:

```bash
gh api repos/helsome/AiNativeCrm/branches/main/protection --jq '.required_status_checks.contexts|join(", ")'
```

Green on those checks is still not the verdict. The verdict is a drive with `control-crm` of the change the way a user would, parent against head.

Post exactly one of these as the PR comment, then the evidence paths:

- `PASS` — the mapped journey for the diff ran, the timeline or the equivalent result state was visible, and no preflight or `运行错误：` copy was shown.
- `PASS+NOTES` — the journey passed, and a non-blocking note is listed under the verdict.
- `FAIL` — the journey failed, the instance was blocked, or the evidence does not show the result state. Include the command and the blocker.

The agent that authored the PR does not post these words on its own PR.

Landing, only when a human has authorized landing in the overnight session:

- Walk up from the lowest unmerged PR. Stop at the first without `PASS` or `PASS+NOTES`. That PR is the ceiling. The ones below it are the run.
- A verified PR above an unverified one waits.
- After a rebase, compare `git patch-id` of the verdict SHA with the current head before reusing the verdict. A dev-server lane cannot prove the patch is unchanged by a rebuild, so re-run it.
- Merge one at a time, bottom-up, with `gh pr merge <pr> --squash` only for a PR whose verdict covers the current head. Then read the PR back (`gh pr view <pr> --json state,mergedAt,baseRefName`). Queued is not merged. A landed PR has trunk as its base.
- Retarget the next PR onto trunk and move its patch with `--force-with-lease` only as that playbook's step 4 describes. Do not otherwise rewrite the stack while it lands.
- Do not edit `.github/workflows/release.yml` or `.github/workflows/publish-image.yml` to make a check green.

Default for a session that was not told to land: post the verdict and stop.

<a id="user-feedback-triage"></a>

## User-feedback triage

Source: handbook stage 7; <https://raw.githubusercontent.com/cursor/plugins/main/pstack/automations/benny/skills/triage-issue-reports/SKILL.md>; <https://raw.githubusercontent.com/cursor/plugins/main/pstack/automations/benny/README.md>.

This repository's queue is GitHub issues and PR comments on `helsome/AiNativeCrm`, not a Slack app, until a human names a Slack channel. Apply the benny rules there:

- One verdict reply in the original thread.
- Trace `how` and `why` before routing.
- Classify as Bug, Performance, Feature request, Question, or Reroute.
- When the bug-versus-feature line is unclear, do not file.
- Dedup before creating an issue. Prefer no ticket over a guessed or duplicate ticket.
- Incomplete configuration fails closed: write nothing.
- Subagents are read-only. They do not post.
- Do not ping a maintainer by default.
- Do not send WhatsApp, Feishu, or any other real outbound message. A reply that needs sending stays draft or pending.
- Reproduce through the real UI with `control-crm` before any fix. A compile, a unit test, or a plausible diff is not after-evidence.
- A fix from this lane opens a draft PR only. Never merge or deploy from triage.

<a id="overnight-contract"></a>

## Overnight contract

Source: handbook stage 8; <https://raw.githubusercontent.com/cursor/plugins/main/pstack/docs/guide/07-overnight.md>.

The filled-in contract for this repository is [OVERNIGHT_CONTRACT.md](./OVERNIGHT_CONTRACT.md). Use that file. Do not rewrite the goal, the done line, or the forbidden list in the session. The decision log template is [decisions.tsv](./decisions.tsv). Morning audit instructions are in the contract.

Earn the loop before leaving it: the verification skill has been executed at least once as far as the environment allowed, the agent has `control-crm`, every stage can stop the line, and this file is the place repeated failures get written down. `pnpm exec tsx scripts/verify-crm/cold-start.ts` is how you tell whether this machine may launch. `stop: do not launch` means the Supabase blocker in [HANDOFF.md](./HANDOFF.md) is already measured here: the live pass is `blocked`, and you do not drive `http://127.0.0.1:3011/login`.
