# Expert sub-run collaboration

A supervisor run may start durable specialist sub-runs. The manager sees those children in the workbench. Collaboration is on by default for a workbench start. There is no separate toggle to flip.

## Sub-features

- `collab-supervisor` starts `CRM 主管 Agent` in inspect mode.
- `collab-children` shows `Specialist 子运行` when the run actually delegated.
- `collab-events` shows timeline labels `多 Agent 审查开始`, `Specialist 证据冲突`, or `多 Agent 审查完成` when those events exist.

## How to get to it (user POV)

- Open `/app/ai/workbench`.
- Choose `CRM 主管 Agent` in `#agent-picker`.
- Leave the mode on `只读检查` unless the recipe says `act`.
- Open `运行详情` and read `Specialist 子运行` plus the timeline.

## Driving it with control-crm

Preconditions:

- Doctor is `worth_driving` true, with `cat-jam-free` tool support and a validated OpenCode credential.
- The worker pid is alive. Specialists are created by the running agent, not by the page.

- **Start the supervisor.** Run `control-crm browser goto --path /app/ai/workbench`, `control-crm browser select --id agent-picker --label "CRM 主管 Agent"`, `control-crm browser select --id run-mode --value inspect`, and `control-crm browser fill --id agent-task --value "Peça a especialistas somente leitura para listar contatos e negócios, e aponte conflitos. Não escreva no CRM."`.
- **Run it.** Screenshot the composer, then run `control-crm browser click --role button --name "运行 Agent"`. `运行状态：` updates.
- **Read children.** Open `运行详情`. The heading `Specialist 子运行` is present only when `detail.specialists.length > 0`. The note `Specialist 只读；CRM 写入仍由父 Agent 和 Harness 单写者路径处理。` is the child policy line.
- **Proof.** Screenshot the specialist list and expand `执行时间线`. A pass requires at least one specialist row. If the model answers without delegating, the journey fails. Do not report the parent run as collaboration.

## Gotchas

- `collaboration: "auto"` is the API default. Hiding the children section and calling the parent timeline a pass is a weakened journey.
- Event labels `只读 Specialist 开始` and `只读 Specialist 完成` are not the same as `Specialist 子运行`. Prefer the sub-run list as the proof, and keep the timeline as the second view.
- A conflict label appears only when the runtime records one. Absence of `Specialist 证据冲突` does not fail the journey when a specialist row exists and no conflict was expected.
- When the runtime records a field-hash or source-version disagreement, the same run detail shows `专家冲突未解决`. The parent answer asks for a decision or a fresh read, the status is `partial`, and the error code is `expert_conflict_unresolved`. That run does not stage a CRM write. The timeline label `Specialist 证据冲突` stays; the extra sentence under it is the governance decision.
- This does not exercise Feishu `ask_internal_colleague` or a WeKnora wiki. Those services are not configured in this run.
- Memory for the run stays `local` while `AI_INTEGRATION_BINDINGS` is unset. That is acceptable here. It is not evidence that Mem0 ranked anything.
