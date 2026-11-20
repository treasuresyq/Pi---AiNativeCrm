# verify-crm harness

This is the copy that `verify-crm-pr` runs from the default branch. The workflow archives `.cursor/skills/verify-crm` and `scripts/verify-crm` and refuses to run a pull request's own `control-crm` with the model key.

From the repository root:

```bash
.cursor/skills/verify-crm/scripts/control-crm launch
.cursor/skills/verify-crm/scripts/control-crm doctor
.cursor/skills/verify-crm/scripts/control-crm drive workbench-run
.cursor/skills/verify-crm/scripts/control-crm observe-unreachable
.cursor/skills/verify-crm/scripts/control-crm cleanup
```

`drive workbench-run` is the whole workbench journey. The three names `OPENCODE_API_KEY`, `OPENCODE_BASE_URL`, and `OPENCODE_MODEL` are repository Actions secrets and win over `.cursor/skills/verify-crm/opencode.env` when set. The key in that file is in git history permanently; deleting the file is not enough, and the owner revokes it at OpenCode after the proof.

Settings > Secrets and variables > Actions > New repository secret

There is no GitHub Environment. Required reviewers are unavailable on this private repository without GitHub Pro.
