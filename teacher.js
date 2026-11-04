/**
 * Accessible Learning Companion - Teacher & Caregiver Dashboard Module
 * Facilitates student oversight, goal setting, teacher remarks, caregiver observations,
 * and individual learning performance reviews.
 */

const TeacherModule = {
  selectedStudentId: null,

  init() {
    this.selectedStudentId = window.StorageManager ? window.StorageManager.getCurrentStudent().id : 'student-1';
    this.renderOverviewStats();
    this.renderStudentSelector();
    this.renderIndividualAnalytics();
    this.renderRemarksList();
    this.bindEvents();
  },

  renderOverviewStats() {
    const students = window.StorageManager ? window.StorageManager.getStudents() : [];
    const allResults = window.StorageManager ? window.StorageManager.getResults() : [];

    const totalStudentsEl = document.getElementById('teacher-total-students');
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;

    const totalCompletedEl = document.getElementById('teacher-total-completed');
    if (totalCompletedEl) totalCompletedEl.textContent = allResults.length;

    const avgAccEl = document.getElementById('teacher-avg-accuracy');
    if (avgAccEl) {
      const totalCorrect = allResults.reduce((a, r) => a + (r.correctAnswers || 0), 0);
      const totalAttempts = allResults.reduce((a, r) => a + (r.attempts || 1), 0);
      const avg = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 80;
      avgAccEl.textContent = `${avg}%`;
    }
  },

  renderStudentSelector() {
    const selector = document.getElementById('teacher-student-picker');
    if (!selector) return;

    const students = window.StorageManager ? window.StorageManager.getStudents() : [];
    selector.innerHTML = students.map(s => `
      <option value="${s.id}" ${s.id === this.selectedStudentId ? 'selected' : ''}>
        ${s.avatar} ${s.name} (${s.learningLevel})
      </option>
    `).join('');

    selector.addEventListener('change', (e) => {
      this.selectedStudentId = e.target.value;
      this.renderIndividualAnalytics();
      this.renderRemarksList();
    });
  },

  renderIndividualAnalytics() {
    const students = window.StorageManager ? window.StorageManager.getStudents() : [];
    const current = students.find(s => s.id === this.selectedStudentId) || students[0];
    if (!current) return;

    const results = window.StorageManager ? window.StorageManager.getResults(current.id) : [];
    const analysis = window.AdaptiveEngine ? window.AdaptiveEngine.analyzePerformance(current.id) : null;

    const card = document.getElementById('teacher-student-detail-card');
    if (!card) return;

    card.innerHTML = `
      <div class="teacher-student-header">
        <span class="teacher-student-avatar">${current.avatar}</span>
        <div>
          <h3>${current.name}</h3>
          <p class="text-muted">Age group: ${current.ageGroup} | Level: <span class="badge-difficulty ${current.learningLevel}">${current.learningLevel}</span> | Preferred: ${current.preferredLanguage === 'kn' ? 'Kannada' : 'English'}</p>
        </div>
      </div>

      <div class="teacher-metrics-mini-grid">
        <div class="teacher-metric-box">
          <span class="metric-num">${results.length}</span>
          <span class="metric-lbl">Activities</span>
        </div>
        <div class="teacher-metric-box">
          <span class="metric-num">${analysis ? analysis.overallAccuracy : 80}%</span>
          <span class="metric-lbl">Accuracy</span>
        </div>
        <div class="teacher-metric-box">
          <span class="metric-num">${current.totalStars || 45} ⭐</span>
          <span class="metric-lbl">Reward Stars</span>
        </div>
        <div class="teacher-metric-box">
          <span class="metric-num">${analysis?.masteredTopics.length || 0}</span>
          <span class="metric-lbl">Mastered Topics</span>
        </div>
      </div>

      <div class="teacher-topics-split">
        <div class="topics-split-box">
          <h4>Mastered Topics (Ready for Advancement):</h4>
          <div class="tag-cloud">
            ${(analysis?.masteredTopics || []).map(t => `<span class="badge-tag tag-mastered">✓ ${window.AdaptiveEngine.formatCategoryName(t)}</span>`).join('') || '<span class="text-muted">None yet</span>'}
          </div>
        </div>
        <div class="topics-split-box">
          <h4>Topics Needing Guided Revision:</h4>
          <div class="tag-cloud">
            ${(analysis?.revisionTopics || []).map(t => `<span class="badge-tag tag-revision">↻ ${window.AdaptiveEngine.formatCategoryName(t)}</span>`).join('') || '<span class="text-muted">None flagged</span>'}
          </div>
        </div>
      </div>
    `;
  },

  renderRemarksList() {
    const listContainer = document.getElementById('teacher-remarks-container');
    if (!listContainer) return;

    const remarks = window.StorageManager ? window.StorageManager.getTeacherRemarks(this.selectedStudentId) : [];

    if (remarks.length === 0) {
      listContainer.innerHTML = `<p class="empty-text">No remarks recorded yet for this student.</p>`;
      return;
    }

    listContainer.innerHTML = remarks.map(r => `
      <div class="remark-entry-card ${r.authorRole}">
        <div class="remark-header">
          <div class="remark-author-pill">
            <span>${r.authorRole === 'teacher' ? '👩‍🏫 Teacher Remark' : '🏡 Caregiver Observation'}</span>
            <strong>${r.authorName}</strong>
          </div>
          <span class="remark-date">${r.date}</span>
        </div>
        <p class="remark-body-text">${r.note}</p>
        ${r.goalAssigned ? `
          <div class="remark-goal-callout">
            <strong>🎯 Assigned Goal:</strong> ${r.goalAssigned}
          </div>
        ` : ''}
      </div>
    `).join('');
  },

  openAddRemarkModal() {
    const students = window.StorageManager ? window.StorageManager.getStudents() : [];
    const current = students.find(s => s.id === this.selectedStudentId) || students[0];

    const modalHtml = `
      <div class="modal-backdrop" id="add-remark-modal" role="dialog" aria-modal="true" aria-labelledby="remark-modal-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="remark-modal-title">Add Remark for ${current ? current.name : 'Student'}</h3>
            <button class="modal-close-btn" id="close-remark-modal" aria-label="Close dialog">✖</button>
          </div>
          <form id="remark-form">
            <div class="modal-body">
              <div class="form-group">
                <label for="remark-role-select">Your Role:</label>
                <select id="remark-role-select" class="form-control" required>
                  <option value="teacher">Special Educator / Teacher</option>
                  <option value="caregiver">Parent / Caregiver</option>
                </select>
              </div>
              <div class="form-group">
                <label for="remark-author-name">Your Name:</label>
                <input type="text" id="remark-author-name" class="form-control" required placeholder="e.g. Mrs. Sharma or Parent" value="Learning Educator">
              </div>
              <div class="form-group">
                <label for="remark-note">Observation / Progress Note:</label>
                <textarea id="remark-note" class="form-control" rows="3" required placeholder="Describe student engagement, mood, or breakthrough..."></textarea>
              </div>
              <div class="form-group">
                <label for="remark-goal">Assign Learning Goal (Optional):</label>
                <input type="text" id="remark-goal" class="form-control" placeholder="e.g. Practice counting 1 to 5 with visual aids">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cancel-remark-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Remark ✨</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const existing = document.getElementById('add-remark-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('add-remark-modal');
      if (m) m.remove();
    };

    document.getElementById('close-remark-modal').addEventListener('click', close);
    document.getElementById('cancel-remark-btn').addEventListener('click', close);

    document.getElementById('remark-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('remark-role-select').value;
      const author = document.getElementById('remark-author-name').value.trim();
      const note = document.getElementById('remark-note').value.trim();
      const goal = document.getElementById('remark-goal').value.trim();

      if (note && window.StorageManager) {
        window.StorageManager.addTeacherRemark({
          id: 'rem-' + Date.now(),
          studentId: this.selectedStudentId,
          authorRole: role,
          authorName: author,
          date: new Date().toISOString().slice(0, 10),
          note,
          goalAssigned: goal || null,
          recommendedTopic: 'general'
        });

        close();
        this.renderRemarksList();
        if (window.App) window.App.notify('Remark and learning goal saved successfully! 📝', 'success');
      }
    });
  },

  bindEvents() {
    const addBtn = document.getElementById('open-add-remark-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openAddRemarkModal());
    }
  }
};

window.TeacherModule = TeacherModule;
