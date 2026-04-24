/* ============================================
   AUTH.JS - Authentication with Google + Email
   ============================================
   SETUP: Replace the value below with your actual
   Client ID from Google Cloud Console.
   https://console.cloud.google.com → APIs & Services
   → Credentials → Create OAuth 2.0 Client ID
   ============================================ */

// Paste your Google Client ID here:
let GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

// ── LocalStorage helpers ──────────────────────────────
function getUsers() { return Store.get('users', []); }
function saveUsers(u) { Store.set('users', u); }
function findUser(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

// ── Google Identity Services callback ────────────────
function handleGoogleCredential(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const { name, email, picture, sub } = payload;

  let user = findUser(email);
  const isNew = !user;

  if (isNew) {
    user = {
      name,
      email: email.toLowerCase(),
      password: null,
      avatar: name.slice(0, 2).toUpperCase(),
      picture,
      googleId: sub,
      createdAt: Date.now(),
    };
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  }

  Store.set('user', { name: user.name, email: user.email, avatar: user.avatar, picture: user.picture });
  Toast.show(
    isNew ? 'Account Created!' : 'Welcome back, ' + user.name.split(' ')[0] + '!',
    'Signing you in with Google...',
    'success'
  );
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
}

// ── Render Google button ──────────────────────────────
function initGoogleButton(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
    el.innerHTML = `
      <button class="social-auth-btn google-btn" onclick="showClientIdNotice()" type="button">
        <svg width="18" height="18" viewBox="0 0 48 48" style="flex-shrink:0">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>`;
    return;
  }

  if (window.google && window.google.accounts) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
    });
    google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
      width: el.offsetWidth || 360,
      text: containerId === 'googleSignupBtn' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
    });
  }
}

function showClientIdNotice() {
  Toast.show(
    'Google Sign-In Setup Required',
    'Paste your Google Client ID in js/auth.js to enable this.',
    'warning',
    5000
  );
}

// ── Login form ────────────────────────────────────────
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  window.addEventListener('load', () => initGoogleButton('googleLoginBtn'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Validate.clearAll(form);
    const emailEl    = form.querySelector('#loginEmail');
    const passwordEl = form.querySelector('#loginPassword');
    let valid = true;

    if (!Validate.required(emailEl.value)) {
      Validate.showError(emailEl, 'Email is required'); valid = false;
    } else if (!Validate.email(emailEl.value)) {
      Validate.showError(emailEl, 'Enter a valid email address'); valid = false;
    } else { Validate.showSuccess(emailEl); }

    if (!Validate.required(passwordEl.value)) {
      Validate.showError(passwordEl, 'Password is required'); valid = false;
    } else if (!Validate.minLength(passwordEl.value, 6)) {
      Validate.showError(passwordEl, 'Password must be at least 6 characters'); valid = false;
    } else { Validate.showSuccess(passwordEl); }

    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in...';

    setTimeout(() => {
      const user = findUser(emailEl.value);

      if (!user) {
        Toast.show('No Account Found', 'Please register first.', 'warning', 3000);
        setTimeout(() => { window.location.href = 'signup.html'; }, 2000);
        btn.disabled = false;
        btn.innerHTML = 'Sign In';
        return;
      }

      if (!user.password) {
        Toast.show('Use Google Sign-In', 'This account was created with Google.', 'info');
        btn.disabled = false;
        btn.innerHTML = 'Sign In';
        return;
      }

      if (user.password !== passwordEl.value) {
        Validate.showError(passwordEl, 'Incorrect password');
        Toast.show('Login Failed', 'Wrong password. Please try again.', 'error');
        btn.disabled = false;
        btn.innerHTML = 'Sign In';
        return;
      }

      Store.set('user', { name: user.name, email: user.email, avatar: user.avatar, picture: user.picture || null });
      Toast.show('Welcome back, ' + user.name.split(' ')[0] + '!', 'Redirecting...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    }, 1000);
  });
}

// ── Signup form ───────────────────────────────────────
function initSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  window.addEventListener('load', () => initGoogleButton('googleSignupBtn'));

  const password = form.querySelector('#signupPassword');
  const confirm  = form.querySelector('#signupConfirm');

  if (password) {
    password.addEventListener('input', () => {
      const strength  = getPasswordStrength(password.value);
      const indicator = document.getElementById('passwordStrength');
      if (indicator) {
        indicator.className = `password-strength strength-${strength.level}`;
        indicator.querySelector('.strength-bar').style.width = strength.percent + '%';
        indicator.querySelector('.strength-label').textContent = strength.label;
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Validate.clearAll(form);
    const nameEl  = form.querySelector('#signupName');
    const emailEl = form.querySelector('#signupEmail');
    let valid = true;

    if (!Validate.required(nameEl.value)) {
      Validate.showError(nameEl, 'Full name is required'); valid = false;
    } else if (!Validate.minLength(nameEl.value, 2)) {
      Validate.showError(nameEl, 'Name must be at least 2 characters'); valid = false;
    } else { Validate.showSuccess(nameEl); }

    if (!Validate.required(emailEl.value)) {
      Validate.showError(emailEl, 'Email is required'); valid = false;
    } else if (!Validate.email(emailEl.value)) {
      Validate.showError(emailEl, 'Enter a valid email address'); valid = false;
    } else { Validate.showSuccess(emailEl); }

    if (!Validate.required(password.value)) {
      Validate.showError(password, 'Password is required'); valid = false;
    } else if (!Validate.minLength(password.value, 8)) {
      Validate.showError(password, 'Password must be at least 8 characters'); valid = false;
    } else { Validate.showSuccess(password); }

    if (!Validate.required(confirm.value)) {
      Validate.showError(confirm, 'Please confirm your password'); valid = false;
    } else if (!Validate.match(password.value, confirm.value)) {
      Validate.showError(confirm, 'Passwords do not match'); valid = false;
    } else { Validate.showSuccess(confirm); }

    const terms = form.querySelector('#agreeTerms');
    if (terms && !terms.checked) {
      Toast.show('Terms Required', 'Please agree to the terms and conditions', 'warning');
      valid = false;
    }

    if (!valid) return;

    if (findUser(emailEl.value)) {
      Validate.showError(emailEl, 'This email is already registered');
      Toast.show('Already Registered', 'Please log in instead.', 'warning');
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creating account...';

    setTimeout(() => {
      const newUser = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim().toLowerCase(),
        password: password.value,
        avatar: nameEl.value.trim().slice(0, 2).toUpperCase(),
        picture: null,
        createdAt: Date.now(),
      };
      const users = getUsers();
      users.push(newUser);
      saveUsers(users);

      Store.set('user', { name: newUser.name, email: newUser.email, avatar: newUser.avatar, picture: null });
      Toast.show('Account Created!', 'Welcome to FitTrack Pro, ' + newUser.name.split(' ')[0] + '!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    }, 1500);
  });
}

// ── Forgot password ───────────────────────────────────
function initForgotForm() {
  const form = document.getElementById('forgotForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Validate.clearAll(form);
    const emailEl = form.querySelector('#forgotEmail');
    let valid = true;

    if (!Validate.required(emailEl.value)) {
      Validate.showError(emailEl, 'Email is required'); valid = false;
    } else if (!Validate.email(emailEl.value)) {
      Validate.showError(emailEl, 'Enter a valid email address'); valid = false;
    } else { Validate.showSuccess(emailEl); }

    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Sending...';

    setTimeout(() => {
      const successMsg = document.getElementById('forgotSuccess');
      if (successMsg) {
        form.style.display = 'none';
        successMsg.classList.remove('hidden');
      } else {
        Toast.show('Email Sent!', `Reset link sent to ${emailEl.value}`, 'success');
      }
    }, 1500);
  });
}

// ── Password strength ─────────────────────────────────
function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { level: 'weak',        label: 'Weak',        percent: 20  },
    { level: 'fair',        label: 'Fair',        percent: 40  },
    { level: 'good',        label: 'Good',        percent: 60  },
    { level: 'strong',      label: 'Strong',      percent: 80  },
    { level: 'very-strong', label: 'Very Strong', percent: 100 },
  ];
  return levels[Math.min(score, 4)];
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initSignupForm();
  initForgotForm();
});
