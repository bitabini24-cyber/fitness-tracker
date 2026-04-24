/* ============================================
   CHARTS.JS - Chart.js configurations
   ============================================ */

// Chart defaults
function applyChartDefaults() {
  if (typeof Chart === 'undefined') return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  Chart.defaults.color = isDark ? '#94a3b8' : '#6b7280';
  Chart.defaults.borderColor = isDark ? '#2d2d44' : '#e5e7eb';
  Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
  Chart.defaults.font.size = 12;
}

// Color palette
const COLORS = {
  primary: '#e91e8c',
  primaryLight: 'rgba(233,30,140,0.15)',
  secondary: '#ff3d6b',
  secondaryLight: 'rgba(255,61,107,0.15)',
  accent: '#00e5cc',
  accentLight: 'rgba(0,229,204,0.15)',
  warning: '#f7971e',
  warningLight: 'rgba(247,151,30,0.15)',
  info: '#38bdf8',
  infoLight: 'rgba(56,189,248,0.15)',
};

function getGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

// Weekly Activity Chart (Bar)
function createWeeklyActivityChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Calories Burned',
        data: [420, 380, 510, 290, 460, 620, 340],
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }, {
        label: 'Active Minutes',
        data: [45, 38, 55, 30, 48, 70, 35],
        backgroundColor: COLORS.accentLight,
        borderColor: COLORS.accent,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16 } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: Chart.defaults.borderColor }, beginAtZero: true }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
  });
}

// Steps Line Chart
function createStepsChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  const gradient = getGradient(ctx, 'rgba(233,30,140,0.3)', 'rgba(233,30,140,0)');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Steps',
        data: [7200, 8500, 6800, 9200, 7600, 11000, 5400],
        borderColor: COLORS.primary,
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: Chart.defaults.borderColor }, beginAtZero: true }
      }
    }
  });
}

// Weight Progress Chart
function createWeightChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  const gradient = getGradient(ctx, 'rgba(255,101,132,0.25)', 'rgba(255,101,132,0)');
  const labels = [];
  const data = [];
  let w = 82;
  for (let i = 0; i < 12; i++) {
    const d = new Date(); d.setMonth(d.getMonth() - 11 + i);
    labels.push(d.toLocaleDateString('en-US', { month: 'short' }));
    w = Math.max(70, w - (Math.random() * 1.5));
    data.push(+w.toFixed(1));
  }
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight (kg)',
        data,
        borderColor: COLORS.secondary,
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: COLORS.secondary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: Chart.defaults.borderColor } }
      }
    }
  });
}

// Nutrition Pie Chart
function createNutritionChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Protein', 'Carbs', 'Fat'],
      datasets: [{
        data: [30, 50, 20],
        backgroundColor: [COLORS.primary, COLORS.accent, COLORS.secondary],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });
}

// Sleep Chart
function createSleepChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Deep Sleep',
        data: [1.5, 2, 1.8, 1.2, 1.6, 2.2, 1.9],
        backgroundColor: COLORS.primary,
        borderRadius: 4,
        stack: 'sleep',
      }, {
        label: 'Light Sleep',
        data: [3, 2.5, 3.2, 2.8, 3.1, 2.8, 3.3],
        backgroundColor: COLORS.primaryLight,
        borderRadius: 4,
        stack: 'sleep',
      }, {
        label: 'REM',
        data: [1.2, 1.5, 1.0, 1.3, 1.1, 1.8, 1.4],
        backgroundColor: COLORS.accent,
        borderRadius: 4,
        stack: 'sleep',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false }, stacked: true },
        y: { grid: { color: Chart.defaults.borderColor }, stacked: true, beginAtZero: true,
          ticks: { callback: v => `${v}h` } }
      }
    }
  });
}

// Calories Intake vs Burned
function createCaloriesChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Intake',
        data: [2100, 1950, 2300, 1800, 2050, 2400, 1900],
        borderColor: COLORS.warning,
        backgroundColor: COLORS.warningLight,
        borderWidth: 2.5,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      }, {
        label: 'Burned',
        data: [420, 380, 510, 290, 460, 620, 340],
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondaryLight,
        borderWidth: 2.5,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: Chart.defaults.borderColor }, beginAtZero: false }
      }
    }
  });
}

// Activity Radar Chart
function createActivityRadarChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Endurance', 'Speed'],
      datasets: [{
        label: 'This Week',
        data: [80, 65, 55, 70, 75, 60],
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
        borderWidth: 2,
        pointBackgroundColor: COLORS.primary,
      }, {
        label: 'Last Week',
        data: [65, 70, 50, 60, 65, 55],
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.secondaryLight,
        borderWidth: 2,
        pointBackgroundColor: COLORS.secondary,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14 } } },
      scales: {
        r: {
          beginAtZero: true, max: 100,
          ticks: { stepSize: 20, display: false },
          grid: { color: Chart.defaults.borderColor },
          pointLabels: { font: { size: 11 } }
        }
      }
    }
  });
}

// Monthly Progress Bar Chart
function createMonthlyProgressChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  applyChartDefaults();
  const ctx = canvas.getContext('2d');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date().getMonth();
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months.slice(0, now + 1),
      datasets: [{
        label: 'Workouts',
        data: [18, 22, 19, 25, 21, 28, 24, 30, 26, 22, 27, 20].slice(0, now + 1),
        backgroundColor: COLORS.primary,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: Chart.defaults.borderColor }, beginAtZero: true }
      }
    }
  });
}

// Re-init charts on theme change
document.addEventListener('themeChanged', () => {
  applyChartDefaults();
  Chart.instances && Object.values(Chart.instances).forEach(c => c.update());
});
