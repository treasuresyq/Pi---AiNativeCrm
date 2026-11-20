# Eval results and Judge

After a run, the manager can read the deterministic evaluation, save it, and explicitly run the semantic Judge. The Judge calls the organization model and spends quota. A failed Judge is not a pass.

## Sub-features

- `eval-read` shows `data-testid="agent-run-evaluation"` inside `运行详情`.
- `eval-save` delivers the deterministic result with `保存并投递确定性 Eval`.
- `eval-judge` runs `运行语义 Judge（消耗模型额度）` and shows `语义 Judge：` plus a verdict.
- `eval-retry` uses `重试读取评测` in the region `评测读取失败` when the read fails. Retry does not start a new agent run.

## How to get to it (user POV)

- Workbench: finish a run, open `运行详情`, scroll to the evaluation block.
- Kanban mission: `查看业务评测` on the lead dossier reads that mission's evaluation. It is a second entry point. The workbench buttons do not replace it.

## Driving it with control-crm

Preconditions:

- A workbench run has already reached a terminal status and doctor is `worth_driving` true.
- The evaluation region is readable. If the region `评测读取失败` is showing, use the retry button once and stop if it remains.

- **Open the evaluation.** Run `control-crm browser click --role button --name "运行详情"`. The block `agent-run-evaluation` is on screen. The copy may say the current result is the deterministic harness and that the semantic Judge still needs an explicit run (`当前为确定性 Harness 评测；语义 Judge 需要显式运行。`).
- **Save the deterministic eval.** Run `control-crm browser click --role button --name "保存并投递确定性 Eval"`. The block still shows the harness summary after the click.
- **Run the Judge.** Screenshot the block, then run `control-crm browser click --role button --name "运行语义 Judge（消耗模型额度）"`. The line `语义 Judge：` includes a verdict. `语义 Judge 上次未完成；确定性 Harness 结果仍然有效。` means the Judge did not finish. That is a failed Judge proof even if the harness line remains.
- **Kanban entry.** On a lead that has a mission, run `control-crm browser click --role button --name "查看业务评测"`. The mission evaluation is visible in the dossier. Skipping this button does not verify this entry point.
- **Proof.** Keep a screenshot from before the Judge click and one that shows `语义 Judge：` and the verdict. Re-open `运行详情` and confirm the verdict is still there.

## Gotchas

- Do not treat a deterministic summary as a semantic verdict. The button label says the Judge spends model quota because it calls the model.
- `重试读取评测` only reads. It must not be reported as a new run, a new Judge, or a new delivery.
- If the organization credential is not validated, the Judge cannot succeed. Doctor `credential_not_validated` fails the journey before the click.
- The workbench Judge and the kanban `查看业务评测` control are different. One green screenshot does not cover both.
- An empty organization may still produce a harness result for an inspect run. A missing `agent-run-evaluation` block is a failure, not a skip.
