/**
 * Accessible Learning Companion - Milo Mascot & Rule-Based Learning Assistant
 * 
 * Milo is a friendly, rule-based learning buddy designed for students with intellectual disabilities.
 * Milo gives simple instructions, encourages retries, celebrates wins, and answers concept questions.
 * (Milo uses transparent rule-based logic and clearly identifies as an educational buddy, not a diagnostic tool.)
 */

const MiloMascot = {
  currentMood: 'happy', // 'happy' | 'celebrate' | 'encourage' | 'thinking' | 'talking'
  isTalking: false,

  // Knowledge base of concepts and supportive responses
  ruleBase: [
    {
      keywords: ['red', 'apple', 'strawberry'],
      reply: 'Red is a bright and warm colour. Look around! Sweet apples and ripe strawberries are red.',
      kannada: 'ಕೆಂಪು ಬಣ್ಣ ಪ್ರಕಾಶಮಾನವಾಗಿದೆ. ಸೇಬು ಮತ್ತು ಸ್ಟ್ರಾಬೆರಿಗಳು ಕೆಂಪು ಬಣ್ಣದಲ್ಲಿರುತ್ತವೆ.',
      suggestCategory: 'colours'
    },
    {
      keywords: ['blue', 'sky', 'water', 'ocean'],
      reply: 'Blue is a peaceful and cool colour. The sky high above us and clean sea water are blue!',
      kannada: 'ನೀಲಿ ಬಣ್ಣ ತಂಪಾಗಿದೆ. ಆಕಾಶ ಮತ್ತು ಶುದ್ಧ ನೀರು ನೀಲಿ ಬಣ್ಣದಲ್ಲಿರುತ್ತದೆ.',
      suggestCategory: 'colours'
    },
    {
      keywords: ['green', 'tree', 'grass', 'leaf', 'leaves'],
      reply: 'Green is the colour of fresh nature! Soft garden grass and healthy tree leaves are green.',
      kannada: 'ಹಸಿರು ಪ್ರಕೃತಿಯ ಬಣ್ಣ! ಮರದ ಎಲೆಗಳು ಮತ್ತು ಹುಲ್ಲು ಹಸಿರಾಗಿವೆ.',
      suggestCategory: 'colours'
    },
    {
      keywords: ['yellow', 'sun', 'banana'],
      reply: 'Yellow is sunny and cheerful. The smiling sun in the morning and sweet bananas are yellow.',
      kannada: 'ಹಳದಿ ಬಣ್ಣ ಸೂರ್ಯನಂತೆ ಪ್ರಕಾಶಮಾನ. ಬಾಳೆಹಣ್ಣು ಹಳದಿಯಾಗಿದೆ.',
      suggestCategory: 'colours'
    },
    {
      keywords: ['count', 'number', 'numbers', 'math'],
      reply: 'Numbers help us count toys and steps! 1, 2, 3, 4, 5... We can count with our fingers together.',
      kannada: 'ಸಂಖ್ಯೆಗಳು ಎಣಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ. ಒಂದು, ಎರಡು, ಮೂರು!',
      suggestCategory: 'numbers'
    },
    {
      keywords: ['circle', 'round', 'wheel', 'clock'],
      reply: 'A circle is completely round with no sharp corners, just like a ball or a wheel!',
      kannada: 'ವೃತ್ತ ದುಂಡಾಗಿರುತ್ತದೆ. ಚಕ್ರ ಮತ್ತು ಚೆಂಡು ವೃತ್ತಾಕಾರದಲ್ಲಿವೆ.',
      suggestCategory: 'shapes'
    },
    {
      keywords: ['square', 'box'],
      reply: 'A square has 4 equal straight sides and 4 pointy corners, like a game dice or a picture block.',
      kannada: 'ಚೌಕಕ್ಕೆ ನಾಲ್ಕು ಸಮಾನ ಬದಿಗಳಿವೆ.',
      suggestCategory: 'shapes'
    },
    {
      keywords: ['triangle', 'pizza'],
      reply: 'A triangle has 3 straight sides, just like a delicious slice of cheese pizza!',
      kannada: 'ತ್ರಿಕೋನಕ್ಕೆ ಮೂರು ಬದಿಗಳಿವೆ.',
      suggestCategory: 'shapes'
    },
    {
      keywords: ['dog', 'puppy', 'bark', 'woof'],
      reply: 'Dogs are loving, playful friends. They wag their tail happily and say: Woof Woof!',
      kannada: 'ನಾಯಿ ನಮ್ಮ ಅತ್ಯುತ್ತಮ ಸ್ನೇಹಿತ. ಅದು ಬೌ ಬೌ ಎಂದು ಕೂಗುತ್ತದೆ.',
      suggestCategory: 'animals'
    },
    {
      keywords: ['cat', 'kitten', 'meow'],
      reply: 'Cats are soft and gentle animals. They love afternoon naps and say: Meow Meow!',
      kannada: 'ಬೆಕ್ಕು ಮೃದುವಾದ ಪ್ರಾಣಿ. ಅದು ಮಿಯಾಂವ್ ಮಿಯಾಂವ್ ಅನ್ನುತ್ತದೆ.',
      suggestCategory: 'animals'
    },
    {
      keywords: ['cow', 'milk', 'moo'],
      reply: 'Cows are peaceful gentle animals. They chew green grass, say Moo, and give us healthy milk!',
      kannada: 'ಹಸು ನಮಗೆ ಪೌಷ್ಟಿಕ ಹಾಲು ನೀಡುತ್ತದೆ.',
      suggestCategory: 'animals'
    },
    {
      keywords: ['wash', 'hands', 'soap', 'clean'],
      reply: 'Washing hands with soap and water keeps all tiny germs away! Sing a little song for 20 seconds.',
      kannada: 'ಸೋಪು ಮತ್ತು ನೀರಿನಿಂದ ಕೈ ತೊಳೆಯುವುದು ಆರೋಗ್ಯಕ್ಕೆ ಒಳ್ಳೆಯದು.',
      suggestCategory: 'daily-skills'
    },
    {
      keywords: ['brush', 'teeth', 'toothbrush'],
      reply: 'Brushing teeth morning and night keeps your smile bright, white, and super clean!',
      kannada: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಹಲ್ಲುಜ್ಜುವುದು ಉತ್ತಮ ಅಭ್ಯಾಸ.',
      suggestCategory: 'daily-skills'
    },
    {
      keywords: ['traffic', 'red light', 'road', 'safe', 'safety'],
      reply: 'Remember our golden road rule: Red light means STOP, Yellow means WAIT, and Green means GO with an adult!',
      kannada: 'ಕೆಂಪು ದೀಪ ನಿಲ್ಲಿ, ಹಳದಿ ದೀಪ ಕಾಯಿರಿ, ಹಸಿರು ದೀಪ ಸಾಗಿ.',
      suggestCategory: 'daily-skills'
    },
    {
      keywords: ['confused', "don't understand", 'dont understand', 'hard', 'stuck', 'help me', 'help'],
      reply: 'Do not worry at all! Take a slow deep breath. We can look at the pictures together and try step by step.',
      kannada: 'ಚಿಂತಿಸಬೇಡಿ! ನಿಧಾನವಾಗಿ ಚಿತ್ರಗಳನ್ನು ನೋಡಿ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸೋಣ.',
      suggestCategory: 'practice'
    },
    {
      keywords: ['hello', 'hi', 'namaste', 'milo'],
      reply: 'Hello my wonderful friend! I am Milo. I am so happy to learn with you today! What should we explore?',
      kannada: 'ನಮಸ್ಕಾರ ಸ್ನೇಹಿತರೆ! ನಾನು ಮಿಲೋ. ಇಂದು ನಾವು ಒಟ್ಟಿಗೆ ಕಲಿಯೋಣ!',
      suggestCategory: 'student-dashboard'
    },
    {
      keywords: ['sad', 'crying', 'unhappy'],
      reply: 'It is okay to feel sad. You are safe here and you are doing your very best. Would you like to look at calm colors or cute animals?',
      kannada: 'ದುಃಖಿಸಬೇಡಿ, ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ. ಮುದ್ದಾದ ಪ್ರಾಣಿಗಳ ಚಿತ್ರ ನೋಡೋಣವೇ?',
      suggestCategory: 'emotions'
    },
    {
      keywords: ['happy', 'fun', 'smile'],
      reply: 'Yay! Seeing you smile makes my tail wag with joy! You are doing fantastic learning!',
      kannada: 'ನೀವು ಸಂತೋಷವಾಗಿದ್ದರೆ ನನಗೂ ತುಂಬಾ ಖುಷಿ!',
      suggestCategory: 'student-dashboard'
    }
  ],

  init() {
    this.renderFloatingMascot();
    this.bindMascotEvents();
  },

  /**
   * Generates Milo SVG illustration dynamically based on current mood
   */
  getMascotSvg(mood = 'happy', size = 100) {
    let mouth = `<path d="M 42 66 Q 50 76 58 66" fill="none" stroke="#24304A" stroke-width="3" stroke-linecap="round"/>`;
    let eyes = `
      <ellipse cx="38" cy="50" rx="4.5" ry="6" fill="#24304A"/>
      <ellipse cx="62" cy="50" rx="4.5" ry="6" fill="#24304A"/>
      <circle cx="36" cy="48" r="2" fill="#FFFFFF"/>
      <circle cx="60" cy="48" r="2" fill="#FFFFFF"/>
    `;
    let cheeks = `
      <ellipse cx="30" cy="58" rx="5" ry="3.5" fill="#FFA4A4" opacity="0.6"/>
      <ellipse cx="70" cy="58" rx="5" ry="3.5" fill="#FFA4A4" opacity="0.6"/>
    `;
    let arm = `<path d="M 76 68 Q 88 56 82 46" fill="none" stroke="#5B7CFA" stroke-width="6" stroke-linecap="round"/>`;
    let extras = ``;

    if (mood === 'celebrate') {
      mouth = `<path d="M 40 64 Q 50 82 60 64 Z" fill="#EF4444" stroke="#24304A" stroke-width="2"/>`;
      eyes = `
        <path d="M 32 52 Q 38 44 44 52" fill="none" stroke="#24304A" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 56 52 Q 62 44 68 52" fill="none" stroke="#24304A" stroke-width="3.5" stroke-linecap="round"/>
      `;
      arm = `<path d="M 76 60 Q 94 38 92 28" fill="none" stroke="#5B7CFA" stroke-width="6" stroke-linecap="round"/>`;
      extras = `
        <polygon points="18,22 22,14 26,22 34,24 28,30 30,38 22,34 14,38 16,30 10,24" fill="#FFD76A"/>
        <polygon points="80,18 84,10 88,18 96,20 90,26 92,34 84,30 76,34 78,26 72,20" fill="#FFD76A"/>
      `;
    } else if (mood === 'encourage') {
      mouth = `<path d="M 44 66 Q 50 72 56 66" fill="none" stroke="#24304A" stroke-width="3" stroke-linecap="round"/>`;
      arm = `<path d="M 74 70 Q 86 68 84 62" fill="none" stroke="#5B7CFA" stroke-width="6" stroke-linecap="round"/>`;
    } else if (mood === 'thinking') {
      mouth = `<path d="M 44 68 L 56 68" stroke="#24304A" stroke-width="3" stroke-linecap="round"/>`;
      eyes = `
        <circle cx="40" cy="48" r="4.5" fill="#24304A"/>
        <circle cx="64" cy="48" r="4.5" fill="#24304A"/>
      `;
      extras = `
        <circle cx="78" cy="30" r="3" fill="#9DE7C5"/>
        <circle cx="86" cy="22" r="5" fill="#9DE7C5"/>
        <circle cx="96" cy="14" r="7" fill="#9DE7C5"/>
      `;
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 100 100" class="milo-mascot-svg mood-${mood}" aria-hidden="true">
        <defs>
          <linearGradient id="miloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5B7CFA"/>
            <stop offset="100%" stop-color="#3F5FD6"/>
          </linearGradient>
          <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="100%" stop-color="#E0E7FF"/>
          </linearGradient>
        </defs>

        <!-- Ears -->
        <path d="M 28 32 L 20 10 L 40 22 Z" fill="#3F5FD6" stroke="#24304A" stroke-width="2"/>
        <path d="M 27 28 L 22 14 L 36 22 Z" fill="#FFD76A"/>
        <path d="M 72 32 L 80 10 L 60 22 Z" fill="#3F5FD6" stroke="#24304A" stroke-width="2"/>
        <path d="M 73 28 L 78 14 L 64 22 Z" fill="#FFD76A"/>

        <!-- Body / Head (Cute soft robot-fox) -->
        <rect x="22" y="24" width="56" height="52" rx="24" fill="url(#miloGrad)" stroke="#24304A" stroke-width="2.5"/>
        
        <!-- Belly / Face Plate -->
        <ellipse cx="50" cy="56" rx="22" ry="18" fill="url(#bellyGrad)"/>

        <!-- Cute Cheeks -->
        ${cheeks}

        <!-- Eyes -->
        ${eyes}

        <!-- Soft Nose -->
        <polygon points="50,56 46,52 54,52" fill="#F59E0B"/>

        <!-- Mouth -->
        ${mouth}

        <!-- Limbs -->
        <!-- Left arm -->
        <path d="M 24 66 Q 14 62 18 52" fill="none" stroke="#5B7CFA" stroke-width="6" stroke-linecap="round"/>
        <!-- Right arm (Animated/Expressive) -->
        ${arm}

        <!-- Antenna with soft warm light bulb -->
        <line x1="50" y1="24" x2="50" y2="12" stroke="#24304A" stroke-width="2.5"/>
        <circle cx="50" cy="10" r="5" fill="#FFD76A" stroke="#24304A" stroke-width="1.5"/>

        <!-- Extras (Stars/Thought bubbles) -->
        ${extras}
      </svg>
    `;
  },

  renderFloatingMascot() {
    const container = document.getElementById('floating-milo-container');
    if (!container) return;

    container.innerHTML = `
      <div class="milo-floating-bubble" id="milo-bubble-text" role="status" aria-live="polite">
        Hi! I'm Milo, your friendly learning buddy. Click me if you want help! 🌟
      </div>
      <button class="milo-floating-button" id="milo-open-assistant-btn" aria-label="Open Milo Learning Assistant">
        ${this.getMascotSvg('happy', 68)}
        <span class="milo-help-pill">Ask Milo 💬</span>
      </button>
    `;
  },

  setMood(mood = 'happy', speakText = null, kannadaText = null) {
    this.currentMood = mood;
    const icons = document.querySelectorAll('.milo-mascot-placeholder');
    icons.forEach(el => {
      const size = parseInt(el.getAttribute('data-size') || '80', 10);
      el.innerHTML = this.getMascotSvg(mood, size);
    });

    const floatingBtn = document.getElementById('milo-open-assistant-btn');
    if (floatingBtn) {
      floatingBtn.querySelector('.milo-mascot-svg')?.remove();
      floatingBtn.insertAdjacentHTML('afterbegin', this.getMascotSvg(mood, 68));
    }

    if (speakText && window.AudioEngine) {
      window.AudioEngine.speak(speakText, kannadaText);
    }
  },

  setTalking(talking) {
    this.isTalking = talking;
    const svgs = document.querySelectorAll('.milo-mascot-svg');
    svgs.forEach(svg => {
      svg.classList.toggle('talking-active', talking);
    });
  },

  showSpeechBubble(text, autoHideMs = 5000) {
    const bubble = document.getElementById('milo-bubble-text');
    if (!bubble) return;

    bubble.textContent = text;
    bubble.classList.add('visible');

    if (autoHideMs > 0) {
      setTimeout(() => {
        bubble.classList.remove('visible');
      }, autoHideMs);
    }
  },

  /**
   * Rule-based response processor for Milo Chat view
   */
  processQuery(userInput) {
    if (!userInput) {
      return {
        text: "I'm listening! You can ask me about colours, shapes, numbers, animals, or say 'help me'.",
        kannada: "ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ! ಬಣ್ಣಗಳು, ಆಕಾರಗಳು ಅಥವಾ ಪ್ರಾಣಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
        mood: 'happy'
      };
    }

    const cleaned = userInput.toLowerCase().trim();

    // Check each rule in order
    for (const rule of this.ruleBase) {
      const matched = rule.keywords.some(kw => cleaned.includes(kw));
      if (matched) {
        return {
          text: rule.reply,
          kannada: rule.kannada,
          mood: (rule.suggestCategory === 'practice' || cleaned.includes('sad')) ? 'encourage' : 'celebrate',
          category: rule.suggestCategory
        };
      }
    }

    // Adaptive fallback response
    return {
      text: "That is interesting! Let's explore together. Would you like to practice our colourful lessons or daily skills?",
      kannada: "ನಾವು ಒಟ್ಟಿಗೆ ಕಲಿಯೋಣ! ಬಣ್ಣಗಳು ಅಥವಾ ದೈನಂದಿನ ಕೌಶಲ್ಯಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡೋಣವೇ?",
      mood: 'thinking',
      category: 'colours'
    };
  },

  bindMascotEvents() {
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('#milo-open-assistant-btn');
      if (openBtn) {
        if (window.App && typeof window.App.navigate === 'function') {
          window.App.navigate('milo-assistant');
        }
      }
    });
  }
};

window.MiloMascot = MiloMascot;
