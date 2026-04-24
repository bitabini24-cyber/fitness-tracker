/* ============================================================
   PORTFOLIO SCRIPT — Themes, Canvas, Typed, Rings, Counters
   ============================================================ */

// ===== THEME SWITCHER — left panel, one icon expands =====
const themeIconBtn = document.getElementById('themeIconBtn');
const themePopup   = document.getElementById('themePopup');
const tpBtns       = document.querySelectorAll('.tp-btn');
const html         = document.documentElement;

themeIconBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  themePopup.classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-panel')) themePopup.classList.remove('open');
});

tpBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    html.setAttribute('data-theme', btn.dataset.theme);
    tpBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    themePopup.classList.remove('open');
    initCanvas();
  });
});

// ===== CANVAS PARTICLE SYSTEM =====
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let W, H;

function getThemeColor() {
  return getComputedStyle(html).getPropertyValue('--p').trim() || '#6c63ff';
}

function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  const n = parseInt(hex, 16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw(rgb) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${this.alpha})`;
    ctx.fill();
  }
}

function initCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  particles = Array.from({ length: 120 }, () => new Particle());
}

function drawConnections(rgb) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.08 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  const color = getThemeColor();
  const rgb   = hexToRgb(color);
  particles.forEach(p => { p.update(); p.draw(rgb); });
  drawConnections(rgb);
  requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animateCanvas();

// ===== TYPED TEXT =====
const typedEl = document.querySelector('.typed-name');
const words   = ['Altaye Ayfokru', 'a Developer', 'a Designer', 'a Creator', 'a Problem Solver'];
let wi = 0, ci = 0, deleting = false;

function type() {
  const word = words[wi];
  typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  let speed = deleting ? 55 : 95;
  if (!deleting && ci === word.length + 1) { speed = 1800; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; speed = 400; }
  setTimeout(type, speed);
}
type();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
});

// ===== ACTIVE NAV =====
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
function highlightNav() {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ===== SKILL BAR ANIMATION =====
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    bar.style.width = bar.dataset.w + '%';
    barObs.unobserve(bar);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.sk-bar-fill').forEach(b => barObs.observe(b));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-num');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target);
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
      else el.textContent = current;
    }, 40);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

// ===== SERVICE CHIPS =====
document.querySelectorAll('.cf-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.cf-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ===== CHAR COUNTER =====
const fmessage = document.getElementById('fmessage');
const charCount = document.getElementById('charCount');
if (fmessage && charCount) {
  fmessage.addEventListener('input', () => {
    const len = fmessage.value.length;
    charCount.textContent = `${len} / 500`;
    charCount.style.color = len > 450 ? '#ef4444' : 'var(--muted)';
    if (len > 500) fmessage.value = fmessage.value.slice(0, 500);
  });
}

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const msg     = document.getElementById('formMsg');
  if (name && email && message) {
    msg.style.color = '#10b981';
    msg.textContent = `Thanks ${name}! Message sent successfully.`;
    this.reset();
    setTimeout(() => msg.textContent = '', 4000);
  } else {
    msg.style.color = '#ef4444';
    msg.textContent = 'Please fill in all required fields.';
  }
});

// ===== EDGE SKILL ICONS — color sync with theme =====
function syncEdgeSkills() {
  // brand colors are hardcoded per icon class, no override needed
}
syncEdgeSkills();

// ===== PROJECT FILTER TABS =====
const pfBtns = document.querySelectorAll('.pf-btn');
const projCards = document.querySelectorAll('.proj-card');
pfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projCards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== DOM ORBIT SKILL ICONS — real Font Awesome icons =====
(function initOrbit() {
  const box = document.getElementById('ssrBox');
  const container = document.getElementById('orbitContainer');
  if (!box || !container) return;

  const skills = [
    { label: 'HTML',   icon: 'fab fa-html5',    color: '#e34f26', orbit: 0, angle: 0 },
    { label: 'CSS',    icon: 'fab fa-css3-alt',  color: '#1572b6', orbit: 0, angle: (Math.PI * 2) / 3 },
    { label: 'JS',     icon: 'fab fa-js',        color: '#f7df1e', orbit: 0, angle: (Math.PI * 4) / 3 },
    { label: 'Python', icon: 'fab fa-python',    color: '#4b8bbe', orbit: 1, angle: 0 },
    { label: 'React',  icon: 'fab fa-react',     color: '#61dafb', orbit: 1, angle: Math.PI },
  ];

  // orbit radii relative to box center
  const orbits = [
    { rx: 108, ry: 70, speed: 0.012 },   // inner — 3 skills
    { rx: 138, ry: 88, speed: -0.009 },  // outer — 2 skills (reverse)
  ];

  // create DOM nodes
  const nodes = skills.map(s => {
    const el = document.createElement('div');
    el.className = 'orbit-node';
    el.innerHTML = `<i class="${s.icon}" style="color:${s.color}"></i><span style="color:${s.color}">${s.label}</span>`;
    container.appendChild(el);
    return { el, ...s };
  });

  // draw orbit ring SVGs behind icons
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);overflow:visible;pointer-events:none;z-index:3;';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  orbits.forEach(o => {
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    ellipse.setAttribute('cx', '0');
    ellipse.setAttribute('cy', '0');
    ellipse.setAttribute('rx', o.rx);
    ellipse.setAttribute('ry', o.ry);
    ellipse.setAttribute('fill', 'none');
    ellipse.setAttribute('stroke', 'var(--p)');
    ellipse.setAttribute('stroke-width', '1');
    ellipse.setAttribute('stroke-dasharray', '4 5');
    ellipse.setAttribute('opacity', '0.3');
    svg.appendChild(ellipse);
  });
  box.insertBefore(svg, container);

  function animate() {
    orbits.forEach(o => { o.angle = (o.angle || 0) + o.speed; });
    nodes.forEach(n => {
      const o = orbits[n.orbit];
      n.angle += o.speed;
      const x = o.rx * Math.cos(n.angle);
      const y = o.ry * Math.sin(n.angle);
      n.el.style.left = x + 'px';
      n.el.style.top  = y + 'px';
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== SIDE PANEL — show only on home section =====
const sidePanel = document.getElementById('sidePanel');
const homeSection = document.getElementById('home');

function updateSidePanel() {
  const homeRect = homeSection.getBoundingClientRect();
  // visible when home section occupies most of the viewport
  const isHome = homeRect.bottom > window.innerHeight * 0.3 && homeRect.top < window.innerHeight * 0.7;
  if (isHome) {
    sidePanel.classList.remove('hidden');
  } else {
    sidePanel.classList.add('hidden');
  }
}
window.addEventListener('scroll', updateSidePanel, { passive: true });
updateSidePanel();

// ===== CURSOR GLOW EFFECT =====
const glow = document.createElement('div');
glow.style.cssText = `
  position:fixed; width:300px; height:300px; border-radius:50%;
  pointer-events:none; z-index:0; transition:transform 0.1s;
  background:radial-gradient(circle, var(--glow) 0%, transparent 70%);
  opacity:0.12; transform:translate(-50%,-50%);
`;
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ===== SCROLL PROGRESS BAR =====
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// ===== CUSTOM CURSOR =====
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = mx + 'px';
  ring.style.top  = my + 'px';
});

// enlarge ring on interactive elements
document.querySelectorAll('a, button, .skill-card, .proj-card, .tool-tag, .tp-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// hook toast into contact form
document.getElementById('contactForm').addEventListener('submit', function handler(e) {
  // remove old listener to avoid double-fire — we'll override below
}, { once: true });

// override contact form with toast
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const msg     = document.getElementById('formMsg');
  const submitBtn = this.querySelector('.cf-submit');
  const submitText    = this.querySelector('.cf-submit-text');
  const submitSending = this.querySelector('.cf-submit-sending');

  if (name && email && message) {
    // show loading state
    if (submitText)    submitText.style.display    = 'none';
    if (submitSending) submitSending.style.display = 'flex';
    if (submitBtn)     submitBtn.disabled = true;

    setTimeout(() => {
      if (submitText)    submitText.style.display    = 'flex';
      if (submitSending) submitSending.style.display = 'none';
      if (submitBtn)     submitBtn.disabled = false;
      showToast(`Thanks ${name}! Your message was sent 🚀`, 'success');
      msg.style.color = '#10b981';
      msg.textContent = `Thanks ${name}! Message sent successfully.`;
      this.reset();
      if (charCount) charCount.textContent = '0 / 500';
      setTimeout(() => msg.textContent = '', 4000);
    }, 1500);
  } else {
    showToast('Please fill in all required fields.', 'error');
    msg.style.color = '#ef4444';
    msg.textContent = 'Please fill in all required fields.';
  }
});

// ===== SECTION NAVIGATION DOTS =====
(function initSectionDots() {
  const secs = [
    { id: 'home',     label: 'Home' },
    { id: 'about',    label: 'About' },
    { id: 'skills',   label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact',  label: 'Contact' },
  ];
  const nav = document.createElement('nav');
  nav.id = 'sectionDots';
  nav.setAttribute('aria-label', 'Section navigation');
  secs.forEach(s => {
    const d = document.createElement('div');
    d.className = 'sdot';
    d.setAttribute('data-label', s.label);
    d.setAttribute('data-target', s.id);
    d.setAttribute('role', 'button');
    d.setAttribute('tabindex', '0');
    d.addEventListener('click', () => document.getElementById(s.id).scrollIntoView({ behavior: 'smooth' }));
    d.addEventListener('keydown', e => { if (e.key === 'Enter') d.click(); });
    nav.appendChild(d);
  });
  document.body.appendChild(nav);

  function updateDots() {
    const dots = nav.querySelectorAll('.sdot');
    let current = secs[0].id;
    secs.forEach(s => {
      const el = document.getElementById(s.id);
      if (el && window.scrollY >= el.offsetTop - window.innerHeight / 2) current = s.id;
    });
    dots.forEach(d => d.classList.toggle('active', d.dataset.target === current));
  }
  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
})();

// ===== 3D TILT EFFECT ON PROJECT CARDS =====
document.querySelectorAll('.proj-card').forEach(card => {
  card.classList.add('tilt-card');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.glow-btn, .nav-hire-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.3;
    const y = (e.clientY - r.top  - r.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== SKILL CARD STAGGER REVEAL =====
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.07}s`;
});
