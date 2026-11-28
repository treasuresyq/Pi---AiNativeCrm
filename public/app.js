'use strict';

(function () {
  const STORAGE_KEY = 'pi_native_crm_static_demo_v3';

  const ICONS = {
    gauge: '<circle cx="12" cy="13" r="8"/><path d="M12 13l3.5-3.5M8.5 17h7"/>',
    sparkleCheck: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    robot: '<rect x="4" y="6" width="16" height="13" rx="3"/><path d="M12 3v3M9 11v2M15 11v2M8 15h8"/>',
    brain: '<path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .5.1 1 .3 1.4A3.5 3.5 0 0 0 5 15.5 3.5 3.5 0 0 0 8.5 19H11V4H9.5ZM14.5 4A3.5 3.5 0 0 1 18 7.5c0 .5-.1 1-.3 1.4A3.5 3.5 0 0 1 19 15.5 3.5 3.5 0 0 1 15.5 19H13V4h1.5Z"/>',
    scales: '<path d="M12 3v18M5 7h14M6 7l-2.5 6h5L6 7ZM18 7l-2.5 6h5L18 7ZM8 21h8"/>',
    inbox: '<path d="M4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M4 13l3.5 5h9L20 13M4 13h4l2 2h4l2-2h4"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l5-5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    kanban: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 10 0v2M16 6a2.5 2.5 0 0 1 0 5M21 20v-2a4 4 0 0 0-3-3.8"/>',
    tasks: '<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
    chart: '<path d="M4 20h16M7 16v-5M12 16V7M17 16v-8"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
    sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M12 18h.01"/>',
    flow: '<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M8 6h5a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H10"/>',
    shield: '<path d="m12 3 8 3v5c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z"/>',
  };

  function svg(name, size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  }

  function loadState() {
    const base = window.createInitialDemoState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Object.assign(base, parsed, {
          contactsFilters: Object.assign(base.contactsFilters, parsed.contactsFilters || {}),
        });
      }
    } catch {}
    return base;
  }

  let state = loadState();
  let toastTimer = null;

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function toast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 2600);
  }

  function getRoute() {
    const h = window.location.hash || '#/app/contacts';
    const path = h.startsWith('#') ? h.slice(1) : h;
    return path || '/app/contacts';
  }

  function navigate(path) {
    state.contactsFilterOpen = false;
    if (getRoute() !== path) {
      window.location.hash = '#' + path;
    } else {
      render();
    }
  }

  function getBadges() {
    const actionRequired = window.DemoViews.getActionItems ? window.DemoViews.getActionItems(state).length : 0;
    return {
      actionRequired,
      unreadInbox: state.conversations.reduce((s, c) => s + (c.unread || 0), 0),
      radarCount: state.leads.filter((l) => l.stage !== 'won' && l.staleHours >= 24).length,
      openTasks: state.tasks.filter((t) => t.status !== 'done').length,
      pendingMemories: state.contacts.reduce((s, c) => s + c.memories.filter((m) => m.status === 'candidate').length, 0),
    };
  }

  function isFollowupsCanvasRoute(route) {
    return route.indexOf('/app/ai/followups/') === 0;
  }

  function navIsActive(itemPath, route) {
    if (itemPath === '/app') return route === '/app';
    return route === itemPath || route.indexOf(itemPath + '/') === 0;
  }

  function mountFollowups() {
    const el = document.getElementById('followups-root');
    if (el && window.PiFollowupsDemo) window.PiFollowupsDemo.mount(el);
  }

  function openModal(title, bodyHtml, onSubmit, okText = '确认') {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <strong style="font-size:16px;">${window.DemoViews.esc(title)}</strong>
          <button class="btn icon ghost" id="modal-close" style="width:28px;height:28px;">✕</button>
        </div>
        <div id="modal-body">${bodyHtml}</div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px;">
          <button class="btn sm" id="modal-cancel">取消</button>
          <button class="btn sm primary" id="modal-ok">${window.DemoViews.esc(okText)}</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    wrap.querySelector('#modal-close').onclick = close;
    wrap.querySelector('#modal-cancel').onclick = close;
    wrap.onclick = (e) => { if (e.target === wrap) close(); };
    wrap.querySelector('#modal-ok').onclick = () => {
      if (onSubmit(wrap) !== false) close();
    };
  }

  function openCommandPalette() {
    document.querySelector('.cmd-backdrop')?.remove();

    const pageItems = [];
    window.DEMO_NAV_GROUPS.forEach((g) => {
      const groupTitle = g.label || '核心工作区';
      g.items.forEach((i) => pageItems.push({ kind: 'page', group: groupTitle, label: i.label, icon: i.icon, path: i.path }));
    });
    pageItems.push({ kind: 'page', group: '分析与设置', label: '指标分析', icon: 'chart', path: '/app/metrics' });
    pageItems.push({ kind: 'page', group: '分析与设置', label: '工作区设置', icon: 'settings', path: '/app/settings' });

    const contactItems = state.contacts.map((c) => ({
      kind: 'contact',
      group: '客户档案',
      label: `${c.name} · ${c.company}`,
      sub: c.crmStatus || c.source,
      contactId: c.id,
      icon: 'users',
    }));

    const allItems = [...pageItems, ...contactItems];
    let selectedIdx = 0;

    const wrap = document.createElement('div');
    wrap.className = 'cmd-backdrop';
    wrap.innerHTML = `
      <div class="cmd-dialog">
        <div class="cmd-input-row">
          <span style="color:var(--text-soft);display:grid;place-items:center;">${svg('search', 16)}</span>
          <input class="cmd-input" id="cmd-q" placeholder="搜索页面、客户、设置或动作..." autocomplete="off" />
          <span class="kbd">Esc</span>
        </div>
        <div class="cmd-list" id="cmd-list"></div>
      </div>`;
    document.body.appendChild(wrap);

    const qEl = wrap.querySelector('#cmd-q');
    const listEl = wrap.querySelector('#cmd-list');
    const close = () => {
      window.removeEventListener('keydown', onKey);
      wrap.remove();
    };
    wrap.onclick = (e) => { if (e.target === wrap) close(); };

    let currentFiltered = allItems;

    function execute(item) {
      close();
      if (!item) return;
      if (item.kind === 'page') {
        navigate(item.path);
      } else if (item.kind === 'contact') {
        state.contactsTab = 'people';
        state.drawerContactId = item.contactId;
        navigate('/app/contacts');
        render();
      }
    }

    function paintList() {
      const val = (qEl.value || '').trim().toLowerCase();
      currentFiltered = allItems.filter((it) => `${it.label} ${it.group} ${it.sub || ''}`.toLowerCase().includes(val));
      if (selectedIdx >= currentFiltered.length) selectedIdx = 0;

      if (currentFiltered.length === 0) {
        listEl.innerHTML = `<div class="small muted" style="padding:24px;text-align:center;">没有匹配的结果</div>`;
        return;
      }

      const grouped = new Map();
      currentFiltered.forEach((it, idx) => {
        if (!grouped.has(it.group)) grouped.set(it.group, []);
        grouped.get(it.group).push({ ...it, idx });
      });

      let html = '';
      grouped.forEach((arr, grp) => {
        html += `<div class="cmd-group-title">${window.DemoViews.esc(grp)}</div>`;
        arr.forEach((it) => {
          html += `
            <button class="cmd-item ${it.idx === selectedIdx ? 'selected' : ''}" data-cmd-idx="${it.idx}">
              ${svg(it.icon, 15)}
              <span>${window.DemoViews.esc(it.label)}</span>
              <span class="cmd-item-hint">${it.idx === selectedIdx ? '↵' : window.DemoViews.esc(it.sub || '›')}</span>
            </button>`;
        });
      });
      listEl.innerHTML = html;

      listEl.querySelectorAll('[data-cmd-idx]').forEach((btn) => {
        btn.onclick = () => execute(currentFiltered[Number(btn.dataset.cmdIdx)]);
      });
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % Math.max(currentFiltered.length, 1);
        paintList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + Math.max(currentFiltered.length, 1)) % Math.max(currentFiltered.length, 1);
        paintList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        execute(currentFiltered[selectedIdx]);
      }
    }

    window.addEventListener('keydown', onKey);
    qEl.addEventListener('input', () => {
      selectedIdx = 0;
      paintList();
    });
    paintList();
    qEl.focus();
  }

  function runScenario(scenarioId) {
    const sc = window.DEMO_SCENARIOS.find((s) => s.id === scenarioId) || window.DEMO_SCENARIOS[0];
    state.activeScenarioId = sc.id;
    state.workbenchAgent = sc.agent;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    state.workbenchRuns.unshift({
      id: 'run-' + Date.now(),
      agent: sc.agent,
      prompt: sc.prompt,
      time,
      steps: sc.steps,
      evidence: sc.evidence,
      reply: sc.reply,
      proposal: sc.proposal,
      proposalState: 'pending',
    });
    saveState();
    render();
    toast('已完成语义核验与受控 Agent 回合');
  }

  function runCustomPrompt(promptText) {
    const text = promptText.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    state.workbenchRuns.unshift({
      id: 'run-' + Date.now(),
      agent: state.workbenchAgent,
      prompt: text,
      time,
      steps: [
        { name: '1. ontology_check_answerable · 口径核验', status: 'full', detail: { query: text, ontologyVersion: '1.0.0', role: 'ontology_reader' } },
        { name: '2. memory_retrieve · 客户记忆检索', status: 'ok', detail: { rulesLoaded: state.orgRules.length, contactsScanned: state.contacts.length } },
      ],
      evidence: {
        status: 'full',
        ontologyVersion: '1.0.0',
        scope: '星云跨境工作区 (0dae91cc)',
        visibility: '只读角色 ontology_reader',
        relations: 'crm_leads → contacts → customer_memories',
        template: `custom_ad_hoc_readonly_v1 · ${state.contacts.length} 条（上限 50 条）`,
      },
      reply: `已基于当前工作区的 **${state.contacts.length} 位客户** 与 **${state.leads.length} 笔商机** 完成只读核验：\n- 指令：「${text}」\n- 当前共有 **${state.leads.filter((l) => l.staleHours >= 48).length} 笔高停滞商机** 需要重点人工跟进。\n- 所有外发建议均受「入站 ≠ 同意」护栏保护，不会未经审批外发。`,
      proposal: null,
      proposalState: 'pending',
    });
    saveState();
    render();
  }

  function approveDraft(convId, overrideText) {
    const conv = state.conversations.find((c) => c.id === convId);
    if (!conv || !conv.aiDraft) return;
    const ct = state.contacts.find((c) => c.id === conv.contactId);
    const body = (overrideText !== undefined ? overrideText : conv.aiDraft.body).trim();
    if (!body) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    conv.messages.push({
      id: 'msg-ai-' + Date.now(),
      type: 'outbound',
      sender: 'Alex（审批 AI 草稿发送）',
      text: body,
      time,
      badge: '人工审批通过 · AI 草稿',
    });
    conv.preview = body;
    conv.time = time;
    conv.unread = 0;
    conv.aiDraft.status = 'sent';
    saveState();
    render();
    toast(`✓ 已批准并发送给 ${ct?.name || '客户'}（演示模式，无真实外发）`);
  }

  function render(opts) {
    const force = !!(opts && opts.force);
    document.documentElement.setAttribute('data-theme', state.theme === 'dark' ? 'dark' : 'light');
    const route = getRoute();
    const followupsRoot = document.getElementById('followups-root');
    if (!force && followupsRoot && isFollowupsCanvasRoute(route) && followupsRoot.dataset.route === route) {
      document.querySelector('.sidebar')?.classList.toggle('collapsed', !!state.sidebarCollapsed);
      return;
    }
    const badges = getBadges();
    const isFlush = route === '/app/inbox' || route === '/app/ai/workbench' || isFollowupsCanvasRoute(route);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-frame">
        <div class="demobar">
          <div class="demobar-center">
            <span class="demobar-dot"></span>
            <span class="demobar-strong">纯静态交互演示</span>
            <span class="demobar-text-long">· 虚构业务数据与受控 AI 模拟，所有操作仅保存在本地浏览器，无真实外发</span>
          </div>
          <div class="demobar-actions">
            <button class="demobar-btn" id="open-arch-intro" type="button">${svg('file', 12)} 架构导览</button>
            <a class="demobar-btn" href="mobile.html#${window.DemoViews.esc(route)}">${svg('smartphone', 12)} 手机端</a>
            <button class="demobar-btn" data-action="reset-demo" type="button">${svg('reset', 12)} 重置数据</button>
          </div>
        </div>

        <div class="shell">
          <aside class="sidebar ${state.sidebarCollapsed ? 'collapsed' : ''}">
            <div class="sidebar-header">
              <div class="brand" data-nav="/app">
                <div class="brand-mark">
                  <svg width="16" height="16" viewBox="0 0 216 216"><g fill="#d79376"><path d="M26 108V43c0-10 8-18 18-18h54c56 0 91 33 91 81s-35 81-91 81H45l34-34h19c35 0 56-17 56-47s-21-47-56-47H60v49Z"/><rect x="26" y="125" width="34" height="34" rx="4"/></g></svg>
                </div>
                <span class="brand-text">Pi Native CRM</span>
              </div>
              <div class="sidebar-head-actions">
                <button class="sidebar-icon-btn theme-btn-desktop" data-action="toggle-theme" title="${state.theme === 'dark' ? '切换浅色模式' : '切换深色模式'}">
                  ${state.theme === 'dark' ? svg('sun', 16) : svg('moon', 16)}
                </button>
                <button class="sidebar-icon-btn" id="toggle-sidebar" title="${state.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}">
                  ${svg('sidebar', 16)}
                </button>
              </div>
            </div>

            <div class="sidebar-search-wrap">
              <button class="sidebar-search-btn" id="open-cmd" type="button">
                ${svg('search', 14)}
                <span class="sidebar-search-text">搜索或跳转…</span>
                <span class="kbd">⌘K</span>
              </button>
            </div>

            <nav class="sidebar-nav">
              ${window.DEMO_NAV_GROUPS.map(
                (g) => `
                <div class="nav-group">
                  ${g.label ? `<div class="nav-group-label">${window.DemoViews.esc(g.label)}</div>` : ''}
                  ${g.items
                    .map((it) => {
                      const count = it.badgeKey ? badges[it.badgeKey] : 0;
                      const toneCls = it.badgeTone ? ' ' + it.badgeTone : '';
                      const badgeHtml = it.badge
                        ? `<span class="nav-badge${toneCls}">${it.badge}</span>`
                        : count > 0
                          ? `<span class="nav-badge${toneCls}">${count}</span>`
                          : '';
                      return `
                        <button class="nav-item ${navIsActive(it.path, route) ? 'active' : ''}" data-nav="${it.path}" title="${window.DemoViews.esc(it.label)}">
                          ${svg(it.icon, 16)}
                          <span class="nav-label">${window.DemoViews.esc(it.label)}</span>
                          ${badgeHtml}
                        </button>`;
                    })
                    .join('')}
                </div>`
              ).join('')}
            </nav>

            <div class="sidebar-footer">
              <button class="nav-item ${navIsActive('/app/metrics', route) ? 'active' : ''}" data-nav="/app/metrics" title="指标分析">
                ${svg('chart', 16)}<span class="nav-label">指标分析</span>
              </button>
              <button class="nav-item ${navIsActive('/app/settings', route) ? 'active' : ''}" data-nav="/app/settings" title="工作区设置">
                ${svg('settings', 16)}<span class="nav-label">工作区设置</span>
              </button>
              <div class="workspace-card" data-nav="/app/settings" title="星云跨境工作区">
                <div class="workspace-avatar">星</div>
                <div class="workspace-card-info">
                  <div class="workspace-card-name">星云跨境工作区</div>
                  <div class="workspace-card-sub">Alex · 演示管理员</div>
                </div>
              </div>
            </div>
          </aside>

          <div class="main-col">
            <main class="content ${isFlush ? 'flush' : ''}">
              ${window.DemoViews.render(route, state)}
            </main>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    mountFollowups();
  }

  function bindEvents() {
    document.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(el.dataset.nav);
      });
    });

    const toggleSidebar = document.getElementById('toggle-sidebar');
    if (toggleSidebar) {
      toggleSidebar.onclick = () => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        saveState();
        render();
      };
    }

    const openCmd = document.getElementById('open-cmd');
    if (openCmd) openCmd.onclick = openCommandPalette;

    const openArchIntro = document.getElementById('open-arch-intro');
    if (openArchIntro) openArchIntro.onclick = () => window.openProjectArchModal && window.openProjectArchModal('arch');
    const settingsArch = document.getElementById('settings-open-arch');
    if (settingsArch) settingsArch.onclick = () => window.openProjectArchModal && window.openProjectArchModal('arch');

    document.querySelectorAll('[data-action="toggle-theme"]').forEach((el) => {
      el.onclick = () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        saveState();
        render();
      };
    });

    document.querySelectorAll('[data-action="reset-demo"]').forEach((el) => {
      el.onclick = () => {
        state = window.createInitialDemoState();
        saveState();
        window.FollowupsDemoState?.reset();
        window.PiFollowupsDemo?.resetQueries();
        render({ force: true });
        toast('已恢复初始演示数据');
      };
    });

    // Actions Required queue
    document.querySelectorAll('[data-actions-filter]').forEach((el) => {
      el.onclick = () => {
        state.actionsFilter = el.dataset.actionsFilter;
        render();
      };
    });
    const actionsSearch = document.getElementById('actions-search');
    if (actionsSearch) {
      actionsSearch.oninput = (e) => {
        state.actionsSearch = e.target.value;
        render();
        const el = document.getElementById('actions-search');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      };
    }

    document.querySelectorAll('[data-approve-draft]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const editor = document.getElementById('ai-draft-editor');
        approveDraft(el.dataset.approveDraft, editor ? editor.value : undefined);
      };
    });
    document.querySelectorAll('[data-discard-draft]').forEach((el) => {
      el.onclick = () => {
        const conv = state.conversations.find((c) => c.id === el.dataset.discardDraft);
        if (conv && conv.aiDraft) {
          conv.aiDraft.status = 'discarded';
          saveState();
          render();
          toast('已丢弃该 AI 草稿');
        }
      };
    });
    document.querySelectorAll('[data-open-conv]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        state.activeConvId = el.dataset.openConv;
        state.drawerContactId = null;
        const conv = state.conversations.find((c) => c.id === state.activeConvId);
        if (conv) conv.unread = 0;
        saveState();
        navigate('/app/inbox');
      };
    });
    document.querySelectorAll('[data-run-stalled-wb]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        window.location.hash = '#/app/ai/workbench';
        setTimeout(() => runScenario('ontology-stalled'), 30);
      };
    });

    // Contacts & Companies
    document.querySelectorAll('[data-contacts-tab]').forEach((el) => {
      el.onclick = () => {
        state.contactsTab = el.dataset.contactsTab;
        state.contactsFilterOpen = false;
        render();
      };
    });
    const contactsSearch = document.getElementById('contacts-search');
    if (contactsSearch) {
      contactsSearch.oninput = (e) => {
        state.contactsSearch = e.target.value;
        render();
        const el = document.getElementById('contacts-search');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      };
    }
    const toggleFilterBtn = document.getElementById('toggle-contacts-filter');
    if (toggleFilterBtn) {
      toggleFilterBtn.onclick = (e) => {
        e.stopPropagation();
        state.contactsFilterOpen = !state.contactsFilterOpen;
        render();
      };
    }
    const filterPop = document.getElementById('contacts-filter-popover');
    if (filterPop) {
      filterPop.onclick = (e) => e.stopPropagation();
      const clearBtn = document.getElementById('clear-contacts-filter');
      if (clearBtn) {
        clearBtn.onclick = () => {
          state.contactsFilters = { source: 'all', category: 'all', onlyPendingMem: false, onlyActionReq: false, onlyStalled: false };
          render();
        };
      }
      const cfSource = document.getElementById('cf-source');
      if (cfSource) cfSource.onchange = () => { state.contactsFilters.source = cfSource.value; render(); };
      const cfCat = document.getElementById('cf-category');
      if (cfCat) cfCat.onchange = () => { state.contactsFilters.category = cfCat.value; render(); };
      const cfAct = document.getElementById('cf-action');
      if (cfAct) cfAct.onchange = () => { state.contactsFilters.onlyActionReq = cfAct.checked; render(); };
      const cfMem = document.getElementById('cf-mem');
      if (cfMem) cfMem.onchange = () => { state.contactsFilters.onlyPendingMem = cfMem.checked; render(); };
      const cfStale = document.getElementById('cf-stalled');
      if (cfStale) cfStale.onchange = () => { state.contactsFilters.onlyStalled = cfStale.checked; render(); };
    }

    document.querySelectorAll('[data-open-drawer]').forEach((row) => {
      row.onclick = () => {
        state.drawerContactId = row.dataset.openDrawer;
        render();
      };
    });
    const closeDrawer = document.getElementById('close-drawer');
    if (closeDrawer) closeDrawer.onclick = () => { state.drawerContactId = null; render(); };
    const drawerBackdrop = document.getElementById('contact-drawer-backdrop');
    if (drawerBackdrop) {
      drawerBackdrop.onclick = (e) => {
        if (e.target === drawerBackdrop) { state.drawerContactId = null; render(); }
      };
    }

    // Sequences / Followups list
    document.querySelectorAll('[data-seq-tab]').forEach((el) => {
      el.onclick = () => { state.sequencesTab = el.dataset.seqTab; render(); };
    });
    const seqSearch = document.getElementById('seq-search');
    if (seqSearch) {
      seqSearch.oninput = (e) => {
        state.sequencesSearch = e.target.value;
        render();
        const el = document.getElementById('seq-search');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      };
    }
    document.querySelectorAll('[data-toggle-seq-auto]').forEach((el) => {
      el.onclick = () => {
        const seq = (state.sequences || []).find((s) => s.id === el.dataset.toggleSeqAuto);
        if (seq) {
          seq.autoSend = !seq.autoSend;
          saveState();
          render();
          toast(seq.autoSend ? `「${seq.name}」已切换为受控自动跟进` : `「${seq.name}」已切回人工审批门禁`);
        }
      };
    });
    document.querySelectorAll('[data-action="new-sequence"]').forEach((el) => {
      el.onclick = () => {
        openModal(
          '新建跟进流程',
          `<div style="display:flex;flex-direction:column;gap:10px;">
            <input class="input" id="m-seq-name" placeholder="流程名称，例如：展会线索 7 日破冰序列" />
            <input class="input" id="m-seq-desc" placeholder="简述触发条件与外发守卫策略" />
          </div>`,
          () => {
            const name = document.getElementById('m-seq-name').value.trim();
            if (!name) return false;
            state.sequences.unshift({
              id: 'seq-' + Date.now(),
              name,
              desc: document.getElementById('m-seq-desc').value.trim() || '遵循默认外发审批门禁与客户记忆时间窗。',
              stepsCount: 3,
              stepsSummary: 'AI 起草 + 2 轮跟进',
              categories: [{ label: '自定义触发', tone: 'info' }],
              autoSend: false,
              handoffGuard: '人工接管即暂停',
              status: 'draft',
              version: '草稿 v0.1',
              enrolledCount: 0,
              hasCanvas: true,
            });
            saveState();
            render();
            toast('已创建跟进流程草稿');
          },
          '创建流程'
        );
      };
    });

    // Inbox interactions
    const inboxSearch = document.getElementById('inbox-search');
    if (inboxSearch) {
      inboxSearch.oninput = (e) => {
        state.inboxSearch = e.target.value;
        render();
        const el = document.getElementById('inbox-search');
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
      };
    }
    document.querySelectorAll('[data-inbox-filter]').forEach((el) => {
      el.onclick = () => { state.inboxFilter = el.dataset.inboxFilter; render(); };
    });
    document.querySelectorAll('[data-conv-id]').forEach((el) => {
      el.onclick = () => {
        state.activeConvId = el.dataset.convId;
        const conv = state.conversations.find((c) => c.id === state.activeConvId);
        if (conv) conv.unread = 0;
        saveState();
        render();
      };
    });
    document.querySelectorAll('[data-composer-mode]').forEach((el) => {
      el.onclick = () => { state.composerMode = el.dataset.composerMode; render(); };
    });
    document.querySelectorAll('[data-toggle-details]').forEach((el) => {
      el.onclick = () => {
        state.inboxDetailsOpen = state.inboxDetailsOpen === false ? true : false;
        saveState();
        render();
      };
    });
    document.querySelectorAll('[data-toggle-draft-expand]').forEach((el) => {
      el.onclick = () => {
        const cid = el.dataset.toggleDraftExpand;
        state.inboxDraftExpanded = state.inboxDraftExpanded || {};
        state.inboxDraftExpanded[cid] = !state.inboxDraftExpanded[cid];
        render();
        if (state.inboxDraftExpanded[cid]) {
          document.getElementById('ai-draft-editor')?.focus();
        }
      };
    });
    document.querySelectorAll('[data-open-drawer-from-inbox]').forEach((el) => {
      el.onclick = () => {
        const cid = el.dataset.openDrawerFromInbox;
        if (!cid) return;
        state.contactsTab = 'people';
        state.drawerContactId = cid;
        navigate('/app/contacts');
        render();
      };
    });
    const threadScroll = document.getElementById('thread-scroll');
    if (threadScroll) {
      threadScroll.scrollTop = threadScroll.scrollHeight;
    }
    const tplPicker = document.getElementById('tpl-picker');
    if (tplPicker) {
      tplPicker.onchange = () => {
        const input = document.getElementById('inbox-input');
        if (input && tplPicker.value) {
          input.value = tplPicker.value;
          tplPicker.value = '';
          input.focus();
        }
      };
    }
    const sendBtn = document.getElementById('send-inbox-msg');
    if (sendBtn) {
      sendBtn.onclick = () => {
        const input = document.getElementById('inbox-input');
        const text = input?.value.trim();
        if (!text) return;
        const conv = state.conversations.find((c) => c.id === state.activeConvId);
        if (!conv) return;
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        conv.messages.push({
          id: 'msg-' + Date.now(),
          type: state.composerMode === 'note' ? 'note' : 'outbound',
          sender: state.composerMode === 'note' ? '内部备注（Alex）' : 'Alex（人工回复）',
          text,
          time,
        });
        conv.preview = text;
        conv.time = time;
        saveState();
        render();
        toast(state.composerMode === 'note' ? '已添加内部备注' : '已发送演示消息（无真实外发）');
      };
    }
    document.querySelectorAll('[data-action="toggle-conv-mode"]').forEach((el) => {
      el.onclick = () => {
        const conv = state.conversations.find((c) => c.id === el.dataset.conv);
        if (!conv) return;
        conv.status = conv.status === 'human' ? 'ai' : 'human';
        saveState();
        render();
        toast(conv.status === 'human' ? '已切换为人工接管' : '已恢复 AI 托管');
      };
    });

    // Memory confirm / reject
    document.querySelectorAll('[data-confirm-mem]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const [cid, mid] = el.dataset.confirmMem.split(':');
        const ct = state.contacts.find((c) => c.id === cid);
        const mem = ct?.memories.find((m) => m.id === mid);
        if (mem) {
          mem.status = 'confirmed';
          mem.source = '人工审核确认 · 刚刚';
          saveState();
          render();
          toast('✓ 已采纳为正式客户记忆');
        }
      };
    });
    document.querySelectorAll('[data-reject-mem]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const [cid, mid] = el.dataset.rejectMem.split(':');
        const ct = state.contacts.find((c) => c.id === cid);
        if (ct) {
          ct.memories = ct.memories.filter((m) => m.id !== mid);
          saveState();
          render();
          toast('已忽略该候选记忆');
        }
      };
    });

    // Lead stage changes, step buttons & drag-drop
    document.querySelectorAll('[data-lead-stage]').forEach((el) => {
      el.onchange = () => {
        const lead = state.leads.find((l) => l.id === el.dataset.leadStage);
        if (lead) {
          lead.stage = el.value;
          saveState();
          render();
          toast('已更新商机阶段');
        }
      };
    });
    document.querySelectorAll('[data-lead-move]').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const [leadId, stage] = btn.dataset.leadMove.split(':');
        if (!stage) return;
        const lead = state.leads.find((l) => l.id === leadId);
        if (lead) {
          lead.stage = stage;
          saveState();
          render();
          toast('已推进商机阶段');
        }
      };
    });
    document.querySelectorAll('[data-lead-drag]').forEach((el) => {
      el.ondragstart = (ev) => ev.dataTransfer.setData('text/plain', el.dataset.leadDrag);
    });
    document.querySelectorAll('[data-stage-drop]').forEach((col) => {
      col.ondragover = (ev) => {
        ev.preventDefault();
        col.classList.add('drag-over');
      };
      col.ondragleave = () => col.classList.remove('drag-over');
      col.ondrop = (ev) => {
        ev.preventDefault();
        col.classList.remove('drag-over');
        const leadId = ev.dataTransfer.getData('text/plain');
        const lead = state.leads.find((l) => l.id === leadId);
        if (lead) {
          lead.stage = col.dataset.stageDrop;
          saveState();
          render();
          toast('已移动商机阶段');
        }
      };
    });

    // Workbench
    const wbAgent = document.getElementById('wb-agent');
    if (wbAgent) wbAgent.onchange = () => { state.workbenchAgent = wbAgent.value; saveState(); };
    document.querySelectorAll('[data-wb-mode]').forEach((el) => {
      el.onclick = () => {
        state.workbenchMode = el.dataset.wbMode;
        saveState();
        render();
      };
    });
    document.querySelectorAll('[data-run-scenario]').forEach((el) => {
      el.onclick = () => runScenario(el.dataset.runScenario);
    });
    const wbRunCustom = document.getElementById('wb-run-custom');
    const wbInput = document.getElementById('wb-prompt-input');
    if (wbRunCustom) {
      wbRunCustom.onclick = () => { if (wbInput) runCustomPrompt(wbInput.value); };
    }
    if (wbInput) {
      wbInput.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          runCustomPrompt(wbInput.value);
        }
      };
    }
    document.querySelectorAll('[data-action="toggle-outbound"]').forEach((el) => {
      el.onclick = () => {
        state.outboundPaused = !state.outboundPaused;
        saveState();
        render();
        toast(state.outboundPaused ? '已暂停所有自动外发' : '已恢复审批后外发');
      };
    });
    document.querySelectorAll('[data-prop-action]').forEach((el) => {
      el.onclick = () => {
        const run = state.workbenchRuns.find((r) => r.id === el.dataset.runId);
        if (!run || !run.proposal) return;
        const act = el.dataset.propAction;
        if (act === 'approve') {
          run.proposalState = 'approved';
          if (run.proposal.actionType === 'create_tasks_batch') {
            run.proposal.tasksToAdd.forEach((t) => {
              state.tasks.unshift({ id: 't-prop-' + Date.now(), ...t, status: 'pending' });
            });
          } else if (run.proposal.actionType === 'confirm_memory') {
            const ct = state.contacts.find((c) => c.id === run.proposal.contactId);
            const mem = ct?.memories.find((m) => m.id === run.proposal.memoryId);
            if (mem) mem.status = 'confirmed';
          }
          toast('✓ 已批准提案并写入演示 CRM');
        } else if (act === 'reject') {
          run.proposalState = 'rejected';
          toast('已拒绝该提案');
        } else if (act === 'undo') {
          run.proposalState = 'pending';
          state.tasks = state.tasks.filter((t) => !String(t.id).startsWith('t-prop-'));
          toast('已撤销变更');
        }
        saveState();
        render();
      };
    });

    // Tasks
    document.querySelectorAll('[data-toggle-task]').forEach((el) => {
      el.onchange = () => {
        const task = state.tasks.find((t) => t.id === el.dataset.toggleTask);
        if (task) {
          task.status = el.checked ? 'done' : 'pending';
          saveState();
          render();
        }
      };
    });
    document.querySelectorAll('[data-action="new-task"], [data-action="quick-task"]').forEach((el) => {
      el.onclick = () => {
        const contactId = el.dataset.contact || state.contacts[0].id;
        openModal(
          '新建跟进任务',
          `<div style="display:flex;flex-direction:column;gap:10px;">
            <input class="input" id="m-task-title" placeholder="任务标题，例如：回访确认报价" />
            <input class="input" id="m-task-due" value="明天 14:30" />
          </div>`,
          () => {
            const title = document.getElementById('m-task-title').value.trim();
            if (!title) return false;
            state.tasks.unshift({
              id: 't-' + Date.now(),
              title,
              dueLabel: document.getElementById('m-task-due').value.trim() || '待定',
              priority: 'high',
              status: 'pending',
              contactId,
            });
            saveState();
            render();
            toast('✓ 已创建新任务');
          }
        );
      };
    });
    document.querySelectorAll('[data-action="new-lead"]').forEach((el) => {
      el.onclick = () => {
        openModal(
          '新建商机',
          `<div style="display:flex;flex-direction:column;gap:10px;">
            <input class="input" id="m-lead-title" placeholder="商机名称，例如：星辰科技 — 二期扩建" />
            <input class="input" id="m-lead-val" type="number" value="18000" placeholder="金额（元）" />
          </div>`,
          () => {
            const title = document.getElementById('m-lead-title').value.trim();
            if (!title) return false;
            const yuan = Number(document.getElementById('m-lead-val').value || 0);
            state.leads.unshift({
              id: 'l-' + Date.now(),
              title,
              stage: 'new',
              valueCents: Math.round(yuan * 100),
              contactId: state.contacts[0].id,
              tags: ['待跟进'],
              staleHours: 0,
              owner: 'Alex',
            });
            saveState();
            render();
            toast('✓ 已新建商机');
          }
        );
      };
    });
    document.querySelectorAll('[data-action="new-contact"]').forEach((el) => {
      el.onclick = () => {
        openModal(
          '新建联系人',
          `<div style="display:flex;flex-direction:column;gap:10px;">
            <input class="input" id="m-ct-name" placeholder="姓名" />
            <input class="input" id="m-ct-title" placeholder="职位（例如：增长总监）" />
            <input class="input" id="m-ct-company" placeholder="公司名称" />
            <input class="input" id="m-ct-phone" placeholder="手机号" />
          </div>`,
          () => {
            const name = document.getElementById('m-ct-name').value.trim();
            if (!name) return false;
            const company = document.getElementById('m-ct-company').value.trim() || '新星科技';
            state.contacts.unshift({
              id: 'c-' + Date.now(),
              name,
              title: document.getElementById('m-ct-title').value.trim() || '业务负责人',
              company,
              domain: 'company.cn',
              companyMark: company[0],
              companyColor: '#335cff',
              avatarTone: 'tone-blue',
              email: 'contact@company.cn',
              phone: document.getElementById('m-ct-phone').value.trim() || '+86 138-0000-0000',
              channels: { wa: true, wx: false, mail: true, phone: true },
              source: '手动录入',
              tags: ['新线索'],
              crmCategory: 'interested',
              crmStatus: '新录入 · 待初次触达',
              aiSignal: { kind: 'none', text: '等待初次跟进', sub: '已纳入客户档案' },
              memories: [],
            });
            saveState();
            render();
            toast('✓ 已添加联系人');
          }
        );
      };
    });
  }

  // Close popovers on outside click
  document.addEventListener('click', () => {
    if (state.contactsFilterOpen) {
      state.contactsFilterOpen = false;
      render();
    }
  });

  window.addEventListener('hashchange', render);
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
      return;
    }
    if (e.key === 'Escape') {
      if (state.drawerContactId) {
        state.drawerContactId = null;
        render();
      } else if (state.contactsFilterOpen) {
        state.contactsFilterOpen = false;
        render();
      }
      return;
    }
    // J / K navigation in Master Inbox
    if (!typing && getRoute() === '/app/inbox' && (e.key === 'j' || e.key === 'k')) {
      const idx = state.conversations.findIndex((c) => c.id === state.activeConvId);
      if (idx !== -1 && state.conversations.length > 1) {
        const nextIdx = e.key === 'j'
          ? (idx + 1) % state.conversations.length
          : (idx - 1 + state.conversations.length) % state.conversations.length;
        state.activeConvId = state.conversations[nextIdx].id;
        state.conversations[nextIdx].unread = 0;
        saveState();
        render();
      }
    }
  });

  if (!window.location.hash) {
    window.location.hash = '#/app/contacts';
  }
  render();
})();
