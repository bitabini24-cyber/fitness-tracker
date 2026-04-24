/* ============================================
   APP.JS - Homepage & shared app logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHomepage();
  initCounters();
});

function initHomepage() {
  // Animate hero elements
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.querySelectorAll('*').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.08}s`;
    });
  }

  // Floating shapes animation
  document.querySelectorAll('.hero-shape').forEach((shape, i) => {
    shape.style.animationDelay = `${i * 0.8}s`;
    shape.style.animationDuration = `${4 + i}s`;
  });

  // Stats counter animation on scroll
  const statsSection = document.querySelector('.stats-preview');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(el => {
            animateCounter(el, parseInt(el.dataset.count), 1500, el.dataset.suffix || '');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }
}

function initCounters() {
  // Animate any counter elements visible on load
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        if (!isNaN(target)) animateCounter(el, target, 1200, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================
   EXTENDED ANIMATIONS ENGINE
   ============================================ */

// --- Ripple effect on all buttons ---
function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
    `;
    btn.appendChild(wave);
    wave.addEventListener('animationend', () => wave.remove());
  });
}

// --- Stagger children on scroll ---
function initStaggerReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.stagger-children').forEach(el => observer.observe(el));
}

// --- Scroll reveal for directional variants ---
function initExtendedReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
}

// --- Stat card number roll on visibility ---
function initStatRoll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('rolling');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-value').forEach(el => observer.observe(el));
}

// --- Card tilt on mouse move (3D effect) ---
function initCardTilt() {
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// --- Page entrance animation ---
function initPageEntrance() {
  const main = document.querySelector('.main-content, main, .app-main');
  if (main) main.classList.add('page-enter');

  // Stagger direct card/stat children of main sections
  document.querySelectorAll('.grid, .stats-grid, .cards-grid').forEach(grid => {
    if (!grid.classList.contains('stagger-children')) {
      grid.classList.add('stagger-children');
    }
  });
}

// --- Animated number counters for stat cards ---
function initDashboardCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9.]/g, '');
      const target = parseFloat(raw);
      if (isNaN(target) || el.dataset.counted) return;
      el.dataset.counted = '1';
      const suffix = el.textContent.replace(/[0-9.,]/g, '').trim();
      animateCounter(el, target, 1400, suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-value, .stat-number, [data-animate-count]').forEach(el => observer.observe(el));
}

// --- Hover micro-interactions for interactive elements ---
function initMicroInteractions() {
  // Sidebar nav items slide in on load
  document.querySelectorAll('.sidebar-link').forEach((link, i) => {
    link.style.opacity = '0';
    link.style.transform = 'translateX(-16px)';
    link.style.transition = `opacity 0.35s ease ${i * 0.05}s, transform 0.35s ease ${i * 0.05}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      link.style.opacity = '1';
      link.style.transform = 'translateX(0)';
    }));
  });

  // Stat cards pop in on load
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }));
  });

  // Goal/challenge/workout cards stagger
  document.querySelectorAll('.goal-card, .challenge-card, .workout-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }));
  });

  // Timeline items slide in
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }));
  });

  // Achievement badges pop in
  document.querySelectorAll('.achievement-badge').forEach((badge, i) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.7)';
    badge.style.transition = `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      badge.style.opacity = '1';
      badge.style.transform = 'scale(1)';
    }));
  });
}

// --- Smooth tab switch animation ---
function enhanceTabs() {
  document.querySelectorAll('.tab-content').forEach(content => {
    const observer = new MutationObserver(() => {
      if (content.classList.contains('active')) {
        content.style.animation = 'none';
        requestAnimationFrame(() => {
          content.style.animation = 'fadeInUp 0.35s ease forwards';
        });
      }
    });
    observer.observe(content, { attributes: true, attributeFilter: ['class'] });
  });
}

// --- Animate circular progress SVG paths ---
function initCircularProgress() {
  document.querySelectorAll('.circular-progress circle[data-progress]').forEach(circle => {
    const pct = parseFloat(circle.dataset.progress) / 100;
    const r = parseFloat(circle.getAttribute('r') || 40);
    const circumference = 2 * Math.PI * r;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => {
      circle.style.strokeDashoffset = circumference * (1 - pct);
    }, 300);
  });
}

// --- Animate sleep stage bars ---
function initSleepBars() {
  document.querySelectorAll('.sleep-stage-bar[data-height]').forEach(bar => {
    bar.style.height = '0';
    setTimeout(() => {
      bar.style.height = bar.dataset.height + 'px';
    }, 400);
  });
}

// --- Leaderboard items slide in ---
function initLeaderboard() {
  document.querySelectorAll('.leaderboard-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }));
  });
}

// --- Smooth modal entrance ---
function enhanceModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.modalOpen;
      const modal = document.querySelector(`#${id} .modal`);
      if (modal) {
        modal.style.animation = 'none';
        requestAnimationFrame(() => {
          modal.style.animation = 'bounceIn 0.45s cubic-bezier(.36,.07,.19,.97) forwards';
        });
      }
    });
  });
}

// --- Init all extended animations ---
function initAnimations() {
  initRipple();
  initStaggerReveal();
  initExtendedReveal();
  initStatRoll();
  initCardTilt();
  initPageEntrance();
  initDashboardCounters();
  initMicroInteractions();
  enhanceTabs();
  initCircularProgress();
  initSleepBars();
  initLeaderboard();
  enhanceModals();
}

document.addEventListener('DOMContentLoaded', initAnimations);


/* ============================================
   IMAGE ANIMATIONS ENGINE
   ============================================ */

function initImageAnimations() {
  // 1. Fade-in on load — fires for cached & network images
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('img-loaded');
    } else {
      img.classList.add('img-loading');
      img.addEventListener('load', () => {
        img.classList.remove('img-loading');
        img.classList.add('img-loaded');
      }, { once: true });
      img.addEventListener('error', () => {
        img.classList.remove('img-loading');
        img.classList.add('img-loaded'); // don't leave broken imgs invisible
      }, { once: true });
    }
  });

  // 2. Scroll-reveal for images
  const imgRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        imgRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.img-reveal').forEach(el => imgRevealObserver.observe(el));

  // 3. Auto-add img-reveal to key image containers on scroll
  const autoRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.transitionDelay = `${(i % 6) * 0.08}s`;
        img.classList.add('img-loaded');
        autoRevealObserver.unobserve(img);
      }
    });
  }, { threshold: 0.08 });

  // Apply to images inside cards that aren't already handled
  document.querySelectorAll(
    '.stat-card img, .feature-card img, .step-card img, ' +
    '.testimonial-card img, .goal-card img, .challenge-card img, ' +
    '.workout-card img, .sleep-stage img, .leaderboard-item img'
  ).forEach(img => autoRevealObserver.observe(img));

  // 4. Parallax on scroll for hero & cover images
  const parallaxImgs = document.querySelectorAll(
    '.hero-img-card img, .profile-cover-img, .auth-bg-img, .motivational-bg-img, .cta-bg-img'
  );
  if (parallaxImgs.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxImgs.forEach(img => {
        const rect = img.closest('[class]').getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = (rect.top + scrollY) * 0.12;
        img.style.transform = `translateY(${offset * 0.3}px) scale(1.06)`;
      });
    }, { passive: true });
  }

  // 5. Stagger entrance for image grids
  document.querySelectorAll('.grid, .badge-grid, .pb-grid').forEach(grid => {
    const imgs = grid.querySelectorAll('img');
    imgs.forEach((img, i) => {
      img.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  // 6. Tilt effect on profile & stat icon images
  document.querySelectorAll('.stat-img-icon, .profile-avatar-img, .badge-img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
      img.style.transform = `perspective(400px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.08)`;
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  // 7. Observe dynamically added images (e.g. from JS rendering)
  const mutationObs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        const imgs = node.tagName === 'IMG' ? [node] : [...node.querySelectorAll('img')];
        imgs.forEach(img => {
          if (img.complete && img.naturalWidth > 0) {
            img.classList.add('img-loaded');
          } else {
            img.classList.add('img-loading');
            img.addEventListener('load', () => {
              img.classList.remove('img-loading');
              img.classList.add('img-loaded');
            }, { once: true });
            img.addEventListener('error', () => {
              img.classList.remove('img-loading');
              img.classList.add('img-loaded');
            }, { once: true });
          }
        });
      });
    });
  });
  mutationObs.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', initImageAnimations);
