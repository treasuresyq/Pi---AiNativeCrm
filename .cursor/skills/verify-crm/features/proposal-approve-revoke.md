# Proposal approve and revoke

A manager approves a pending agent proposal so the CRM write happens, and undoes a reversible lead-field change from the same run. Irreversible proposals stay human decisions.

## Sub-features

- `proposal-approve` confirms a pending action with `批准执行` or, for a send, `批准并进入发送队列`.
- `proposal-reject` records `拒绝` and does not apply the write.
- `proposal-undo` uses `撤销` on an executed reversible change and the lead shows the previous value.

## How to get to it (user POV)

- In the workbench, after an `act` run, open `运行详情` (the button may also read `运行详情 · N 待确认`) and use the pending-action buttons.
- The reversible fields are the lead title, description, contact, value, currency, and expected close date. Other fields do not show a working undo.

## Driving it with control-crm

Preconditions:

- The workbench run preconditions hold, and `control-crm doctor` is `worth_driving` true.
- A lead exists in this organization because a person created it in the product, or a previous verified journey created it. The fresh baseline bootstrap does not include a lead named 林晓梅. If no lead is visible, stop and report `lead_missing`. Do not insert one through SQL.
- `#run-mode` can be set to `act` (`分级自治（可逆写入自动执行）`).

- **Open the workbench on a lead.** Run `control-crm browser goto --path /app/ai/workbench` and `control-crm browser click --role button --name "任务设置"`. Choose the lead scope with `control-crm browser select --label "CRM 对象类型" --value lead`, then `control-crm browser fill --label "搜索 CRM 对象" --value "<lead title>"`, then `control-crm browser click --role button --name "<lead title>"`. The line `目标对象：` shows the same title.
- **Ask for a reversible title change.** Run `control-crm browser select --id run-mode --value act` and `control-crm browser fill --id agent-task --value "Atualize o título deste lead para Verificação reversível e pare."`, then `control-crm browser click --role button --name "运行 Agent"`. `运行状态：` leaves the queued state, or the page shows `运行错误：`.
- **Approve.** When `查看 N 项待确认动作` appears, open `运行详情` and run `control-crm browser click --role button --name "批准执行"`. The proposal leaves the pending group.
- **Undo.** Run `control-crm browser click --role button --name "撤销"`. The lead title, read again from `任务设置` or from the kanban card, is the title from before the approval.
- **Reject path.** On a second pending proposal, run `control-crm browser click --role button --name "拒绝"`. That proposal is not applied. A send proposal's approve button is `批准并进入发送队列`, not `批准执行`. Driving only `批准执行` does not verify the send button.
- **Proof.** Screenshot before the approve click and after the undo, under `/tmp/verify-crm-evidence/$RUN_ID/proposal-approve-revoke/`. The second screenshot shows the restored title.

## Gotchas

- There is no `control-crm drive` for this feature yet. The browser commands above are the journey. Missing a lead is a failure, not a cue to approve a fixture through the API only.
- Undo exists only when the executed action is reversible and `can_undo` is set. A successful approve of any other field must not be reported as undo.
- Approving from a hand-built `POST` to `/api/v1/ai/workbench/runs/:id/proposals/:proposalId/decision` skips the button the manager uses. The API may be used as a read after the click, not instead of the click.
- If the model never proposes a title change, the journey did not pass. Do not fabricate a proposal row.
