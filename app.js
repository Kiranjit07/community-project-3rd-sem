/**
 * Accessible Learning Companion - Main Application Controller
 * Coordinates:
 * - Hash routing & View navigation across all 15 views
 * - Student Dashboard population & time-based greetings
 * - Practice & Flashcard revision mode
 * - Rewards, Stars & Badges trophy room
 * - Student Profile Management & switching
 * - Milo Rule-Based Chat Assistant
 * - Application Settings, JSON export, and data reset
 * - Global accessible toasts and responsive mobile sidebar
 */

const App = {
  currentView: 'student-dashboard',

  init() {
    this.bindNavigation();
    this.bindStudentSwitcher();
    this.bindRevisionModule();
    this.bindMiloChatView();
    this.bindAppSettings();

    // Check auth before loading views
    if (window.Auth && window.Auth.isAuthenticated()) {
      this.refreshCurrentStudentUI();
      let initialRoute = window.location.hash ? window.location.hash.replace('#', '') : 'student-dashboard';
      if (!initialRoute || initialRoute === 'login') {
        initialRoute = 'student-dashboard';
      }
      this.navigate(initialRoute);
    } else {
      if (window.Auth) window.Auth.verifyAuthStatus();
    }
  },

  // --------------------------------------------------------------------------
  // Navigation & View Switching
  // --------------------------------------------------------------------------
  bindNavigation() {
    // Nav links
    document.querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const route = el.getAttribute('data-route');
        this.navigate(route);

        // Close mobile drawer if open
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      });
    });

    // Mobile Hamburger Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) {
          sidebar.classList.toggle('mobile-open');
        }
      });
    }

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '');
      if (route && route !== this.currentView) {
        this.navigate(route, false);
      }
    });
  },

  navigate(viewId, updateHash = true) {
    // Auth guard
    if (window.Auth && !window.Auth.isAuthenticated() && viewId !== 'login') {
      window.Auth.verifyAuthStatus();
      return;
    }

    // Fallback if view doesn't exist
    const targetView = document.getElementById(`view-${viewId}`) || document.getElementById('view-student-dashboard');
    const resolvedViewId = targetView ? targetView.id.replace('view-', '') : 'student-dashboard';

    // Hide all view containers
    document.querySelectorAll('.app-view-container').forEach(view => {
      view.classList.remove('active');
    });

    if (targetView) {
      targetView.classList.add('active');
      this.currentView = resolvedViewId;
      if (updateHash) {
        window.location.hash = `#${resolvedViewId}`;
      }
    }

    // Update active nav sidebar links
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const route = item.getAttribute('data-route');
      item.classList.toggle('active', route === resolvedViewId);
      if (route === resolvedViewId) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    // View specific hooks
    this.onViewEnter(resolvedViewId);

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  onViewEnter(viewId) {
    switch (viewId) {
      case 'student-dashboard':
        this.renderStudentDashboard();
        break;
      case 'learning-library':
        if (window.LessonModule) window.LessonModule.renderLessonGrid();
        break;
      case 'activities':
        if (window.ActivitiesModule) window.ActivitiesModule.renderActivityHub();
        break;
      case 'practice':
        this.renderPracticeHub();
        break;
      case 'rewards':
        this.renderRewardsShelf();
        break;
      case 'progress':
      case 'reports':
        if (window.ProgressModule) window.ProgressModule.init();
        break;
      case 'teacher-dashboard':
        if (window.TeacherModule) window.TeacherModule.init();
        break;
      case 'student-profiles':
        this.renderStudentProfilesList();
        break;
      case 'daily-skills':
        if (window.DailySkillsModule) window.DailySkillsModule.init();
        break;
      case 'cms':
        if (window.CMSModule) window.CMSModule.init();
        break;
      case 'accessibility':
        if (window.AccessibilityModule) window.AccessibilityModule.syncFormFields();
        break;
      case 'milo-assistant':
        // Focus chat input
        setTimeout(() => document.getElementById('milo-chat-input')?.focus(), 200);
        break;
    }
  },

  // --------------------------------------------------------------------------
  // Student Dashboard Rendering
  // --------------------------------------------------------------------------
  renderStudentDashboard() {
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    if (!student) return;

    // Time-based greeting
    const hour = new Date().getHours();
    let greeting = 'Hello';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    const isKannada = student.preferredLanguage === 'kn';
    const kannadaGreeting = hour < 12 ? 'ಶುಭೋದಯ' : 'ಶುಭ ಸಂಜೆ';

    const greetingEl = document.getElementById('dashboard-greeting-text');
    if (greetingEl) {
      greetingEl.innerHTML = isKannada 
        ? `${kannadaGreeting}, <strong>${student.name}</strong>! ☀️` 
        : `${greeting}, <strong>${student.name}</strong>! ☀️`;
    }

    const avatarEl = document.getElementById('dashboard-student-avatar');
    if (avatarEl) avatarEl.textContent = student.avatar;

    const levelBadgeEl = document.getElementById('dashboard-student-level');
    if (levelBadgeEl) {
      levelBadgeEl.className = `badge-difficulty ${student.learningLevel}`;
      levelBadgeEl.textContent = `${student.learningLevel.toUpperCase()} LEVEL`;
    }

    const starsEl = document.getElementById('dashboard-stars-count');
    if (starsEl) starsEl.textContent = `${student.totalStars || 45} ⭐`;

    const streakEl = document.getElementById('dashboard-streak-count');
    if (streakEl) streakEl.textContent = `${student.streakDays || 3} Days 🔥`;

    // Dynamic Continue Learning card via Adaptive Engine
    const analysis = window.AdaptiveEngine ? window.AdaptiveEngine.analyzePerformance(student.id) : null;
    const contCard = document.getElementById('dashboard-continue-card');
    if (contCard && analysis && analysis.recommendation) {
      const rec = analysis.recommendation;
      contCard.innerHTML = `
        <div class="continue-card-content">
          <div class="continue-badge">Recommended for You 🎯</div>
          <h3>${rec.title}</h3>
          <p>${rec.reason}</p>
          <button class="btn btn-primary continue-action-btn" data-lesson-id="${rec.lessonId}">
            <span>Continue Learning</span> <span aria-hidden="true">➡️</span>
          </button>
        </div>
        <div class="continue-card-graphic">
          <span style="font-size:4.5rem;">🌟</span>
        </div>
      `;

      contCard.querySelector('.continue-action-btn')?.addEventListener('click', () => {
        if (window.LessonModule) {
          window.LessonModule.openLessonModal(rec.lessonId);
        }
      });
    }

    // Dashboard Categories Quick Access
    const catGrid = document.getElementById('dashboard-quick-categories');
    if (catGrid) {
      const cats = [
        { id: 'colours', title: 'Colours', icon: '🎨', color: '#EF4444' },
        { id: 'numbers', title: 'Numbers', icon: '🔢', color: '#3B82F6' },
        { id: 'shapes', title: 'Shapes', icon: '📐', color: '#10B981' },
        { id: 'animals', title: 'Animals', icon: '🐾', color: '#F59E0B' },
        { id: 'objects', title: 'Everyday Objects', icon: '🪑', color: '#8B5CF6' },
        { id: 'fruits-veg', title: 'Fruits & Veggies', icon: '🍎', color: '#EC4899' },
        { id: 'emotions', title: 'Emotions', icon: '😊', color: '#06B6D4' }
      ];

      catGrid.innerHTML = cats.map(c => `
        <button class="quick-category-card" data-cat="${c.id}" aria-label="Open ${c.title}">
          <span class="quick-cat-icon">${c.icon}</span>
          <span class="quick-cat-title">${c.title}</span>
        </button>
      `).join('');

      catGrid.querySelectorAll('.quick-category-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const cat = e.currentTarget.getAttribute('data-cat');
          if (window.LessonModule) {
            window.LessonModule.filterByCategory(cat);
          }
          this.navigate('learning-library');
        });
      });
    }

    // Dashboard Recent Activity
    const recentGrid = document.getElementById('dashboard-recent-lessons');
    if (recentGrid) {
      const results = window.StorageManager ? window.StorageManager.getResults(student.id) : [];
      const recent = [...results].reverse().slice(0, 3);

      if (recent.length === 0) {
        recentGrid.innerHTML = `<p class="empty-text">No lessons completed yet today. Let's start with Colours!</p>`;
      } else {
        recentGrid.innerHTML = recent.map(r => `
          <div class="mini-activity-pill">
            <span class="mini-pill-icon">✨</span>
            <div class="mini-pill-info">
              <strong>${r.activityType}</strong>
              <small>${r.accuracy}% Accuracy • +${Math.ceil((r.pointsEarned || 5)/5)} Stars</small>
            </div>
          </div>
        `).join('');
      }
    }
  },

  // --------------------------------------------------------------------------
  // Practice & Revision Module
  // --------------------------------------------------------------------------
  bindRevisionModule() {
    const flashcardFlipBtn = document.getElementById('flashcard-flip-btn');
    if (flashcardFlipBtn) {
      flashcardFlipBtn.addEventListener('click', () => {
        const card = document.getElementById('revision-flashcard');
        if (card) {
          card.classList.toggle('flipped');
          if (window.AudioEngine) window.AudioEngine.playGentleChime('tap');
        }
      });
    }

    const nextCardBtn = document.getElementById('flashcard-next-btn');
    if (nextCardBtn) {
      nextCardBtn.addEventListener('click', () => {
        this.nextFlashcard();
      });
    }

    const speakFlashcardBtn = document.getElementById('flashcard-speak-btn');
    if (speakFlashcardBtn) {
      speakFlashcardBtn.addEventListener('click', () => {
        const title = document.getElementById('flashcard-title')?.textContent;
        const text = document.getElementById('flashcard-text')?.textContent;
        if (window.AudioEngine) window.AudioEngine.speak(`${title}. ${text}`);
      });
    }
  },

  renderPracticeHub() {
    this.flashcardIndex = 0;
    this.renderCurrentFlashcard();
  },

  flashcardIndex: 0,
  renderCurrentFlashcard() {
    const lessons = window.StorageManager ? window.StorageManager.getLessons() : [];
    if (lessons.length === 0) return;

    const lesson = lessons[this.flashcardIndex % lessons.length];

    const card = document.getElementById('revision-flashcard');
    if (card) card.classList.remove('flipped');

    const frontVisual = document.getElementById('flashcard-front-visual');
    if (frontVisual) {
      if (lesson.visualKey && window.VisualAssets[lesson.visualKey]) {
        frontVisual.innerHTML = window.VisualAssets[lesson.visualKey];
      } else {
        frontVisual.innerHTML = `<span style="font-size:5rem;">${lesson.iconEmoji || '🌟'}</span>`;
      }
    }

    const titleEl = document.getElementById('flashcard-title');
    if (titleEl) titleEl.textContent = lesson.title;

    const textEl = document.getElementById('flashcard-text');
    if (textEl) textEl.textContent = lesson.simpleExplanation || lesson.description;

    const progressEl = document.getElementById('flashcard-counter');
    if (progressEl) progressEl.textContent = `Card ${(this.flashcardIndex % lessons.length) + 1} of ${lessons.length}`;
  },

  nextFlashcard() {
    this.flashcardIndex++;
    this.renderCurrentFlashcard();
  },

  // --------------------------------------------------------------------------
  // Rewards & Achievements Shelf
  // --------------------------------------------------------------------------
  renderRewardsShelf() {
    const shelf = document.getElementById('rewards-badges-shelf');
    if (!shelf) return;

    const achievements = window.StorageManager ? window.StorageManager.getAchievements() : [];
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;

    const totalStars = student ? student.totalStars : 45;
    const headerStars = document.getElementById('rewards-total-stars-banner');
    if (headerStars) {
      headerStars.textContent = `${totalStars} Stars Collected! 🌟`;
    }

    shelf.innerHTML = achievements.map(ach => {
      const isUnlocked = !!ach.unlockedAt;
      return `
        <div class="reward-badge-card ${isUnlocked ? 'unlocked' : 'locked'}" tabindex="0">
          <div class="badge-trophy-icon">${isUnlocked ? ach.icon : '🔒'}</div>
          <h4 class="badge-title">${ach.title}</h4>
          <p class="badge-desc">${ach.description}</p>
          <div class="badge-points-tag">${isUnlocked ? `+${ach.points} Pts Unlocked!` : `${ach.points} Pts to Unlock`}</div>
        </div>
      `;
    }).join('');

    // Trigger celebration button
    const celebrateBtn = document.getElementById('trigger-celebration-stars-btn');
    if (celebrateBtn) {
      celebrateBtn.onclick = () => {
        if (window.AudioEngine) window.AudioEngine.playGentleChime('fanfare');
        if (window.MiloMascot) window.MiloMascot.setMood('celebrate');
        if (window.ActivitiesModule) window.ActivitiesModule.triggerConfetti();
        this.notify('Superstar celebration! Keep shining! 🌟', 'success');
      };
    }
  },

  // --------------------------------------------------------------------------
  // Student Profiles Management
  // --------------------------------------------------------------------------
  bindStudentSwitcher() {
    const switcher = document.getElementById('header-student-switch');
    if (switcher) {
      switcher.addEventListener('change', (e) => {
        this.switchActiveStudent(e.target.value);
      });
    }

    const addStudentBtn = document.getElementById('add-new-student-btn');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', () => {
        this.openAddStudentModal();
      });
    }
  },

  refreshCurrentStudentUI() {
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    if (!student) return;

    // Header selector
    const switcher = document.getElementById('header-student-switch');
    if (switcher && window.StorageManager) {
      const all = window.StorageManager.getStudents();
      switcher.innerHTML = all.map(s => `
        <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
          ${s.avatar} ${s.name}
        </option>
      `).join('');
    }

    // Sync accessibility preferences for active student
    if (window.AccessibilityModule) {
      window.AccessibilityModule.loadSettings();
      window.AccessibilityModule.applySettingsToDOM();
    }
  },

  switchActiveStudent(studentId) {
    if (window.StorageManager) {
      window.StorageManager.setCurrentStudent(studentId);
    }
    this.refreshCurrentStudentUI();
    this.renderStudentDashboard();
    this.notify('Switched student profile safely.', 'info');
  },

  renderStudentProfilesList() {
    const list = document.getElementById('profiles-list-grid');
    if (!list) return;

    const students = window.StorageManager ? window.StorageManager.getStudents() : [];
    const current = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;

    list.innerHTML = students.map(s => `
      <div class="student-profile-card ${s.id === current?.id ? 'active-profile' : ''}">
        <span class="profile-card-avatar">${s.avatar}</span>
        <h3 class="profile-card-name">${s.name}</h3>
        <p class="profile-card-meta">
          Age: ${s.ageGroup} • Level: <span class="badge-difficulty ${s.learningLevel}">${s.learningLevel}</span>
        </p>
        <p class="profile-card-meta">
          Language: ${s.preferredLanguage === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'} • Stars: ${s.totalStars || 0} ⭐
        </p>
        <div style="margin-top:16px;">
          ${s.id === current?.id 
            ? `<span class="badge-tag tag-mastered">Currently Learning</span>`
            : `<button class="btn btn-outline btn-sm activate-profile-btn" data-id="${s.id}">Select Student</button>`
          }
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.activate-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.switchActiveStudent(id);
        this.renderStudentProfilesList();
      });
    });
  },

  openAddStudentModal() {
    const modalHtml = `
      <div class="modal-backdrop" id="add-student-modal" role="dialog" aria-modal="true" aria-labelledby="add-stud-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="add-stud-title">Add New Student Profile</h3>
            <button class="modal-close-btn" id="close-stud-modal" aria-label="Cancel">✖</button>
          </div>
          <form id="add-student-form">
            <div class="modal-body">
              <div class="form-group">
                <label for="new-student-name">Student Name *</label>
                <input type="text" id="new-student-name" class="form-control" required placeholder="e.g. Samarth" autofocus>
              </div>
              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="new-student-avatar">Avatar Emoji</label>
                  <select id="new-student-avatar" class="form-control">
                    <option value="👦">👦 Boy</option>
                    <option value="👧">👧 Girl</option>
                    <option value="🧒">🧒 Child</option>
                    <option value="🦊">🦊 Fox</option>
                    <option value="🦁">🦁 Lion</option>
                    <option value="🐼">🐼 Panda</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label for="new-student-age">Age Group</label>
                  <select id="new-student-age" class="form-control">
                    <option value="5-7 years">5-7 years</option>
                    <option value="8-11 years">8-11 years</option>
                    <option value="12-15 years">12-15 years</option>
                    <option value="16+ years">16+ years</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="new-student-level">Initial Learning Level</label>
                  <select id="new-student-level" class="form-control">
                    <option value="beginner">Beginner (1-2 options, simple)</option>
                    <option value="intermediate">Intermediate (3 options)</option>
                    <option value="advanced">Advanced (4 options)</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label for="new-student-lang">Preferred Language</label>
                  <select id="new-student-lang" class="form-control">
                    <option value="en">English</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cancel-stud-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Profile ✨</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const existing = document.getElementById('add-student-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('add-student-modal');
      if (m) m.remove();
    };

    document.getElementById('close-stud-modal').addEventListener('click', close);
    document.getElementById('cancel-stud-btn').addEventListener('click', close);

    document.getElementById('add-student-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-student-name').value.trim();
      const avatar = document.getElementById('new-student-avatar').value;
      const ageGroup = document.getElementById('new-student-age').value;
      const level = document.getElementById('new-student-level').value;
      const lang = document.getElementById('new-student-lang').value;

      if (!name) return;

      const newStudent = {
        id: 'student-' + Date.now(),
        name,
        avatar,
        ageGroup,
        learningLevel: level,
        preferredLanguage: lang,
        totalStars: 10,
        streakDays: 1,
        accessibilitySettings: {
          fontSize: 'normal',
          highContrast: false,
          reducedMotion: false,
          audioFirst: false,
          pictureFirst: true,
          speechRate: 0.9,
          audioVolume: 1.0,
          simpleLanguage: true,
          largeButtons: false,
          theme: 'default'
        }
      };

      if (window.StorageManager) {
        window.StorageManager.addStudent(newStudent);
        this.switchActiveStudent(newStudent.id);
      }

      close();
      this.renderStudentProfilesList();
      this.notify(`Created student profile for ${name}! 🌟`, 'success');
    });
  },

  // --------------------------------------------------------------------------
  // Milo Rule-Based Chat Assistant View
  // --------------------------------------------------------------------------
  bindMiloChatView() {
    const chatForm = document.getElementById('milo-chat-form');
    const chatInput = document.getElementById('milo-chat-input');
    const chatMessages = document.getElementById('milo-chat-messages');

    if (chatForm && chatInput && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        this.sendMiloMessage(text);
        chatInput.value = '';
      });
    }

    // Quick suggestion chips
    document.querySelectorAll('.milo-quick-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const query = e.currentTarget.textContent.replace(/^[^\w]+/, '').trim();
        this.sendMiloMessage(query);
      });
    });

    // Voice input mic in chat
    const chatMicBtn = document.getElementById('milo-chat-voice-btn');
    if (chatMicBtn && window.AudioEngine) {
      chatMicBtn.addEventListener('click', () => {
        window.AudioEngine.startListening(
          (spoken) => {
            this.sendMiloMessage(spoken);
          },
          (err) => {
            this.notify(err, 'info');
          }
        );
      });
    }
  },

  sendMiloMessage(userText) {
    const chatMessages = document.getElementById('milo-chat-messages');
    if (!chatMessages) return;

    // Render User message
    const userMsgHtml = `
      <div class="chat-bubble user-bubble">
        <div class="bubble-text">${userText}</div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', userMsgHtml);

    // Rule-based engine response
    const response = window.MiloMascot ? window.MiloMascot.processQuery(userText) : {
      text: "I am happy to learn with you! Let's explore together.",
      mood: 'happy'
    };

    // Simulated gentle delay
    setTimeout(() => {
      const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
      const isKannada = student && student.preferredLanguage === 'kn';
      const replyText = (isKannada && response.kannada) ? response.kannada : response.text;

      const miloMsgHtml = `
        <div class="chat-bubble milo-bubble">
          <div class="milo-bubble-avatar">
            ${window.MiloMascot ? window.MiloMascot.getMascotSvg(response.mood || 'happy', 40) : '🦊'}
          </div>
          <div class="bubble-content">
            <div class="bubble-text">${replyText}</div>
            <button class="btn-icon-soft speak-reply-btn" aria-label="Listen to Milo">🔊</button>
          </div>
        </div>
      `;
      chatMessages.insertAdjacentHTML('beforeend', miloMsgHtml);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Speak reply
      if (window.AudioEngine) {
        window.AudioEngine.speak(response.text, response.kannada);
      }
      if (window.MiloMascot) {
        window.MiloMascot.setMood(response.mood || 'happy');
      }

      // Bind speech button on new bubble
      const lastBubble = chatMessages.querySelector('.milo-bubble:last-child .speak-reply-btn');
      lastBubble?.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.speak(response.text, response.kannada);
      });
    }, 400);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  },

  // --------------------------------------------------------------------------
  // Application Settings & Data Reset
  // --------------------------------------------------------------------------
  bindAppSettings() {
    const exportBtn = document.getElementById('settings-export-json-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAllDataJson());
    }

    const resetBtn = document.getElementById('settings-reset-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.confirmResetAllData());
    }
  },

  exportAllDataJson() {
    const data = {
      students: window.StorageManager ? window.StorageManager.getStudents() : [],
      lessons: window.StorageManager ? window.StorageManager.getLessons() : [],
      results: window.StorageManager ? window.StorageManager.getResults() : [],
      achievements: window.StorageManager ? window.StorageManager.getAchievements() : [],
      exportedAt: new Date().toISOString()
    };

    const str = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = str;
    a.download = `accessible_learning_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.notify('All application data exported as JSON backup! 💾', 'success');
  },

  confirmResetAllData() {
    const modalHtml = `
      <div class="modal-backdrop" id="reset-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="reset-modal-title">Reset to Default Data?</h3>
            <button class="modal-close-btn" id="close-reset-modal" aria-label="Cancel">✖</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to restore all lessons, students, and progress records to default factory settings?</p>
            <p style="color:var(--color-error);font-size:0.9rem;margin-top:8px;">
              ⚠️ This will erase local additions and reset all stars and activity histories.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancel-reset-btn">Cancel</button>
            <button class="btn btn-outline" id="confirm-reset-btn" style="color:var(--color-error);border-color:var(--color-error);">
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('reset-confirm-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('reset-confirm-modal');
      if (m) m.remove();
    };

    document.getElementById('close-reset-modal').addEventListener('click', close);
    document.getElementById('cancel-reset-btn').addEventListener('click', close);

    document.getElementById('confirm-reset-btn').addEventListener('click', () => {
      if (window.StorageManager) {
        window.StorageManager.resetAllData();
      }
      close();
      this.refreshCurrentStudentUI();
      this.renderStudentDashboard();
      this.notify('Application data has been reset to defaults.', 'info');
    });
  },

  // --------------------------------------------------------------------------
  // Accessible Toast Notifications
  // --------------------------------------------------------------------------
  notify(message, type = 'info') {
    const container = document.getElementById('global-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.setAttribute('role', 'status');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span aria-hidden="true">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};

window.App = App;

// Robust Bootstrap: Runs whether DOM is still loading or already ready
function bootstrapApp() {
  try { if (window.StorageManager) StorageManager.init(); } catch (e) { console.error('StorageManager init error', e); }
  try { if (window.AudioEngine) AudioEngine.init(); } catch (e) { console.error('AudioEngine init error', e); }
  try { if (window.AccessibilityModule) AccessibilityModule.init(); } catch (e) { console.error('AccessibilityModule init error', e); }
  try { if (window.MiloMascot) MiloMascot.init(); } catch (e) { console.error('MiloMascot init error', e); }
  try { if (window.Auth) Auth.init(); } catch (e) { console.error('Auth init error', e); }
  try { if (window.LessonModule) LessonModule.init(); } catch (e) { console.error('LessonModule init error', e); }
  try { if (window.ActivitiesModule) ActivitiesModule.init(); } catch (e) { console.error('ActivitiesModule init error', e); }
  try { if (window.DailySkillsModule) DailySkillsModule.init(); } catch (e) { console.error('DailySkillsModule init error', e); }
  try { if (window.ProgressModule) ProgressModule.init(); } catch (e) { console.error('ProgressModule init error', e); }
  try { if (window.TeacherModule) TeacherModule.init(); } catch (e) { console.error('TeacherModule init error', e); }
  try { if (window.CMSModule) CMSModule.init(); } catch (e) { console.error('CMSModule init error', e); }
  try { if (window.App) App.init(); } catch (e) { console.error('App init error', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  // DOM already parsed, initialize immediately
  bootstrapApp();
}
