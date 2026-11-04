/**
 * Accessible Learning Companion - Daily-Life Skills Module
 * Personal Hygiene, Daily Routines, Safety & Communication skills
 * with step-by-step interactive visual sequencing, audio narration, and checklists.
 */

const DailySkillsModule = {
  currentCategory: 'hygiene',
  selectedSkill: null,

  init() {
    this.renderCategoryChips();
    this.renderSkillsList();
    this.bindEvents();
  },

  renderCategoryChips() {
    const container = document.getElementById('daily-skills-chips');
    if (!container) return;

    const categories = [
      { id: 'hygiene', name: 'Personal Hygiene', icon: '🧼' },
      { id: 'routines', name: 'Daily Routines', icon: '☀️' },
      { id: 'safety', name: 'Safety Skills', icon: '🚦' },
      { id: 'communication', name: 'Communication', icon: '🤝' }
    ];

    container.innerHTML = categories.map(cat => `
      <button class="chip-filter ${cat.id === this.currentCategory ? 'active' : ''}" data-cat="${cat.id}">
        <span aria-hidden="true">${cat.icon}</span> ${cat.name}
      </button>
    `).join('');

    container.querySelectorAll('.chip-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentCategory = e.currentTarget.getAttribute('data-cat');
        this.renderCategoryChips();
        this.renderSkillsList();
      });
    });
  },

  renderSkillsList() {
    const container = document.getElementById('daily-skills-cards-grid');
    if (!container) return;

    const allSkills = window.StorageManager ? window.StorageManager.getDailySkills() : [];
    const filtered = allSkills.filter(s => s.category === this.currentCategory);

    if (filtered.length === 0) {
      container.innerHTML = `<p class="empty-text">No skills in this category.</p>`;
      return;
    }

    container.innerHTML = filtered.map(skill => `
      <div class="skill-card-item">
        <div class="skill-card-header">
          <span class="skill-badge-icon">${skill.icon}</span>
          <div>
            <h3 class="skill-card-title">${skill.title}</h3>
            <p class="skill-card-desc">${skill.description}</p>
          </div>
        </div>

        <div class="skill-steps-timeline">
          ${skill.steps.map(s => `
            <div class="skill-step-item" tabindex="0">
              <div class="step-circle">${s.step}</div>
              <div class="step-content">
                <div class="step-title-row">
                  <span class="step-icon-emoji">${s.emoji}</span>
                  <strong>${s.title}</strong>
                  <button class="btn-icon-soft speak-step-btn" data-audio="${s.audio}" aria-label="Listen to step ${s.step}">
                    🔊
                  </button>
                </div>
                <p class="step-desc">${s.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="skill-card-actions">
          <button class="btn btn-primary start-skill-practice" data-skill-id="${skill.id}">
            <span>Practice Checklist</span> <span aria-hidden="true">✅</span>
          </button>
          <button class="btn btn-secondary speak-all-steps" data-skill-id="${skill.id}">
            <span>Listen to All Steps</span> <span aria-hidden="true">🎧</span>
          </button>
        </div>
      </div>
    `).join('');

    // Bind step audio speak buttons
    container.querySelectorAll('.speak-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const audio = e.currentTarget.getAttribute('data-audio');
        if (window.AudioEngine) {
          window.AudioEngine.speak(audio);
        }
      });
    });

    // Bind Speak All Steps
    container.querySelectorAll('.speak-all-steps').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skillId = e.currentTarget.getAttribute('data-skill-id');
        const skill = allSkills.find(s => s.id === skillId);
        if (skill && window.AudioEngine) {
          const combined = skill.title + ". " + skill.steps.map(s => `Step ${s.step}: ${s.title}. ${s.desc}`).join(' ');
          window.AudioEngine.speak(combined);
        }
      });
    });

    // Bind practice checklist
    container.querySelectorAll('.start-skill-practice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skillId = e.currentTarget.getAttribute('data-skill-id');
        const skill = allSkills.find(s => s.id === skillId);
        if (skill) this.openChecklistModal(skill);
      });
    });
  },

  openChecklistModal(skill) {
    const modalHtml = `
      <div class="modal-backdrop" id="skill-checklist-modal" role="dialog" aria-modal="true" aria-labelledby="skill-check-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="skill-check-title">${skill.icon} Step-by-Step Practice: ${skill.title}</h3>
            <button class="modal-close-btn" id="close-skill-modal" aria-label="Close practice">✖</button>
          </div>
          <div class="modal-body">
            <p style="margin-bottom:16px;color:var(--color-text-muted);">
              Check off each step as you complete it together!
            </p>
            <div class="checklist-interactive-list">
              ${skill.steps.map((st, i) => `
                <label class="checklist-item-row" tabindex="0">
                  <input type="checkbox" class="skill-checkbox" data-index="${i}">
                  <span class="custom-check-box"></span>
                  <div class="checklist-text">
                    <strong>Step ${st.step}: ${st.title} ${st.emoji}</strong>
                    <p>${st.desc}</p>
                  </div>
                  <button type="button" class="btn-icon-soft speak-step-inline" data-audio="${st.audio}" aria-label="Listen">🔊</button>
                </label>
              `).join('')}
            </div>
            <div id="checklist-success-banner" class="practice-feedback-banner feedback-success" style="display:none;margin-top:16px;">
              <span style="font-size:1.8rem;">🎉</span>
              <div>
                <strong>Wonderful Routine Completed!</strong>
                <p>You practiced healthy, safe habits! Awarded 20 bonus stars! ⭐</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="close-checklist-btn">Done for Now</button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('skill-checklist-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('skill-checklist-modal');
      if (m) m.remove();
    };

    document.getElementById('close-skill-modal').addEventListener('click', close);
    document.getElementById('close-checklist-btn').addEventListener('click', close);

    const modalEl = document.getElementById('skill-checklist-modal');
    modalEl.querySelectorAll('.speak-step-inline').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const aud = e.currentTarget.getAttribute('data-audio');
        if (window.AudioEngine) window.AudioEngine.speak(aud);
      });
    });

    const checkboxes = modalEl.querySelectorAll('.skill-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (window.AudioEngine) window.AudioEngine.playGentleChime('tap');
        const allChecked = Array.from(checkboxes).every(c => c.checked);
        if (allChecked) {
          const banner = document.getElementById('checklist-success-banner');
          if (banner) banner.style.display = 'flex';
          if (window.AudioEngine) {
            window.AudioEngine.playGentleChime('fanfare');
            window.AudioEngine.speak('Wonderful routine completed! You did every step!');
          }
          if (window.MiloMascot) window.MiloMascot.setMood('celebrate');
          // Add reward
          if (window.StorageManager) {
            const student = window.StorageManager.getCurrentStudent();
            window.StorageManager.addResult({
              id: 'res-' + Date.now(),
              studentId: student ? student.id : 'student-1',
              lessonId: skill.id,
              activityId: 'checklist-routine',
              activityType: 'Daily Skill Checklist',
              category: skill.category,
              correctAnswers: skill.steps.length,
              incorrectAnswers: 0,
              attempts: skill.steps.length,
              accuracy: 100,
              completionTime: 45,
              completedAt: new Date().toISOString(),
              pointsEarned: 20
            });
          }
        }
      });
    });
  },

  bindEvents() {}
};

window.DailySkillsModule = DailySkillsModule;
