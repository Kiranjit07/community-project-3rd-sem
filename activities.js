/**
 * Accessible Learning Companion - Interactive Learning Activities Module
 * 
 * Implements 8 fully functional educational games:
 * 1. Picture Selection
 * 2. Matching Game (clickable/tap pair selection)
 * 3. Drag-and-Drop / Tap Category Sorter
 * 4. Multiple Choice Quiz
 * 5. Memory Card Game
 * 6. Sorting Game (e.g. Fruits vs Vegetables)
 * 7. Sequence Activity (e.g. Handwashing steps)
 * 8. Audio Identification ("Listen and choose")
 * 
 * All activities track attempts, correct/incorrect counts, completion time,
 * provide positive encouragement, sound feedback, and record data in LocalStorage.
 */

const ActivitiesModule = {
  currentActivityType: 'pic-select',
  gameState: {
    startTime: 0,
    attempts: 0,
    correct: 0,
    incorrect: 0,
    timerInterval: null,
    elapsedSeconds: 0,
    isActive: false,
    selectedFirst: null, // For matching & memory
    sequenceItems: [],   // For sequencing
    sortItems: [],       // For sorting
    currentQuestionIndex: 0
  },

  init() {
    this.bindActivitySelector();
    this.renderActivityHub();
  },

  bindActivitySelector() {
    const tabs = document.querySelectorAll('.activity-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const actType = e.currentTarget.getAttribute('data-activity');
        this.startActivity(actType);
      });
    });

    const restartBtn = document.getElementById('activity-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.startActivity(this.currentActivityType);
      });
    }

    const voiceBtn = document.getElementById('activity-voice-answer-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        this.listenForVoiceAnswer();
      });
    }
  },

  renderActivityHub() {
    this.startActivity(this.currentActivityType);
  },

  startActivity(type) {
    this.currentActivityType = type;
    this.resetGameState();

    const stage = document.getElementById('activity-stage');
    if (!stage) return;

    // Update active tab styling
    document.querySelectorAll('.activity-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-activity') === type);
    });

    // Clear feedback & timer
    this.hideFeedback();
    this.startTimer();

    switch (type) {
      case 'pic-select':
        this.renderPictureSelection(stage);
        break;
      case 'matching':
        this.renderMatchingGame(stage);
        break;
      case 'drag-drop':
        this.renderDragAndDrop(stage);
        break;
      case 'quiz':
        this.renderQuiz(stage);
        break;
      case 'memory':
        this.renderMemoryGame(stage);
        break;
      case 'sorting':
        this.renderSortingGame(stage);
        break;
      case 'sequence':
        this.renderSequenceActivity(stage);
        break;
      case 'audio-id':
        this.renderAudioIdentification(stage);
        break;
      default:
        this.renderPictureSelection(stage);
    }
  },

  resetGameState() {
    if (this.gameState.timerInterval) {
      clearInterval(this.gameState.timerInterval);
    }
    this.gameState = {
      startTime: Date.now(),
      attempts: 0,
      correct: 0,
      incorrect: 0,
      timerInterval: null,
      elapsedSeconds: 0,
      isActive: true,
      selectedFirst: null,
      sequenceItems: [],
      sortItems: [],
      currentQuestionIndex: 0
    };
    this.updateStatsDisplay();
  },

  startTimer() {
    const timerEl = document.getElementById('activity-timer-display');
    this.gameState.timerInterval = setInterval(() => {
      if (!this.gameState.isActive) return;
      this.gameState.elapsedSeconds = Math.floor((Date.now() - this.gameState.startTime) / 1000);
      if (timerEl) {
        const mins = Math.floor(this.gameState.elapsedSeconds / 60);
        const secs = this.gameState.elapsedSeconds % 60;
        timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    }, 1000);
  },

  updateStatsDisplay() {
    const attemptsEl = document.getElementById('activity-attempts-count');
    const scoreEl = document.getElementById('activity-score-count');
    if (attemptsEl) attemptsEl.textContent = this.gameState.attempts;
    if (scoreEl) scoreEl.textContent = this.gameState.correct;
  },

  // --------------------------------------------------------------------------
  // 1. Picture Selection Activity
  // --------------------------------------------------------------------------
  renderPictureSelection(stage) {
    const questions = [
      {
        prompt: "Find the RED colour circle 🔴",
        audio: "Touch the bright red circle.",
        kannada: "ಕೆಂಪು ಬಣ್ಣವನ್ನು ಆರಿಸಿ.",
        correctId: 'red',
        options: [
          { id: 'blue', visualKey: 'blue', label: 'Blue' },
          { id: 'red', visualKey: 'red', label: 'Red' },
          { id: 'green', visualKey: 'green', label: 'Green' }
        ]
      },
      {
        prompt: "Which shape is a STAR? ⭐",
        audio: "Find the shining star.",
        kannada: "ನಕ್ಷತ್ರವನ್ನು ಹುಡುಕಿ.",
        correctId: 'star',
        options: [
          { id: 'circle', visualKey: 'circle', label: 'Circle' },
          { id: 'square', visualKey: 'square', label: 'Square' },
          { id: 'star', visualKey: 'star', label: 'Star' }
        ]
      },
      {
        prompt: "Find the friendly DOG 🐕",
        audio: "Which animal says woof woof? Touch the dog.",
        kannada: "ನಾಯಿಯ ಚಿತ್ರವನ್ನು ಮುಟ್ಟಿ.",
        correctId: 'dog',
        options: [
          { id: 'cat', emoji: '🐈', label: 'Cat' },
          { id: 'dog', emoji: '🐕', label: 'Dog' },
          { id: 'elephant', emoji: '🐘', label: 'Elephant' }
        ]
      }
    ];

    const currentQ = questions[this.gameState.currentQuestionIndex % questions.length];

    // Adapt options if student accuracy is low
    const studentAcc = window.AdaptiveEngine ? window.AdaptiveEngine.analyzePerformance().overallAccuracy : 80;
    let renderedOptions = currentQ.options;
    if (studentAcc < 50 && renderedOptions.length > 2) {
      const correct = renderedOptions.find(o => o.id === currentQ.correctId);
      const wrong = renderedOptions.filter(o => o.id !== currentQ.correctId)[0];
      renderedOptions = [correct, wrong].sort(() => Math.random() - 0.5);
    }

    stage.innerHTML = `
      <div class="activity-container">
        <div class="activity-instruction-header">
          <h2 class="activity-prompt-text">${currentQ.prompt}</h2>
          <button class="btn-icon-soft speak-instruction-btn" id="act-speak-prompt-btn" aria-label="Listen to instruction">🔊 Speak</button>
        </div>
        <div class="picture-choice-grid">
          ${renderedOptions.map(opt => `
            <button class="choice-card-button" data-id="${opt.id}" aria-label="${opt.label}">
              <div class="choice-card-art">
                ${opt.visualKey && window.VisualAssets[opt.visualKey] 
                  ? window.VisualAssets[opt.visualKey] 
                  : `<span class="emoji-huge">${opt.emoji || '⭐'}</span>`}
              </div>
              <span class="choice-card-label">${opt.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Speak prompt
    if (window.AudioEngine) {
      window.AudioEngine.speak(currentQ.audio, currentQ.kannada);
    }

    stage.querySelector('#act-speak-prompt-btn')?.addEventListener('click', () => {
      if (window.AudioEngine) {
        window.AudioEngine.speak(currentQ.audio, currentQ.kannada);
      }
    });

    stage.querySelectorAll('.choice-card-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chosenId = e.currentTarget.getAttribute('data-id');
        this.gameState.attempts++;
        if (chosenId === currentQ.correctId) {
          this.gameState.correct++;
          this.handleAnswerSuccess("Wonderful! You found the right picture!", () => {
            this.gameState.currentQuestionIndex++;
            this.renderPictureSelection(stage);
          });
        } else {
          this.gameState.incorrect++;
          this.handleAnswerRetry("Almost there! Look at the colours and shapes carefully.");
        }
        this.updateStatsDisplay();
      });
    });
  },

  // --------------------------------------------------------------------------
  // 2. Matching Game (Picture to Word / Picture to Picture)
  // --------------------------------------------------------------------------
  renderMatchingGame(stage) {
    const pairs = [
      { id: 'p1', label: 'Apple', emoji: '🍎' },
      { id: 'p2', label: 'Sun', emoji: '☀️' },
      { id: 'p3', label: 'Cat', emoji: '🐈' },
      { id: 'p4', label: 'Star', emoji: '⭐' }
    ];

    // Left column: pictures, Right column: shuffled words
    const leftCards = [...pairs];
    const rightCards = [...pairs].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div class="activity-container">
        <div class="activity-instruction-header">
          <h2 class="activity-prompt-text">Match the Picture with its Word! 🎯</h2>
          <button class="btn-icon-soft speak-instruction-btn" id="act-match-speak" aria-label="Listen">🔊 Speak</button>
        </div>
        <p class="activity-subtext">Tap a picture on the left, then tap its matching word on the right.</p>

        <div class="matching-columns-grid">
          <div class="matching-column" id="matching-left">
            ${leftCards.map(c => `
              <button class="match-item-card match-left" data-pair-id="${c.id}" aria-label="Picture of ${c.label}">
                <span class="emoji-large">${c.emoji}</span>
              </button>
            `).join('')}
          </div>
          <div class="matching-column" id="matching-right">
            ${rightCards.map(c => `
              <button class="match-item-card match-right" data-pair-id="${c.id}" aria-label="Word: ${c.label}">
                <span class="match-word-text">${c.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.AudioEngine) {
      window.AudioEngine.speak("Tap a picture on the left, then tap its matching word on the right.");
    }
    stage.querySelector('#act-match-speak')?.addEventListener('click', () => {
      if (window.AudioEngine) {
        window.AudioEngine.speak("Tap a picture on the left, then tap its matching word on the right.");
      }
    });

    let selectedLeft = null;
    let matchedCount = 0;

    const leftBtns = stage.querySelectorAll('.match-left');
    const rightBtns = stage.querySelectorAll('.match-right');

    leftBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('matched')) return;
        leftBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedLeft = btn;
        if (window.AudioEngine) window.AudioEngine.playGentleChime('tap');
      });
    });

    rightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('matched') || !selectedLeft) return;
        this.gameState.attempts++;

        const leftId = selectedLeft.getAttribute('data-pair-id');
        const rightId = btn.getAttribute('data-pair-id');

        if (leftId === rightId) {
          this.gameState.correct++;
          selectedLeft.classList.remove('selected');
          selectedLeft.classList.add('matched');
          btn.classList.add('matched');
          selectedLeft = null;
          matchedCount++;

          if (window.AudioEngine) {
            window.AudioEngine.playGentleChime('star');
            window.AudioEngine.speak("Great match!");
          }

          if (matchedCount === pairs.length) {
            this.handleAnswerSuccess("Incredible work! You matched all pairs!", () => {
              this.renderMatchingGame(stage);
            });
          }
        } else {
          this.gameState.incorrect++;
          btn.classList.add('mismatch-shake');
          setTimeout(() => btn.classList.remove('mismatch-shake'), 600);
          this.handleAnswerRetry("Let's try again. Look at the word and picture.");
        }
        this.updateStatsDisplay();
      });
    });
  },

  // --------------------------------------------------------------------------
  // 3. Drag-and-Drop / Tap-to-categorize Activity
  // --------------------------------------------------------------------------
  renderDragAndDrop(stage) {
    const items = [
      { id: 'd1', label: 'Apple 🍎', category: 'food' },
      { id: 'd2', label: 'Chair 🪑', category: 'object' },
      { id: 'd3', label: 'Banana 🍌', category: 'food' },
      { id: 'd4', label: 'Book 📖', category: 'object' }
    ];

    stage.innerHTML = `
      <div class="activity-container">
        <div class="activity-instruction-header">
          <h2 class="activity-prompt-text">Put Food and Objects in the right box! 📦</h2>
          <button class="btn-icon-soft speak-instruction-btn" id="act-drag-speak" aria-label="Listen">🔊 Speak</button>
        </div>
        <p class="activity-subtext">You can drag the item, or simply tap an item and then tap its matching box.</p>

        <div class="drag-items-rack" id="drag-items-rack">
          ${items.map(item => `
            <div class="draggable-pill" draggable="true" data-id="${item.id}" data-category="${item.category}" tabindex="0">
              ${item.label}
            </div>
          `).join('')}
        </div>

        <div class="drop-zones-grid">
          <div class="drop-zone-card" data-category="food" tabindex="0">
            <div class="drop-zone-header">
              <span class="emoji-large">🍎</span>
              <h3>Yummy Food Box</h3>
            </div>
            <div class="drop-zone-slot" id="slot-food"></div>
          </div>
          <div class="drop-zone-card" data-category="object" tabindex="0">
            <div class="drop-zone-header">
              <span class="emoji-large">🪑</span>
              <h3>Everyday Objects Box</h3>
            </div>
            <div class="drop-zone-slot" id="slot-object"></div>
          </div>
        </div>
      </div>
    `;

    if (window.AudioEngine) {
      window.AudioEngine.speak("Put food in the food box and objects in the object box.");
    }
    stage.querySelector('#act-drag-speak')?.addEventListener('click', () => {
      if (window.AudioEngine) {
        window.AudioEngine.speak("Put food in the food box and objects in the object box.");
      }
    });

    let activeSelected = null;
    let placedCount = 0;

    const draggableEls = stage.querySelectorAll('.draggable-pill');
    const dropZones = stage.querySelectorAll('.drop-zone-card');

    // Tap-based alternative for touchscreen accessibility
    draggableEls.forEach(el => {
      el.addEventListener('click', () => {
        draggableEls.forEach(d => d.classList.remove('selected-pill'));
        el.classList.add('selected-pill');
        activeSelected = el;
        if (window.AudioEngine) window.AudioEngine.playGentleChime('tap');
      });

      // HTML5 Drag support
      el.addEventListener('dragstart', (e) => {
        activeSelected = el;
        e.dataTransfer.setData('text/plain', el.getAttribute('data-id'));
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('zone-hover');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('zone-hover');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('zone-hover');
        processPlacement(zone);
      });

      // Tap zone to place selected pill
      zone.addEventListener('click', () => {
        if (activeSelected) {
          processPlacement(zone);
        }
      });
    });

    const processPlacement = (zone) => {
      if (!activeSelected) return;
      this.gameState.attempts++;

      const itemCategory = activeSelected.getAttribute('data-category');
      const targetCategory = zone.getAttribute('data-category');

      if (itemCategory === targetCategory) {
        this.gameState.correct++;
        const slot = zone.querySelector('.drop-zone-slot');
        slot.appendChild(activeSelected);
        activeSelected.draggable = false;
        activeSelected.classList.remove('selected-pill');
        activeSelected.classList.add('placed-pill');
        activeSelected = null;
        placedCount++;

        if (window.AudioEngine) {
          window.AudioEngine.playGentleChime('star');
        }

        if (placedCount === items.length) {
          this.handleAnswerSuccess("Super sorting! Everything is in the right place!", () => {
            this.renderDragAndDrop(stage);
          });
        }
      } else {
        this.gameState.incorrect++;
        zone.classList.add('mismatch-shake');
        setTimeout(() => zone.classList.remove('mismatch-shake'), 600);
        this.handleAnswerRetry("Almost! Let's check which box this belongs to.");
      }
      this.updateStatsDisplay();
    };
  },

  // --------------------------------------------------------------------------
  // 4. Multiple Choice Quiz
  // --------------------------------------------------------------------------
  renderQuiz(stage) {
    const quizQuestions = [
      {
        prompt: "What colour is a juicy ripe strawberry? 🍓",
        audio: "What colour is a ripe strawberry?",
        options: [
          { text: "Red 🔴", isCorrect: true },
          { text: "Blue 🔵", isCorrect: false },
          { text: "Black ⚫", isCorrect: false }
        ]
      },
      {
        prompt: "How many legs does a happy dog have? 🐕",
        audio: "How many legs does a dog have?",
        options: [
          { text: "Two (2)", isCorrect: false },
          { text: "Four (4)", isCorrect: true },
          { text: "Six (6)", isCorrect: false }
        ]
      },
      {
        prompt: "Which shape looks like a coin? 🪙",
        audio: "Which shape is round like a coin?",
        options: [
          { text: "Circle ⭕", isCorrect: true },
          { text: "Triangle 🔺", isCorrect: false }
        ]
      }
    ];

    const q = quizQuestions[this.gameState.currentQuestionIndex % quizQuestions.length];

    stage.innerHTML = `
      <div class="activity-container">
        <div class="activity-instruction-header">
          <h2 class="activity-prompt-text">${q.prompt}</h2>
          <button class="btn-icon-soft speak-instruction-btn" id="act-quiz-speak" aria-label="Listen">🔊 Speak</button>
        </div>
        <div class="quiz-options-vertical">
          ${q.options.map((opt, idx) => `
            <button class="btn btn-outline quiz-answer-btn" data-correct="${opt.isCorrect}">
              <span class="quiz-badge-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="quiz-answer-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    if (window.AudioEngine) {
      window.AudioEngine.speak(q.audio || q.prompt);
    }
    stage.querySelector('#act-quiz-speak')?.addEventListener('click', () => {
      if (window.AudioEngine) {
        window.AudioEngine.speak(q.audio || q.prompt);
      }
    });

    stage.querySelectorAll('.quiz-answer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.gameState.attempts++;
        const isCorrect = e.currentTarget.getAttribute('data-correct') === 'true';

        if (isCorrect) {
          this.gameState.correct++;
          e.currentTarget.classList.add('answer-correct');
          this.handleAnswerSuccess("You got it! Excellent answer!", () => {
            this.gameState.currentQuestionIndex++;
            this.renderQuiz(stage);
          });
        } else {
          this.gameState.incorrect++;
          e.currentTarget.classList.add('answer-wrong');
          this.handleAnswerRetry("Let's look carefully. You can do it!");
        }
        this.updateStatsDisplay();
      });
    });
  },

  // --------------------------------------------------------------------------
  // 5. Memory Card Game
  // --------------------------------------------------------------------------
  renderMemoryGame(stage) {
    const symbols = ['🐶', '🐱', '🐮', '🐘'];
    // Duplicate for pairs
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

    stage.innerHTML = `
      <div class="activity-container">
        <div class="activity-instruction-header">
          <h2 class="activity-prompt-text">Find the Matching Animal Pairs! 🃏</h2>
          <button class="btn-icon-soft speak-instruction-btn" id="act-memory-speak" aria-label="Listen">🔊 Speak</button>
        </div>
        <p class="activity-subtext">Flip two cards to find animal pairs that look the same.</p>

        <div class="memory-grid">
          ${cards.map((sym, idx) => `
            <button class="memory-card" data-symbol="${sym}" data-index="${idx}" aria-label="Card ${idx + 1}">
              <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back">${sym}</div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    if (window.AudioEngine) {
      window.AudioEngine.speak("Flip two cards to find animal pairs that look the same.");
    }
    stage.querySelector('#act-memory-speak')?.addEventListener('click', () => {
      if (window.AudioEngine) {
        window.AudioEngine.speak("Flip two cards to find animal pairs that look the same.");
      }
    });

    let firstCard = null;
    let lockBoard = false;
    let matchesFound = 0;

    const cardBtns = stage.querySelectorAll('.memory-card');
    cardBtns.forEach(card => {
      card.addEventListener('click', () => {
        if (lockBoard || card === firstCard || card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        if (window.AudioEngine) window.AudioEngine.playGentleChime('tap');

        if (!firstCard) {
          firstCard = card;
        } else {
          this.gameState.attempts++;
          const sym1 = firstCard.getAttribute('data-symbol');
          const sym2 = card.getAttribute('data-symbol');

          if (sym1 === sym2) {
            this.gameState.correct++;
            firstCard.classList.add('matched');
            card.classList.add('matched');
            matchesFound++;
            firstCard = null;

            if (window.AudioEngine) {
              window.AudioEngine.playGentleChime('star');
            }

            if (matchesFound === symbols.length) {
              this.handleAnswerSuccess("Wonderful memory! You discovered all the friends!", () => {
                this.renderMemoryGame(stage);
              });
            }
          } else {
            this.gameState.incorrect++;
            lockBoard = true;
            setTimeout(() => {
              firstCard.classList.remove('flipped');
              card.classList.remove('flipped');
              firstCard = null;
              lockBoard = false;
            }, 1000);
          }
          this.updateStatsDisplay();
        }
      });
    });
  },

  // --------------------------------------------------------------------------
  // 6. Sorting Game (Fruits vs Vegetables)
  // --------------------------------------------------------------------------
  renderSortingGame(stage) {
    const items = [
      { id: 's1', name: 'Apple 🍎', type: 'fruit' },
      { id: 's2', name: 'Carrot 🥕', type: 'vegetable' },
      { id: 's3', name: 'Banana 🍌', type: 'fruit' },
      { id: 's4', name: 'Tomato 🍅', type: 'vegetable' }
    ];

    let currentItemIdx = 0;

    const renderCurrentItem = () => {
      if (currentItemIdx >= items.length) {
        this.handleAnswerSuccess("Fantastic sorting! You know your fruits and vegetables!", () => {
          this.renderSortingGame(stage);
        });
        return;
      }

      const item = items[currentItemIdx];
      stage.innerHTML = `
        <div class="activity-container">
          <div class="activity-instruction-header">
            <h2 class="activity-prompt-text">Is this a FRUIT or a VEGETABLE? 🧺</h2>
            <button class="btn-icon-soft speak-instruction-btn" id="act-sort-speak" aria-label="Listen">🔊 Speak</button>
          </div>

          <div class="sort-target-card">
            <span class="sort-target-name">${item.name}</span>
          </div>

          <div class="sort-choice-buttons">
            <button class="btn btn-primary sort-choice-btn" data-type="fruit">
              <span class="emoji-large">🍉</span>
              <span>It is a FRUIT</span>
            </button>
            <button class="btn btn-secondary sort-choice-btn" data-type="vegetable">
              <span class="emoji-large">🥦</span>
              <span>It is a VEGETABLE</span>
            </button>
          </div>
        </div>
      `;

      if (window.AudioEngine) {
        window.AudioEngine.speak(`Is ${item.name.replace(/[^a-zA-Z]/g, '')} a fruit or a vegetable?`);
      }
      stage.querySelector('#act-sort-speak')?.addEventListener('click', () => {
        if (window.AudioEngine) {
          window.AudioEngine.speak(`Is ${item.name.replace(/[^a-zA-Z]/g, '')} a fruit or a vegetable?`);
        }
      });

      stage.querySelectorAll('.sort-choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.gameState.attempts++;
          const chosen = e.currentTarget.getAttribute('data-type');
          if (chosen === item.type) {
            this.gameState.correct++;
            if (window.AudioEngine) window.AudioEngine.playGentleChime('star');
            currentItemIdx++;
            renderCurrentItem();
          } else {
            this.gameState.incorrect++;
            this.handleAnswerRetry("Almost! Let's think if this grows sweet like a fruit or cooked like a veggie.");
          }
          this.updateStatsDisplay();
        });
      });
    };

    renderCurrentItem();
  },

  // --------------------------------------------------------------------------
  // 7. Sequence Activity (e.g. Handwashing Steps)
  // --------------------------------------------------------------------------
  renderSequenceActivity(stage) {
    const originalSteps = [
      { step: 1, text: "Wet Hands 💧", order: 1 },
      { step: 2, text: "Put Soap 🧼", order: 2 },
      { step: 3, text: "Rub Hands 🤲", order: 3 },
      { step: 4, text: "Dry with Towel 🧖", order: 4 }
    ];

    // Start with shuffled steps
    let currentOrder = [...originalSteps].sort(() => Math.random() - 0.5);

    const renderSteps = () => {
      stage.innerHTML = `
        <div class="activity-container">
          <div class="activity-instruction-header">
            <h2 class="activity-prompt-text">Put the Handwashing Steps in Order! 🧼</h2>
            <button class="btn-icon-soft speak-instruction-btn" id="act-seq-speak" aria-label="Listen">🔊 Speak</button>
          </div>
          <p class="activity-subtext">Use the Up ⬆️ and Down ⬇️ buttons to move the steps into order 1, 2, 3, 4.</p>

          <div class="sequence-list-container">
            ${currentOrder.map((s, idx) => `
              <div class="sequence-item-row" data-index="${idx}">
                <span class="seq-step-badge">${idx + 1}</span>
                <span class="seq-step-title">${s.text}</span>
                <div class="seq-controls">
                  <button class="btn-icon-soft move-up-btn" ${idx === 0 ? 'disabled' : ''} aria-label="Move step up">⬆️</button>
                  <button class="btn-icon-soft move-down-btn" ${idx === currentOrder.length - 1 ? 'disabled' : ''} aria-label="Move step down">⬇️</button>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="text-align:center;margin-top:20px;">
            <button class="btn btn-primary btn-lg" id="verify-sequence-btn">
              Check My Order ✨
            </button>
          </div>
        </div>
      `;

      if (window.AudioEngine) {
        window.AudioEngine.speak("Put the handwashing steps in order from first to last.");
      }
      stage.querySelector('#act-seq-speak')?.addEventListener('click', () => {
        if (window.AudioEngine) {
          window.AudioEngine.speak("Put the handwashing steps in order from first to last.");
        }
      });

      stage.querySelectorAll('.move-up-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const row = e.target.closest('.sequence-item-row');
          const idx = parseInt(row.getAttribute('data-index'), 10);
          if (idx > 0) {
            const temp = currentOrder[idx];
            currentOrder[idx] = currentOrder[idx - 1];
            currentOrder[idx - 1] = temp;
            renderSteps();
          }
        });
      });

      stage.querySelectorAll('.move-down-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const row = e.target.closest('.sequence-item-row');
          const idx = parseInt(row.getAttribute('data-index'), 10);
          if (idx < currentOrder.length - 1) {
            const temp = currentOrder[idx];
            currentOrder[idx] = currentOrder[idx + 1];
            currentOrder[idx + 1] = temp;
            renderSteps();
          }
        });
      });

      stage.querySelector('#verify-sequence-btn')?.addEventListener('click', () => {
        this.gameState.attempts++;
        const isCorrect = currentOrder.every((item, idx) => item.order === (idx + 1));

        if (isCorrect) {
          this.gameState.correct++;
          this.handleAnswerSuccess("Perfect routine! Clean hands make a happy student!", () => {
            this.renderSequenceActivity(stage);
          });
        } else {
          this.gameState.incorrect++;
          this.handleAnswerRetry("Almost there! Think: first wet hands, then apply soap!");
        }
        this.updateStatsDisplay();
      });
    };

    renderSteps();
  },

  // --------------------------------------------------------------------------
  // 8. Audio Identification ("Listen and choose")
  // --------------------------------------------------------------------------
  renderAudioIdentification(stage) {
    const questions = [
      {
        target: "Elephant",
        audioInstruction: "Listen carefully! Touch the Elephant.",
        kannada: "ಆನೆಯನ್ನು ಮುಟ್ಟಿ.",
        correctId: 'elephant',
        options: [
          { id: 'cow', emoji: '🐄', label: 'Cow' },
          { id: 'elephant', emoji: '🐘', label: 'Elephant' },
          { id: 'lion', emoji: '🦁', label: 'Lion' }
        ]
      },
      {
        target: "Blue Circle",
        audioInstruction: "Listen carefully! Touch the Blue shape.",
        kannada: "ನೀಲಿ ಬಣ್ಣವನ್ನು ಆರಿಸಿ.",
        correctId: 'blue',
        options: [
          { id: 'red', visualKey: 'red', label: 'Red' },
          { id: 'blue', visualKey: 'blue', label: 'Blue' },
          { id: 'yellow', visualKey: 'yellow', label: 'Yellow' }
        ]
      }
    ];

    const q = questions[this.gameState.currentQuestionIndex % questions.length];

    stage.innerHTML = `
      <div class="activity-container">
        <div class="activity-instruction-header">
          <h2 class="activity-prompt-text">Listen to Milo & Pick the Right One! 🎧</h2>
        </div>

        <div style="text-align:center;margin:24px 0;">
          <button class="btn btn-primary btn-lg" id="play-audio-prompt-btn" style="font-size:1.3rem;padding:16px 28px;">
            <span aria-hidden="true">🔊</span> Play Voice Clue
          </button>
        </div>

        <div class="picture-choice-grid">
          ${q.options.map(opt => `
            <button class="choice-card-button" data-id="${opt.id}" aria-label="${opt.label}">
              <div class="choice-card-art">
                ${opt.visualKey && window.VisualAssets[opt.visualKey] 
                  ? window.VisualAssets[opt.visualKey] 
                  : `<span class="emoji-huge">${opt.emoji || '⭐'}</span>`}
              </div>
              <span class="choice-card-label">${opt.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const playPrompt = () => {
      if (window.AudioEngine) {
        window.AudioEngine.speak(q.audioInstruction, q.kannada);
      }
    };

    stage.querySelector('#play-audio-prompt-btn')?.addEventListener('click', playPrompt);
    playPrompt();

    stage.querySelectorAll('.choice-card-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.gameState.attempts++;
        const chosenId = e.currentTarget.getAttribute('data-id');

        if (chosenId === q.correctId) {
          this.gameState.correct++;
          this.handleAnswerSuccess("Great listening ears! You chose the correct picture!", () => {
            this.gameState.currentQuestionIndex++;
            this.renderAudioIdentification(stage);
          });
        } else {
          this.gameState.incorrect++;
          this.handleAnswerRetry("Let's listen one more time! Press the big sound button.");
        }
        this.updateStatsDisplay();
      });
    });
  },

  // --------------------------------------------------------------------------
  // Voice Answering Integration
  // --------------------------------------------------------------------------
  listenForVoiceAnswer() {
    if (!window.AudioEngine) return;

    const feedback = document.getElementById('activity-feedback-card');
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = 'practice-feedback-banner feedback-info';
      feedback.innerHTML = `
        <span aria-hidden="true">🎤</span>
        <div><strong>Listening...</strong><p>Speak your answer aloud now.</p></div>
      `;
    }

    window.AudioEngine.startListening(
      (spokenText) => {
        if (window.App && typeof window.App.notify === 'function') {
          window.App.notify(`Heard: "${spokenText}"`, 'info');
        }
        this.validateSpokenAnswer(spokenText);
      },
      (errorMsg) => {
        if (window.App && typeof window.App.notify === 'function') {
          window.App.notify(errorMsg, 'info');
        }
      }
    );
  },

  validateSpokenAnswer(spokenText) {
    const stage = document.getElementById('activity-stage');
    if (!stage) return;

    // Check all clickable answer buttons in stage for a text match
    const buttons = stage.querySelectorAll('.choice-card-button, .quiz-answer-btn, .sort-choice-btn');
    let found = false;

    buttons.forEach(btn => {
      const label = (btn.textContent || '').toLowerCase();
      if (label.includes(spokenText) || spokenText.includes(label)) {
        found = true;
        btn.click();
      }
    });

    if (!found) {
      this.handleAnswerRetry(`I heard "${spokenText}". Let's try saying one of the card labels!`);
    }
  },

  // --------------------------------------------------------------------------
  // Feedback & Reward Handling
  // --------------------------------------------------------------------------
  handleAnswerSuccess(message, nextCallback) {
    if (window.AudioEngine) {
      window.AudioEngine.playGentleChime('success');
      window.AudioEngine.speak(message);
    }
    if (window.MiloMascot) {
      window.MiloMascot.setMood('celebrate');
    }

    this.showFeedback(message, 'success');
    this.recordActivityCompletion(10);

    // Launch celebratory confetti if available
    this.triggerConfetti();

    setTimeout(() => {
      this.hideFeedback();
      if (nextCallback) nextCallback();
    }, 2200);
  },

  handleAnswerRetry(message) {
    if (window.AudioEngine) {
      window.AudioEngine.playGentleChime('retry');
      window.AudioEngine.speak(message);
    }
    if (window.MiloMascot) {
      window.MiloMascot.setMood('encourage');
    }

    this.showFeedback(message, 'retry');
  },

  showFeedback(msg, type) {
    const feedback = document.getElementById('activity-feedback-card');
    if (!feedback) return;

    feedback.style.display = 'flex';
    feedback.className = `practice-feedback-banner feedback-${type}`;
    feedback.innerHTML = `
      <span aria-hidden="true" style="font-size:2rem;">${type === 'success' ? '🎉' : '🌱'}</span>
      <div>
        <strong>${type === 'success' ? 'Wonderful!' : 'Almost there!'}</strong>
        <p>${msg}</p>
      </div>
    `;
  },

  hideFeedback() {
    const feedback = document.getElementById('activity-feedback-card');
    if (feedback) feedback.style.display = 'none';
  },

  recordActivityCompletion(points = 10) {
    if (!window.StorageManager) return;
    const student = window.StorageManager.getCurrentStudent();

    const result = {
      id: 'res-' + Date.now(),
      studentId: student ? student.id : 'student-1',
      lessonId: 'act-' + this.currentActivityType,
      activityId: this.currentActivityType,
      activityType: this.currentActivityType,
      category: 'general',
      correctAnswers: this.gameState.correct,
      incorrectAnswers: this.gameState.incorrect,
      attempts: this.gameState.attempts,
      accuracy: this.gameState.attempts > 0 ? Math.round((this.gameState.correct / this.gameState.attempts) * 100) : 100,
      completionTime: this.gameState.elapsedSeconds || 20,
      completedAt: new Date().toISOString(),
      pointsEarned: points
    };

    window.StorageManager.addResult(result);
  },

  triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 45 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      color: ['#5B7CFA', '#9DE7C5', '#FFD76A', '#EF4444', '#A855F7'][Math.floor(Math.random() * 5)],
      radius: Math.random() * 6 + 4,
      alpha: 1
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animId);
      }
    };

    animate();
  }
};

window.ActivitiesModule = ActivitiesModule;
