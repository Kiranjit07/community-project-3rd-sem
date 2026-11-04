/**
 * Accessible Learning Companion - Content Management System (CMS)
 * Enables educators and caregivers to create, edit, organize, and delete
 * custom lessons, picture prompts, and quiz questions with full validation
 * and safety confirmation dialogs.
 */

const CMSModule = {
  editingLessonId: null,

  init() {
    this.renderLessonsTable();
    this.bindEvents();
  },

  renderLessonsTable() {
    const tbody = document.getElementById('cms-lessons-tbody');
    if (!tbody) return;

    const lessons = window.StorageManager ? window.StorageManager.getLessons() : [];

    if (lessons.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;">No lessons found. Click "Add New Lesson" above to create one!</td></tr>`;
      return;
    }

    tbody.innerHTML = lessons.map(l => `
      <tr>
        <td>
          <span style="font-size:1.6rem;">${l.iconEmoji || '📘'}</span>
        </td>
        <td>
          <strong>${l.title}</strong>
          <div style="font-size:0.85rem;color:var(--color-text-muted);">${(l.simpleExplanation || l.description).substring(0, 50)}...</div>
        </td>
        <td>
          <span class="badge-tag">${window.AdaptiveEngine ? window.AdaptiveEngine.formatCategoryName(l.category) : l.category}</span>
        </td>
        <td>
          <span class="badge-difficulty ${l.difficulty}">${l.difficulty}</span>
        </td>
        <td>
          ${l.questions ? l.questions.length : 0} Qs
        </td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm btn-outline cms-edit-btn" data-id="${l.id}" aria-label="Edit ${l.title}">
              ✏️ Edit
            </button>
            <button class="btn btn-sm btn-outline cms-delete-btn" data-id="${l.id}" data-title="${l.title}" aria-label="Delete ${l.title}">
              🗑️ Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.cms-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openEditModal(id);
      });
    });

    tbody.querySelectorAll('.cms-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const title = e.currentTarget.getAttribute('data-title');
        this.confirmDeleteLesson(id, title);
      });
    });
  },

  openEditModal(lessonId = null) {
    this.editingLessonId = lessonId;
    const lesson = lessonId ? (window.StorageManager.getLessonById(lessonId) || {}) : {};

    const isEdit = !!lessonId;
    const title = isEdit ? `Edit Lesson: ${lesson.title}` : 'Add New Picture Lesson';

    const modalHtml = `
      <div class="modal-backdrop" id="cms-lesson-modal" role="dialog" aria-modal="true" aria-labelledby="cms-modal-title">
        <div class="modal-card modal-card-lg">
          <div class="modal-header">
            <h3 id="cms-modal-title">${title}</h3>
            <button class="modal-close-btn" id="close-cms-modal" aria-label="Close dialog">✖</button>
          </div>
          <form id="cms-lesson-form">
            <div class="modal-body modal-scrollable">
              <div class="form-row">
                <div class="form-group flex-2">
                  <label for="cms-input-title">Lesson Title *</label>
                  <input type="text" id="cms-input-title" class="form-control" required placeholder="e.g. Green Frog" value="${lesson.title || ''}">
                </div>
                <div class="form-group flex-1">
                  <label for="cms-input-emoji">Symbol / Emoji Icon *</label>
                  <input type="text" id="cms-input-emoji" class="form-control" required placeholder="e.g. 🐸" value="${lesson.iconEmoji || '🌟'}">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="cms-select-category">Category / Subject *</label>
                  <select id="cms-select-category" class="form-control" required>
                    <option value="colours" ${lesson.category === 'colours' ? 'selected' : ''}>Colours</option>
                    <option value="numbers" ${lesson.category === 'numbers' ? 'selected' : ''}>Numbers</option>
                    <option value="shapes" ${lesson.category === 'shapes' ? 'selected' : ''}>Shapes</option>
                    <option value="animals" ${lesson.category === 'animals' ? 'selected' : ''}>Animals</option>
                    <option value="objects" ${lesson.category === 'objects' ? 'selected' : ''}>Everyday Objects</option>
                    <option value="fruits-veg" ${lesson.category === 'fruits-veg' ? 'selected' : ''}>Fruits & Vegetables</option>
                    <option value="emotions" ${lesson.category === 'emotions' ? 'selected' : ''}>Emotions</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label for="cms-select-difficulty">Difficulty Level *</label>
                  <select id="cms-select-difficulty" class="form-control" required>
                    <option value="beginner" ${lesson.difficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
                    <option value="intermediate" ${lesson.difficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                    <option value="advanced" ${lesson.difficulty === 'advanced' ? 'selected' : ''}>Advanced</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="cms-input-desc">Full Explanation *</label>
                <textarea id="cms-input-desc" class="form-control" rows="2" required placeholder="Clear description of the concept...">${lesson.description || ''}</textarea>
              </div>

              <div class="form-group">
                <label for="cms-input-simple">Simple Language Version (for students needing gentle phrasing) *</label>
                <input type="text" id="cms-input-simple" class="form-control" required placeholder="e.g. This is a green frog. Ribbit ribbit!" value="${lesson.simpleExplanation || ''}">
              </div>

              <div class="form-group">
                <label for="cms-input-audio">Text-to-Speech Spoken Script *</label>
                <input type="text" id="cms-input-audio" class="form-control" required placeholder="Spoken by Milo when opening lesson..." value="${lesson.audioText || ''}">
              </div>

              <div class="form-group">
                <label for="cms-input-kn">Kannada Audio Translation (Optional)</label>
                <input type="text" id="cms-input-kn" class="form-control" placeholder="ಕನ್ನಡ ವಿವರಣೆ..." value="${lesson.kannadaText || ''}">
              </div>

              <hr style="margin:16px 0;border:none;border-top:1px solid var(--color-border);">
              <h4 style="margin-bottom:8px;">Interactive Practice Check Question</h4>
              
              <div class="form-group">
                <label for="cms-input-qprompt">Question Prompt</label>
                <input type="text" id="cms-input-qprompt" class="form-control" placeholder="e.g. Find the green frog." value="${lesson.questions && lesson.questions[0] ? lesson.questions[0].prompt : 'Which one is correct?'}">
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="cms-input-opt-correct">Correct Option Text *</label>
                  <input type="text" id="cms-input-opt-correct" class="form-control" required placeholder="e.g. Frog 🐸" value="${lesson.questions && lesson.questions[0] && lesson.questions[0].options ? (lesson.questions[0].options.find(o => o.isCorrect)?.text || 'Yes') : 'Frog 🐸'}">
                </div>
                <div class="form-group flex-1">
                  <label for="cms-input-opt-wrong">Incorrect Option Text *</label>
                  <input type="text" id="cms-input-opt-wrong" class="form-control" required placeholder="e.g. Tree 🌳" value="${lesson.questions && lesson.questions[0] && lesson.questions[0].options ? (lesson.questions[0].options.find(o => !o.isCorrect)?.text || 'No') : 'Tree 🌳'}">
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="cancel-cms-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Lesson ✨</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const existing = document.getElementById('cms-lesson-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('cms-lesson-modal');
      if (m) m.remove();
    };

    document.getElementById('close-cms-modal').addEventListener('click', close);
    document.getElementById('cancel-cms-btn').addEventListener('click', close);

    document.getElementById('cms-lesson-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveLessonForm(lessonId);
    });
  },

  handleSaveLessonForm(lessonId) {
    const title = document.getElementById('cms-input-title').value.trim();
    const emoji = document.getElementById('cms-input-emoji').value.trim();
    const category = document.getElementById('cms-select-category').value;
    const difficulty = document.getElementById('cms-select-difficulty').value;
    const desc = document.getElementById('cms-input-desc').value.trim();
    const simple = document.getElementById('cms-input-simple').value.trim();
    const audio = document.getElementById('cms-input-audio').value.trim();
    const kn = document.getElementById('cms-input-kn').value.trim();
    const qprompt = document.getElementById('cms-input-qprompt').value.trim();
    const optCorrect = document.getElementById('cms-input-opt-correct').value.trim();
    const optWrong = document.getElementById('cms-input-opt-wrong').value.trim();

    // Validation
    if (!title || !desc || !optCorrect || !optWrong) {
      alert('Please fill out all required fields to keep learning content complete and reliable.');
      return;
    }

    const lessonData = {
      id: lessonId || ('les-custom-' + Date.now()),
      title,
      iconEmoji: emoji || '🌟',
      category,
      difficulty,
      description: desc,
      simpleExplanation: simple || desc,
      audioText: audio || title,
      kannadaText: kn || null,
      questions: [
        {
          id: 'q-' + Date.now(),
          prompt: qprompt || `Touch ${title}`,
          audioPrompt: audio || title,
          kannadaPrompt: kn || null,
          options: [
            { text: optCorrect, isCorrect: true },
            { text: optWrong, isCorrect: false }
          ]
        }
      ]
    };

    if (window.StorageManager) {
      window.StorageManager.saveLesson(lessonData);
    }

    // Close modal & re-render
    const modal = document.getElementById('cms-lesson-modal');
    if (modal) modal.remove();

    this.renderLessonsTable();

    // Also notify lesson module to update
    if (window.LessonModule) {
      window.LessonModule.renderLessonGrid();
    }

    if (window.App) {
      window.App.notify(`Lesson "${title}" saved successfully! 🌟`, 'success');
    }
  },

  confirmDeleteLesson(id, title) {
    const modalHtml = `
      <div class="modal-backdrop" id="cms-delete-modal" role="dialog" aria-modal="true" aria-labelledby="del-modal-title">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="del-modal-title">Delete Lesson?</h3>
            <button class="modal-close-btn" id="close-del-modal" aria-label="Cancel">✖</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>"${title}"</strong>?</p>
            <p style="font-size:0.9rem;color:var(--color-error);margin-top:8px;">
              This will remove this lesson from the student learning library.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancel-del-btn">Cancel</button>
            <button class="btn btn-outline" id="confirm-del-btn" style="color:var(--color-error);border-color:var(--color-error);">
              Yes, Delete Lesson
            </button>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('cms-delete-modal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const close = () => {
      const m = document.getElementById('cms-delete-modal');
      if (m) m.remove();
    };

    document.getElementById('close-del-modal').addEventListener('click', close);
    document.getElementById('cancel-del-btn').addEventListener('click', close);

    document.getElementById('confirm-del-btn').addEventListener('click', () => {
      if (window.StorageManager) {
        window.StorageManager.deleteLesson(id);
      }
      close();
      this.renderLessonsTable();
      if (window.LessonModule) {
        window.LessonModule.renderLessonGrid();
      }
      if (window.App) {
        window.App.notify(`Lesson "${title}" deleted.`, 'info');
      }
    });
  },

  bindEvents() {
    const addBtn = document.getElementById('cms-add-lesson-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.openEditModal(null);
      });
    }
  }
};

window.CMSModule = CMSModule;
