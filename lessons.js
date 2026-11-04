/**
 * Accessible Learning Companion - Learning Library & Lesson Viewer Module
 * Renders categorized picture-based lessons, handles interactive lesson views,
 * audio pronunciation, next/previous navigation, and embedded interactive checks.
 */

const LessonModule = {
  currentCategory: 'all',
  currentLessonIndex: 0,
  activeLessonList: [],
  currentLesson: null,

  init() {
    this.renderCategoryChips();
    this.renderLessonGrid();
    this.bindLessonEvents();
  },

  renderCategoryChips() {
    const container = document.getElementById('lesson-category-chips');
    if (!container) return;

    const categories = [
      { id: 'all', name: 'All Topics', icon: '🌟' },
      { id: 'colours', name: 'Colours', icon: '🎨' },
      { id: 'numbers', name: 'Numbers', icon: '🔢' },
      { id: 'shapes', name: 'Shapes', icon: '📐' },
      { id: 'animals', name: 'Animals', icon: '🐾' },
      { id: 'objects', name: 'Everyday Objects', icon: '🪑' },
      { id: 'fruits-veg', name: 'Fruits & Veggies', icon: '🍎' },
      { id: 'emotions', name: 'Emotions', icon: '😊' }
    ];

    container.innerHTML = categories.map(cat => `
      <button class="chip-filter ${cat.id === this.currentCategory ? 'active' : ''}" 
              data-category="${cat.id}" 
              aria-pressed="${cat.id === this.currentCategory}">
        <span aria-hidden="true">${cat.icon}</span> ${cat.name}
      </button>
    `).join('');

    // Bind chip clicks
    container.querySelectorAll('.chip-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-category');
        this.filterByCategory(cat);
      });
    });
  },

  filterByCategory(categoryId) {
    this.currentCategory = categoryId;
    this.renderCategoryChips();
    this.renderLessonGrid();
  },

  getFilteredLessons() {
    const all = window.StorageManager ? window.StorageManager.getLessons() : [];
    if (this.currentCategory === 'all') {
      return all;
    }
    return all.filter(l => l.category === this.currentCategory);
  },

  renderLessonGrid() {
    const grid = document.getElementById('lesson-cards-grid');
    if (!grid) return;

    const lessons = this.getFilteredLessons();
    this.activeLessonList = lessons;

    if (lessons.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1;">
          <span style="font-size:3rem;">🔍</span>
          <h3>No lessons found</h3>
          <p>Try selecting another category or add a new lesson in Content Management.</p>
        </div>
      `;
      return;
    }

    const currentStudent = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    const isKannada = currentStudent && currentStudent.preferredLanguage === 'kn';

    grid.innerHTML = lessons.map((l, index) => {
      let visualHtml = '';
      if (l.visualKey && window.VisualAssets && window.VisualAssets[l.visualKey]) {
        visualHtml = window.VisualAssets[l.visualKey];
      } else if (l.customVisualHtml) {
        visualHtml = l.customVisualHtml;
      } else {
        visualHtml = `<div class="emoji-card-visual"><span class="main-emoji">${l.iconEmoji || '🌟'}</span></div>`;
      }

      return `
        <article class="lesson-card" data-lesson-id="${l.id}" data-index="${index}" tabindex="0" role="button" aria-label="Open lesson: ${l.title}">
          <div class="lesson-card-visual">
            ${visualHtml}
          </div>
          <div class="lesson-card-body">
            <div class="lesson-meta-pill">
              <span>${window.AdaptiveEngine ? window.AdaptiveEngine.formatCategoryName(l.category) : l.category}</span>
              <span class="badge-difficulty ${l.difficulty}">${l.difficulty}</span>
            </div>
            <h3 class="lesson-card-title">${l.title}</h3>
            <p class="lesson-card-desc">${isKannada && l.kannadaText ? l.kannadaText : (l.simpleExplanation || l.description)}</p>
          </div>
          <div class="lesson-card-footer">
            <button class="btn btn-primary btn-sm open-lesson-btn" data-lesson-id="${l.id}" aria-label="Start lesson ${l.title}">
              <span>Start Lesson</span> <span aria-hidden="true">➡️</span>
            </button>
            <button class="btn-icon-soft speak-lesson-preview" data-lesson-id="${l.id}" aria-label="Listen to ${l.title}">
              <span aria-hidden="true">🔊</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Bind card clicks
    grid.querySelectorAll('.lesson-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicking the audio preview button, do not open modal
        if (e.target.closest('.speak-lesson-preview')) {
          e.stopPropagation();
          const lId = e.target.closest('.speak-lesson-preview').getAttribute('data-lesson-id');
          const les = window.StorageManager.getLessonById(lId);
          if (les && window.AudioEngine) {
            window.AudioEngine.speak(les.audioText || les.title, les.kannadaText);
          }
          return;
        }

        const lessonId = card.getAttribute('data-lesson-id');
        this.openLessonModal(lessonId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const lessonId = card.getAttribute('data-lesson-id');
          this.openLessonModal(lessonId);
        }
      });
    });
  },

  openLessonModal(lessonId) {
    const lesson = window.StorageManager ? window.StorageManager.getLessonById(lessonId) : null;
    if (!lesson) return;

    this.currentLesson = lesson;
    const all = this.activeLessonList.length > 0 ? this.activeLessonList : (window.StorageManager ? window.StorageManager.getLessons() : []);
    this.currentLessonIndex = all.findIndex(l => l.id === lesson.id);

    const modal = document.getElementById('lesson-detail-modal');
    if (!modal) return;

    const currentStudent = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    const isKannada = currentStudent && currentStudent.preferredLanguage === 'kn';
    const isSimpleLang = currentStudent?.accessibilitySettings?.simpleLanguage;

    // Render large visual
    let largeVisual = '';
    if (lesson.visualKey && window.VisualAssets && window.VisualAssets[lesson.visualKey]) {
      largeVisual = `<div class="modal-large-visual">${window.VisualAssets[lesson.visualKey]}</div>`;
    } else if (lesson.customVisualHtml) {
      largeVisual = `<div class="modal-large-visual">${lesson.customVisualHtml}</div>`;
    } else {
      largeVisual = `<div class="modal-large-visual emoji-card-visual" style="min-height:180px;"><span style="font-size:5rem;">${lesson.iconEmoji || '🌟'}</span></div>`;
    }

    const explanationText = isKannada && lesson.kannadaText 
      ? lesson.kannadaText 
      : (isSimpleLang ? (lesson.simpleExplanation || lesson.description) : lesson.description);

    document.getElementById('modal-lesson-title').textContent = lesson.title;
    document.getElementById('modal-lesson-visual-container').innerHTML = largeVisual;
    document.getElementById('modal-lesson-explanation').textContent = explanationText;

    // Setup interactive question check
    const practiceBox = document.getElementById('modal-lesson-practice-container');
    if (practiceBox) {
      if (lesson.questions && lesson.questions.length > 0) {
        const q = lesson.questions[0];
        const studentAcc = window.AdaptiveEngine ? window.AdaptiveEngine.analyzePerformance().overallAccuracy : 75;
        const options = window.AdaptiveEngine ? window.AdaptiveEngine.adaptQuestionOptions(q, studentAcc) : q.options;

        practiceBox.innerHTML = `
          <div class="embedded-practice-box">
            <h4 class="practice-box-title">
              <span aria-hidden="true">🎯</span> Quick Practice: ${q.prompt}
              <button class="btn-icon-soft speak-q-btn" aria-label="Listen to question">🔊</button>
            </h4>
            <div class="embedded-options-grid" id="modal-practice-options">
              ${options.map((opt, oIdx) => `
                <button class="btn btn-outline practice-opt-btn" data-correct="${opt.isCorrect}">
                  ${opt.visualKey && window.VisualAssets[opt.visualKey] ? `<div style="width:40px;height:40px;">${window.VisualAssets[opt.visualKey]}</div>` : ''}
                  <span>${opt.text}</span>
                </button>
              `).join('')}
            </div>
            <div id="modal-practice-feedback" class="practice-feedback-banner" style="display:none;" role="status"></div>
          </div>
        `;

        // Bind question speech
        practiceBox.querySelector('.speak-q-btn')?.addEventListener('click', () => {
          if (window.AudioEngine) {
            window.AudioEngine.speak(q.audioPrompt || q.prompt, q.kannadaPrompt);
          }
        });

        // Bind option clicks
        practiceBox.querySelectorAll('.practice-opt-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const isCorrect = e.currentTarget.getAttribute('data-correct') === 'true';
            this.handlePracticeAnswer(isCorrect, lesson, q);
          });
        });
      } else {
        practiceBox.innerHTML = '';
      }
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Automatically speak audio prompt
    if (window.AudioEngine) {
      const speechToPlay = lesson.audioText || lesson.title;
      window.AudioEngine.speak(speechToPlay, lesson.kannadaText);
    }
  },

  handlePracticeAnswer(isCorrect, lesson, question) {
    const feedbackBanner = document.getElementById('modal-practice-feedback');
    if (!feedbackBanner) return;

    feedbackBanner.style.display = 'block';

    if (isCorrect) {
      feedbackBanner.className = 'practice-feedback-banner feedback-success';
      feedbackBanner.innerHTML = `
        <span aria-hidden="true" style="font-size:1.6rem;">🎉</span>
        <div>
          <strong>Wonderful! You got it right!</strong>
          <p>Milo gives you a high five and 5 bonus stars! ⭐⭐⭐⭐⭐</p>
        </div>
      `;

      if (window.AudioEngine) {
        window.AudioEngine.playGentleChime('star');
        window.AudioEngine.speak('Wonderful! You got it right!');
      }

      if (window.MiloMascot) {
        window.MiloMascot.setMood('celebrate');
      }

      // Record result
      if (window.StorageManager) {
        const student = window.StorageManager.getCurrentStudent();
        window.StorageManager.addResult({
          id: 'res-' + Date.now(),
          studentId: student ? student.id : 'student-1',
          lessonId: lesson.id,
          activityId: 'quick-practice',
          activityType: 'Quick Practice Check',
          category: lesson.category,
          correctAnswers: 1,
          incorrectAnswers: 0,
          attempts: 1,
          accuracy: 100,
          completionTime: 12,
          completedAt: new Date().toISOString(),
          pointsEarned: 5
        });
      }
    } else {
      feedbackBanner.className = 'practice-feedback-banner feedback-retry';
      feedbackBanner.innerHTML = `
        <span aria-hidden="true" style="font-size:1.6rem;">🌱</span>
        <div>
          <strong>Almost there! Let's try again.</strong>
          <p>Look carefully at the pictures or listen to Milo's hint.</p>
        </div>
      `;

      if (window.AudioEngine) {
        window.AudioEngine.playGentleChime('retry');
        window.AudioEngine.speak("Let's try again. You can do it!");
      }

      if (window.MiloMascot) {
        window.MiloMascot.setMood('encourage');
      }
    }
  },

  closeLessonModal() {
    const modal = document.getElementById('lesson-detail-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (window.AudioEngine) {
      window.AudioEngine.stopSpeech();
    }
    if (window.MiloMascot) {
      window.MiloMascot.setMood('happy');
    }
  },

  goToNextLesson() {
    const all = this.activeLessonList.length > 0 ? this.activeLessonList : (window.StorageManager ? window.StorageManager.getLessons() : []);
    if (this.currentLessonIndex < all.length - 1) {
      this.currentLessonIndex += 1;
      this.openLessonModal(all[this.currentLessonIndex].id);
    } else {
      this.openLessonModal(all[0].id); // loop back or celebrate
    }
  },

  goToPrevLesson() {
    const all = this.activeLessonList.length > 0 ? this.activeLessonList : (window.StorageManager ? window.StorageManager.getLessons() : []);
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex -= 1;
      this.openLessonModal(all[this.currentLessonIndex].id);
    } else {
      this.openLessonModal(all[all.length - 1].id);
    }
  },

  repeatAudio() {
    if (this.currentLesson && window.AudioEngine) {
      const speechToPlay = this.currentLesson.audioText || this.currentLesson.title;
      window.AudioEngine.speak(speechToPlay, this.currentLesson.kannadaText);
    }
  },

  bindLessonEvents() {
    const closeBtn = document.getElementById('close-lesson-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLessonModal());
    }

    const nextBtn = document.getElementById('lesson-modal-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.goToNextLesson());
    }

    const prevBtn = document.getElementById('lesson-modal-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.goToPrevLesson());
    }

    const repeatAudioBtn = document.getElementById('lesson-modal-repeat-audio-btn');
    if (repeatAudioBtn) {
      repeatAudioBtn.addEventListener('click', () => this.repeatAudio());
    }

    // Search lessons input
    const searchInput = document.getElementById('lesson-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const all = window.StorageManager ? window.StorageManager.getLessons() : [];
        if (!query) {
          this.filterByCategory(this.currentCategory);
          return;
        }
        const filtered = all.filter(l => 
          l.title.toLowerCase().includes(query) || 
          l.description.toLowerCase().includes(query) ||
          l.category.toLowerCase().includes(query)
        );
        this.activeLessonList = filtered;
        this.renderLessonGrid();
      });
    }
  }
};

window.LessonModule = LessonModule;
