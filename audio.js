/**
 * Accessible Learning Companion - Audio & Voice Engine
 * Handles:
 * 1. Web Speech API SpeechSynthesis (TTS with rate, volume, English & Kannada language support)
 * 2. Web Speech API SpeechRecognition (Voice answers with manual fallback)
 * 3. Web Audio API gentle sound effects (chimes, celebrations, gentle retries - zero external audio assets required)
 * 4. Anti-overlap speech queue control and audio state management
 */

const AudioEngine = {
  synth: window.speechSynthesis || null,
  currentUtterance: null,
  isSpeaking: false,
  isAudioMuted: false,
  recognition: null,
  isListening: false,
  audioCtx: null,

  // Settings defaults
  settings: {
    speechRate: 0.9,     // Slightly slower for cognitive clarity
    pitch: 1.05,         // Friendly, warm tone
    volume: 1.0,
    preferredVoice: null,
    language: 'en-US',   // 'en-US' or 'kn-IN'
    enableSoundEffects: true
  },

  init() {
    this.initSpeechSynth();
    this.initSpeechRecognition();
    this.loadAudioSettings();
    this.bindGlobalAudioEvents();
  },

  initSpeechSynth() {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      this.notifySpeechUnavailable();
      return;
    }

    // Populate voices when loaded
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.selectBestVoice();
    }
    this.selectBestVoice();
  },

  selectBestVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    const lang = this.settings.language;
    if (lang.startsWith('kn')) {
      // Find Kannada or Indian English voice
      const knVoice = voices.find(v => v.lang.includes('kn') || v.lang.includes('IN'));
      if (knVoice) this.settings.preferredVoice = knVoice;
    } else {
      // Find friendly English voice (prefer natural/Google/friendly accents)
      const friendlyVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny')) && v.lang.startsWith('en'))
        || voices.find(v => v.lang.startsWith('en'));
      if (friendlyVoice) this.settings.preferredVoice = friendlyVoice;
    }
  },

  loadAudioSettings() {
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    if (student) {
      if (student.preferredLanguage === 'kn') {
        this.settings.language = 'kn-IN';
      } else {
        this.settings.language = 'en-US';
      }

      if (student.accessibilitySettings) {
        this.settings.speechRate = student.accessibilitySettings.speechRate || 0.9;
        this.settings.volume = student.accessibilitySettings.audioVolume !== undefined ? student.accessibilitySettings.audioVolume : 1.0;
      }
    }
  },

  /**
   * Speak a text string with anti-overlap safety and language routing
   * @param {string} text - The text in English
   * @param {string} kannadaFallback - Optional Kannada translation if language is kn-IN
   * @param {function} onEndCallback - Callback when speaking finishes
   */
  speak(text, kannadaFallback = null, onEndCallback = null) {
    if (this.isAudioMuted || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (!this.synth) {
      this.notifySpeechUnavailable();
      if (onEndCallback) onEndCallback();
      return;
    }

    // Cancel any previous speech to avoid confusing cognitive overlap
    this.stopSpeech();

    const textToSpeak = (this.settings.language.startsWith('kn') && kannadaFallback) ? kannadaFallback : text;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = this.settings.speechRate || 0.9;
    utterance.pitch = this.settings.pitch || 1.05;
    utterance.volume = this.settings.volume !== undefined ? this.settings.volume : 1.0;
    utterance.lang = this.settings.language || 'en-US';

    if (this.settings.preferredVoice) {
      utterance.voice = this.settings.preferredVoice;
    }

    // Visual indicators during speech
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateAudioVisualState(true);
      if (window.MiloMascot) {
        window.MiloMascot.setTalking(true);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateAudioVisualState(false);
      if (window.MiloMascot) {
        window.MiloMascot.setTalking(false);
      }
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.updateAudioVisualState(false);
      if (window.MiloMascot) {
        window.MiloMascot.setTalking(false);
      }
      if (onEndCallback) onEndCallback();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  },

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.updateAudioVisualState(false);
      if (window.MiloMascot) {
        window.MiloMascot.setTalking(false);
      }
    }
  },

  repeatLastSpeech() {
    if (this.currentUtterance && this.currentUtterance.text) {
      this.speak(this.currentUtterance.text);
    }
  },

  updateAudioVisualState(speaking) {
    const speechIndicator = document.getElementById('global-speech-indicator');
    if (speechIndicator) {
      speechIndicator.classList.toggle('active', speaking);
    }
  },

  notifySpeechUnavailable() {
    console.info('Speech synthesis is unavailable in this environment; all visual text remains prominent.');
  },

  // --------------------------------------------------------------------------
  // Speech Recognition (Voice Answering)
  // --------------------------------------------------------------------------
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.settings.language;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceButtonState(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButtonState(false);
      };

      this.recognition.onerror = (err) => {
        console.warn('Voice recognition notice:', err.error);
        this.isListening = false;
        this.updateVoiceButtonState(false);
      };
    }
  },

  startListening(onResultCallback, onErrorFallback) {
    if (!this.recognition) {
      if (onErrorFallback) {
        onErrorFallback('Speech recognition is not supported in this browser. Please tap or click your answer.');
      }
      return false;
    }

    try {
      this.stopSpeech(); // Stop TTS so it doesn't hear itself
      this.recognition.lang = this.settings.language;
      this.recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const spoken = event.results[0][0].transcript.trim().toLowerCase();
          if (onResultCallback) onResultCallback(spoken);
        }
      };
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Error starting speech recognition', e);
      if (onErrorFallback) onErrorFallback('Could not start microphone. You can tap or click your answer.');
      return false;
    }
  },

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateVoiceButtonState(false);
    }
  },

  updateVoiceButtonState(listening) {
    const micBtns = document.querySelectorAll('.voice-input-btn');
    micBtns.forEach(btn => {
      btn.classList.toggle('listening', listening);
      if (listening) {
        btn.setAttribute('aria-label', 'Listening for your voice... speak now');
      } else {
        btn.setAttribute('aria-label', 'Speak your answer with microphone');
      }
    });
  },

  // --------------------------------------------------------------------------
  // Web Audio API Synthesizer (Gentle pleasant tones - zero external files)
  // --------------------------------------------------------------------------
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playGentleChime(type = 'success') {
    if (this.isAudioMuted || !this.settings.enableSoundEffects) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'success') {
        // Warm, joyful major triad (C5 - E5 - G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);

          gain.gain.setValueAtTime(0.001, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.12 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.5);
        });
      } else if (type === 'retry') {
        // Gentle, soft supportive two-tone (A4 - F4 soft descending sine, never harsh buzzer)
        const notes = [440.00, 349.23];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.16);

          gain.gain.setValueAtTime(0.001, now + idx * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.16 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.16 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.16);
          osc.stop(now + idx * 0.16 + 0.45);
        });
      } else if (type === 'star') {
        // Sparkling high chime (G5 - B5 - D6)
        const notes = [783.99, 987.77, 1174.66];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);

          gain.gain.setValueAtTime(0.001, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.09 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.4);
        });
      } else if (type === 'fanfare') {
        // Milestone reward celebration fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.13);

          gain.gain.setValueAtTime(0.001, now + idx * 0.13);
          gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.13 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.13 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.13);
          osc.stop(now + idx * 0.13 + 0.65);
        });
      } else if (type === 'tap') {
        // Gentle bubble pop on button click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  },

  // Global Audio Event Bindings
  bindGlobalAudioEvents() {
    const repeatBtn = document.getElementById('global-audio-repeat-btn');
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        this.repeatLastSpeech();
      });
    }

    const stopBtn = document.getElementById('global-audio-stop-btn');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        this.stopSpeech();
      });
    }

    const muteBtn = document.getElementById('global-audio-mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.toggleMute();
      });
    }

    const langToggle = document.getElementById('global-lang-switch');
    if (langToggle) {
      langToggle.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }
  },

  toggleMute() {
    this.isAudioMuted = !this.isAudioMuted;
    if (this.isAudioMuted) {
      this.stopSpeech();
    }
    const muteBtn = document.getElementById('global-audio-mute-btn');
    if (muteBtn) {
      muteBtn.innerHTML = this.isAudioMuted 
        ? `<span aria-hidden="true">🔇</span><span class="sr-only">Unmute Audio</span>`
        : `<span aria-hidden="true">🔊</span><span class="sr-only">Mute Audio</span>`;
      muteBtn.classList.toggle('muted', this.isAudioMuted);
    }
    if (window.App && typeof window.App.notify === 'function') {
      window.App.notify(this.isAudioMuted ? 'Sound muted.' : 'Sound unmuted.', 'info');
    }
  },

  setLanguage(langCode) {
    this.settings.language = langCode === 'kn' ? 'kn-IN' : 'en-US';
    this.selectBestVoice();

    // Persist to current student
    const student = window.StorageManager ? window.StorageManager.getCurrentStudent() : null;
    if (student) {
      student.preferredLanguage = langCode;
      window.StorageManager.updateStudent(student);
    }

    if (window.App && typeof window.App.notify === 'function') {
      const msg = langCode === 'kn' ? 'ಭಾಷೆ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಗಿದೆ (Kannada mode)' : 'Language set to English';
      window.App.notify(msg, 'success');
    }
  }
};

window.AudioEngine = AudioEngine;
