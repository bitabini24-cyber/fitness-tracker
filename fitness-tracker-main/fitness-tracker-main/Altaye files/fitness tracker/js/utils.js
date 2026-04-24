/* ============================================
   UTILS.JS - Shared utilities
   ============================================ */

// Theme management
const Theme = {
  get: () => localStorage.getItem('ft-theme') || 'light',
  set(theme) {
    localStorage.setItem('ft-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle-icon').forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    document.querySelectorAll('.theme-option').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === theme);
    });
  },
  toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
  init() { this.set(this.get()); }
};

// Toast notifications
const Toast = {
  container: null,
  init() {
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  },
  show(title, message = '', type = 'info', duration = 4000) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <span class="toast-close">✕</span>`;
    this.container.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', () => this.remove(toast));
    toast.addEventListener('click', () => this.remove(toast));
    if (duration > 0) setTimeout(() => this.remove(toast), duration);
    return toast;
  },
  remove(toast) {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }
};

// Modal management
const Modal = {
  open(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  close(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
  closeAll() {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  },
  init() {
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => this.open(btn.dataset.modalOpen));
    });
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.close(btn.dataset.modalClose || btn.closest('.modal-overlay').id));
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.close(overlay.id);
      });
    });
  }
};

// LocalStorage helpers
const Store = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(`ft-${key}`)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, value) => localStorage.setItem(`ft-${key}`, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(`ft-${key}`)
};

// Animated counter
function animateCounter(el, target, duration = 1200, suffix = '') {
  const start = 0;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Animate progress bars
function animateProgressBars() {
  document.querySelectorAll('.progress-bar[data-width]').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 100);
  });
}

// Scroll reveal
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Dropdown toggle
function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = document.getElementById(trigger.dataset.dropdown);
      if (menu) menu.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  });
}

// Tabs
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const container = tabGroup.closest('[data-tabs-container]') || document;
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const content = container.querySelector(`[data-tab-content="${target}"]`);
        if (content) content.classList.add('active');
      });
    });
  });
}

// Sidebar toggle (mobile + desktop collapse)
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const mainContent = document.querySelector('.main-content');
  const toggleBtns = document.querySelectorAll('[data-sidebar-toggle]');
  if (!sidebar) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      } else {
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
      }
    });
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// Sticky navbar
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Mobile hamburger
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// Form validation helpers
const Validate = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  minLength: (v, n) => v.length >= n,
  required: (v) => v.trim().length > 0,
  match: (v1, v2) => v1 === v2,
  showError(input, msg) {
    input.classList.add('error');
    input.classList.remove('success');
    let err = input.parentElement.querySelector('.form-error');
    if (!err) { err = document.createElement('div'); err.className = 'form-error'; input.parentElement.appendChild(err); }
    err.innerHTML = `⚠ ${msg}`;
  },
  showSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    const err = input.parentElement.querySelector('.form-error');
    if (err) err.remove();
  },
  clearAll(form) {
    form.querySelectorAll('.form-control').forEach(i => { i.classList.remove('error', 'success'); });
    form.querySelectorAll('.form-error').forEach(e => e.remove());
  }
};

// Format helpers
const Format = {
  number: (n) => n.toLocaleString(),
  calories: (n) => `${n.toLocaleString()} kcal`,
  duration: (mins) => mins >= 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`,
  date: (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  percent: (v, t) => Math.round((v / t) * 100)
};

// Password toggle
function initPasswordToggles() {
  document.querySelectorAll('[data-password-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.passwordToggle);
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.textContent = isText ? '👁' : '🙈';
    });
  });
}

// Init all common utilities
function initCommon() {
  Theme.init();
  Toast.init();
  Modal.init();
  initDropdowns();
  initTabs();
  initSidebar();
  initStickyNavbar();
  initHamburger();
  initScrollReveal();
  initPasswordToggles();
  animateProgressBars();

  // Theme toggle buttons
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => Theme.toggle());
  });

  // Keyboard: close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') Modal.closeAll();
  });
}

document.addEventListener('DOMContentLoaded', initCommon);
