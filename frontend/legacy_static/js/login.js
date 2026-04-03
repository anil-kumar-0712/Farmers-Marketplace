const STORAGE_CURRENT_USER = 'farmerMarketplace_currentUser';
const API_URL = 'http://localhost:5000/api';

let selectedRole = null;

// Role selection
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedRole = btn.dataset.role;
    showAuthForm();
  });
});

function showAuthForm() {
  const container = document.getElementById('auth-form-container');
  const registerTab = document.getElementById('register-tab');
  const backLink = document.getElementById('back-link');

  container.style.display = 'block';
  backLink.style.display = 'block';

  if (selectedRole === 'admin') {
    registerTab.style.display = 'none';
    switchToLogin();
  } else {
    registerTab.style.display = 'block';
    switchToLogin();
  }

  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
}

function showRoleSelection() {
  document.getElementById('auth-form-container').style.display = 'none';
  document.getElementById('back-link').style.display = 'none';
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('selected'));
  selectedRole = null;
}

window.showRoleSelection = showRoleSelection;

// Auth tabs
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.dataset.mode === 'login') {
      switchToLogin();
    } else {
      switchToRegister();
    }
  });
});

function switchToLogin() {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-mode="login"]').classList.add('active');
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
}

function switchToRegister() {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-mode="register"]').classList.add('active');
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';

  const mobileGroup = document.getElementById('reg-mobile-group');
  mobileGroup.style.display = selectedRole === 'farmer' ? 'block' : 'none';
  document.getElementById('reg-mobile').required = selectedRole === 'farmer';
}

// Login form submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      if (data.user.role !== selectedRole) {
        alert(`This account is for a ${data.user.role}. Please select the correct role.`);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(data.user));

      if (data.user.role === 'farmer') {
        localStorage.setItem('farmerMarketplace_currentFarmer', JSON.stringify(data.user));
      }

      window.location.href = data.user.role + '.html';
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server connection failed. Make sure backend is running.');
  }
});

// Register form submit
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const mobile = document.getElementById('reg-mobile').value.trim();
  const password = document.getElementById('reg-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, password, role: selectedRole })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(data.user));

      if (data.user.role === 'farmer') {
        localStorage.setItem('farmerMarketplace_currentFarmer', JSON.stringify(data.user));
      }

      alert('Registration successful!');
      window.location.href = data.user.role + '.html';
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server connection failed.');
  }
});


