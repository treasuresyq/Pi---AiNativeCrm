'use strict';

window.DemoViews = (function () {
  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtCny(cents) {
    return '¥' + (Number(cents || 0) / 100).toLocaleString('zh-CN');
  }

  function fmtReply(text) {
    return esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  const MINI_SVG = {
    sparkle: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>',
    search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    filter: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 6h18M6 12h12M10 18h4"/></svg>',
    mail: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    wa: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    wx: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9.5" cy="10.5" r="5.5"/><path d="M16.5 11.5a4.5 4.5 0 1 1-4.1 6.3"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    send: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    shield: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 8 3v5c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z"/></svg>',
    arrowRight: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    inbox: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M4 13l3.5 5h9L20 13M4 13h4l2 2h4l2-2h4"/></svg>',
    brain: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .5.1 1 .3 1.4A3.5 3.5 0 0 0 5 15.5 3.5 3.5 0 0 0 8.5 19H11V4H9.5ZM14.5 4A3.5 3.5 0 0 1 18 7.5c0 .5-.1 1-.3 1.4A3.5 3.5 0 0 1 19 15.5 3.5 3.5 0 0 1 15.5 19H13V4h1.5Z"/></svg>',
    clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    alert: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/></svg>',
    wallet: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h4"/></svg>',
    flow: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M8 6h5a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H10"/></svg>',
    users: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2M16 6a2.5 2.5 0 0 1 0 5M21 20v-2a4 4 0 0 0-3-3.8"/></svg>',
    building: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8h2m2 0h2M9 12h2m2 0h2M9 16h6"/></svg>',
    doubleCheck: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>',
    panelRight: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',
    userCard: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="3"/><path d="M4 19a6 6 0 0 1 12 0"/><circle cx="18" cy="11" r="2.5"/><path d="m20 13 2 2"/></svg>',
  };

  const COMPANY_LOGOS = {
    star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6L12 2z"/></svg>',
    peak: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 19L10.2 5.5a1 1 0 0 1 1.76 0L15 11.4l2.1-3.3a1 1 0 0 1 1.72.06L21 19H3z"/></svg>',
    petal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c3.2 2.4 4.8 5.2 4.8 8.3A4.8 4.8 0 1 1 7.2 11.3C7.2 8.2 8.8 5.4 12 3zm0 11.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z"/></svg>',
    sail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3L4 17h9V3zm2 5v9h5l-5-9zM3 19h18v2H3z"/></svg>',
    grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2" opacity="0.55"/><rect x="3" y="13" width="8" height="8" rx="2" opacity="0.55"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    helix: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 4v3m0 10v3M4 12h3m10 0h3"/></svg>',
    compass: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="16.2 7.8 14 14 7.8 16.2 10 10 16.2 7.8" fill="currentColor" stroke="none"/></svg>',
    leaf: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4C11 4 5 9 5 18c0 .6.1 1.3.2 2h2c-.1-.6-.2-1.3-.2-2 0-3.2 1.8-6.4 6-8.4-2.5 2.5-3.8 5.2-4 8.4 7.2-.2 11-5.2 11-14z"/></svg>',
  };

  function renderAvatar(contact, sizeCls) {
    const cls = sizeCls ? ` ${sizeCls}` : '';
    const tone = esc(contact?.avatarTone || 'tone-blue');
    const name = contact?.name || '客';
    if (contact && contact.avatar) {
      return `<div class="avatar${cls} ${tone}"><img src="${esc(contact.avatar)}" alt="${esc(name)}" loading="lazy" /></div>`;
    }
    return `<div class="avatar${cls} ${tone}">${esc(name[0])}</div>`;
  }

  function renderCompanyLogo(contact) {
    const color = esc(contact?.companyColor || '#335cff');
    const icon = COMPANY_LOGOS[contact?.companyLogo];
    if (icon) {
      return `<div class="company-tile" style="color:${color};background:var(--surface);">${icon}</div>`;
    }
    return `<div class="company-tile" style="color:${color};">${esc(contact?.companyMark || (contact?.company || '企')[0])}</div>`;
  }

  function getActionItems(state) {
    const items = [];
    // 1. Ready AI Reply Drafts
    (state.conversations || []).forEach((conv) => {
      if (conv.aiDraft && conv.aiDraft.status === 'ready') {
        const ct = state.contacts.find((c) => c.id === conv.contactId);
        items.push({
          id: 'act-draft-' + conv.id,
          kind: 'draft',
          kindLabel: 'AI 草稿待审',
          tone: 'info',
          urgency: '立即回复',
          urgencyTone: 'error',
          contact: ct,
          channel: conv.channel,
          time: conv.time,
          latestText: conv.preview,
          actionTitle: conv.aiDraft.body,
          actionSub: conv.aiDraft.source,
          convId: conv.id,
        });
      }
    });

    // 2. Pending Candidate Memories
    (state.contacts || []).forEach((ct) => {
      (ct.memories || []).forEach((m) => {
        if (m.status === 'candidate') {
          items.push({
            id: 'act-mem-' + ct.id + '-' + m.id,
            kind: 'memory',
            kindLabel: '候选客户记忆',
            tone: 'purple',
            urgency: '记忆确认',
            urgencyTone: 'warning',
            contact: ct,
            channel: ct.source,
            time: '刚刚提取',
            latestText: m.text,
            actionTitle: '采纳写入 Mem0 正式客户记忆库',
            actionSub: m.source,
            contactId: ct.id,
            memoryId: m.id,
          });
        }
      });
    });

    // 3. Pending Workbench Proposals
    (state.workbenchRuns || []).forEach((run) => {
      if (run.proposal && run.proposalState === 'pending') {
        items.push({
          id: 'act-prop-' + run.id,
          kind: 'proposal',
          kindLabel: 'Agent 写库提案',
          tone: 'warning',
          urgency: '待审批',
          urgencyTone: 'warning',
          contact: { name: run.agent, company: 'Agent–CRM 工作台', avatarTone: 'tone-blue' },
          channel: 'Ontology',
          time: run.time,
          latestText: run.proposal.title,
          actionTitle: run.proposal.summary,
          actionSub: '支持审批写入与随时撤销',
          runId: run.id,
        });
      }
    });

    // 4. High-value Stalled Deals (>= 48h)
    (state.leads || []).forEach((lead) => {
      if (lead.stage !== 'won' && lead.staleHours >= 48) {
        const ct = state.contacts.find((c) => c.id === lead.contactId);
        items.push({
          id: 'act-stale-' + lead.id,
          kind: 'stalled',
          kindLabel: '高价值停滞',
          tone: 'error',
          urgency: '停滞 ' + lead.staleHours + 'h',
          urgencyTone: 'error',
          contact: ct,
          channel: '商机漏斗',
          time: fmtCny(lead.valueCents),
          latestText: lead.title + ' · 超过 48 小时未推进',
          actionTitle: '建议在工作台运行「本体论停滞诊断」',
          actionSub: '结合客户记忆生成合规回访方案',
          leadId: lead.id,
        });
      }
    });

    return items;
  }

  function channelMicroIcon(channel) {
    if (channel === 'WhatsApp') return `<span class="ch-icon wa" title="WhatsApp">${MINI_SVG.wa}</span>`;
    if (channel === '微信客服' || channel === '微信私域') return `<span class="ch-icon wx" title="微信">${MINI_SVG.wx}</span>`;
    return `<span class="ch-icon mail" title="${esc(channel)}">${MINI_SVG.mail}</span>`;
  }

  function renderReachIcons(c) {
    const ch = c.channels || { wa: false, wx: false, mail: !!c.email, phone: !!c.phone };
    return `
      <div class="reach-row">
        <span class="ch-icon ${ch.wa ? 'wa' : 'muted-ch'}" title="${ch.wa ? 'WhatsApp 已连通' : '未开通 WhatsApp'}">${MINI_SVG.wa}</span>
        <span class="ch-icon ${ch.wx ? 'wx' : 'muted-ch'}" title="${ch.wx ? '微信客服已连通' : '未关联微信'}">${MINI_SVG.wx}</span>
        <span class="ch-icon ${ch.mail ? 'mail' : 'muted-ch'}" title="${esc(c.email || '暂无邮箱')}">${MINI_SVG.mail}</span>
        <span class="ch-icon ${ch.phone ? 'phone' : 'muted-ch'}" title="${esc(c.phone || '暂不支持电话')}">${MINI_SVG.phone}</span>
      </div>`;
  }

  function computeContactLiveState(c, state) {
    const conv = state.conversations.find((x) => x.contactId === c.id);
    const lead = state.leads.find((x) => x.contactId === c.id);
    const candCount = (c.memories || []).filter((m) => m.status === 'candidate').length;
    const hasDraft = !!(conv && conv.aiDraft && conv.aiDraft.status === 'ready');
    const isHuman = !!(conv && conv.status === 'human');
    const isStalled = !!(lead && lead.stage !== 'won' && lead.staleHours >= 48);

    let badgeTone = 'success';
    if (c.crmCategory === 'stalled' || isStalled) badgeTone = 'error';
    else if (c.crmCategory === 'review' || isHuman) badgeTone = 'warning';
    else if (c.crmCategory === 'customer') badgeTone = 'purple';

    let signalHtml = '';
    if (hasDraft && candCount > 0) {
      signalHtml = `<div class="ai-signal cobalt">${MINI_SVG.sparkle} AI 草稿就绪 <span class="ai-signal-sep">·</span> ${candCount} 条记忆待审</div>`;
    } else if (hasDraft) {
      signalHtml = `<div class="ai-signal cobalt">${MINI_SVG.sparkle} AI 草稿就绪 <span class="ai-signal-sep">·</span> 等待一键批准</div>`;
    } else if (candCount > 0) {
      signalHtml = `<div class="ai-signal">${MINI_SVG.sparkle} AI 提取记忆 <span class="ai-signal-sep">·</span> 待人工确认 (${candCount})</div>`;
    } else if (isHuman) {
      signalHtml = `<div class="ai-signal">${MINI_SVG.sparkle} 人工接管中 <span class="ai-signal-sep">·</span> 自动外发已静默</div>`;
    } else if (c.aiSignal && c.aiSignal.sub) {
      signalHtml = `<div class="ai-signal muted-sig">${esc(c.aiSignal.text)} <span class="ai-signal-sep">·</span> ${esc(c.aiSignal.sub)}</div>`;
    } else {
      signalHtml = `<div class="ai-signal muted-sig">已确认 ${(c.memories || []).length} 条客户记忆</div>`;
    }

    return { conv, lead, candCount, hasDraft, isHuman, isStalled, badgeTone, signalHtml };
  }

  /* ========================================================================
     1. Overview Dashboard (/app)
     ======================================================================== */
  function renderHome(state) {
    const openLeads = state.leads.filter((l) => l.stage !== 'won');
    const totalPipeline = openLeads.reduce((s, l) => s + l.valueCents, 0);
    const actionItems = getActionItems(state);
    const unreadConvs = state.conversations.reduce((s, c) => s + (c.unread || 0), 0);
    const pendingMem = state.contacts.reduce(
      (s, c) => s + c.memories.filter((m) => m.status === 'candidate').length,
      0
    );
    const draftsReady = state.conversations.filter((c) => c.aiDraft && c.aiDraft.status === 'ready').length;

    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">概览看板</h1>
            <p class="page-desc">实时汇总商机漏斗、AI 待审批草稿、客户记忆候选与受控执行状态。</p>
          </div>
          <div class="page-actions">
            <button class="btn" data-nav="/app/ai/workbench">打开 Agent 工作台</button>
            <button class="btn primary" data-nav="/app/actions">
              ${MINI_SVG.sparkle} 处理待人工拍板 (${actionItems.length})
            </button>
          </div>
        </div>

        <div class="kpi-strip">
          <div class="kpi-cell clickable" data-nav="/app/kanban">
            <div class="kpi-icon-box">${MINI_SVG.wallet}</div>
            <div class="kpi-label">进行中商机总额</div>
            <div class="kpi-val">${fmtCny(totalPipeline)}</div>
            <div class="kpi-sub">${openLeads.length} 笔活跃商机 · 2 笔高价值停滞</div>
          </div>
          <div class="kpi-cell clickable" data-nav="/app/actions">
            <div class="kpi-icon-box" style="color:var(--info-fg);background:var(--info-bg);border-color:var(--info-border);">${MINI_SVG.sparkle}</div>
            <div class="kpi-label">待人工拍板队列</div>
            <div class="kpi-val">${actionItems.length}</div>
            <div class="kpi-sub">含 ${draftsReady} 条已就绪 AI 回复草稿</div>
          </div>
          <div class="kpi-cell clickable" data-nav="/app/inbox">
            <div class="kpi-icon-box">${MINI_SVG.inbox}</div>
            <div class="kpi-label">收件箱未读消息</div>
            <div class="kpi-val">${unreadConvs}</div>
            <div class="kpi-sub">WhatsApp & 微信客服统一归并</div>
          </div>
          <div class="kpi-cell clickable" data-nav="/app/ai/memory">
            <div class="kpi-icon-box">${MINI_SVG.brain}</div>
            <div class="kpi-label">待审核客户记忆</div>
            <div class="kpi-val">${pendingMem}</div>
            <div class="kpi-sub">Mem0 闭环候选 · 确认后生效</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="data-shell">
            <div class="data-shell-head">
              <div>
                <div class="data-shell-title">待人工拍板精选</div>
                <div class="data-shell-sub">AI 已完成阅读与起草，等待你一键确认执行</div>
              </div>
              <button class="btn sm ghost" data-nav="/app/actions">查看全部 ${MINI_SVG.arrowRight}</button>
            </div>
            <div class="table-card">
              ${
                actionItems.length === 0
                  ? `<div style="padding:36px 20px;text-align:center;" class="muted small">所有待拍板事项均已处理完毕</div>`
                  : actionItems
                      .slice(0, 4)
                      .map((it) => `
                        <div style="padding:13px 14px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;gap:12px;">
                          <div style="min-width:0;flex:1;">
                            <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px;flex-wrap:wrap;">
                              <strong style="font-size:13.5px;">${esc(it.contact?.name || '客户')}</strong>
                              <span class="xs muted">${esc(it.contact?.company || '')}</span>
                              <span class="badge ${it.tone}"><span class="dot"></span>${esc(it.kindLabel)}</span>
                            </div>
                            <div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(it.latestText)}</div>
                          </div>
                          <div style="flex-shrink:0;">
                            ${
                              it.kind === 'draft'
                                ? `<button class="btn xs primary" data-approve-draft="${it.convId}">批准发送</button>`
                                : it.kind === 'memory'
                                  ? `<button class="btn xs primary" data-confirm-mem="${it.contactId}:${it.memoryId}">确认记忆</button>`
                                  : `<button class="btn xs" data-run-stalled-wb="1">去诊断</button>`
                            }
                          </div>
                        </div>`)
                      .join('')
              }
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div>
                  <div class="data-shell-title">近期跟进任务</div>
                  <div class="data-shell-sub">与客户记忆时间窗自动对齐的销售待办</div>
                </div>
                <button class="btn sm ghost" data-nav="/app/tasks">全部任务</button>
              </div>
              ${state.tasks
                .slice(0, 4)
                .map(
                  (t) => `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);">
                  <div style="display:flex;align-items:center;gap:10px;min-width:0;">
                    <input type="checkbox" data-toggle-task="${t.id}" ${t.status === 'done' ? 'checked' : ''} style="accent-color:var(--accent);width:15px;height:15px;cursor:pointer;" />
                    <div style="min-width:0;">
                      <div style="font-weight:500;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${t.status === 'done' ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${esc(t.title)}</div>
                      <div class="xs muted">${esc(t.dueLabel)}</div>
                    </div>
                  </div>
                  <span class="badge ${t.status === 'done' ? 'success' : t.priority === 'urgent' ? 'error' : 'warning'}">
                    <span class="dot"></span>${t.status === 'done' ? '已完成' : t.priority === 'urgent' ? '紧急' : '待处理'}
                  </span>
                </div>`
                )
                .join('')}
            </div>

            <div class="card" style="background:var(--bg-weak);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span class="data-shell-title" style="font-size:13.5px;">Pi Native 安全与可信架构运行态</span>
                <button class="btn xs" data-nav="/app/ai/evals">查看 7 维评测</button>
              </div>
              <div class="grid-2" style="gap:10px;">
                <div style="padding:11px 12px;border-radius:10px;background:var(--surface);border:1px solid var(--border);">
                  <div style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:12.5px;">
                    <span class="badge info" style="padding:1px 6px;">Ontology v1.0</span>
                    <span>口径先验门禁</span>
                  </div>
                  <div class="xs muted" style="margin-top:5px;">只读角色 <span class="mono">ontology_reader</span> + RLS 行列隔离，零越权写库。</div>
                </div>
                <div style="padding:11px 12px;border-radius:10px;background:var(--surface);border:1px solid var(--border);">
                  <div style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:12.5px;">
                    <span class="badge purple" style="padding:1px 6px;">Mem0 Loop</span>
                    <span>确认式记忆闭环</span>
                  </div>
                  <div class="xs muted" style="margin-top:5px;">区分候选与已确认记忆，外发动作默认受「入站 ≠ 同意」守卫。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     2. NEW Flagship View: Action Required (/app/actions)
     ======================================================================== */
  function renderActions(state) {
    const allItems = getActionItems(state);
    const q = (state.actionsSearch || '').trim().toLowerCase();
    const filtered = allItems.filter((it) => {
      if (state.actionsFilter !== 'all' && it.kind !== state.actionsFilter) return false;
      if (q) {
        const hay = `${it.contact?.name || ''} ${it.contact?.company || ''} ${it.latestText} ${it.actionTitle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const draftCount = allItems.filter((x) => x.kind === 'draft').length;
    const memCount = allItems.filter((x) => x.kind === 'memory').length;
    const riskCount = allItems.filter((x) => x.kind === 'stalled' || x.kind === 'proposal').length;

    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">待人工拍板</h1>
            <p class="page-desc">AI 已完成全渠道会话分类、草稿起草与记忆提取。在状态写入或消息外发前，由你一键批准、编辑或忽略。</p>
          </div>
          <div class="page-actions">
            <button class="btn" data-nav="/app/ai/workbench">进入 Agent 工作台</button>
          </div>
        </div>

        <div class="kpi-strip">
          <div class="kpi-cell clickable" data-actions-filter="all">
            <div class="kpi-icon-box">${MINI_SVG.inbox}</div>
            <div class="kpi-label">待拍板总数</div>
            <div class="kpi-val">${allItems.length}</div>
            <div class="kpi-sub">跨渠道与 AI 中台统一聚合</div>
          </div>
          <div class="kpi-cell clickable" data-actions-filter="draft">
            <div class="kpi-icon-box" style="color:var(--info-fg);background:var(--info-bg);border-color:var(--info-border);">${MINI_SVG.sparkle}</div>
            <div class="kpi-label">待审 AI 回复草稿</div>
            <div class="kpi-val">${draftCount}</div>
            <div class="kpi-sub">引用知识库起草 · 审批后外发</div>
          </div>
          <div class="kpi-cell clickable" data-actions-filter="memory">
            <div class="kpi-icon-box" style="color:var(--purple-fg);background:var(--purple-bg);border-color:var(--purple-border);">${MINI_SVG.brain}</div>
            <div class="kpi-label">候选客户记忆</div>
            <div class="kpi-val">${memCount}</div>
            <div class="kpi-sub">人工采纳后写入正式画像</div>
          </div>
          <div class="kpi-cell clickable" data-actions-filter="stalled">
            <div class="kpi-icon-box" style="color:var(--warning-fg);background:var(--warning-bg);border-color:var(--warning-border);">${MINI_SVG.alert}</div>
            <div class="kpi-label">停滞风险与提案</div>
            <div class="kpi-val">${riskCount}</div>
            <div class="kpi-sub">超过 48h 未推进的高价值商机</div>
          </div>
        </div>

        <div class="data-shell">
          <div class="data-shell-head">
            <div>
              <div class="data-shell-title">审批与决策队列</div>
              <div class="data-shell-sub">共 ${filtered.length} 项待处理 · 遵循「入站 ≠ 外发同意」安全边界</div>
            </div>
            <div class="data-shell-tools">
              <div class="segmented">
                ${[
                  ['all', '全部', allItems.length],
                  ['draft', 'AI 草稿', draftCount],
                  ['memory', '候选记忆', memCount],
                  ['stalled', '停滞与提案', riskCount],
                ]
                  .map(
                    ([k, label, cnt]) =>
                      `<button class="seg-btn ${state.actionsFilter === k ? 'active' : ''}" data-actions-filter="${k}">${label} <span class="seg-count">${cnt}</span></button>`
                  )
                  .join('')}
              </div>
              <div class="input-search-wrap" style="width:220px;">
                ${MINI_SVG.search}
                <input class="input" id="actions-search" placeholder="搜索客户、公司或内容..." value="${esc(state.actionsSearch)}" />
              </div>
            </div>
          </div>

          <div class="table-card">
            ${
              filtered.length === 0
                ? `<div style="padding:56px 24px;text-align:center;">
                     <div style="width:44px;height:44px;border-radius:12px;background:var(--success-bg);color:var(--success-fg);display:inline-grid;place-items:center;margin-bottom:12px;">${MINI_SVG.check}</div>
                     <div style="font-weight:600;font-size:15px;">当前队列已清空</div>
                     <div class="small muted" style="margin-top:4px;">所有待审批 AI 草稿与客户记忆都已处理完毕，可随时重置演示数据重新体验。</div>
                   </div>`
                : `<table>
                     <thead>
                       <tr>
                         <th style="width:200px;">客户 / 来源</th>
                         <th style="width:155px;">AI 识别分类</th>
                         <th>客户最新信号</th>
                         <th>AI 建议动作 / 草稿预览</th>
                         <th style="width:190px;text-align:right;">一键拍板</th>
                       </tr>
                     </thead>
                     <tbody>
                       ${filtered
                         .map((it) => `
                           <tr>
                             <td>
                               <div class="entity-cell">
                                 ${renderAvatar(it.contact)}
                                 <div style="min-width:0;">
                                   <div class="entity-name">${esc(it.contact?.name || '未知')}</div>
                                   <div class="entity-sub">${esc(it.contact?.company || '')}</div>
                                 </div>
                               </div>
                             </td>
                             <td>
                               <span class="badge ${it.tone}"><span class="dot"></span>${esc(it.kindLabel)}</span>
                               <div class="xs muted" style="margin-top:5px;">${esc(it.channel)} · ${esc(it.time)}</div>
                             </td>
                             <td style="max-width:260px;">
                               <div style="font-size:13px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                                 ${esc(it.latestText)}
                               </div>
                             </td>
                             <td style="max-width:300px;">
                               <div style="font-size:13px;color:var(--text);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                                 ${esc(it.actionTitle)}
                               </div>
                               <div class="xs" style="margin-top:4px;color:var(--success-fg);display:flex;align-items:center;gap:4px;min-width:0;">
                                 <span style="flex-shrink:0;display:inline-grid;place-items:center;">${MINI_SVG.check}</span>
                                 <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(it.actionSub)}</span>
                               </div>
                             </td>
                             <td style="text-align:right;">
                               <div style="display:inline-flex;gap:6px;align-items:center;justify-content:flex-end;">
                                 ${
                                   it.kind === 'draft'
                                     ? `<button class="btn sm primary" data-approve-draft="${it.convId}">${MINI_SVG.send} 批准发送</button>
                                        <button class="btn sm" data-open-conv="${it.convId}">编辑</button>`
                                     : it.kind === 'memory'
                                       ? `<button class="btn sm primary" data-confirm-mem="${it.contactId}:${it.memoryId}">采纳入库</button>
                                          <button class="btn sm ghost" data-reject-mem="${it.contactId}:${it.memoryId}">忽略</button>`
                                       : it.kind === 'proposal'
                                         ? `<button class="btn sm primary" data-prop-action="approve" data-run-id="${it.runId}">批准写入</button>`
                                         : `<button class="btn sm" data-run-stalled-wb="1">工作台诊断</button>`
                                 }
                               </div>
                             </td>
                           </tr>`)
                         .join('')}
                     </tbody>
                   </table>`
            }
          </div>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     3. Contacts & Companies (/app/contacts) — AgentSDR /leads Craft Level!
     ======================================================================== */
  function renderContacts(state) {
    const f = state.contactsFilters || { source: 'all', category: 'all', onlyPendingMem: false, onlyActionReq: false, onlyStalled: false };
    const q = (state.contactsSearch || '').trim().toLowerCase();
    const activeFilterCount =
      (f.source !== 'all' ? 1 : 0) +
      (f.category !== 'all' ? 1 : 0) +
      (f.onlyPendingMem ? 1 : 0) +
      (f.onlyActionReq ? 1 : 0) +
      (f.onlyStalled ? 1 : 0);

    const sources = Array.from(new Set(state.contacts.map((c) => c.source)));

    const filteredContacts = state.contacts.filter((c) => {
      const live = computeContactLiveState(c, state);
      if (f.source !== 'all' && c.source !== f.source) return false;
      if (f.category !== 'all' && c.crmCategory !== f.category) return false;
      if (f.onlyPendingMem && live.candCount === 0) return false;
      if (f.onlyActionReq && !(live.hasDraft || live.candCount > 0 || live.isHuman)) return false;
      if (f.onlyStalled && !live.isStalled) return false;
      if (q) {
        const hay = `${c.name} ${c.title || ''} ${c.company} ${c.domain || ''} ${c.email} ${c.crmStatus || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // Companies aggregation
    const companyMap = new Map();
    state.contacts.forEach((c) => {
      const lead = state.leads.find((l) => l.contactId === c.id);
      if (!companyMap.has(c.company)) {
        companyMap.set(c.company, {
          name: c.company,
          domain: c.domain || 'example.cn',
          mark: c.companyMark || c.company[0],
          color: c.companyColor || '#335cff',
          contacts: [],
          pipelineCents: 0,
          memCount: 0,
          status: c.crmStatus || '跟进中',
          category: c.crmCategory || 'interested',
        });
      }
      const co = companyMap.get(c.company);
      co.contacts.push(c);
      co.memCount += (c.memories || []).length;
      if (lead) co.pipelineCents += lead.valueCents;
    });
    const companies = Array.from(companyMap.values()).filter((co) => {
      if (!q) return true;
      return `${co.name} ${co.domain} ${co.status}`.toLowerCase().includes(q);
    });

    const drawerContact = state.drawerContactId
      ? state.contacts.find((c) => c.id === state.drawerContactId)
      : null;

    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">客户与线索</h1>
            <p class="page-desc">每一位可触达的联系人与企业档案，实时同步沟通渠道、AI 客户记忆与商机状态。</p>
          </div>
          <div class="page-actions">
            <button class="btn primary" data-action="new-contact">+ 新建联系人</button>
          </div>
        </div>

        <div class="underline-tabs">
          <button class="underline-tab ${state.contactsTab === 'people' ? 'active' : ''}" data-contacts-tab="people">
            ${MINI_SVG.users} 联系人 <span class="tab-count">${state.contacts.length}</span>
          </button>
          <button class="underline-tab ${state.contactsTab === 'companies' ? 'active' : ''}" data-contacts-tab="companies">
            ${MINI_SVG.building} 企业档案 <span class="tab-count">${companyMap.size}</span>
          </button>
        </div>

        <div class="data-shell">
          <div class="data-shell-head">
            <div>
              <div class="data-shell-title">${state.contactsTab === 'people' ? '联系人列表' : '企业客户档案'}</div>
              <div class="data-shell-sub">${
                state.contactsTab === 'people'
                  ? `显示 ${filteredContacts.length} / ${state.contacts.length} 位联系人 · 点击任意行查看客户 360° 抽屉`
                  : `共 ${companies.length} 家企业 · 汇总关联商机与记忆条目`
              }</div>
            </div>
            <div class="data-shell-tools">
              <div class="input-search-wrap" style="width:230px;">
                ${MINI_SVG.search}
                <input class="input" id="contacts-search" placeholder="${state.contactsTab === 'people' ? '搜索姓名、职位、公司...' : '搜索企业名或域名...'}" value="${esc(state.contactsSearch)}" />
              </div>
              ${
                state.contactsTab === 'people'
                  ? `<div class="popover-anchor">
                       <button class="btn sm ${activeFilterCount > 0 ? 'primary' : ''}" id="toggle-contacts-filter">
                         ${MINI_SVG.filter} 筛选${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                       </button>
                       ${
                         state.contactsFilterOpen
                           ? `<div class="filter-popover" id="contacts-filter-popover">
                                <div class="filter-pop-head">
                                  <strong style="font-size:14px;">筛选条件</strong>
                                  <button class="btn xs ghost" id="clear-contacts-filter">清空全部</button>
                                </div>
                                <div class="filter-field">
                                  <label>线索来源</label>
                                  <select class="select" id="cf-source" style="height:34px;padding:0 10px;">
                                    <option value="all">全部来源</option>
                                    ${sources.map((s) => `<option value="${esc(s)}" ${f.source === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}
                                  </select>
                                </div>
                                <div class="filter-field">
                                  <label>CRM 意向分类</label>
                                  <select class="select" id="cf-category" style="height:34px;padding:0 10px;">
                                    <option value="all">全部分类</option>
                                    <option value="interested" ${f.category === 'interested' ? 'selected' : ''}>意向明确</option>
                                    <option value="review" ${f.category === 'review' ? 'selected' : ''}>法务 / 预算评估</option>
                                    <option value="stalled" ${f.category === 'stalled' ? 'selected' : ''}>高价值停滞</option>
                                    <option value="customer" ${f.category === 'customer' ? 'selected' : ''}>已签约客户</option>
                                  </select>
                                </div>
                                <div style="display:flex;flex-direction:column;gap:8px;padding-top:4px;border-top:1px solid var(--border-subtle);">
                                  <label class="check-row"><input type="checkbox" id="cf-action" ${f.onlyActionReq ? 'checked' : ''} /> 仅看 AI 变更 / 需人工拍板</label>
                                  <label class="check-row"><input type="checkbox" id="cf-mem" ${f.onlyPendingMem ? 'checked' : ''} /> 仅看含待审核客户记忆</label>
                                  <label class="check-row"><input type="checkbox" id="cf-stalled" ${f.onlyStalled ? 'checked' : ''} /> 仅看停滞超过 48h 商机</label>
                                </div>
                              </div>`
                           : ''
                       }
                     </div>`
                  : ''
              }
            </div>
          </div>

          <div class="table-card">
            ${
              state.contactsTab === 'people'
                ? `<table>
                     <thead>
                       <tr>
                         <th style="min-width:190px;">联系人</th>
                         <th style="min-width:190px;">企业</th>
                         <th style="width:130px;">触达渠道</th>
                         <th style="min-width:190px;">关联商机</th>
                         <th style="min-width:255px;">CRM 与 AI 状态</th>
                       </tr>
                     </thead>
                     <tbody>
                       ${
                         filteredContacts.length === 0
                           ? `<tr><td colspan="5" style="text-align:center;padding:38px;" class="muted small">没有符合筛选条件的联系人</td></tr>`
                           : filteredContacts
                               .map((c) => {
                                 const live = computeContactLiveState(c, state);
                                 const stObj = live.lead ? window.DEMO_STAGES.find((s) => s.id === live.lead.stage) : null;
                                 return `
                                   <tr class="clickable-row" data-open-drawer="${c.id}">
                                     <td>
                                       <div class="entity-cell">
                                         ${renderAvatar(c)}
                                         <div style="min-width:0;">
                                           <div class="entity-name">${esc(c.name)}</div>
                                           <div class="entity-sub">${esc(c.title || c.source)}</div>
                                         </div>
                                       </div>
                                     </td>
                                     <td>
                                       <div class="entity-cell">
                                         ${renderCompanyLogo(c)}
                                         <div style="min-width:0;">
                                           <div class="entity-name">${esc(c.company)}</div>
                                           <div class="entity-sub">${esc(c.domain || c.email.split('@')[1] || '')}</div>
                                         </div>
                                       </div>
                                     </td>
                                     <td>${renderReachIcons(c)}</td>
                                     <td>
                                       ${
                                         live.lead
                                           ? `<div style="font-weight:500;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px;">${esc(live.lead.title.split('—')[1]?.trim() || live.lead.title)}</div>
                                              <div class="xs muted tabular" style="margin-top:3px;display:flex;align-items:center;gap:6px;">
                                                <strong style="color:var(--text-sub);">${fmtCny(live.lead.valueCents)}</strong>
                                                <span>·</span>
                                                <span>${esc(stObj?.name || '')}</span>
                                              </div>`
                                           : `<span class="xs muted">暂无活跃商机</span>`
                                       }
                                     </td>
                                     <td>
                                       <div>
                                         <span class="badge ${live.badgeTone}"><span class="dot"></span>${esc(c.crmStatus || c.source)}</span>
                                       </div>
                                       <div style="margin-top:5px;">${live.signalHtml}</div>
                                     </td>
                                   </tr>`;
                               })
                               .join('')
                       }
                     </tbody>
                   </table>`
                : `<table>
                     <thead>
                       <tr>
                         <th>企业名称</th>
                         <th>主联系人</th>
                         <th>活跃商机总额</th>
                         <th>沉淀记忆</th>
                         <th>当前状态</th>
                       </tr>
                     </thead>
                     <tbody>
                       ${companies
                         .map((co) => `
                           <tr class="clickable-row" data-open-drawer="${co.contacts[0].id}">
                             <td>
                               <div class="entity-cell">
                                 ${renderCompanyLogo(co.contacts[0])}
                                 <div>
                                   <div class="entity-name">${esc(co.name)}</div>
                                   <div class="entity-sub">${esc(co.domain)}</div>
                                 </div>
                               </div>
                             </td>
                             <td>
                               <div style="font-weight:500;">${esc(co.contacts.map((x) => x.name).join('、'))}</div>
                               <div class="xs muted">${esc(co.contacts[0].title || '')}</div>
                             </td>
                             <td class="tabular" style="font-weight:600;">${co.pipelineCents > 0 ? fmtCny(co.pipelineCents) : '—'}</td>
                             <td><span class="badge purple">${co.memCount} 条记忆</span></td>
                             <td><span class="badge ${co.category === 'stalled' ? 'error' : co.category === 'customer' ? 'purple' : 'success'}"><span class="dot"></span>${esc(co.status)}</span></td>
                           </tr>`)
                         .join('')}
                     </tbody>
                   </table>`
            }
          </div>
        </div>

        ${drawerContact ? renderContactDrawer(drawerContact, state) : ''}
      </div>
    `;
  }

  function renderContactDrawer(c, state) {
    const live = computeContactLiveState(c, state);
    return `
      <div class="drawer-backdrop" id="contact-drawer-backdrop">
        <div class="drawer-panel">
          <div class="drawer-head">
            <div class="entity-cell">
              ${renderAvatar(c, 'lg')}
              <div>
                <div style="font-weight:650;font-size:17px;">${esc(c.name)}</div>
                <div class="small muted">${esc(c.title || '联系人')} · ${esc(c.company)}</div>
              </div>
            </div>
            <button class="btn icon ghost" id="close-drawer" title="关闭">✕</button>
          </div>
          <div class="drawer-body">
            <div>
              <div class="panel-section-title">基础档案与触达方式</div>
              <div class="card" style="padding:14px;display:flex;flex-direction:column;gap:8px;font-size:13px;">
                <div style="display:flex;justify-content:space-between;"><span class="muted">企业域名</span><span class="mono small">${esc(c.domain || '—')}</span></div>
                <div style="display:flex;justify-content:space-between;"><span class="muted">手机号</span><span class="tabular">${esc(c.phone)}</span></div>
                <div style="display:flex;justify-content:space-between;"><span class="muted">邮箱</span><span class="small">${esc(c.email)}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center;"><span class="muted">触达渠道</span>${renderReachIcons(c)}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;"><span class="muted">CRM 状态</span><span class="badge ${live.badgeTone}"><span class="dot"></span>${esc(c.crmStatus || c.source)}</span></div>
              </div>
            </div>

            ${
              live.lead
                ? `<div>
                     <div class="panel-section-title">关联商机</div>
                     <div class="card" style="padding:14px;">
                       <div style="font-weight:600;font-size:14px;">${esc(live.lead.title)}</div>
                       <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                         <span class="tabular" style="font-size:18px;font-weight:700;">${fmtCny(live.lead.valueCents)}</span>
                         <select class="select" data-lead-stage="${live.lead.id}" style="width:auto;height:30px;padding:0 10px;font-size:12.5px;">
                           ${window.DEMO_STAGES.map((s) => `<option value="${s.id}" ${live.lead.stage === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}
                         </select>
                       </div>
                     </div>
                   </div>`
                : ''
            }

            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div class="panel-section-title" style="margin:0;">客户记忆闭环 (${(c.memories || []).length})</div>
                <button class="btn xs ghost" data-nav="/app/ai/memory">全部记忆</button>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${(c.memories || [])
                  .map(
                    (m) => `
                  <div class="mem-card">
                    <div style="font-size:13px;line-height:1.5;">${esc(m.text)}</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px;">
                      <span class="badge ${m.status === 'confirmed' ? 'success' : 'warning'}"><span class="dot"></span>${m.status === 'confirmed' ? '已确认记忆' : '待审核候选'}</span>
                      ${
                        m.status === 'candidate'
                          ? `<div style="display:flex;gap:5px;">
                               <button class="btn xs primary" data-confirm-mem="${c.id}:${m.id}">确认</button>
                               <button class="btn xs ghost" data-reject-mem="${c.id}:${m.id}">忽略</button>
                             </div>`
                          : `<span class="xs muted">${esc(m.source)}</span>`
                      }
                    </div>
                  </div>`
                  )
                  .join('')}
              </div>
            </div>
          </div>
          <div class="drawer-foot">
            ${live.conv ? `<button class="btn primary" style="flex:1;" data-open-conv="${live.conv.id}">前往收件箱沟通</button>` : ''}
            <button class="btn" style="flex:1;" data-action="quick-task" data-contact="${c.id}">+ 新建跟进任务</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     4. Master Inbox (/app/inbox) — AgentSDR-Grade Chat + AI Draft + Details
     ======================================================================== */
  function renderInbox(state) {
    const q = (state.inboxSearch || '').trim().toLowerCase();
    const draftCount = state.conversations.filter((c) => c.aiDraft && c.aiDraft.status === 'ready').length;
    const unreadCount = state.conversations.filter((c) => c.unread > 0).length;
    const detailsOpen = state.inboxDetailsOpen !== false;

    const filtered = state.conversations.filter((c) => {
      const contact = state.contacts.find((x) => x.id === c.contactId);
      if (state.inboxFilter === 'unread' && !c.unread) return false;
      if (state.inboxFilter === 'draft' && !(c.aiDraft && c.aiDraft.status === 'ready')) return false;
      if (state.inboxFilter === 'human' && c.status !== 'human') return false;
      if (q) {
        const hay = `${contact?.name || ''} ${contact?.company || ''} ${c.preview}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const active = state.conversations.find((c) => c.id === state.activeConvId) || filtered[0] || state.conversations[0];
    const contact = state.contacts.find((x) => x.id === active?.contactId);
    const lead = state.leads.find((x) => x.id === active?.leadId);
    const stageObj = lead ? window.DEMO_STAGES.find((s) => s.id === lead.stage) : null;
    const draftExpanded = !!(active && state.inboxDraftExpanded && state.inboxDraftExpanded[active.id]);

    const todayConvs = filtered.filter((c) => c.group !== '更早');
    const earlierConvs = filtered.filter((c) => c.group === '更早');

    function renderConvRow(c) {
      const ct = state.contacts.find((x) => x.id === c.contactId);
      const isActive = active && active.id === c.id;
      const hasDraft = !!(c.aiDraft && c.aiDraft.status === 'ready');
      return `
        <div class="conv-item ${isActive ? 'active' : ''} ${c.unread ? 'is-unread' : ''}" data-conv-id="${c.id}">
          ${c.unread ? '<span class="conv-unread-bar"></span>' : ''}
          ${renderAvatar(ct, 'md')}
          <div class="conv-body">
            <div class="conv-top">
              <div class="conv-name">${esc(ct?.name || '未知客户')}<span class="conv-company">${esc(ct?.company || '')}</span></div>
              <span class="xs soft tabular" style="flex-shrink:0;">${esc(c.time)}</span>
            </div>
            <div class="conv-preview-row">
              <div class="conv-preview">${esc(c.preview)}</div>
              ${c.unread > 0 ? `<span class="unread-count-pill">${c.unread}</span>` : ''}
            </div>
            <div class="conv-badges">
              ${hasDraft ? `<span class="ai-draft-pill">${MINI_SVG.sparkle} AI 草稿</span>` : ''}
              <span class="badge ${c.intentTone || 'outline'}" style="font-size:11px;padding:1px 6px;">${esc(c.intent || c.channel)}</span>
              ${channelMicroIcon(c.channel)}
            </div>
          </div>
        </div>`;
    }

    // Build message list with subtle day dividers
    let lastDay = '';
    const messagesHtml = active
      ? active.messages
          .map((m, idx) => {
            const dayLabel = m.day || (idx === 0 ? (active.group || '今天') : '');
            let divider = '';
            if (dayLabel && dayLabel !== lastDay) {
              lastDay = dayLabel;
              divider = `<div class="chat-day-divider">${esc(dayLabel)}</div>`;
            }
            if (m.type === 'handoff') {
              return `${divider}
                <div class="handoff-card">
                  <span style="display:inline-flex;align-items:center;gap:7px;">${MINI_SVG.shield} ${esc(m.text)}</span>
                  <span class="xs soft tabular">${esc(m.time)}</span>
                </div>`;
            }
            if (m.type === 'note') {
              return `${divider}
                <div class="msg-row note">
                  <div class="msg-bubble">
                    <div style="display:flex;align-items:center;gap:6px;font-weight:600;color:var(--warning-fg);margin-bottom:3px;font-size:12px;">
                      ${MINI_SVG.sparkle} ${esc(m.sender || '系统提示')}
                      <span style="font-weight:400;color:var(--text-soft);margin-left:auto;">${esc(m.time)}</span>
                    </div>
                    <div>${esc(m.text)}</div>
                  </div>
                </div>`;
            }
            const isOut = m.type === 'outbound';
            return `${divider}
              <div class="msg-row ${m.type}">
                <div class="msg-sender-line">
                  <span class="msg-sender-name">${esc(m.sender || (isOut ? '你' : contact?.name || '客户'))}</span>
                  ${m.badge ? `<span class="badge purple" style="font-size:10.5px;padding:0 6px;">${esc(m.badge)}</span>` : ''}
                </div>
                <div class="msg-bubble">
                  <div>${esc(m.text)}</div>
                  <div class="msg-bubble-foot">
                    <span>${esc(m.time)}</span>
                    ${isOut ? `<span class="read-ticks" title="已送达并已读">${MINI_SVG.doubleCheck}</span>` : ''}
                  </div>
                </div>
              </div>`;
          })
          .join('')
      : '';

    return `
      <div class="inbox-shell">
        <div class="page-header" style="margin-bottom:14px;">
          <div>
            <h1 class="page-title">会话收件箱</h1>
            <p class="page-desc">全渠道客户会话归并一处，AI 自动分类并起草回复，人工一键审核外发。</p>
          </div>
          <div class="page-actions">
            <span class="xs muted" style="display:inline-flex;align-items:center;gap:5px;">
              <span class="kbd">J</span><span class="kbd">K</span> 切换会话
            </span>
            <button class="btn sm" data-nav="/app/actions">待拍板队列</button>
          </div>
        </div>

        <div class="inbox-layout ${detailsOpen ? '' : 'no-details'}">
          <div class="inbox-list-col">
            <div class="inbox-list-head">
              <div class="input-search-wrap">
                ${MINI_SVG.search}
                <input class="input" id="inbox-search" placeholder="搜索联系人、企业或消息..." value="${esc(state.inboxSearch)}" />
              </div>
              <div class="inbox-tabs">
                ${[
                  ['all', '全部', state.conversations.length],
                  ['draft', 'AI 草稿', draftCount],
                  ['unread', '未读', unreadCount],
                  ['human', '人工接管', state.conversations.filter((x) => x.status === 'human').length],
                ]
                  .map(
                    ([k, label, cnt]) =>
                      `<button class="inbox-tab ${state.inboxFilter === k ? 'active' : ''}" data-inbox-filter="${k}">${label}${cnt > 0 ? ` <span class="tab-count">${cnt}</span>` : ''}</button>`
                  )
                  .join('')}
              </div>
            </div>
            <div class="conv-scroll">
              ${
                filtered.length === 0
                  ? `<div class="muted small" style="padding:28px 16px;text-align:center;">没有匹配的会话</div>`
                  : `${todayConvs.length ? `<div class="conv-group-title">今天</div>${todayConvs.map(renderConvRow).join('')}` : ''}
                     ${earlierConvs.length ? `<div class="conv-group-title">更早</div>${earlierConvs.map(renderConvRow).join('')}` : ''}`
              }
            </div>
            <div class="inbox-list-footer">
              <span>共 ${filtered.length} 个会话</span>
              <span>外发审批护栏已开启</span>
            </div>
          </div>

          <div class="inbox-thread-col">
            ${
              active
                ? `
              <div class="thread-header">
                <div class="entity-cell" style="gap:12px;">
                  ${renderAvatar(contact, 'md')}
                  <div style="min-width:0;">
                    <div style="font-weight:650;font-size:15px;color:var(--text);line-height:1.25;">${esc(contact?.name)}</div>
                    <div class="thread-head-meta" style="flex-wrap:nowrap;overflow:hidden;">
                      <span class="badge ${active.intentTone || 'success'}" style="font-size:11.5px;padding:1px 7px;flex-shrink:0;">
                        <span class="dot"></span>${esc(active.intent || '跟进中')}
                      </span>
                      ${channelMicroIcon(active.channel)}
                      <span class="xs muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(active.channel)} · ${esc(contact?.company || '')}</span>
                    </div>
                  </div>
                </div>
                <div class="thread-head-actions">
                  <button class="thread-icon-btn" data-open-drawer-from-inbox="${contact?.id || ''}" title="查看客户 360° 档案">
                    ${MINI_SVG.userCard}
                  </button>
                  <button class="thread-icon-btn" data-action="toggle-conv-mode" data-conv="${active.id}" title="切换 AI 托管 / 人工接管">
                    <span>${active.status === 'human' ? '恢复 AI 托管' : '人工接管'}</span>
                  </button>
                  <button class="thread-icon-btn ${detailsOpen ? 'active' : ''}" data-toggle-details="1" title="${detailsOpen ? '收起右侧详情' : '展开右侧详情'}">
                    ${MINI_SVG.panelRight}
                  </button>
                </div>
              </div>

              <div class="thread-messages" id="thread-scroll">
                ${messagesHtml}
              </div>

              ${
                active.aiDraft && active.aiDraft.status === 'ready'
                  ? `
                <div class="ai-draft-card">
                  <div class="ai-draft-head">
                    <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                      <span class="ai-sparkle-box">${MINI_SVG.sparkle}</span>
                      <span style="font-weight:650;font-size:13px;color:var(--text);white-space:nowrap;flex-shrink:0;">AI 回复已就绪</span>
                      <span class="xs muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">· ${esc(active.aiDraft.source)}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                      ${
                        draftExpanded
                          ? `<button class="btn xs ghost" data-discard-draft="${active.id}">丢弃</button>
                             <button class="btn sm primary" data-approve-draft="${active.id}">${MINI_SVG.send} 批准并发送</button>`
                          : `<button class="btn sm primary" data-toggle-draft-expand="${active.id}">审核草稿</button>`
                      }
                    </div>
                  </div>
                  <div class="ai-draft-body">
                    ${
                      draftExpanded
                        ? `<textarea class="ai-draft-textarea" id="ai-draft-editor" rows="3">${esc(active.aiDraft.body)}</textarea>`
                        : `<div class="ai-draft-preview-text">${esc(active.aiDraft.body)}</div>
                           <button class="ai-draft-link" data-toggle-draft-expand="${active.id}">展开完整草稿并编辑</button>`
                    }
                  </div>
                  ${
                    draftExpanded
                      ? `<div class="ai-draft-foot">
                           <span class="xs" style="color:var(--success-fg);display:inline-flex;align-items:center;gap:4px;">
                             ${MINI_SVG.check} ${esc(active.aiDraft.guardNote)}
                           </span>
                           <button class="ai-draft-link" style="margin:0;color:var(--text-muted);" data-toggle-draft-expand="${active.id}">收起草稿</button>
                         </div>`
                      : ''
                  }
                </div>`
                  : ''
              }

              <div class="composer">
                <div class="composer-unified ${state.composerMode === 'note' ? 'note-mode' : ''}">
                  <textarea class="composer-input-clean" id="inbox-input" rows="2" placeholder="${
                    state.composerMode === 'note'
                      ? `添加关于 ${esc(contact?.name || '客户')} 的团队内部备注（仅内部可见）...`
                      : `回复 ${esc(contact?.name || '客户')}…`
                  }"></textarea>
                  <div class="composer-bar">
                    <div class="composer-bar-left">
                      <span style="display:inline-flex;align-items:center;gap:5px;white-space:nowrap;flex-shrink:0;" class="xs muted">
                        ${channelMicroIcon(active.channel)}
                        <span>Alex</span>
                      </span>
                      <span style="color:var(--border-strong);flex-shrink:0;">·</span>
                      <button class="composer-pill-toggle ${state.composerMode === 'reply' ? 'active' : ''}" data-composer-mode="reply" style="white-space:nowrap;flex-shrink:0;">回复</button>
                      <button class="composer-pill-toggle ${state.composerMode === 'note' ? 'active' : ''}" data-composer-mode="note" style="white-space:nowrap;flex-shrink:0;">内部备注</button>
                      <select class="select" id="tpl-picker" style="width:104px;max-width:120px;height:26px;padding:0 6px;font-size:11.5px;border-radius:6px;flex-shrink:1;min-width:74px;">
                        <option value="">模板…</option>
                        ${state.templates.map((t) => `<option value="${esc(t.content)}">${esc(t.title)}</option>`).join('')}
                      </select>
                    </div>
                    <button class="btn sm primary" id="send-inbox-msg" style="flex-shrink:0;">${MINI_SVG.send} 发送</button>
                  </div>
                </div>
              </div>
            `
                : `<div style="margin:auto;text-align:center;padding:32px;">
                     <div style="width:44px;height:44px;border-radius:12px;border:1px solid var(--border);background:var(--bg-weak);display:inline-grid;place-items:center;color:var(--text-muted);margin-bottom:12px;">${MINI_SVG.inbox}</div>
                     <div style="font-weight:600;">选择一个会话开始处理</div>
                     <div class="small muted" style="margin-top:6px;">
                       <span class="kbd">J</span> <span class="kbd">K</span> 切换线程 · <span class="kbd">⌘K</span> 全局跳转
                     </div>
                   </div>`
            }
          </div>

          ${
            detailsOpen && contact
              ? `
            <div class="inbox-crm-col">
              <div class="details-top-bar">
                <span>客户详情</span>
                <button class="sidebar-icon-btn" data-toggle-details="1" title="关闭详情栏">✕</button>
              </div>

              <div class="details-section">
                ${renderAvatar(contact, 'lg')}
                <div style="font-weight:650;font-size:16px;margin-top:11px;color:var(--text);">${esc(contact.name)}</div>
                <div class="small muted" style="margin-top:2px;">${esc(contact.title || '联系人')}</div>
                <div class="xs muted" style="margin-top:4px;display:flex;align-items:center;gap:5px;">
                  ${MINI_SVG.building} <span>${esc(contact.company)}</span>
                </div>
                <div style="display:flex;gap:7px;margin-top:12px;">
                  <button class="btn sm" style="flex:1;" data-open-drawer-from-inbox="${contact.id}">${MINI_SVG.userCard} CRM 档案</button>
                  <button class="btn sm" data-nav="/app/ai/workbench">工作台诊断</button>
                </div>
              </div>

              <div class="details-section">
                <div class="panel-section-title">CRM 与商机状态</div>
                <div class="kv-grid">
                  <span class="kv-label">意向状态</span>
                  <span class="kv-val"><span style="color:var(--success);margin-right:4px;">●</span>${esc(active.intent || contact.crmStatus)}</span>
                  <span class="kv-label">关联金额</span>
                  <span class="kv-val tabular">${lead ? fmtCny(lead.valueCents) : '—'}</span>
                  <span class="kv-label">漏斗阶段</span>
                  <span>
                    ${
                      lead
                        ? `<select class="select" data-lead-stage="${lead.id}" style="height:26px;padding:0 6px;font-size:12px;border-radius:6px;">
                             ${window.DEMO_STAGES.map((s) => `<option value="${s.id}" ${lead.stage === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}
                           </select>`
                        : '<span class="xs muted">—</span>'
                    }
                  </span>
                  <span class="kv-label">渠道归属</span>
                  <span class="kv-val">${esc(active.channel)} · ${esc(stageObj?.name || '跟进中')}</span>
                  <span class="kv-label">托管模式</span>
                  <span class="kv-val">${active.status === 'human' ? '人工接管中' : 'AI 自动托管'}</span>
                </div>
              </div>

              <div class="details-section">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">
                  <h4 class="panel-section-title" style="margin:0;">客户记忆闭环 (${contact.memories.length})</h4>
                  <button class="btn xs ghost" data-nav="/app/ai/memory">全部</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${contact.memories
                    .map(
                      (m) => `
                    <div class="mem-card">
                      <div style="font-size:12.5px;line-height:1.5;">${esc(m.text)}</div>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:6px;">
                        <span class="badge ${m.status === 'confirmed' ? 'success' : 'warning'}" style="font-size:11px;">
                          <span class="dot"></span>${m.status === 'confirmed' ? '已确认' : '待审核'}
                        </span>
                        ${
                          m.status === 'candidate'
                            ? `<div style="display:flex;gap:4px;">
                                 <button class="btn xs primary" data-confirm-mem="${contact.id}:${m.id}">确认</button>
                                 <button class="btn xs ghost" data-reject-mem="${contact.id}:${m.id}">忽略</button>
                               </div>`
                            : ''
                        }
                      </div>
                    </div>`
                    )
                    .join('')}
                </div>
              </div>

              <div class="details-section">
                <div class="panel-section-title">联系方式</div>
                <div class="kv-grid">
                  <span class="kv-label">电话</span>
                  <span class="kv-val tabular">${esc(contact.phone)}</span>
                  <span class="kv-label">邮箱</span>
                  <span class="kv-val">${esc(contact.email)}</span>
                </div>
                <button class="btn sm" style="width:100%;margin-top:12px;" data-action="quick-task" data-contact="${contact.id}">+ 为该客户创建跟进任务</button>
              </div>
            </div>`
              : ''
          }
        </div>
      </div>
    `;
  }

  /* ========================================================================
     5. Sequences / Followups Library (/app/ai/followups) — 100% Chinese!
     ======================================================================== */
  function renderFollowupsList(state) {
    const seqs = state.sequences || [];
    const q = (state.sequencesSearch || '').trim().toLowerCase();
    const publishedCount = seqs.filter((s) => s.status === 'published').length;
    const autoCount = seqs.filter((s) => s.autoSend).length;
    const totalEnrolled = seqs.reduce((sum, s) => sum + (s.enrolledCount || 0), 0);
    const draftCount = seqs.filter((s) => s.status === 'draft').length;

    const filtered = seqs.filter((s) => {
      if (state.sequencesTab === 'published' && s.status !== 'published') return false;
      if (state.sequencesTab === 'draft' && s.status !== 'draft') return false;
      if (q && !`${s.name} ${s.desc}`.toLowerCase().includes(q)) return false;
      return true;
    });

    function renderStepDots(count) {
      let dots = '';
      for (let i = 0; i < Math.min(count, 5); i++) {
        dots += `<span class="step-dot ${i === 0 ? 'active' : ''}"></span>`;
      }
      return `<span class="step-dots">${dots}</span>`;
    }

    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">跟进流程（Sequences）</h1>
            <p class="page-desc">面向不同商机状态的可复用自动化跟进编排。默认等待人工批准后外发；点击任意流程可进入可视化画布编辑器。</p>
          </div>
          <div class="page-actions">
            <button class="btn" data-nav="/app/ai/followups/11111111-1111-4111-8111-111111111111">
              ${MINI_SVG.flow} 打开流程画布
            </button>
            <button class="btn primary" data-action="new-sequence">+ 新建跟进流程</button>
          </div>
        </div>

        <div class="kpi-strip cols-3">
          <div class="kpi-cell">
            <div class="kpi-icon-box">${MINI_SVG.send}</div>
            <div class="kpi-label">已发布流程</div>
            <div class="kpi-val">${publishedCount}</div>
            <div class="kpi-sub">${draftCount} 项草稿 · 全部支持版本快照</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-icon-box">${MINI_SVG.flow}</div>
            <div class="kpi-label">已纳管客户</div>
            <div class="kpi-val">${totalEnrolled}</div>
            <div class="kpi-sub">命中客户记忆禁区时自动跳过</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-icon-box">${MINI_SVG.shield}</div>
            <div class="kpi-label">开启自动外发</div>
            <div class="kpi-val">${autoCount}</div>
            <div class="kpi-sub">其余 ${seqs.length - autoCount} 项强制进入人工审批队列</div>
          </div>
        </div>

        <div class="data-shell">
          <div class="data-shell-head">
            <div>
              <div class="data-shell-title">流程模板库</div>
              <div class="data-shell-sub">一次编排、发布版本，随后绑定到对应商机阶段或沉默触发器。</div>
            </div>
            <div class="data-shell-tools">
              <div class="segmented">
                <button class="seg-btn ${state.sequencesTab === 'all' ? 'active' : ''}" data-seq-tab="all">全部 <span class="seg-count">${seqs.length}</span></button>
                <button class="seg-btn ${state.sequencesTab === 'published' ? 'active' : ''}" data-seq-tab="published">已发布 <span class="seg-count">${publishedCount}</span></button>
                <button class="seg-btn ${state.sequencesTab === 'draft' ? 'active' : ''}" data-seq-tab="draft">草稿 <span class="seg-count">${draftCount}</span></button>
              </div>
              <div class="input-search-wrap" style="width:210px;">
                ${MINI_SVG.search}
                <input class="input" id="seq-search" placeholder="搜索跟进流程..." value="${esc(state.sequencesSearch)}" />
              </div>
            </div>
          </div>

          <div class="table-card">
            <table>
              <thead>
                <tr>
                  <th style="min-width:250px;">流程名称</th>
                  <th style="min-width:170px;">执行步骤</th>
                  <th style="min-width:165px;">适用场景</th>
                  <th style="min-width:160px;">外发门禁</th>
                  <th style="width:125px;">版本状态</th>
                  <th style="width:120px;text-align:right;">画布编辑</th>
                </tr>
              </thead>
              <tbody>
                ${filtered
                  .map(
                    (s) => `
                  <tr>
                    <td>
                      <div style="font-weight:600;font-size:13.5px;">${esc(s.name)}</div>
                      <div class="xs muted" style="margin-top:3px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(s.desc)}</div>
                    </td>
                    <td>
                      <div style="font-weight:500;font-size:13px;">${s.stepsCount} 步</div>
                      <div class="xs muted" style="margin-top:4px;display:flex;align-items:center;">
                        ${renderStepDots(s.stepsCount)}<span>${esc(s.stepsSummary)}</span>
                      </div>
                    </td>
                    <td>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${s.categories.map((cat) => `<span class="badge ${cat.tone}">${esc(cat.label)}</span>`).join('')}
                      </div>
                    </td>
                    <td>
                      <div class="switch-row" data-toggle-seq-auto="${s.id}">
                        <button type="button" class="switch-track ${s.autoSend ? 'on' : ''}" aria-label="切换自动外发">
                          <span class="switch-thumb"></span>
                        </button>
                        <span class="small" style="font-weight:500;">${s.autoSend ? '自动跟进' : '等待审批'}</span>
                      </div>
                      <div class="xs muted" style="margin-top:4px;">${esc(s.handoffGuard)}</div>
                    </td>
                    <td>
                      <span class="badge ${s.status === 'published' ? 'success' : 'outline'}">
                        <span class="dot"></span>${s.status === 'published' ? '已发布' : '草稿'}
                      </span>
                      <div class="xs muted" style="margin-top:4px;">${esc(s.version)}</div>
                    </td>
                    <td style="text-align:right;">
                      <button class="btn sm" data-nav="/app/ai/followups/11111111-1111-4111-8111-111111111111">编排画布 →</button>
                    </td>
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     6. Agent-CRM Workbench (/app/ai/workbench) — Business-First Harness
     ======================================================================== */
  function renderWorkbench(state) {
    const scenario = window.DEMO_SCENARIOS.find((s) => s.id === state.activeScenarioId) || window.DEMO_SCENARIOS[0];

    return `
      <div class="workbench-layout">
        <div class="workbench-main">
          <div class="workbench-topbar">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <strong style="font-size:15px;">Agent–CRM 工作台</strong>
              <select class="select" id="wb-agent" style="width:auto;height:32px;padding:0 10px;font-size:12.5px;">
                ${['商机诊断 Agent', '记忆整理 Agent', '销售跟进 Agent', '客服分流 Agent']
                  .map((a) => `<option ${state.workbenchAgent === a ? 'selected' : ''}>${a}</option>`)
                  .join('')}
              </select>
              <div class="segmented">
                <button class="seg-btn ${state.workbenchMode === 'controlled' ? 'active' : ''}" data-wb-mode="controlled">受控行动 · 需审批</button>
                <button class="seg-btn ${state.workbenchMode === 'readonly' ? 'active' : ''}" data-wb-mode="readonly">只读调查</button>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${window.DEMO_SCENARIOS.map(
                (sc) => `
                <button class="btn sm ${state.activeScenarioId === sc.id ? 'primary' : ''}" data-run-scenario="${sc.id}">
                  ▶ ${esc(sc.title.split('：')[0])}
                </button>`
              ).join('')}
            </div>
          </div>

          <div class="workbench-stream" id="wb-stream">
            ${
              state.workbenchRuns.length === 0
                ? `
              <div style="max-width:760px;margin:28px auto;width:100%;">
                <div style="margin-bottom:18px;">
                  <span class="badge info" style="margin-bottom:10px;">${MINI_SVG.sparkle} 受控执行链路演示</span>
                  <h2 style="margin:0;font-size:21px;font-weight:650;letter-spacing:-0.02em;">选择内置诊断场景，或直接向 CRM 发起自然语言任务</h2>
                  <p class="small muted" style="margin:6px 0 0;">每次运行均依次经过「业务本体论口径校验 → Mem0 客户记忆读取 → 持久化 Trace → 人工审批写库提案」。</p>
                </div>
                <div class="grid-2" style="gap:12px;">
                  ${window.DEMO_SCENARIOS.map(
                    (sc) => `
                    <button class="scenario-pick-card" data-run-scenario="${sc.id}">
                      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;">
                        <span class="badge ${sc.id === 'ontology-stalled' ? 'info' : 'purple'}">${esc(sc.tag || '内置场景')}</span>
                        <span class="xs" style="color:var(--info-fg);font-weight:600;">运行演示 →</span>
                      </div>
                      <div style="font-weight:600;font-size:14px;color:var(--text);margin-top:4px;">${esc(sc.title)}</div>
                      <div class="xs muted" style="line-height:1.5;">${esc(sc.desc || sc.prompt)}</div>
                    </button>`
                  ).join('')}
                </div>
              </div>`
                : state.workbenchRuns
                    .map(
                      (run) => `
                  <div class="card" style="max-width:880px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap;">
                      <div style="display:flex;align-items:center;gap:8px;">
                        <span class="badge info"><span class="dot"></span>${esc(run.agent)}</span>
                        <strong style="font-size:14px;">${esc(run.prompt)}</strong>
                      </div>
                      <span class="xs soft mono">${esc(run.time)}</span>
                    </div>

                    ${run.steps
                      .map(
                        (st) => `
                      <details class="trace-step">
                        <summary>
                          <span style="display:inline-flex;align-items:center;gap:7px;">
                            <span style="color:var(--success-fg);">${MINI_SVG.check}</span>
                            <span>${esc(st.name)}</span>
                          </span>
                          <span class="badge success" style="font-size:11px;">${esc(st.status)}</span>
                        </summary>
                        <pre class="trace-pre">${esc(JSON.stringify(st.detail, null, 2))}</pre>
                      </details>`
                      )
                      .join('')}

                    ${
                      run.evidence
                        ? `
                      <details class="trace-step" open style="border-color:var(--accent-soft-border);margin-top:10px;background:var(--surface);">
                        <summary>
                          <span style="font-weight:600;">语义依据与查询回执（OntologyEvidence）</span>
                          <span class="badge ${run.evidence.status === 'full' ? 'success' : 'warning'}"><span class="dot"></span>${esc(run.evidence.status)}</span>
                        </summary>
                        <div class="xs" style="margin-top:10px;display:grid;grid-template-columns:108px 1fr;gap:5px 12px;">
                          <span class="muted">定义版本</span><span class="mono">${esc(run.evidence.ontologyVersion)}</span>
                          <span class="muted">查询范围</span><span>${esc(run.evidence.scope)}</span>
                          <span class="muted">权限隔离</span><span>${esc(run.evidence.visibility)}</span>
                          <span class="muted">语义路径</span><span class="mono">${esc(run.evidence.relations)}</span>
                          <span class="muted">查询回执</span><span class="mono">${esc(run.evidence.template)}</span>
                        </div>
                      </details>`
                        : ''
                    }

                    <div style="margin-top:14px;padding:13px 15px;border-radius:10px;background:var(--bg-weak);border:1px solid var(--border-subtle);white-space:pre-line;font-size:13.5px;line-height:1.65;">
                      ${fmtReply(run.reply)}
                    </div>

                    ${
                      run.proposal
                        ? `
                      <div class="proposal-box">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                          <div style="flex:1;min-width:220px;">
                            <div style="display:flex;align-items:center;gap:6px;font-weight:600;font-size:13.5px;color:var(--text);">
                              ${MINI_SVG.sparkle} 待审批写入提案：${esc(run.proposal.title)}
                            </div>
                            <div class="small muted" style="margin-top:3px;">${esc(run.proposal.summary)}</div>
                          </div>
                          <div style="display:flex;gap:6px;align-items:center;">
                            ${
                              run.proposalState === 'pending'
                                ? `<button class="btn sm primary" data-prop-action="approve" data-run-id="${run.id}">批准并写入 CRM</button>
                                   <button class="btn sm danger" data-prop-action="reject" data-run-id="${run.id}">拒绝</button>`
                                : run.proposalState === 'approved'
                                  ? `<span class="badge success"><span class="dot"></span>已批准写入</span>
                                     <button class="btn sm" data-prop-action="undo" data-run-id="${run.id}">撤销变更</button>`
                                  : `<span class="badge error"><span class="dot"></span>已拒绝</span>`
                            }
                          </div>
                        </div>
                      </div>`
                        : ''
                    }
                  </div>`
                    )
                    .join('')
            }
          </div>

          <div class="composer">
            <div class="composer-box">
              <input class="input" id="wb-prompt-input" placeholder="输入工作台指令，例如：检查本周未跟进的重点商机并生成回访任务..." />
              <button class="btn primary" id="wb-run-custom">${MINI_SVG.sparkle} 运行 Agent</button>
            </div>
          </div>
        </div>

        <div class="workbench-side">
          <div>
            <h4 class="panel-section-title">Mission 方向与外发护栏</h4>
            <div class="card" style="padding:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;">
                <span style="font-weight:600;font-size:13px;">审批后允许外发</span>
                <button type="button" class="switch-track ${!state.outboundPaused ? 'on' : ''}" data-action="toggle-outbound" aria-label="切换外发护栏">
                  <span class="switch-thumb"></span>
                </button>
              </div>
              <div class="xs muted" style="line-height:1.5;">
                ${state.outboundPaused ? '当前已启用紧急静默：拦截一切对外消息发送。' : '遵循「入站 ≠ 同意」边界，所有对客动作必须先经过人工审批。'}
              </div>
            </div>
          </div>

          <div>
            <h4 class="panel-section-title">当前活跃场景</h4>
            <div class="card" style="padding:14px;">
              <span class="badge info" style="margin-bottom:7px;">${esc(scenario.tag || '内置场景')}</span>
              <div style="font-weight:600;font-size:13.5px;line-height:1.4;">${esc(scenario.title)}</div>
              <div class="xs muted" style="margin-top:6px;line-height:1.5;">${esc(scenario.prompt)}</div>
            </div>
          </div>

          <details class="security-collapse">
            <summary>
              <span style="display:inline-flex;align-items:center;gap:6px;">${MINI_SVG.shield} 底层数据库与权限边界</span>
              <span class="xs soft">展开</span>
            </summary>
            <div style="display:flex;flex-direction:column;gap:6px;margin-top:10px;">
              <div class="badge outline mono" style="font-size:11.5px;">role: ontology_reader (只读)</div>
              <div class="badge outline mono" style="font-size:11.5px;">isolation: Postgres RLS + 列授权</div>
              <div class="badge outline mono" style="font-size:11.5px;">seq: fn_append_workbench_event</div>
            </div>
          </details>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     7. Sales Funnel Kanban (/app/kanban)
     ======================================================================== */
  function renderKanban(state) {
    const openSum = state.leads.filter((l) => l.stage !== 'won').reduce((s, l) => s + l.valueCents, 0);
    const wonSum = state.leads.filter((l) => l.stage === 'won').reduce((s, l) => s + l.valueCents, 0);

    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">销售漏斗</h1>
            <p class="page-desc">拖拽卡片或使用底部快捷步进键推进商机阶段，停滞超 48 小时自动亮灯提示。</p>
          </div>
          <div class="page-actions">
            <span class="badge outline tabular">进行中 ${fmtCny(openSum)} · 已签约 ${fmtCny(wonSum)}</span>
            <button class="btn primary" data-action="new-lead">+ 新建商机</button>
          </div>
        </div>

        <div class="kanban-board">
          ${window.DEMO_STAGES.map((st, stIdx) => {
            const items = state.leads.filter((l) => l.stage === st.id);
            const sum = items.reduce((s, l) => s + l.valueCents, 0);
            return `
              <div class="kanban-col" data-stage-drop="${st.id}">
                <div class="kanban-col-head">
                  <span style="display:inline-flex;align-items:center;">
                    <span class="stage-dot" style="background:${esc(st.color || 'var(--accent)')};"></span>
                    ${esc(st.name)} <span class="tab-count" style="margin-left:6px;">${items.length}</span>
                  </span>
                  <span class="xs muted tabular" style="font-weight:600;">${fmtCny(sum)}</span>
                </div>
                ${items
                  .map((l) => {
                    const ct = state.contacts.find((c) => c.id === l.contactId);
                    const conv = state.conversations.find((x) => x.leadId === l.id);
                    const hasDraft = !!(conv && conv.aiDraft && conv.aiDraft.status === 'ready');
                    return `
                      <div class="lead-card" draggable="true" data-lead-drag="${l.id}">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">
                          <div style="font-weight:600;font-size:13.5px;line-height:1.4;">${esc(l.title)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                          <span class="tabular" style="font-weight:700;font-size:15px;">${fmtCny(l.valueCents)}</span>
                          ${
                            l.staleHours >= 48
                              ? `<span class="badge error"><span class="dot"></span>停滞 ${l.staleHours}h</span>`
                              : hasDraft
                                ? `<span class="ai-draft-pill">${MINI_SVG.sparkle} AI 草稿</span>`
                                : `<span class="badge outline">${esc(ct?.company || '')}</span>`
                          }
                        </div>
                        <div class="lead-card-foot">
                          <div class="entity-cell" style="gap:7px;">
                            ${renderAvatar(ct, 'xs')}
                            <span class="xs muted">${esc(ct?.name || '')}</span>
                          </div>
                          <div class="stage-step-btns">
                            <button class="stage-step-btn" data-lead-move="${l.id}:${stIdx > 0 ? window.DEMO_STAGES[stIdx - 1].id : ''}" ${stIdx === 0 ? 'disabled' : ''} title="移至上一阶段">←</button>
                            <button class="stage-step-btn" data-lead-move="${l.id}:${stIdx < window.DEMO_STAGES.length - 1 ? window.DEMO_STAGES[stIdx + 1].id : ''}" ${stIdx === window.DEMO_STAGES.length - 1 ? 'disabled' : ''} title="推进至下一阶段">→</button>
                          </div>
                        </div>
                      </div>`;
                  })
                  .join('')}
              </div>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  /* ========================================================================
     8. Customer Memory & Rules (/app/ai/memory)
     ======================================================================== */
  function renderMemory(state) {
    const totalMem = state.contacts.reduce((s, c) => s + c.memories.length, 0);
    const confirmedMem = state.contacts.reduce((s, c) => s + c.memories.filter((m) => m.status === 'confirmed').length, 0);
    const candMem = totalMem - confirmedMem;

    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">客户记忆与组织规则</h1>
            <p class="page-desc">确认式客户记忆闭环：管理全局 AI 护栏规则，以及每位客户的已确认偏好与待审核候选。</p>
          </div>
        </div>

        <div class="kpi-strip cols-3">
          <div class="kpi-cell">
            <div class="kpi-icon-box">${MINI_SVG.shield}</div>
            <div class="kpi-label">生效组织级规则</div>
            <div class="kpi-val">${state.orgRules.length}</div>
            <div class="kpi-sub">org_memory_versions 版本受控</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-icon-box" style="color:var(--success-fg);background:var(--success-bg);border-color:var(--success-border);">${MINI_SVG.check}</div>
            <div class="kpi-label">已确认客户记忆</div>
            <div class="kpi-val">${confirmedMem}</div>
            <div class="kpi-sub">跨会话注入推理上下文</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-icon-box" style="color:var(--warning-fg);background:var(--warning-bg);border-color:var(--warning-border);">${MINI_SVG.brain}</div>
            <div class="kpi-label">待审核候选记忆</div>
            <div class="kpi-val">${candMem}</div>
            <div class="kpi-sub">确认后生效 · 忽略立即丢弃</div>
          </div>
        </div>

        <div class="data-shell" style="margin-bottom:20px;">
          <div class="data-shell-head">
            <div>
              <div class="data-shell-title">组织级 AI 护栏规则</div>
              <div class="data-shell-sub">全局强制约束，所有 Agent 与自动跟进序列必须遵守</div>
            </div>
          </div>
          <div class="grid-3">
            ${state.orgRules
              .map(
                (r) => `
              <div class="card" style="padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;">
                  <strong style="font-size:13.5px;">${esc(r.title)}</strong>
                  <span class="badge success"><span class="dot"></span>生效中</span>
                </div>
                <div class="small muted" style="line-height:1.55;">${esc(r.body)}</div>
                <div class="xs soft" style="margin-top:10px;">来源：${esc(r.source)}</div>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <h3 style="margin:0 0 12px;font-size:15px;font-weight:600;">客户级记忆与候选审核</h3>
        <div class="grid-2">
          ${state.contacts
            .map(
              (c) => `
            <div class="card" style="padding:16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div class="entity-cell">
                  ${renderAvatar(c, 'sm')}
                  <div>
                    <div class="entity-name">${esc(c.name)}</div>
                    <div class="entity-sub">${esc(c.company)}</div>
                  </div>
                </div>
                <span class="badge purple">${c.memories.length} 条记忆</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                ${c.memories
                  .map(
                    (m) => `
                  <div class="mem-card">
                    <div style="font-size:13px;line-height:1.5;">${esc(m.text)}</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px;flex-wrap:wrap;">
                      <span class="xs soft">${esc(m.source)}</span>
                      <div style="display:flex;gap:6px;align-items:center;">
                        <span class="badge ${m.status === 'confirmed' ? 'success' : 'warning'}">
                          <span class="dot"></span>${m.status === 'confirmed' ? '已确认' : '待审核'}
                        </span>
                        ${
                          m.status === 'candidate'
                            ? `<button class="btn xs primary" data-confirm-mem="${c.id}:${m.id}">采纳</button>
                               <button class="btn xs ghost" data-reject-mem="${c.id}:${m.id}">忽略</button>`
                            : ''
                        }
                      </div>
                    </div>
                  </div>`
                  )
                  .join('')}
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  /* ========================================================================
     9. Ontology & Evals (/app/ai/evals)
     ======================================================================== */
  function renderEvals() {
    const terms = [
      { key: 'deal.stalled_high_value', label: '高价值停滞商机', def: 'value_cents >= 2000000 且超过 48h 无入站/推进事件' },
      { key: 'memory.confirmed_constraint', label: '已确认客户约束', def: '经人工或高置信度确认、写入 customer_memories 的联系/预算边界' },
      { key: 'consent.outbound_boundary', label: '外发同意边界', def: '入站消息不构成自动外发同意，需显式授权或审批通过' },
    ];
    const dims = [
      ['口径可回答性校验', 96],
      ['只读角色权限隔离', 100],
      ['客户记忆约束遵守', 94],
      ['工具调用参数准确性', 92],
      ['审批与可回滚提案', 98],
      ['外发同意边界守卫', 100],
      ['端到端交付完整度', 89],
    ];
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">业务本体论与评测基准</h1>
            <p class="page-desc">语义层目录（Catalog v1.0.0）、PG15 / PG17 双库不变式门禁与 7 维量化评测摘要。</p>
          </div>
          <button class="btn primary" data-nav="/app/ai/workbench">在工作台实测本体论查询</button>
        </div>

        <div class="kpi-strip">
          <div class="kpi-cell"><div class="kpi-label">本体论基准集</div><div class="kpi-val">44 题</div><div class="kpi-sub">含独立 SQL Oracle 对照</div></div>
          <div class="kpi-cell"><div class="kpi-label">双库不变式门禁</div><div class="kpi-val">280 组</div><div class="kpi-sub">PG15 & PG17 同步验证</div></div>
          <div class="kpi-cell"><div class="kpi-label">语义工具模块</div><div class="kpi-val">5 个</div><div class="kpi-sub">search / check / query / describe</div></div>
          <div class="kpi-cell"><div class="kpi-label">综合 Judge 评分</div><div class="kpi-val">92 / 100</div><div class="kpi-sub">Pass · 零越权写库</div></div>
        </div>

        <div class="grid-2">
          <div class="card">
            <h3 style="margin:0 0 14px;font-size:15px;">Semantic Catalog v1.0.0 核心口径</h3>
            ${terms
              .map(
                (t) => `
              <div style="padding:12px 0;border-bottom:1px solid var(--border-subtle);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <strong style="font-size:13.5px;">${esc(t.label)}</strong>
                  <code class="xs mono badge outline">${esc(t.key)}</code>
                </div>
                <div class="small muted" style="margin-top:5px;">${esc(t.def)}</div>
              </div>`
              )
              .join('')}
          </div>

          <div class="card">
            <h3 style="margin:0 0 14px;font-size:15px;">7 维量化评测得分</h3>
            <div style="display:flex;flex-direction:column;gap:12px;">
              ${dims
                .map(
                  ([name, score]) => `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
                    <span>${esc(name)}</span>
                    <strong class="tabular">${score}%</strong>
                  </div>
                  <div style="height:7px;border-radius:999px;background:var(--bg-soft);overflow:hidden;">
                    <div style="height:100%;width:${score}%;border-radius:999px;background:${score === 100 ? 'var(--success)' : 'var(--accent)'};"></div>
                  </div>
                </div>`
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     10. Radar, Tasks, Agenda, Templates, Metrics, Settings
     ======================================================================== */
  function renderRadar(state) {
    const atRisk = state.leads.filter((l) => l.stage !== 'won' && l.staleHours >= 24);
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">停滞风险雷达</h1>
            <p class="page-desc">实时识别仍在跟进中但超过 24 小时未推进的高价值商机，避免大客户沉默流失。</p>
          </div>
          <button class="btn primary" data-run-stalled-wb="1">${MINI_SVG.sparkle} 一键本体论诊断</button>
        </div>
        <div class="grid-2">
          ${atRisk
            .map((l) => {
              const ct = state.contacts.find((c) => c.id === l.contactId);
              const conv = state.conversations.find((c) => c.leadId === l.id);
              return `
                <div class="card">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                    <div class="entity-cell">
                      ${renderAvatar(ct)}
                      <div>
                        <div style="font-weight:600;font-size:14.5px;">${esc(l.title)}</div>
                        <div class="xs muted">${esc(ct?.name)} · ${esc(ct?.company)} · <strong class="tabular">${fmtCny(l.valueCents)}</strong></div>
                      </div>
                    </div>
                    <span class="badge error"><span class="dot"></span>停滞 ${l.staleHours}h</span>
                  </div>
                  <div style="display:flex;gap:8px;margin-top:16px;">
                    ${conv ? `<button class="btn sm primary" data-open-conv="${conv.id}">前往收件箱处理</button>` : ''}
                    <button class="btn sm" data-run-stalled-wb="1">在工作台诊断</button>
                  </div>
                </div>`;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  function renderTasks(state) {
    const pending = state.tasks.filter((t) => t.status !== 'done').length;
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">跟进任务</h1>
            <p class="page-desc">共 ${pending} 项待办任务，支持勾选完成状态或新建跟进提醒。</p>
          </div>
          <button class="btn primary" data-action="new-task">+ 新建任务</button>
        </div>
        <div class="data-shell">
          <div class="table-card">
            <table>
              <thead>
                <tr>
                  <th style="width:52px;">完成</th>
                  <th>任务标题</th>
                  <th style="width:150px;">截止时间</th>
                  <th style="width:110px;">优先级</th>
                  <th style="width:160px;">关联客户</th>
                </tr>
              </thead>
              <tbody>
                ${state.tasks
                  .map((t) => {
                    const ct = state.contacts.find((c) => c.id === t.contactId);
                    const priMap = { urgent: ['紧急', 'error'], high: ['高优先', 'warning'], medium: ['常规', 'info'], low: ['低', 'outline'] };
                    const [priLabel, priTone] = priMap[t.priority] || ['常规', 'outline'];
                    return `
                      <tr>
                        <td><input type="checkbox" data-toggle-task="${t.id}" ${t.status === 'done' ? 'checked' : ''} style="accent-color:var(--accent);width:15px;height:15px;cursor:pointer;" /></td>
                        <td style="${t.status === 'done' ? 'text-decoration:line-through;color:var(--text-muted);' : 'font-weight:500;'}">${esc(t.title)}</td>
                        <td class="small muted">${esc(t.dueLabel)}</td>
                        <td><span class="badge ${priTone}"><span class="dot"></span>${priLabel}</span></td>
                        <td>${ct ? `<div class="entity-cell" style="gap:7px;">${renderAvatar(ct, 'xs')}<span>${esc(ct.name)}</span></div>` : '—'}</td>
                      </tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderAgenda(state) {
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">日程预约</h1>
            <p class="page-desc">自动避开客户记忆中的禁呼时段，安排电话回访与产品演示。</p>
          </div>
        </div>
        <div class="grid-2">
          ${state.agenda
            .map(
              (a) => `
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span class="badge ${a.status === '已预约' ? 'success' : 'warning'}"><span class="dot"></span>${esc(a.status)}</span>
                <span class="xs muted">负责人：${esc(a.owner)}</span>
              </div>
              <div style="font-weight:600;font-size:14.5px;margin-bottom:6px;">${esc(a.title)}</div>
              <div class="small muted">${esc(a.time)}</div>
              <div class="xs soft" style="margin-top:5px;">${esc(a.channel)}</div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function renderTemplates(state) {
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">回复模板库</h1>
            <p class="page-desc">经法务与售前核定，可在会话收件箱中一键插入或供 AI 起草引用。</p>
          </div>
        </div>
        <div class="grid-3">
          ${state.templates
            .map(
              (t) => `
            <div class="card">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <strong style="font-size:14px;">${esc(t.title)}</strong>
                <span class="badge info">${esc(t.category)}</span>
              </div>
              <div class="small muted" style="line-height:1.6;">${esc(t.content)}</div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function renderMetrics(state) {
    const won = state.leads.filter((l) => l.stage === 'won');
    const wonSum = won.reduce((s, l) => s + l.valueCents, 0);
    const totalSum = state.leads.reduce((s, l) => s + l.valueCents, 0);
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">指标分析</h1>
            <p class="page-desc">漏斗转化效率、AI 草稿采纳率与客户记忆命中率。</p>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-cell"><div class="kpi-label">总商机池</div><div class="kpi-val">${fmtCny(totalSum)}</div><div class="kpi-sub">${state.leads.length} 笔商机</div></div>
          <div class="kpi-cell"><div class="kpi-label">已签约金额</div><div class="kpi-val">${fmtCny(wonSum)}</div><div class="kpi-sub">${won.length} 笔成交</div></div>
          <div class="kpi-cell"><div class="kpi-label">平均首次响应</div><div class="kpi-val">1m 12s</div><div class="kpi-sub">AI 辅助起草提速 4.6x</div></div>
          <div class="kpi-cell"><div class="kpi-label">AI 记忆命中率</div><div class="kpi-val">94.2%</div><div class="kpi-sub">零违规外发拦截记录</div></div>
        </div>
      </div>
    `;
  }

  function renderSettings(state) {
    return `
      <div class="page-container">
        <div class="page-header">
          <div>
            <h1 class="page-title">工作区设置</h1>
            <p class="page-desc">管理外观主题、架构导览与当前静态演示环境数据。</p>
          </div>
        </div>
        <div class="card" style="max-width:640px;display:flex;flex-direction:column;gap:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong>界面外观主题</strong>
              <div class="small muted">支持极简浅色与 Slate 深色模式实时切换</div>
            </div>
            <button class="btn sm" data-action="toggle-theme">${state.theme === 'dark' ? '切换为浅色' : '切换为深色'}</button>
          </div>
          <hr style="border:0;border-top:1px solid var(--border);margin:0;" />
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong>设计架构导览弹窗</strong>
              <div class="small muted">重新查看系统全景架构、受控状态机与核心工程亮点</div>
            </div>
            <button class="btn sm" id="settings-open-arch">打开架构导览</button>
          </div>
          <hr style="border:0;border-top:1px solid var(--border);margin:0;" />
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <strong>重置演示数据</strong>
              <div class="small muted">清除本地浏览器中的修改记录，恢复初始虚构数据</div>
            </div>
            <button class="btn sm danger" data-action="reset-demo">恢复初始数据</button>
          </div>
        </div>
      </div>
    `;
  }

  return {
    esc,
    getActionItems,
    render(route, state) {
      if (route === '/app/ai/followups') {
        return renderFollowupsList(state);
      }
      if (route.indexOf('/app/ai/followups/') === 0) {
        return `
          <div class="followups-canvas-bar">
            <button class="btn sm ghost" data-nav="/app/ai/followups">← 返回跟进流程列表</button>
            <span class="xs muted">可视化跟进编排画布 · 支持拖拽节点与版本发布演示</span>
          </div>
          <div id="followups-root" data-route="${esc(route)}"></div>`;
      }
      switch (route) {
        case '/app':
          return renderHome(state);
        case '/app/actions':
          return renderActions(state);
        case '/app/inbox':
          return renderInbox(state);
        case '/app/ai/workbench':
          return renderWorkbench(state);
        case '/app/ai/memory':
          return renderMemory(state);
        case '/app/ai/evals':
          return renderEvals();
        case '/app/kanban':
          return renderKanban(state);
        case '/app/contacts':
          return renderContacts(state);
        case '/app/radar':
          return renderRadar(state);
        case '/app/tasks':
          return renderTasks(state);
        case '/app/agenda':
          return renderAgenda(state);
        case '/app/templates':
          return renderTemplates(state);
        case '/app/metrics':
          return renderMetrics(state);
        case '/app/settings':
          return renderSettings(state);
        default:
          return renderContacts(state);
      }
    },
  };
})();
