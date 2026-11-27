'use strict';

window.DEMO_NAV_GROUPS = [
  {
    id: 'overview',
    label: '概览',
    items: [
      { path: '/app', label: '首页概览', icon: 'gauge' },
    ],
  },
  {
    id: 'ai',
    label: 'Agent 操作 CRM',
    items: [
      { path: '/app/ai/workbench', label: 'Agent–CRM 工作台', icon: 'robot', badge: 'Ontology' },
      { path: '/app/ai/followups', label: '跟进流程', icon: 'flow' },
      { path: '/app/ai/memory', label: '客户记忆与规则', icon: 'brain', badgeKey: 'pendingMemories' },
      { path: '/app/ai/evals', label: '本体论与评测基准', icon: 'scales' },
    ],
  },
  {
    id: 'service',
    label: '客户服务',
    items: [
      { path: '/app/inbox', label: '会话收件箱', icon: 'inbox', badgeKey: 'unreadInbox' },
      { path: '/app/radar', label: '风险雷达', icon: 'radar', badgeKey: 'radarCount' },
      { path: '/app/agenda', label: '日程预约', icon: 'calendar' },
      { path: '/app/templates', label: '快速回复', icon: 'file' },
    ],
  },
  {
    id: 'sales',
    label: '销售日常',
    items: [
      { path: '/app/kanban', label: '销售漏斗', icon: 'kanban' },
      { path: '/app/contacts', label: '联系人', icon: 'users' },
      { path: '/app/tasks', label: '跟进任务', icon: 'tasks', badgeKey: 'openTasks' },
    ],
  },
  {
    id: 'system',
    label: '分析与设置',
    items: [
      { path: '/app/metrics', label: '指标分析', icon: 'chart' },
      { path: '/app/settings', label: '工作区设置', icon: 'settings' },
    ],
  },
];

window.DEMO_STAGES = [
  { id: 'new', name: '新客户' },
  { id: 'contacted', name: '已联系' },
  { id: 'proposal', name: '方案沟通' },
  { id: 'won', name: '已成交' },
];

window.createInitialDemoState = function createInitialDemoState() {
  return {
    theme: 'light',
    sidebarCollapsed: false,
    activeConvId: 'conv-1',
    inboxFilter: 'all',
    inboxSearch: '',
    composerMode: 'reply',
    workbenchAgent: '商机诊断 Agent',
    workbenchMode: 'controlled',
    outboundPaused: false,
    activeScenarioId: 'ontology-stalled',
    workbenchRuns: [],
    contacts: [
      {
        id: 'c-1',
        name: '林晓梅',
        company: '星辰数字科技',
        email: 'lin.xiaomei@example.test',
        phone: '+86 138-0013-8001',
        source: 'WhatsApp 官网咨询',
        tags: ['重点', '官网改版'],
        memories: [
          { id: 'm-1', text: '仅接受工作日 14:00 后电话回访，拒绝机器人自动外呼', status: 'confirmed', source: '会话提取 · 2026-11-16' },
          { id: 'm-2', text: '预算上限 ¥15,000，要求包含移动端响应式适配与 SEO 基础配置', status: 'confirmed', source: '人工确认 · 2026-11-17' },
          { id: 'm-3', text: '希望下周二前拿到两套视觉风格初稿对比', status: 'candidate', source: '待审核候选记忆 · 来自收件箱' },
        ],
      },
      {
        id: 'c-2',
        name: '陈伟',
        company: '优品连锁门店',
        email: 'chen.wei@example.test',
        phone: '+86 138-0013-8002',
        source: '微信私域',
        tags: ['门店系统'],
        memories: [
          { id: 'm-4', text: '共有 6 家线下门店，需要与现有收银系统打通积分数据', status: 'confirmed', source: '人工确认 · 2026-11-15' },
        ],
      },
      {
        id: 'c-3',
        name: '王芳',
        company: '悦己美妆',
        email: 'wang.fang@example.test',
        phone: '+86 138-0013-8003',
        source: '老客户转介绍',
        tags: ['重点', '私域运营'],
        memories: [
          { id: 'm-5', text: '重点关注企微社群自动分层与复购提醒触达率', status: 'confirmed', source: '会话提取 · 2026-11-14' },
          { id: 'm-6', text: '法务审批周期约 5 个工作日，需提前提供标准 SLA 附件', status: 'candidate', source: '待审核候选记忆 · 来自跟进纪要' },
        ],
      },
      {
        id: 'c-4',
        name: '赵强',
        company: '华峰智能制造',
        email: 'zhao.qiang@example.test',
        phone: '+86 138-0013-8004',
        source: '官网表单',
        tags: ['重点', '年度合同'],
        memories: [
          { id: 'm-7', text: '采购决策需经过信息安全部对行级权限隔离（RLS）的合规评估', status: 'confirmed', source: '人工确认 · 2026-11-12' },
        ],
      },
      {
        id: 'c-5',
        name: '周敏',
        company: '清风文创',
        email: 'zhou.min@example.test',
        phone: '+86 138-0013-8005',
        source: '活动报名',
        tags: ['已签约'],
        memories: [
          { id: 'm-8', text: '已签约基础版 CRM，计划下季度增购 3 个坐席', status: 'confirmed', source: '合同归档 · 2026-11-10' },
        ],
      },
    ],
    leads: [
      { id: 'l-1', title: '林晓梅 — 企业官网改版', stage: 'new', valueCents: 1280000, contactId: 'c-1', tags: ['待跟进'], staleHours: 4, owner: '演示账号' },
      { id: 'l-2', title: '陈伟 — 门店会员系统', stage: 'contacted', valueCents: 760000, contactId: 'c-2', tags: ['待跟进'], staleHours: 18, owner: '演示账号' },
      { id: 'l-3', title: '王芳 — 私域运营方案', stage: 'proposal', valueCents: 2450000, contactId: 'c-3', tags: ['重点客户'], staleHours: 52, owner: '演示账号' },
      { id: 'l-4', title: '赵强 — 年度服务合同', stage: 'proposal', valueCents: 5200000, contactId: 'c-4', tags: ['重点客户'], staleHours: 76, owner: '演示账号' },
      { id: 'l-5', title: '周敏 — 已签约客户', stage: 'won', valueCents: 980000, contactId: 'c-5', tags: ['已成交'], staleHours: 0, owner: '演示账号' },
    ],
    tasks: [
      { id: 't-1', title: '回访林晓梅：确认官网改版需求', dueLabel: '已逾期 2 小时', priority: 'urgent', status: 'pending', contactId: 'c-1', leadId: 'l-1' },
      { id: 't-2', title: '复核王芳的私域运营方案', dueLabel: '3 小时后到期', priority: 'high', status: 'in_progress', contactId: 'c-3', leadId: 'l-3' },
      { id: 't-3', title: '跟进赵强年度服务合同', dueLabel: '明天 18:00', priority: 'medium', status: 'pending', contactId: 'c-4', leadId: 'l-4' },
      { id: 't-4', title: '整理陈伟的门店会员系统记录', dueLabel: '昨天已完成', priority: 'low', status: 'done', contactId: 'c-2', leadId: 'l-2' },
    ],
    conversations: [
      {
        id: 'conv-1',
        contactId: 'c-1',
        leadId: 'l-1',
        channel: 'WhatsApp',
        status: 'human',
        unread: 1,
        time: '16:22',
        preview: '演示客户：我想和真人客服沟通，请不要让机器人继续回复。',
        messages: [
          { id: 'msg-1', type: 'inbound', sender: '林晓梅', text: '你好，我们企业官网准备下个月改版，预算大概 1.2 万到 1.5 万之间，想了解下交付周期。', time: '16:15' },
          { id: 'msg-2', type: 'outbound', sender: 'AI 客服助手', text: '您好林女士！企业官网改版（含移动端适配与基础 SEO）常规交付周期为 2–3 周。请问您期望下周二先看两套视觉风格初稿吗？', time: '16:16', badge: '引用知识库 · 交付规范 v2' },
          { id: 'msg-3', type: 'inbound', sender: '林晓梅', text: '我想和真人客服沟通，请不要让机器人继续回复。另外我只有工作日 14:00 后方便接电话。', time: '16:22' },
          { id: 'msg-4', type: 'handoff', text: '触发人工接管护栏：客户明确要求人工沟通，已自动静默 AI 回复并同步提取客户记忆候选。', time: '16:22' },
          { id: 'msg-5', type: 'note', sender: '系统记忆提示', text: '检测到客户约束：「仅工作日 14:00 后接听电话」「拒绝机器人自动回复」。已加入客户记忆并阻塞自动外发。', time: '16:22' },
        ],
      },
      {
        id: 'conv-2',
        contactId: 'c-3',
        leadId: 'l-3',
        channel: '微信客服',
        status: 'ai',
        unread: 0,
        time: '14:05',
        preview: '好的，麻烦把标准 SLA 附件也一并发我，我同步给法务预审。',
        messages: [
          { id: 'msg-21', type: 'inbound', sender: '王芳', text: '私域运营方案整体方向没问题，我们法务审批大概需要 5 个工作日。', time: '13:58' },
          { id: 'msg-22', type: 'outbound', sender: 'AI 销售跟进', text: '收到王总，考虑到法务 5 个工作日的审批周期，我这边先为您整理标准 SLA 与数据安全说明附件。', time: '14:00', badge: '读取已确认记忆 · 企微社群分层' },
          { id: 'msg-23', type: 'inbound', sender: '王芳', text: '好的，麻烦把标准 SLA 附件也一并发我，我同步给法务预审。', time: '14:05' },
        ],
      },
      {
        id: 'conv-3',
        contactId: 'c-4',
        leadId: 'l-4',
        channel: 'WhatsApp',
        status: 'human',
        unread: 2,
        time: '昨天',
        preview: '信息安全部需要确认你们多租户数据是怎么做行列隔离的？',
        messages: [
          { id: 'msg-31', type: 'inbound', sender: '赵强', text: '年度服务合同报价我们内部初审过了，但信息安全部需要确认你们多租户数据是怎么做行列隔离的？', time: '昨天 17:40' },
          { id: 'msg-32', type: 'note', sender: 'Agent 诊断建议', text: '该商机金额 ¥52,000 且停滞超过 72 小时，建议附带 Postgres RLS + ontology_reader 只读隔离架构说明进行人工回访。', time: '昨天 17:42' },
        ],
      },
      {
        id: 'conv-4',
        contactId: 'c-2',
        leadId: 'l-2',
        channel: '微信客服',
        status: 'ai',
        unread: 0,
        time: '11-16',
        preview: '6 家门店的积分打通接口文档我已经转给技术同事了。',
        messages: [
          { id: 'msg-41', type: 'inbound', sender: '陈伟', text: '6 家门店的积分打通接口文档我已经转给技术同事了，周四给你反馈。', time: '11-16 11:20' },
          { id: 'msg-42', type: 'outbound', sender: 'AI 客服助手', text: '太好了陈总！已为您登记周四跟进提醒，如有接口联调问题随时联系我们。', time: '11-16 11:21' },
        ],
      },
    ],
    templates: [
      { id: 'tpl-1', title: '官网改版标准报价与周期', category: '售前报价', content: '您好，企业官网改版标准周期为 2–3 周，包含响应式适配、基础 SEO 与后台培训，预算区间 ¥12,000–¥15,000。' },
      { id: 'tpl-2', title: 'SLA 与数据安全合规说明', category: '法务合规', content: '随信附上标准 SLA 服务协议及 Postgres RLS 行级租户隔离白皮书，方便贵司信息安全与法务团队审阅。' },
      { id: 'tpl-3', title: '人工接管致意', category: '客服转接', content: '您好，我是专属客户经理，接下来的沟通由我直接为您跟进处理，请问下午两点后方便通话吗？' },
    ],
    agenda: [
      { id: 'ag-1', title: '林晓梅 · 官网改版需求电话沟通', time: '今天 14:30 - 15:00', owner: '演示账号', channel: '电话（遵循仅 14:00 后偏好）', status: '已预约' },
      { id: 'ag-2', title: '王芳 · 私域运营方案法务答疑', time: '明天 10:00 - 10:45', owner: '演示账号', channel: '腾讯会议', status: '待确认' },
      { id: 'ag-3', title: '赵强 · 年度合同信息安全合规评审', time: '周五 15:00 - 16:00', owner: '演示账号', channel: '线上演示', status: '已预约' },
    ],
    orgRules: [
      { id: 'rule-1', title: '入站消息不等于外发同意', body: '客户首次入站询问或表达转人工意愿时，禁止自动触发营销外发或机器人连续追问，必须经过人工审批或明确同意边界。', source: '系统内置规则 v4', status: 'active' },
      { id: 'rule-2', title: '严格遵循客户时间窗口约束', body: '若客户记忆中存在明确联系时段限制（如「仅工作日 14:00 后」），所有跟进排期提案不得落在禁区时段内。', source: 'PR #29 记忆闭环', status: 'active' },
      { id: 'rule-3', title: '业务口径以本体论语义层为准', body: '统计高价值停滞商机、转化率或回访优先级前，必须先调用 ontology_check_answerable 校验口径可回答性，禁止模型臆造 SQL。', source: 'PR #38 本体论规范', status: 'active' },
    ],
  };
};

window.DEMO_SCENARIOS = [
  {
    id: 'ontology-stalled',
    title: '本体论查询：核对高价值停滞商机并生成跟进方案',
    prompt: '基于业务本体论核对高价值停滞商机与客户记忆，生成可执行跟进方案（先校验口径再读取）。',
    agent: '商机诊断 Agent',
    steps: [
      {
        name: '1. ontology_search_terms',
        status: 'ok',
        detail: { query: '高价值停滞商机', matchedTerms: ['deal.stalled_high_value', 'deal.value_cents', 'conversation.last_inbound_at'] },
      },
      {
        name: '2. ontology_check_answerable',
        status: 'full',
        detail: { ontologyVersion: '1.0.0', answerability: 'full', role: 'ontology_reader (read-only)', visibility: 'org_scoped_rls' },
      },
      {
        name: '3. ontology_query (只读语义执行)',
        status: 'ok',
        detail: { template: 'stalled_deals_with_memory_v1', rowCount: 2, rowLimit: 50, rows: ['赵强 — 年度服务合同 (¥52,000, 停滞 76h)', '王芳 — 私域运营方案 (¥24,500, 停滞 52h)'] },
      },
    ],
    evidence: {
      status: 'full',
      ontologyVersion: '1.0.0',
      scope: '演示工作区 (0dae91cc)',
      visibility: '全量可见漏斗 · 行列隔离角色 ontology_reader',
      relations: 'crm_leads → contacts → customer_memories',
      sources: 'crm_leads, crm_stages, org_memory_entries',
      template: 'stalled_deals_with_memory_v1 · 2 条（上限 50 条）',
    },
    reply: '已完成语义核验与只读查询，发现 2 笔高价值停滞商机：\n1. **赵强 — 年度服务合同（¥52,000，停滞 76 小时）**：客户信息安全部关注多租户行列隔离（RLS）。\n2. **王芳 — 私域运营方案（¥24,500，停滞 52 小时）**：待补充标准 SLA 附件以配合 5 个工作日法务审批。\n\n已为您生成可撤销的跟进任务提案，等待审批后写入 CRM。',
    proposal: {
      id: 'prop-ontology-1',
      title: '创建 2 条高优先级跟进任务并标记合规附件准备',
      summary: '为「赵强 — 年度服务合同」生成 RLS 合规说明回访任务；为「王芳 — 私域运营方案」生成标准 SLA 发送任务（不直接外发消息）。',
      actionType: 'create_tasks_batch',
      tasksToAdd: [
        { title: '发送 Postgres RLS 行级隔离白皮书给赵强', dueLabel: '今天 17:30', priority: 'urgent', contactId: 'c-4', leadId: 'l-4' },
      ],
    },
  },
  {
    id: 'memory-boundary',
    title: '客户记忆闭环：准备林晓梅回访建议（含约束冲突检查）',
    prompt: '查看林晓梅的客户记忆与最近会话，起草一份不触犯偏好的回访计划。',
    agent: '记忆整理 Agent',
    steps: [
      {
        name: '1. memory_retrieve (客户记忆读取)',
        status: 'ok',
        detail: { contact: '林晓梅', confirmedCount: 2, candidateCount: 1, constraints: ['仅工作日 14:00 后电话回访', '拒绝机器人自动外呼', '预算上限 ¥15,000'] },
      },
      {
        name: '2. ontology_describe_outcome (验收边界检查)',
        status: 'ok',
        detail: { inboundIsConsent: false, outboundAllowed: false, reason: '客户在会话中要求人工沟通，禁止自动外发' },
      },
    ],
    evidence: {
      status: 'partial',
      ontologyVersion: '1.0.0',
      scope: '联系人林晓梅 (c-1)',
      visibility: '已确认记忆 2 条 · 待审候选 1 条',
      relations: 'contacts → conversations → customer_memories',
      sources: 'customer_memories, conversations',
      template: 'contact_memory_context_v1 · 3 条（上限 20 条）',
    },
    reply: '根据林晓梅的**已确认客户记忆**：\n- 联系窗口：**仅工作日 14:00 后**，且**禁止机器人自动外呼**；\n- 预算约束：**上限 ¥15,000**（当前商机 ¥12,800 在区间内）。\n\n同时发现 1 条待审核候选记忆：「希望下周二前拿到两套视觉风格初稿对比」。建议由人工客户经理在今天 14:30 的预约电话中确认初稿偏好。',
    proposal: {
      id: 'prop-memory-1',
      title: '确认候选记忆并安排 14:30 人工回访任务',
      summary: '将「下周二前提供两套风格初稿」转为已确认记忆，并保持自动外发静默状态。',
      actionType: 'confirm_memory',
      contactId: 'c-1',
      memoryId: 'm-3',
    },
  },
];
