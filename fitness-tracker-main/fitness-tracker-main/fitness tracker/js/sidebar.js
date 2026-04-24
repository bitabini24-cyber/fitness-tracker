/* ============================================
   SIDEBAR.JS — Injects image-based sidebar into all app pages
   ============================================ */

const SIDEBAR_IMAGES = {
  brand:      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=68&h=68&fit=crop&crop=center',
  dashboard:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=44&h=44&fit=crop',
  activity:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=44&h=44&fit=crop',
  workouts:   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=44&h=44&fit=crop',
  nutrition:  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=44&h=44&fit=crop',
  progress:   'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=44&h=44&fit=crop',
  goals:      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=44&h=44&fit=crop',
  challenges: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=44&h=44&fit=crop',
  sleep:      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=44&h=44&fit=crop',
  profile:    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=44&h=44&fit=crop&crop=faces',
  settings:   'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=44&h=44&fit=crop',
  user:       'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=72&h=72&fit=crop&crop=faces',
};

const NAV_ITEMS = [
  { label:'Main', type:'section' },
  { href:'dashboard.html',  img:'dashboard',  text:'Dashboard' },
  { href:'activity.html',   img:'activity',   text:'Activity' },
  { href:'workouts.html',   img:'workouts',   text:'Workouts' },
  { href:'nutrition.html',  img:'nutrition',  text:'Nutrition' },
  { label:'Progress', type:'section' },
  { href:'progress.html',   img:'progress',   text:'Progress' },
  { href:'goals.html',      img:'goals',      text:'Goals' },
  { href:'challenges.html', img:'challenges', text:'Challenges', badge:'3' },
  { href:'sleep.html',      img:'sleep',      text:'Sleep' },
  { label:'Account', type:'section' },
  { href:'profile.html',    img:'profile',    text:'Profile' },
  { href:'settings.html',   img:'settings',   text:'Settings' },
];

function buildSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Use uploaded avatar if available, else default
  const savedAvatar = localStorage.getItem('ft-userAvatar')
    ? JSON.parse(localStorage.getItem('ft-userAvatar'))
    : SIDEBAR_IMAGES.user;

  // Determine active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Build HTML
  const navHTML = NAV_ITEMS.map(item => {
    if (item.type === 'section') {
      return `<div class="sidebar-section-label">${item.label}</div>`;
    }
    const isActive = currentPage === item.href;
    const badge = item.badge ? `<span class="link-badge">${item.badge}</span>` : '';
    return `
      <a href="${item.href}" class="sidebar-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>
        <img src="${SIDEBAR_IMAGES[item.img]}" class="sidebar-nav-img" alt=""/>
        ${item.text}${badge}
      </a>`;
  }).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="index.html" class="sidebar-brand">
        <img src="${SIDEBAR_IMAGES.brand}" class="sidebar-brand-img" alt="FitTrack Pro"/>
        FitTrack Pro
      </a>
    </div>
    <nav class="sidebar-nav">${navHTML}</nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <img src="${savedAvatar}" class="user-avatar-img" alt="Altaye Ayfokru"/>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name user-display-name">Altaye Ayfokru</div>
          <div class="sidebar-user-role">Premium Member</div>
        </div>
      </div>
    </div>`;
}

// Also upgrade top navbar profile avatar
function upgradeNavbarAvatar() {
  const savedAvatar = localStorage.getItem('ft-userAvatar')
    ? JSON.parse(localStorage.getItem('ft-userAvatar'))
    : SIDEBAR_IMAGES.user;

  // Replace old text-avatar divs
  document.querySelectorAll('.profile-dropdown-btn .avatar, .sidebar-avatar').forEach(el => {
    const img = document.createElement('img');
    img.src = savedAvatar;
    img.className = 'user-avatar-img';
    img.alt = 'User';
    el.replaceWith(img);
  });

  // Update any existing user-avatar-img elements (navbar, sidebar footer)
  document.querySelectorAll('.user-avatar-img').forEach(img => {
    img.src = savedAvatar;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  upgradeNavbarAvatar();
  // Build theme picker in any .theme-picker-wrap on the page
  if (typeof Theme !== 'undefined') {
    document.querySelectorAll('.theme-picker-wrap').forEach(wrap => Theme.buildPicker(wrap));
  }
});