# Mission pause, resume, and owner direction

A manager pauses customer sending for one mission, resumes it, and can attach a follow-up direction while the mission is still open. The workbench and the kanban dossier are different screens. Verifying one does not verify the other.

## Sub-features

- `mission-pause-workbench` pauses send from the workbench mission block.
- `mission-resume-workbench` resumes send from that same block.
- `mission-pause-kanban` pauses send from the lead dossier.
- `mission-direction-kanban` saves a direction of at least 5 characters and shows that the model has not consumed it yet.

## How to get to it (user POV)

- Workbench: open `运行详情` on a run whose mission is not `completed` or `cancelled`. The block is `data-testid="crm-mission-state"`. The reason placeholder is `说明暂停或恢复的原因（至少 5 个字符）`. The button is `暂停客户发送` or `恢复客户发送`.
- Kanban: open `/app/kanban`, open the card whose accessible name is the translated word for Lead plus the title (`t("Lead")` in `KanbanCard.tsx`; pt-BR keeps `Lead:`). In `data-testid="lead-missions"`, the reason field is `#send-policy-reason-<missionId>` labelled `客户发送策略原因`, and the button is `暂停客户发送` or `恢复客户发送权限`.
- Direction, kanban only while status is `queued`, `running`, `needs_review`, `waiting_customer`, or `waiting_approval`: label `负责人补充任务方向`, field `#manager-direction-<missionId>`, button `保存方向并继续任务`.

## Driving it with control-crm

Preconditions:

- Doctor is `worth_driving` true.
- A mission is visible in the workbench or on a lead. A fresh install has none. Stop with `mission_missing` instead of inserting a row.
- The two entry points are both required for a full pass. Record which one you could not open.

- **Pause on the workbench.** Open the run details and fill the reason textarea with `暂停以便核对报价`. Run `control-crm browser fill --label "发送策略调整原因" --value "暂停以便核对报价"` and `control-crm browser click --role button --name "暂停客户发送"`. The button becomes `恢复客户发送`, and the mission block shows `客户发送已被负责人暂停；旧审批不能继续发送。`.
- **Resume on the workbench.** Fill a second reason of at least 5 characters and run `control-crm browser click --role button --name "恢复客户发送"`. The button returns to `暂停客户发送`.
- **Pause on the kanban.** Open the lead card and fill `#send-policy-reason-<missionId>` with `看板暂停发送核对`. Run `control-crm browser fill --id send-policy-reason-<missionId> --value "看板暂停发送核对"` and `control-crm browser click --role button --name "暂停客户发送"`. The kanban button reads `恢复客户发送权限`, and the dossier shows `客户发送已暂停；Agent 可继续读取和内部协作，但不能凭旧审批发出消息。`.
- **Direction.** Fill `#manager-direction-<missionId>` with `先核对需求再报价`. Run `control-crm browser fill --id manager-direction-<missionId> --value "先核对需求再报价"` and `control-crm browser click --role button --name "保存方向并继续任务"`. The dossier shows `负责人方向：先核对需求再报价` and `新方向已接受，等待模型消费`.
- **Proof.** Screenshot the workbench block after pause and the kanban dossier after the direction text appears. Re-open the lead and confirm the direction line is still there. `新方向已由模型读取（不等于业务完成）` is a later state, not a substitute for the accept line.

## Gotchas

- The workbench button and the kanban button do not share a label for resume (`恢复客户发送` versus `恢复客户发送权限`). Clicking one does not exercise the other.
- A direction shorter than 5 characters does not submit. The workbench reason placeholder also requires 5 characters.
- Saving a direction cancels the previous run and revokes old proposals. It does not roll back a customer message that already left. Do not describe the direction as business completion.
- Submitting the direction is not proof that the model consumed it. Wait for the consumed line only when a live model run actually reads it, and do not treat a failed model call as consumption.
- Feishu colleague questions are a different control. Do not use them as the direction proof.
