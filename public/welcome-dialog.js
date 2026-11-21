'use strict';

(() => {
  const STORAGE_KEY = 'pi-native-crm-welcome-seen-v1';
  const FORCE_PARAM = 'welcome';
  const params = new URLSearchParams(window.location.search);
  const forced = params.get(FORCE_PARAM) === '1';

  let seen = false;
  try {
    seen = window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    seen = false;
  }

  if (seen && !forced) return;

  const app = document.getElementById('app');
  const previousFocus = document.activeElement;
  const overlay = document.createElement('div');
  let closing = false;

  overlay.className = 'welcome-demo-overlay';
  overlay.innerHTML = `
    <section class="welcome-demo-panel" role="dialog" aria-modal="true" aria-labelledby="welcome-demo-title" aria-describedby="welcome-demo-description" tabindex="-1">
      <button class="welcome-demo-close" type="button" aria-label="关闭欢迎弹窗">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18"/>
        </svg>
      </button>
      <div class="welcome-demo-avatar-ring">
        <img class="welcome-demo-avatar" src="assets/github-avatar.png" alt="treasuresyq 的 GitHub 头像">
      </div>
      <span class="welcome-demo-status">只读演示 · 无需登录</span>
      <h1 class="welcome-demo-title" id="welcome-demo-title">Pi Native CRM 交互演示</h1>
      <p class="welcome-demo-subtitle" id="welcome-demo-description">Agent 原生 CRM 工作台 · 全部为虚构数据</p>
      <div class="welcome-demo-portfolio" aria-disabled="true">
        <div>
          <strong>treasuresyq 个人项目集</strong>
          <span>作品集准备中</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14m-5-5 5 5-5 5"/>
        </svg>
      </div>
      <div class="welcome-demo-notice">
        <strong>仅供展示与学习，无商业用途</strong>
        <p>演示中所有客户、价格、日期与审批均为虚构；模型部分为脱敏的历史录制回放，页面不发起任何模型或第三方请求。</p>
      </div>
      <button class="welcome-demo-start" type="button">开始浏览</button>
    </section>
  `;

  document.body.append(overlay);
  document.body.classList.add('welcome-demo-open');
  if (app) app.inert = true;

  const panel = overlay.querySelector('.welcome-demo-panel');
  const closeButton = overlay.querySelector('.welcome-demo-close');
  const startButton = overlay.querySelector('.welcome-demo-start');

  const removeForcedParam = () => {
    if (!forced) return;
    const url = new URL(window.location.href);
    url.searchParams.delete(FORCE_PARAM);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const close = () => {
    if (closing) return;
    closing = true;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // The dialog should still close when storage is unavailable.
    }
    removeForcedParam();
    document.body.classList.remove('welcome-demo-open');
    if (app) app.inert = false;
    overlay.classList.add('is-closing');
    window.setTimeout(() => {
      overlay.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }, 155);
  };

  closeButton.addEventListener('click', close);
  startButton.addEventListener('click', close);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) close();
  });

  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...panel.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.requestAnimationFrame(() => panel.focus());
})();
