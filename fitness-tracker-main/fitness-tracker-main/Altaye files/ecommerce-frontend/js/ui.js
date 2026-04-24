/**
 * ui.js - UI utilities: Toast, Modal, Theme, Scroll, Animations
 */

import { Storage } from './storage.js';

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'region');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

const TOAST_ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ'
};

export function showToast(type = 'info', title = '', message = '', duration = 3000) {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast__icon">${TOAST_ICONS[type] || 'ℹ'}</div>
    <div class="toast__content">
      <div class="toast__title">${sanitize(title)}</div>
      ${message ? `<div class="toast__msg">${sanitize(message)}</div>` : ''}
    </div>
    <button class="toast__close" aria-label="Close notification">✕</button>
    <div class="toast__progress"></div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const close = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector('.toast__close').addEventListener('click', close);
  const timer = setTimeout(close, duration);
  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', () => setTimeout(close, 1000));
}

/* ============================================
   MODAL
   ============================================ */
export function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.classList.add('no-scroll');
  overlay.querySelector('[data-modal-close]')?.focus();
}

export function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

export function initModals() {
  document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const overlay = closeBtn.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    }

    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target.id);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
    }
  });
}

/* ============================================
   DARK / LIGHT THEME
   ============================================ */
export function initTheme() {
  const saved = Storage.get('luxe_theme', 'light');
  applyTheme(saved);
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  Storage.set('luxe_theme', theme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  });
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ============================================
   NAVBAR SCROLL BEHAVIOR
   ============================================ */
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    navbar.classList.toggle('scrolled', current > 20);
    lastScroll = current;
  }, { passive: true });

  // Hamburger
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('active');
    mobileNav?.classList.toggle('active', open);
    document.body.classList.toggle('no-scroll', open);
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}

/* ============================================
   SCROLL TO TOP
   ============================================ */
export function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   INTERSECTION OBSERVER (Reveal Animations)
   ============================================ */
export function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================
   LAZY LOADING IMAGES
   ============================================ */
export function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

/* ============================================
   TABS
   ============================================ */
export function initTabs(container) {
  const el = container || document;
  el.querySelectorAll('.tabs').forEach(tabs => {
    tabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const panelContainer = tabs.nextElementSibling;
        if (panelContainer) {
          panelContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
          panelContainer.querySelector(`[data-panel="${target}"]`)?.classList.add('active');
        }
      });
    });
  });
}

/* ============================================
   COUNTDOWN TIMER
   ============================================ */
export function initCountdown(endTime, elements) {
  function update() {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      Object.values(elements).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (elements.hours)   elements.hours.textContent   = String(h).padStart(2, '0');
    if (elements.minutes) elements.minutes.textContent = String(m).padStart(2, '0');
    if (elements.seconds) elements.seconds.textContent = String(s).padStart(2, '0');

    setTimeout(update, 1000);
  }

  update();
}

/* ============================================
   PAGE LOADER
   ============================================ */
export function hidePageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }, 800);
}

/* ============================================
   FILTER SIDEBAR TOGGLE (Mobile)
   ============================================ */
export function initFilterToggle() {
  const toggleBtn = document.querySelector('.filter-toggle-btn');
  const sidebar   = document.querySelector('.sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    toggleBtn.textContent = sidebar.classList.contains('mobile-open') ? '✕ Close Filters' : '⚙ Filters';
  });
}

/* ============================================
   COLLAPSIBLE FILTER SECTIONS
   ============================================ */
export function initFilterSections() {
  document.querySelectorAll('.filter-section__title').forEach(title => {
    title.addEventListener('click', () => {
      title.closest('.filter-section').classList.toggle('collapsed');
    });
  });
}

/* ============================================
   CAROUSEL / SLIDER
   ============================================ */
export function initCarousel(selector) {
  const carousels = document.querySelectorAll(selector);

  carousels.forEach(carousel => {
    const track  = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const prevBtn = carousel.querySelector('.carousel__prev');
    const nextBtn = carousel.querySelector('.carousel__next');
    const dots    = carousel.querySelectorAll('.carousel__dot');

    if (!track || slides.length === 0) return;

    let current = 0;
    let autoplay = null;

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-play
    function startAutoplay() {
      autoplay = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplay);
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Touch support
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    startAutoplay();
    goTo(0);
  });
}

/* ============================================
   INPUT SANITIZATION (XSS prevention)
   ============================================ */
export function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/* ============================================
   DEBOUNCE
   ============================================ */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ============================================
   QUANTITY CONTROLS (delegated)
   ============================================ */
export function initQtyControls(container, onChange) {
  container?.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;

    const action = btn.dataset.action;
    const key    = btn.dataset.key;
    const input  = container.querySelector(`.qty-input[data-key="${key}"]`);
    if (!input) return;

    let val = parseInt(input.value) || 1;
    val = action === 'inc' ? val + 1 : val - 1;
    input.value = Math.max(1, val);
    onChange?.(key, parseInt(input.value));
  });

  container?.addEventListener('change', e => {
    const input = e.target.closest('.qty-input');
    if (!input) return;
    const val = Math.max(1, parseInt(input.value) || 1);
    input.value = val;
    onChange?.(input.dataset.key, val);
  });
}
