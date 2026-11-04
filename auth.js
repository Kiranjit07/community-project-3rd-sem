/**
 * Accessible Learning Companion - Authentication Module
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This prototype application uses browser LocalStorage for authentication state demonstration.
 * In a real production deployment, client-side authentication is NOT secure.
 * Production systems require a secure backend server (e.g. Node.js, Python, or Go), HTTPS,
 * cryptographic password hashing (such as Argon2 or bcrypt), JWT/HTTP-only session cookies,
 * CSRF protection, and rate limiting against brute-force attacks.
 */

const Auth = {
  // Predefined authorized credentials for demonstration prototype
  CREDENTIALS: {
    email: 'kiranfamily.0987@gmail.com',
    username: 'kiranfamily.0987',
    password: 'kiranfamily.0987',
    role: 'educator_caregiver',
    name: 'Kiran Family Learning Guide'
  },

  STORAGE_KEY: 'alc_auth_user',
  REMEMBER_KEY: 'alc_auth_remembered_email',
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.bindEvents();
    this.checkRememberedEmail();
    this.verifyAuthStatus();
  },

  isAuthenticated() {
    try {
      const user = localStorage.getItem(this.STORAGE_KEY);
      return !!user;
    } catch (e) {
      return false;
    }
  },

  getUser() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  bindEvents() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const submitBtn = document.getElementById('login-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        // If form doesn't trigger submit automatically
        if (e && e.target === submitBtn) {
          this.handleLogin(e);
        }
      });
    }

    const autofillBtn = document.getElementById('autofill-demo-btn');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.fillDemoCredentials(true);
      });
    }

    const togglePasswordBtn = document.getElementById('toggle-password-visibility');
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
    }

    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showForgotPasswordModal();
      });
    }

    const logoutBtns = document.querySelectorAll('.action-logout');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.confirmLogout();
      });
    });
  },

  fillDemoCredentials(autoSubmit = false) {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    if (emailInput) emailInput.value = this.CREDENTIALS.email;
    if (passwordInput) passwordInput.value = this.CREDENTIALS.password;

    if (autoSubmit) {
      this.handleLogin();
    }
  },

  checkRememberedEmail() {
    const remembered = localStorage.getItem(this.REMEMBER_KEY);
    const emailInput = document.getElementById('login-email');
    const rememberCheckbox = document.getElementById('remember-me');
    if (remembered && emailInput && rememberCheckbox) {
      emailInput.value = remembered;
      rememberCheckbox.checked = true;
    }
  },

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('login-password');
    const toggleBtn = document.getElementById('toggle-password-visibility');
    if (!passwordInput || !toggleBtn) return;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleBtn.innerHTML = `<span aria-hidden="true">👁️‍🗨️</span><span class="sr-only">Hide password</span>`;
      toggleBtn.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.type = 'password';
      toggleBtn.innerHTML = `<span aria-hidden="true">👁️</span><span class="sr-only">Show password</span>`;
      toggleBtn.setAttribute('aria-label', 'Show password');
    }
  },

  handleLogin(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('remember-me');
    const errorBox = document.getElementById('login-error-message');
    const submitBtn = document.getElementById('login-submit-btn');

    if (!emailInput || !passwordInput) {
      console.warn('Login inputs missing from DOM');
      return;
    }

    // Reset error state
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.remove('active');
      errorBox.style.display = 'none';
    }

    // Normalize entered values: case-insensitive email, trimmed of accidental whitespaces
    const enteredEmail = (emailInput.value || '').trim().toLowerCase();
    const enteredPassword = (passwordInput.value || '').trim();

    if (!enteredEmail || !enteredPassword) {
      this.displayError('Please enter both your Email / User ID and Password.');
      return;
    }

    // Check credentials (allows either full email or username prefix)
    const validEmail = this.CREDENTIALS.email.toLowerCase().trim();
    const validUsername = this.CREDENTIALS.username.toLowerCase().trim();
    const validPassword = this.CREDENTIALS.password.trim();

    const isEmailValid = (enteredEmail === validEmail || enteredEmail === validUsername);
    const isPasswordValid = (enteredPassword === validPassword);

    if (isEmailValid && isPasswordValid) {
      // Remember me handling
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem(this.REMEMBER_KEY, enteredEmail);
      } else {
        localStorage.removeItem(this.REMEMBER_KEY);
      }

      // Store authenticated session
      const sessionData = {
        email: this.CREDENTIALS.email,
        name: this.CREDENTIALS.name,
        role: this.CREDENTIALS.role,
        signedInAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));

      // Clear password field for clean security
      passwordInput.value = '';

      if (submitBtn) {
        submitBtn.innerHTML = `<span>Welcome! Opening Learning Hub... ✨</span>`;
      }

      // Play pleasant welcome chime
      if (window.AudioEngine) {
        try {
          window.AudioEngine.playGentleChime('success');
        } catch (err) {
          console.warn('Audio chime notice:', err);
        }
      }

      // Immediately switch views without unneeded delays
      this.verifyAuthStatus();

      if (window.App) {
        window.App.refreshCurrentStudentUI();
        window.App.navigate('student-dashboard');
        window.App.notify('Welcome to Accessible Learning Companion! 🌟', 'success');
      }

      // Restore button text after transition
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Sign In to Learning Hub</span> <span aria-hidden="true">🚀</span>`;
      }

    } else {
      this.displayError('Incorrect email or password. Please check carefully and try again.');
      if (window.AudioEngine) {
        try {
          window.AudioEngine.playGentleChime('retry');
        } catch (err) {
          console.warn('Audio retry notice:', err);
        }
      }
    }
  },

  displayError(msg) {
    const errorBox = document.getElementById('login-error-message');
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.classList.add('active');
      errorBox.style.display = 'block';
    }
  },

  showForgotPasswordModal() {
    const modalHtml = `
      <div class="modal-backdrop active" id="forgot-modal" role="dialog" aria-modal="true" aria-labelledby="forgot-modal-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="forgot-modal-title">Need Help Signing In?</h3>
            <button class="modal-close-btn" id="close-forgot-modal" aria-label="Close dialog">✖</button>
          </div>
          <div class="modal-body">
            <p>If you forgot your password or need assistance, you can use the designated demonstration credentials below:</p>
            <div style="background:var(--color-bg);padding:14px;border-radius:12px;margin:14px 0;border:1px solid var(--color-border);">
              <p><strong>Email / User ID:</strong> <code>kiranfamily.0987@gmail.com</code></p>
              <p style="margin-top:6px;"><strong>Password:</strong> <code>kiranfamily.0987</code></p>
            </div>
            <p style="font-size:0.95rem;color:var(--color-text-muted);">
              Press the button below to automatically fill these credentials and enter.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="confirm-forgot-close">Close</button>
            <button class="btn btn-primary" id="confirm-forgot-autofill">Auto-Fill & Enter ✨</button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('forgot-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('forgot-modal');
      if (m) m.remove();
    };

    document.getElementById('close-forgot-modal')?.addEventListener('click', close);
    document.getElementById('confirm-forgot-close')?.addEventListener('click', close);
    document.getElementById('confirm-forgot-autofill')?.addEventListener('click', () => {
      close();
      this.fillDemoCredentials(true);
    });
  },

  confirmLogout() {
    const modalHtml = `
      <div class="modal-backdrop active" id="logout-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="logout-title">Ready to leave for now?</h3>
            <button class="modal-close-btn" id="close-logout-modal" aria-label="Cancel logout">✖</button>
          </div>
          <div class="modal-body">
            <div style="font-size:3rem;text-align:center;margin-bottom:12px;">👋</div>
            <p style="text-align:center;font-size:1.1rem;color:var(--color-text);">
              You did wonderful learning today! Do you want to sign out safely?
            </p>
          </div>
          <div class="modal-footer" style="justify-content:center;gap:12px;">
            <button class="btn btn-secondary" id="cancel-logout-btn">Stay Here</button>
            <button class="btn btn-primary" id="proceed-logout-btn">Yes, Sign Out</button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('logout-confirm-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('logout-confirm-modal');
      if (m) m.remove();
    };

    document.getElementById('close-logout-modal')?.addEventListener('click', close);
    document.getElementById('cancel-logout-btn')?.addEventListener('click', close);
    document.getElementById('proceed-logout-btn')?.addEventListener('click', () => {
      close();
      this.logout();
    });
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    if (window.AudioEngine) {
      window.AudioEngine.stopSpeech();
    }
    this.verifyAuthStatus();
    if (window.App && typeof window.App.notify === 'function') {
      window.App.notify('Signed out safely. See you soon!', 'info');
    }
  },

  verifyAuthStatus() {
    const loginView = document.getElementById('view-login');
    const appShell = document.getElementById('app-shell');
    const isAuth = this.isAuthenticated();

    if (isAuth) {
      if (loginView) {
        loginView.style.display = 'none';
        loginView.classList.add('hidden');
      }
      if (appShell) {
        appShell.style.display = 'flex';
        appShell.classList.add('visible');
      }
    } else {
      if (loginView) {
        loginView.style.display = 'flex';
        loginView.classList.remove('hidden');
      }
      if (appShell) {
        appShell.style.display = 'none';
        appShell.classList.remove('visible');
      }
    }
  }
};

window.Auth = Auth;
