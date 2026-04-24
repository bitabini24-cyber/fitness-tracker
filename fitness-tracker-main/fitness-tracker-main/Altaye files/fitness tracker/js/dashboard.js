/* ============================================
   DASHBOARD.JS - Dashboard page logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  loadUserGreeting();
  animateDashboardStats();
  initWaterTracker();
  initWorkoutTimer();
  renderRecentWorkouts();
  renderNotifications();
  initCharts();
  initCircularProgress();
}

function loadUserGreeting() {
  const user = Store.get('user', { name: 'Altaye Ayfokru' });
  const greetEl = document.getElementById('userGreeting');
  const nameEls = document.querySelectorAll('.user-display-name');
  const avatarEls = document.querySelectorAll('.user-avatar-text');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (greetEl) greetEl.textContent = `${greeting}, ${user.name.split(' ')[0]}! 👋`;
  nameEls.forEach(el => el.textContent = user.name);
  avatarEls.forEach(el => el.textContent = user.avatar || user.name.slice(0,2).toUpperCase());
}

function animateDashboardStats() {
  const stats = [
    { id: 'statSteps', value: 8432, suffix: '' },
    { id: 'statCalories', value: 487, suffix: '' },
    { id: 'statMinutes', value: 52, suffix: '' },
    { id: 'statWater', value: 6, suffix: '' },
    { id: 'statSleep', value: 7.5, suffix: '' },
  ];
  stats.forEach(({ id, value, suffix }) => {
    const el = document.getElementById(id);
    if (el) animateCounter(el, value, 1400, suffix);
  });
}

// Water tracker
function initWaterTracker() {
  const cups = document.querySelectorAll('.water-cup');
  let filled = Store.get('water-cups', 6);

  function updateCups() {
    cups.forEach((cup, i) => {
      const fill = cup.querySelector('.water-fill');
      if (i < filled) {
        cup.classList.add('filled');
        if (fill) fill.style.height = '100%';
      } else {
        cup.classList.remove('filled');
        if (fill) fill.style.height = '0%';
      }
    });
    const countEl = document.getElementById('waterCount');
    if (countEl) countEl.textContent = filled;
  }

  cups.forEach((cup, i) => {
    cup.addEventListener('click', () => {
      filled = i < filled ? i : i + 1;
      Store.set('water-cups', filled);
      updateCups();
      if (filled === cups.length) Toast.show('Hydration Goal!', 'You reached your daily water goal! 💧', 'success');
    });
  });

  updateCups();
}

// Workout timer
function initWorkoutTimer() {
  let seconds = 0, interval = null, running = false;
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('timerStart');
  const pauseBtn = document.getElementById('timerPause');
  const resetBtn = document.getElementById('timerReset');

  function updateDisplay() {
    if (!display) return;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    display.textContent = h > 0
      ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  if (startBtn) startBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    interval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
    startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'flex';
  });

  if (pauseBtn) pauseBtn.addEventListener('click', () => {
    running = false;
    clearInterval(interval);
    pauseBtn.style.display = 'none';
    if (startBtn) startBtn.style.display = 'flex';
  });

  if (resetBtn) resetBtn.addEventListener('click', () => {
    running = false;
    clearInterval(interval);
    seconds = 0;
    updateDisplay();
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (startBtn) startBtn.style.display = 'flex';
  });

  updateDisplay();
}

// Recent workouts mock data
const RECENT_WORKOUTS = [
  { name: 'Morning Run', type: 'cardio', duration: 35, calories: 320, icon: '🏃', color: '#6c63ff', time: '7:30 AM' },
  { name: 'Upper Body Strength', type: 'strength', duration: 45, calories: 280, icon: '💪', color: '#ff6584', time: 'Yesterday' },
  { name: 'Yoga Flow', type: 'yoga', duration: 30, calories: 150, icon: '🧘', color: '#43e97b', time: '2 days ago' },
  { name: 'HIIT Cardio', type: 'hiit', duration: 25, calories: 380, icon: '⚡', color: '#f7971e', time: '3 days ago' },
];

function renderRecentWorkouts() {
  const container = document.getElementById('recentWorkouts');
  if (!container) return;
  container.innerHTML = RECENT_WORKOUTS.map(w => `
    <div class="workout-item">
      <div class="workout-icon" style="background:${w.color}20; color:${w.color}">${w.icon}</div>
      <div class="workout-info">
        <div class="workout-name">${w.name}</div>
        <div class="workout-meta">${w.duration} min • ${w.time}</div>
      </div>
      <div class="workout-calories">${w.calories} kcal</div>
    </div>`).join('');
}

// Notifications mock data
const NOTIFICATIONS = [
  { text: 'You reached your step goal today! 🎉', time: '2 min ago', read: false },
  { text: 'New challenge available: 30-Day Plank', time: '1 hour ago', read: false },
  { text: 'Weekly report is ready to view', time: '3 hours ago', read: true },
  { text: 'Reminder: Log your lunch meal', time: '5 hours ago', read: true },
];

function renderNotifications() {
  const container = document.getElementById('notificationsList');
  if (!container) return;
  container.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item">
      <div class="notif-dot-indicator ${n.read ? 'read' : ''}"></div>
      <div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
}

function initCharts() {
  createWeeklyActivityChart('weeklyActivityChart');
  createStepsChart('stepsChart');
}

function initCircularProgress() {
  document.querySelectorAll('.circular-progress[data-percent]').forEach(el => {
    const percent = parseInt(el.dataset.percent);
    const size = parseInt(el.dataset.size || 100);
    const stroke = parseInt(el.dataset.stroke || 8);
    const color = el.dataset.color || '#6c63ff';
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    el.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}"
          fill="none" stroke="var(--border)" stroke-width="${stroke}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${radius}"
          fill="none" stroke="${color}" stroke-width="${stroke}"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference}"
          style="transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"
          class="progress-circle-fill"/>
      </svg>
      <div class="progress-text" style="font-size:${size*0.18}px; color:${color}">
        ${percent}%
      </div>`;

    setTimeout(() => {
      const circle = el.querySelector('.progress-circle-fill');
      if (circle) circle.style.strokeDashoffset = offset;
    }, 300);
  });
}
