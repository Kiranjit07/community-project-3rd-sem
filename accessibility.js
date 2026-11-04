/**
 * Accessible Learning Companion - Accessibility Engine & Preferences Module
 * 
 * Manages:
 * - Font scaling (Normal, Large, Extra Large)
 * - Contrast themes (Default, High Contrast, Calm Blue, Warm Sunset)
 * - Reduced motion enforcement
 * - Large touch targets mode
 * - Simple language simplification mode
 * - Audio-first vs Picture-first emphasis
 * - Speech rate and volume preferences
 * - LocalStorage persistence and dynamic DOM application
 */

const AccessibilityModule = {
  currentSettings: {
    fontSize: 'normal',       // 'normal' | 'large' | 'extra-large'
    theme: 'default',         // 'default' | 'high-contrast' | 'calm-blue' | 'warm-sunset'
    reducedMotion: false,
    largeButtons: false,
    audioFirst: false,
    pictureFirst: true,
    simpleLanguage: true,
    speechRate: 0.9,
    audioVolume: 1.0
  },

  STORAGE_KEY: 'alc_accessibility_settings',

  init() {
    this.loadSettings();
    this.applySettingsToDOM();
    this.bindSettingsForm();
    this.bindQuickControls();
  },

  loadSettings() {
    // 1. Try student specific settings
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    if (student && student.accessibilitySettings) {
      this.currentSettings = { ...this.currentSettings, ...student.accessibilitySettings };
      return;
    }

    // 2. Fallback to generic local storage
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.currentSettings = { ...this.currentSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error loading accessibility settings', e);
    }
  },

  saveSettings() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentSettings));
    } catch (e) {
      console.warn('Error saving accessibility settings', e);
    }

    // Also persist into current student profile
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    if (student) {
      student.accessibilitySettings = { ...this.currentSettings };
      window.StorageManager.updateStudent(student);
    }

    // Sync with AudioEngine
    if (window.AudioEngine) {
      window.AudioEngine.settings.speechRate = this.currentSettings.speechRate;
      window.AudioEngine.settings.volume = this.currentSettings.audioVolume;
    }
  },

  applySettingsToDOM() {
    const root = document.documentElement;
    const body = document.body;

    // 1. Font scaling
    body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    body.classList.add(`font-size-${this.currentSettings.fontSize}`);

    // 2. Themes
    body.classList.remove('theme-default', 'theme-high-contrast', 'theme-calm-blue', 'theme-warm-sunset');
    body.classList.add(`theme-${this.currentSettings.theme}`);

    // 3. Large Buttons
    body.classList.toggle('large-buttons-mode', !!this.currentSettings.largeButtons);

    // 4. Reduced Motion
    body.classList.toggle('reduced-motion-mode', !!this.currentSettings.reducedMotion);

    // 5. Audio First / Picture First
    body.classList.toggle('audio-first-mode', !!this.currentSettings.audioFirst);
    body.classList.toggle('picture-first-mode', !!this.currentSettings.pictureFirst);

    // Update Quick Toggle icon if high contrast is active
    const contrastBtn = document.getElementById('quick-contrast-toggle');
    if (contrastBtn) {
      contrastBtn.classList.toggle('active', this.currentSettings.theme === 'high-contrast');
    }

    // Update settings form fields if on settings page
    this.syncFormFields();
  },

  syncFormFields() {
    const fontSizeSelect = document.getElementById('setting-font-size');
    if (fontSizeSelect) fontSizeSelect.value = this.currentSettings.fontSize;

    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) themeSelect.value = this.currentSettings.theme;

    const redMotionCb = document.getElementById('setting-reduced-motion');
    if (redMotionCb) redMotionCb.checked = this.currentSettings.reducedMotion;

    const lrgBtnCb = document.getElementById('setting-large-buttons');
    if (lrgBtnCb) lrgBtnCb.checked = this.currentSettings.largeButtons;

    const simpleLangCb = document.getElementById('setting-simple-lang');
    if (simpleLangCb) simpleLangCb.checked = this.currentSettings.simpleLanguage;

    const audioFirstCb = document.getElementById('setting-audio-first');
    if (audioFirstCb) audioFirstCb.checked = this.currentSettings.audioFirst;

    const speechRateSlider = document.getElementById('setting-speech-rate');
    const speechRateVal = document.getElementById('setting-speech-rate-val');
    if (speechRateSlider) {
      speechRateSlider.value = this.currentSettings.speechRate;
      if (speechRateVal) speechRateVal.textContent = `${this.currentSettings.speechRate}x`;
    }

    const volumeSlider = document.getElementById('setting-volume');
    const volumeVal = document.getElementById('setting-volume-val');
    if (volumeSlider) {
      volumeSlider.value = this.currentSettings.audioVolume;
      if (volumeVal) volumeVal.textContent = `${Math.round(this.currentSettings.audioVolume * 100)}%`;
    }
  },

  bindSettingsForm() {
    const form = document.getElementById('accessibility-settings-form');
    if (!form) return;

    form.addEventListener('change', (e) => {
      this.currentSettings.fontSize = document.getElementById('setting-font-size').value;
      this.currentSettings.theme = document.getElementById('setting-theme').value;
      this.currentSettings.reducedMotion = document.getElementById('setting-reduced-motion').checked;
      this.currentSettings.largeButtons = document.getElementById('setting-large-buttons').checked;
      this.currentSettings.simpleLanguage = document.getElementById('setting-simple-lang').checked;
      this.currentSettings.audioFirst = document.getElementById('setting-audio-first').checked;

      const rate = parseFloat(document.getElementById('setting-speech-rate').value);
      this.currentSettings.speechRate = rate;
      const rateVal = document.getElementById('setting-speech-rate-val');
      if (rateVal) rateVal.textContent = `${rate}x`;

      const vol = parseFloat(document.getElementById('setting-volume').value);
      this.currentSettings.audioVolume = vol;
      const volVal = document.getElementById('setting-volume-val');
      if (volVal) volVal.textContent = `${Math.round(vol * 100)}%`;

      this.saveSettings();
      this.applySettingsToDOM();
    });

    const testVoiceBtn = document.getElementById('test-speech-settings-btn');
    if (testVoiceBtn) {
      testVoiceBtn.addEventListener('click', () => {
        if (window.AudioEngine) {
          window.AudioEngine.speak("Hello! This is how instructions will sound for our lessons.");
        }
      });
    }
  },

  bindQuickControls() {
    // Quick Contrast Toggle in top bar
    const contrastBtn = document.getElementById('quick-contrast-toggle');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => {
        this.currentSettings.theme = this.currentSettings.theme === 'high-contrast' ? 'default' : 'high-contrast';
        this.saveSettings();
        this.applySettingsToDOM();
        if (window.App) {
          window.App.notify(this.currentSettings.theme === 'high-contrast' ? 'High Contrast Mode ON' : 'Default Theme Restored', 'info');
        }
      });
    }

    // Quick Font Size Toggle in top bar
    const fontBtn = document.getElementById('quick-font-toggle');
    if (fontBtn) {
      fontBtn.addEventListener('click', () => {
        if (this.currentSettings.fontSize === 'normal') {
          this.currentSettings.fontSize = 'large';
        } else if (this.currentSettings.fontSize === 'large') {
          this.currentSettings.fontSize = 'extra-large';
        } else {
          this.currentSettings.fontSize = 'normal';
        }
        this.saveSettings();
        this.applySettingsToDOM();
        if (window.App) {
          window.App.notify(`Font Size: ${this.currentSettings.fontSize}`, 'info');
        }
      });
    }
  }
};

window.AccessibilityModule = AccessibilityModule;
