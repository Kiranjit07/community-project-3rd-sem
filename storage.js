/**
 * Accessible Learning Companion - Storage Module
 * Manages LocalStorage persistence, structured data models,
 * default seed data for students, lessons, achievements, and activities.
 */

const STORAGE_KEYS = {
  AUTH_USER: 'alc_auth_user',
  CURRENT_STUDENT: 'alc_current_student_id',
  STUDENTS: 'alc_students_data',
  LESSONS: 'alc_lessons_data',
  RESULTS: 'alc_activity_results',
  ACHIEVEMENTS: 'alc_achievements_data',
  DAILY_SKILLS: 'alc_daily_skills_data',
  TEACHER_REMARKS: 'alc_teacher_remarks',
  ACCESSIBILITY: 'alc_accessibility_settings',
  APP_SETTINGS: 'alc_app_settings'
};

// SVG illustration generator helper for rich, crystal-clear visual assets
const VisualAssets = {
  // Colours
  red: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#EF4444"/><circle cx="60" cy="60" r="42" fill="#DC2626"/><circle cx="45" cy="45" r="10" fill="rgba(255,255,255,0.4)"/></svg>`,
  blue: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#3B82F6"/><circle cx="60" cy="60" r="42" fill="#2563EB"/><circle cx="45" cy="45" r="10" fill="rgba(255,255,255,0.4)"/></svg>`,
  green: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#10B981"/><circle cx="60" cy="60" r="42" fill="#059669"/><circle cx="45" cy="45" r="10" fill="rgba(255,255,255,0.4)"/></svg>`,
  yellow: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#FBBF24"/><circle cx="60" cy="60" r="42" fill="#F59E0B"/><circle cx="45" cy="45" r="10" fill="rgba(255,255,255,0.5)"/></svg>`,
  orange: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#FB923C"/><circle cx="60" cy="60" r="42" fill="#EA580C"/><circle cx="45" cy="45" r="10" fill="rgba(255,255,255,0.4)"/></svg>`,
  purple: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#A855F7"/><circle cx="60" cy="60" r="42" fill="#9333EA"/><circle cx="45" cy="45" r="10" fill="rgba(255,255,255,0.4)"/></svg>`,
  black: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#1F2937"/><circle cx="60" cy="60" r="42" fill="#111827"/><circle cx="45" cy="45" r="8" fill="rgba(255,255,255,0.25)"/></svg>`,
  white: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="50" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="4"/><circle cx="60" cy="60" r="42" fill="#FFFFFF"/><circle cx="45" cy="45" r="10" fill="#E5E7EB"/></svg>`,

  // Shapes
  circle: `<svg viewBox="0 0 120 120" class="asset-svg"><circle cx="60" cy="60" r="48" fill="#5B7CFA"/><circle cx="46" cy="46" r="10" fill="rgba(255,255,255,0.4)"/></svg>`,
  square: `<svg viewBox="0 0 120 120" class="asset-svg"><rect x="16" y="16" width="88" height="88" rx="14" fill="#10B981"/><rect x="26" y="26" width="30" height="30" rx="6" fill="rgba(255,255,255,0.3)"/></svg>`,
  triangle: `<svg viewBox="0 0 120 120" class="asset-svg"><polygon points="60,14 110,102 10,102" fill="#F59E0B" stroke="#D97706" stroke-width="3" stroke-linejoin="round"/><polygon points="60,32 85,88 35,88" fill="rgba(255,255,255,0.25)"/></svg>`,
  rectangle: `<svg viewBox="0 0 120 120" class="asset-svg"><rect x="10" y="28" width="100" height="64" rx="12" fill="#8B5CF6"/><rect x="18" y="36" width="36" height="20" rx="6" fill="rgba(255,255,255,0.3)"/></svg>`,
  star: `<svg viewBox="0 0 120 120" class="asset-svg"><polygon points="60,10 74,45 112,47 82,71 92,108 60,86 28,108 38,71 8,47 46,45" fill="#FFD76A" stroke="#F59E0B" stroke-width="3" stroke-linejoin="round"/></svg>`,

  // Numbers (Visual cards)
  num: (n, itemEmoji = '⭐') => {
    const dots = Array.from({ length: Math.min(n, 10) }, () => `<span class="num-dot">${itemEmoji}</span>`).join('');
    return `<div class="num-visual-box"><span class="large-num">${n}</span><div class="dots-cloud">${dots}</div></div>`;
  },

  // Emojis / SVG representations for Animals, Objects, Fruits, Emotions
  emoji: (sym, label, bg = '#EEF2FF') => `
    <div class="emoji-card-visual" style="background:${bg};">
      <span class="main-emoji" aria-hidden="true">${sym}</span>
      <span class="sr-only">${label}</span>
    </div>`
};

// Default seed student profiles
const DEFAULT_STUDENTS = [
  {
    id: 'student-1',
    name: 'Rahul Sharma',
    avatar: '👦',
    ageGroup: '7-10 years',
    learningLevel: 'beginner',
    preferredLanguage: 'en',
    totalStars: 45,
    streakDays: 4,
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
  },
  {
    id: 'student-2',
    name: 'Ananya Rao',
    avatar: '👧',
    ageGroup: '11-14 years',
    learningLevel: 'intermediate',
    preferredLanguage: 'kn',
    totalStars: 82,
    streakDays: 7,
    accessibilitySettings: {
      fontSize: 'large',
      highContrast: false,
      reducedMotion: false,
      audioFirst: true,
      pictureFirst: true,
      speechRate: 0.85,
      audioVolume: 1.0,
      simpleLanguage: true,
      largeButtons: true,
      theme: 'calm-blue'
    }
  },
  {
    id: 'student-3',
    name: 'Kiran Patel',
    avatar: '🧒',
    ageGroup: '6-8 years',
    learningLevel: 'beginner',
    preferredLanguage: 'en',
    totalStars: 28,
    streakDays: 2,
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
  }
];

// Comprehensive lessons across all required categories
const DEFAULT_LESSONS = [
  // --- COLOURS ---
  {
    id: 'col-red',
    category: 'colours',
    title: 'Red Colour',
    difficulty: 'beginner',
    visualKey: 'red',
    iconEmoji: '🔴',
    description: 'Red is a bright and warm colour. Strawberries, ripe apples, and stop signs are red.',
    simpleExplanation: 'Look! This is red. Like a sweet red apple.',
    audioText: 'This is the colour red. Red is bright like a juicy apple.',
    kannadaText: 'ಇದು ಕೆಂಪು ಬಣ್ಣ. ಸೇಬು ಕೆಂಪು ಬಣ್ಣದಲ್ಲಿದೆ.',
    questions: [
      {
        id: 'q-col-red-1',
        prompt: 'Which one is RED?',
        audioPrompt: 'Touch the red circle.',
        kannadaPrompt: 'ಕೆಂಪು ಬಣ್ಣವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Red', visualKey: 'red', isCorrect: true },
          { text: 'Blue', visualKey: 'blue', isCorrect: false },
          { text: 'Green', visualKey: 'green', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-blue',
    category: 'colours',
    title: 'Blue Colour',
    difficulty: 'beginner',
    visualKey: 'blue',
    iconEmoji: '🔵',
    description: 'Blue is a peaceful, cool colour. The sky above and deep ocean water are blue.',
    simpleExplanation: 'Look at the blue colour. Like the clear open sky.',
    audioText: 'This is the colour blue. Blue is cool like the clear sky and clean water.',
    kannadaText: 'ಇದು ನೀಲಿ ಬಣ್ಣ. ಆಕಾಶ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿದೆ.',
    questions: [
      {
        id: 'q-col-blue-1',
        prompt: 'Find the BLUE colour.',
        audioPrompt: 'Touch the blue circle.',
        kannadaPrompt: 'ನೀಲಿ ಬಣ್ಣವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Yellow', visualKey: 'yellow', isCorrect: false },
          { text: 'Blue', visualKey: 'blue', isCorrect: true },
          { text: 'Orange', visualKey: 'orange', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-green',
    category: 'colours',
    title: 'Green Colour',
    difficulty: 'beginner',
    visualKey: 'green',
    iconEmoji: '🟢',
    description: 'Green is the colour of nature! Tree leaves, soft grass, and crunchy cucumbers are green.',
    simpleExplanation: 'This is green, just like fresh garden leaves.',
    audioText: 'This is green. Trees and grass are beautiful green.',
    kannadaText: 'ಇದು ಹಸಿರು ಬಣ್ಣ. ಎಲೆಗಳು ಹಸಿರಾಗಿವೆ.',
    questions: [
      {
        id: 'q-col-green-1',
        prompt: 'Where is GREEN?',
        audioPrompt: 'Find and touch the green colour.',
        kannadaPrompt: 'ಹಸಿರು ಬಣ್ಣವನ್ನು ಹುಡುಕಿ.',
        options: [
          { text: 'Green', visualKey: 'green', isCorrect: true },
          { text: 'Red', visualKey: 'red', isCorrect: false },
          { text: 'Purple', visualKey: 'purple', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-yellow',
    category: 'colours',
    title: 'Yellow Colour',
    difficulty: 'beginner',
    visualKey: 'yellow',
    iconEmoji: '🟡',
    description: 'Yellow is warm and cheery. The bright shining sun and ripe sweet bananas are yellow.',
    simpleExplanation: 'This is yellow! Bright like sunshine.',
    audioText: 'Yellow is sunny and warm, like a bright smiling sunflower.',
    kannadaText: 'ಇದು ಹಳದಿ ಬಣ್ಣ. ಸೂರ್ಯ ಹಳದಿ ಬಣ್ಣದಲ್ಲಿದ್ದಾನೆ.',
    questions: [
      {
        id: 'q-col-yellow-1',
        prompt: 'Which one is YELLOW?',
        audioPrompt: 'Tap on the yellow circle.',
        kannadaPrompt: 'ಹಳದಿ ಬಣ್ಣವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Black', visualKey: 'black', isCorrect: false },
          { text: 'Yellow', visualKey: 'yellow', isCorrect: true },
          { text: 'Blue', visualKey: 'blue', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-orange',
    category: 'colours',
    title: 'Orange Colour',
    difficulty: 'beginner',
    visualKey: 'orange',
    iconEmoji: '🟠',
    description: 'Orange is energetic! Juicy orange fruit, tasty carrots, and basketballs are orange.',
    simpleExplanation: 'This is orange. Sweet and bright.',
    audioText: 'This is orange. Just like a yummy sweet orange fruit.',
    kannadaText: 'ಇದು ಕೇಸರಿ ಅಥವಾ ಕಿತ್ತಳೆ ಬಣ್ಣ.',
    questions: [
      {
        id: 'q-col-org-1',
        prompt: 'Which is ORANGE?',
        audioPrompt: 'Find the orange circle.',
        kannadaPrompt: 'ಕಿತ್ತಳೆ ಬಣ್ಣವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Orange', visualKey: 'orange', isCorrect: true },
          { text: 'Green', visualKey: 'green', isCorrect: false },
          { text: 'White', visualKey: 'white', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-purple',
    category: 'colours',
    title: 'Purple Colour',
    difficulty: 'beginner',
    visualKey: 'purple',
    iconEmoji: '🟣',
    description: 'Purple is playful. Sweet grapes, eggplants, and lavender flowers are purple.',
    simpleExplanation: 'This is purple, like delicious grapes.',
    audioText: 'This is purple. Grapes and flowers are purple.',
    kannadaText: 'ಇದು ನೇರಳೆ ಬಣ್ಣ.',
    questions: [
      {
        id: 'q-col-pur-1',
        prompt: 'Find the PURPLE circle.',
        audioPrompt: 'Touch the purple circle.',
        kannadaPrompt: 'ನೇರಳೆ ಬಣ್ಣವನ್ನು ಹುಡುಕಿ.',
        options: [
          { text: 'Blue', visualKey: 'blue', isCorrect: false },
          { text: 'Purple', visualKey: 'purple', isCorrect: true },
          { text: 'Yellow', visualKey: 'yellow', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-black',
    category: 'colours',
    title: 'Black Colour',
    difficulty: 'beginner',
    visualKey: 'black',
    iconEmoji: '⚫',
    description: 'Black is deep and strong. The night sky, tires, and shiny hair can be black.',
    simpleExplanation: 'This is black, like the night sky.',
    audioText: 'This is black. The quiet night sky is black.',
    kannadaText: 'ಇದು ಕಪ್ಪು ಬಣ್ಣ.',
    questions: [
      {
        id: 'q-col-blk-1',
        prompt: 'Find BLACK.',
        audioPrompt: 'Touch the black circle.',
        kannadaPrompt: 'ಕಪ್ಪು ಬಣ್ಣವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Black', visualKey: 'black', isCorrect: true },
          { text: 'White', visualKey: 'white', isCorrect: false },
          { text: 'Red', visualKey: 'red', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'col-white',
    category: 'colours',
    title: 'White Colour',
    difficulty: 'beginner',
    visualKey: 'white',
    iconEmoji: '⚪',
    description: 'White is clean and pure. Fluffy clouds in the sky, fresh milk, and snow are white.',
    simpleExplanation: 'This is white, like milk or clouds.',
    audioText: 'This is white. Fluffy clouds and milk are white.',
    kannadaText: 'ಇದು ಬಿಳಿ ಬಣ್ಣ.',
    questions: [
      {
        id: 'q-col-wht-1',
        prompt: 'Find the WHITE circle.',
        audioPrompt: 'Tap on white.',
        kannadaPrompt: 'ಬಿಳಿ ಬಣ್ಣವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Black', visualKey: 'black', isCorrect: false },
          { text: 'Green', visualKey: 'green', isCorrect: false },
          { text: 'White', visualKey: 'white', isCorrect: true }
        ]
      }
    ]
  },

  // --- NUMBERS ---
  {
    id: 'num-1-10',
    category: 'numbers',
    title: 'Numbers 1 to 10',
    difficulty: 'beginner',
    iconEmoji: '🔢',
    customVisualHtml: '<div class="num-grid-preview"><span>1 ⭐</span><span>2 ⭐⭐</span><span>3 ⭐⭐⭐</span><span>4 🌟</span><span>5 🌟</span></div>',
    description: 'Let us count together from one to ten! Count your fingers or count toys.',
    simpleExplanation: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10! Counting is fun.',
    audioText: 'Let us count from one to ten. One, two, three, four, five, six, seven, eight, nine, ten!',
    kannadaText: 'ಒಂದರಿಂದ ಹತ್ತರವರೆಗೆ ಎಣಿಸೋಣ: ಒಂದು, ಎರಡು, ಮೂರು, ನಾಲ್ಕು, ಐದು, ಆರು, ಏಳು, ಎಂಟು, ಒಂಬತ್ತು, ಹತ್ತು.',
    questions: [
      {
        id: 'q-num-1',
        prompt: 'How many stars do you see? ⭐⭐⭐',
        audioPrompt: 'Count the stars. How many stars are there?',
        kannadaPrompt: 'ಇಲ್ಲಿ ಎಷ್ಟು ನಕ್ಷತ್ರಗಳಿವೆ?',
        options: [
          { text: '2', isCorrect: false },
          { text: '3', isCorrect: true },
          { text: '5', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'num-11-20',
    category: 'numbers',
    title: 'Numbers 11 to 20',
    difficulty: 'intermediate',
    iconEmoji: '🔟',
    customVisualHtml: '<div class="num-grid-preview"><span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span></div>',
    description: 'After 10 comes 11, 12, 13, all the way up to 20! Big counting steps.',
    simpleExplanation: 'Count up to twenty: eleven, twelve, thirteen, and more!',
    audioText: 'Numbers eleven to twenty help us count bigger groups of items.',
    kannadaText: 'ಹನ್ನೊಂದರಿಂದ ಇಪ್ಪತ್ತರವರೆಗೆ ಎಣಿಕೆ.',
    questions: [
      {
        id: 'q-num-15',
        prompt: 'Which number comes after 14?',
        audioPrompt: 'Which number comes after fourteen?',
        kannadaPrompt: 'ಹದಿನಾಲ್ಕರ ನಂತರ ಯಾವ ಸಂಖ್ಯೆ ಬರುತ್ತದೆ?',
        options: [
          { text: '13', isCorrect: false },
          { text: '15', isCorrect: true },
          { text: '18', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'num-counting',
    category: 'numbers',
    title: 'Counting Objects',
    difficulty: 'beginner',
    iconEmoji: '🍎',
    customVisualHtml: '<div class="emoji-cluster"><span>🍎</span><span>🍎</span><span>🍎</span><span>🍎</span></div>',
    description: 'Practice pointing and counting objects one by one with your finger.',
    simpleExplanation: 'Point to each apple and count: 1, 2, 3, 4!',
    audioText: 'Touch each apple as we count together. One, two, three, four apples!',
    kannadaText: 'ಪ್ರತಿಯೊಂದು ಸೇಬನ್ನು ಎಣಿಸಿ.',
    questions: [
      {
        id: 'q-count-apples',
        prompt: 'How many apples are here? 🍎 🍎',
        audioPrompt: 'Count the apples on the screen.',
        kannadaPrompt: 'ಎಷ್ಟು ಸೇಬುಗಳಿವೆ?',
        options: [
          { text: '1', isCorrect: false },
          { text: '2', isCorrect: true },
          { text: '4', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'num-to-picture',
    category: 'numbers',
    title: 'Number-to-Picture Association',
    difficulty: 'beginner',
    iconEmoji: '🎯',
    customVisualHtml: '<div class="assoc-preview"><span>5 ➡️ 🎈🎈🎈🎈🎈</span></div>',
    description: 'Connect the number symbol to the picture showing that exact amount.',
    simpleExplanation: 'The number 5 means five friendly balloons!',
    audioText: 'See the number and match it with the group of objects.',
    kannadaText: 'ಸಂಖ್ಯೆಯನ್ನು ಸರಿಯಾದ ಚಿತ್ರಕ್ಕೆ ಹೊಂದಿಸಿ.',
    questions: [
      {
        id: 'q-assoc-1',
        prompt: 'Which group has ONE dog? 🐕',
        audioPrompt: 'Find the picture with just one dog.',
        kannadaPrompt: 'ಒಂದೇ ನಾಯಿ ಇರುವ ಚಿತ್ರವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: '🐕 (One Dog)', isCorrect: true },
          { text: '🐕 🐕 🐕 (Three Dogs)', isCorrect: false }
        ]
      }
    ]
  },

  // --- SHAPES ---
  {
    id: 'shp-circle',
    category: 'shapes',
    title: 'Circle Shape',
    difficulty: 'beginner',
    visualKey: 'circle',
    iconEmoji: '⭕',
    description: 'A circle is completely round with no corners! Wheels, coins, and clocks are circles.',
    simpleExplanation: 'A circle goes round and round smoothly.',
    audioText: 'A circle is round like a ball or a wall clock.',
    kannadaText: 'ಇದು ವೃತ್ತ. ಚಕ್ರದಂತೆ ದುಂಡಗಿದೆ.',
    questions: [
      {
        id: 'q-shp-circ',
        prompt: 'Which shape is a CIRCLE?',
        audioPrompt: 'Touch the round circle shape.',
        kannadaPrompt: 'ವೃತ್ತಾಕಾರವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Circle', visualKey: 'circle', isCorrect: true },
          { text: 'Square', visualKey: 'square', isCorrect: false },
          { text: 'Triangle', visualKey: 'triangle', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'shp-square',
    category: 'shapes',
    title: 'Square Shape',
    difficulty: 'beginner',
    visualKey: 'square',
    iconEmoji: '🟧',
    description: 'A square has four straight sides that are all the exact same length, and 4 corners.',
    simpleExplanation: 'A square has 4 equal sides, like a game dice.',
    audioText: 'A square has four equal sides and four sharp corners.',
    kannadaText: 'ಇದು ಚೌಕ. ನಾಲ್ಕು ಸಮಾನ ಬದಿಗಳಿವೆ.',
    questions: [
      {
        id: 'q-shp-sq',
        prompt: 'Find the SQUARE.',
        audioPrompt: 'Touch the square.',
        kannadaPrompt: 'ಚೌಕವನ್ನು ಗುರುತಿಸಿ.',
        options: [
          { text: 'Triangle', visualKey: 'triangle', isCorrect: false },
          { text: 'Square', visualKey: 'square', isCorrect: true },
          { text: 'Circle', visualKey: 'circle', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'shp-triangle',
    category: 'shapes',
    title: 'Triangle Shape',
    difficulty: 'beginner',
    visualKey: 'triangle',
    iconEmoji: '🔺',
    description: 'A triangle has three straight sides and three pointy corners. Like a slice of pizza!',
    simpleExplanation: 'A triangle has 3 sides and 3 points.',
    audioText: 'A triangle has three sides, like a tasty slice of pizza.',
    kannadaText: 'ಇದು ತ್ರಿಕೋನ. ಮೂರು ಮೂಲೆಗಳಿವೆ.',
    questions: [
      {
        id: 'q-shp-tri',
        prompt: 'Which is a TRIANGLE?',
        audioPrompt: 'Tap on the triangle with three sides.',
        kannadaPrompt: 'ತ್ರಿಕೋನವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Circle', visualKey: 'circle', isCorrect: false },
          { text: 'Rectangle', visualKey: 'rectangle', isCorrect: false },
          { text: 'Triangle', visualKey: 'triangle', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'shp-rectangle',
    category: 'shapes',
    title: 'Rectangle Shape',
    difficulty: 'intermediate',
    visualKey: 'rectangle',
    iconEmoji: '🚪',
    description: 'A rectangle has four sides. Two sides are long and two sides are short, like a door or book.',
    simpleExplanation: 'A rectangle is long like a picture frame or door.',
    audioText: 'A rectangle is like a stretched out square, like a door or television.',
    kannadaText: 'ಇದು ಆಯತಾಕಾರ.',
    questions: [
      {
        id: 'q-shp-rec',
        prompt: 'Find the RECTANGLE.',
        audioPrompt: 'Touch the rectangle shape.',
        kannadaPrompt: 'ಆಯತಾಕಾರವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Rectangle', visualKey: 'rectangle', isCorrect: true },
          { text: 'Square', visualKey: 'square', isCorrect: false },
          { text: 'Circle', visualKey: 'circle', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'shp-star',
    category: 'shapes',
    title: 'Star Shape',
    difficulty: 'beginner',
    visualKey: 'star',
    iconEmoji: '⭐',
    description: 'A star has sparkly points that shine! Stars twinkle in the beautiful night sky.',
    simpleExplanation: 'A star shines bright in the night sky.',
    audioText: 'Twinkle twinkle little star, a shiny five point star.',
    kannadaText: 'ಇದು ನಕ್ಷತ್ರ ಆಕಾರ.',
    questions: [
      {
        id: 'q-shp-str',
        prompt: 'Touch the shining STAR.',
        audioPrompt: 'Where is the star?',
        kannadaPrompt: 'ನಕ್ಷತ್ರವನ್ನು ಮುಟ್ಟಿ.',
        options: [
          { text: 'Square', visualKey: 'square', isCorrect: false },
          { text: 'Star', visualKey: 'star', isCorrect: true },
          { text: 'Circle', visualKey: 'circle', isCorrect: false }
        ]
      }
    ]
  },

  // --- ANIMALS ---
  {
    id: 'anm-dog',
    category: 'animals',
    title: 'Friendly Dog',
    difficulty: 'beginner',
    iconEmoji: '🐕',
    customVisualHtml: VisualAssets.emoji('🐕', 'Dog', '#FEF3C7'),
    description: 'Dogs are loyal and loving pets. They wag their tails and say "Woof Woof!"',
    simpleExplanation: 'A dog is our friendly buddy. It barks: Woof woof!',
    audioText: 'This is a dog. Dogs say woof woof and love to play fetch.',
    kannadaText: 'ಇದು ನಾಯಿ. ನಾಯಿ ಬೌ ಬೌ ಎಂದು ಕೂಗುತ್ತದೆ.',
    questions: [
      {
        id: 'q-anm-dog',
        prompt: 'Which animal says "Woof Woof"?',
        audioPrompt: 'Which animal barks woof woof?',
        kannadaPrompt: 'ಯಾವ ಪ್ರಾಣಿ ಬೌ ಬೌ ಅನ್ನುತ್ತದೆ?',
        options: [
          { text: 'Dog 🐕', isCorrect: true },
          { text: 'Cat 🐈', isCorrect: false },
          { text: 'Cow 🐄', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'anm-cat',
    category: 'animals',
    title: 'Gentle Cat',
    difficulty: 'beginner',
    iconEmoji: '🐈',
    customVisualHtml: VisualAssets.emoji('🐈', 'Cat', '#FCE7F3'),
    description: 'Cats are quiet, agile, and soft. They purr happily and say "Meow Meow!"',
    simpleExplanation: 'A cat has soft fur and says: Meow meow!',
    audioText: 'This is a cat. Cats are soft, gentle, and say meow.',
    kannadaText: 'ಇದು ಬೆಕ್ಕು. ಬೆಕ್ಕು ಮಿಯಾಂವ್ ಮಿಯಾಂವ್ ಅನ್ನುತ್ತದೆ.',
    questions: [
      {
        id: 'q-anm-cat',
        prompt: 'Find the CAT.',
        audioPrompt: 'Touch the cat.',
        kannadaPrompt: 'ಬೆಕ್ಕನ್ನು ಹುಡುಕಿ.',
        options: [
          { text: 'Lion 🦁', isCorrect: false },
          { text: 'Cat 🐈', isCorrect: true },
          { text: 'Bird 🐦', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'anm-cow',
    category: 'animals',
    title: 'Calm Cow',
    difficulty: 'beginner',
    iconEmoji: '🐄',
    customVisualHtml: VisualAssets.emoji('🐄', 'Cow', '#DCFCE7'),
    description: 'Cows give us healthy, sweet milk. They chew fresh grass and say "Moo Moo!"',
    simpleExplanation: 'Cows give milk and say: Moo moo!',
    audioText: 'This is a cow. Cows give us healthy milk and say moo.',
    kannadaText: 'ಇದು ಹಸು. ಹಸು ನಮಗೆ ಹಾಲು ನೀಡುತ್ತದೆ.',
    questions: [
      {
        id: 'q-anm-cow',
        prompt: 'Which animal gives us milk? 🥛',
        audioPrompt: 'Which gentle animal gives us milk?',
        kannadaPrompt: 'ಯಾವ ಪ್ರಾಣಿ ಹಾಲು ಕೊಡುತ್ತದೆ?',
        options: [
          { text: 'Cow 🐄', isCorrect: true },
          { text: 'Elephant 🐘', isCorrect: false },
          { text: 'Dog 🐕', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'anm-lion',
    category: 'animals',
    title: 'Brave Lion',
    difficulty: 'intermediate',
    iconEmoji: '🦁',
    customVisualHtml: VisualAssets.emoji('🦁', 'Lion', '#FEF08A'),
    description: 'The lion is known as the King of the Jungle! It has a fluffy golden mane and roars loud.',
    simpleExplanation: 'The lion has a grand mane and roars proudly.',
    audioText: 'This is a lion. The lion is strong and roars in the jungle.',
    kannadaText: 'ಇದು ಸಿಂಹ, ಕಾಡಿನ ರಾಜ.',
    questions: [
      {
        id: 'q-anm-lion',
        prompt: 'Who is the King of the Jungle? 👑',
        audioPrompt: 'Which animal is the King of the Jungle?',
        kannadaPrompt: 'ಕಾಡಿನ ರಾಜ ಯಾರು?',
        options: [
          { text: 'Bird 🐦', isCorrect: false },
          { text: 'Lion 🦁', isCorrect: true },
          { text: 'Cat 🐈', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'anm-elephant',
    category: 'animals',
    title: 'Big Elephant',
    difficulty: 'beginner',
    iconEmoji: '🐘',
    customVisualHtml: VisualAssets.emoji('🐘', 'Elephant', '#E0E7FF'),
    description: 'Elephants are the largest animals on land. They have huge floppy ears and a long trunk.',
    simpleExplanation: 'An elephant is big with a long trunk to drink water.',
    audioText: 'This is an elephant. It has large flapping ears and a playful long trunk.',
    kannadaText: 'ಇದು ಆನೆ. ಆನೆಗೆ ಉದ್ದವಾದ ಸೊಂಡಿಲಿದೆ.',
    questions: [
      {
        id: 'q-anm-eleph',
        prompt: 'Which animal has a long TRUNK?',
        audioPrompt: 'Find the animal with a long trunk.',
        kannadaPrompt: 'ಉದ್ದವಾದ ಸೊಂಡಿಲಿರುವ ಪ್ರಾಣಿ ಯಾವುದು?',
        options: [
          { text: 'Elephant 🐘', isCorrect: true },
          { text: 'Cow 🐄', isCorrect: false },
          { text: 'Dog 🐕', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'anm-bird',
    category: 'animals',
    title: 'Singing Bird',
    difficulty: 'beginner',
    iconEmoji: '🐦',
    customVisualHtml: VisualAssets.emoji('🐦', 'Bird', '#CFFAFE'),
    description: 'Birds have wings to fly up in the blue sky and feathers. They chirp sweet songs: "Tweet Tweet!"',
    simpleExplanation: 'A bird can fly in the sky and sings sweet songs.',
    audioText: 'This is a bird. Birds flap their wings and sing tweet tweet.',
    kannadaText: 'ಇದು ಪಕ್ಷಿ. ಹಕ್ಕಿ ಆಕಾಶದಲ್ಲಿ ಹಾರುತ್ತದೆ.',
    questions: [
      {
        id: 'q-anm-bird',
        prompt: 'Which animal can FLY in the sky? ☁️',
        audioPrompt: 'Which animal has wings and flies high?',
        kannadaPrompt: 'ಆಕಾಶದಲ್ಲಿ ಹಾರುವ ಪ್ರಾಣಿ ಯಾವುದು?',
        options: [
          { text: 'Cat 🐈', isCorrect: false },
          { text: 'Bird 🐦', isCorrect: true },
          { text: 'Elephant 🐘', isCorrect: false }
        ]
      }
    ]
  },

  // --- EVERYDAY OBJECTS ---
  {
    id: 'obj-chair',
    category: 'objects',
    title: 'Comfortable Chair',
    difficulty: 'beginner',
    iconEmoji: '🪑',
    customVisualHtml: VisualAssets.emoji('🪑', 'Chair', '#F1F5F9'),
    description: 'A chair has four legs and a seat. We sit on a chair to rest, eat, or read.',
    simpleExplanation: 'We sit down safely on a chair.',
    audioText: 'This is a chair. We sit on a chair when we work or relax.',
    kannadaText: 'ಇದು ಕುರ್ಚಿ. ನಾವು ಕುಳಿತುಕೊಳ್ಳಲು ಕುರ್ಚಿ ಬಳಸುತ್ತೇವೆ.',
    questions: [
      {
        id: 'q-obj-chr',
        prompt: 'What do we SIT on?',
        audioPrompt: 'Which object do we sit on?',
        kannadaPrompt: 'ನಾವು ಯಾವುದರ ಮೇಲೆ ಕುಳಿತುಕೊಳ್ಳುತ್ತೇವೆ?',
        options: [
          { text: 'Chair 🪑', isCorrect: true },
          { text: 'Cup 🥛', isCorrect: false },
          { text: 'Pencil ✏️', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'obj-table',
    category: 'objects',
    title: 'Study Table',
    difficulty: 'beginner',
    iconEmoji: '🪵',
    customVisualHtml: VisualAssets.emoji('🪵', 'Table', '#FEF3C7'),
    description: 'A table has a flat top where we keep our books, plates, and drawing paper.',
    simpleExplanation: 'A table holds our books and meals.',
    audioText: 'This is a table. We put our notebooks and food on a table.',
    kannadaText: 'ಇದು ಮೇಜು ಅಥವಾ ಟೇಬಲ್.',
    questions: [
      {
        id: 'q-obj-tbl',
        prompt: 'Where do we place our notebook while writing?',
        audioPrompt: 'Where do we put our notebook to write?',
        kannadaPrompt: 'ಬರೆಯಲು ಪುಸ್ತಕವನ್ನು ಎಲ್ಲಿ ಇಡುತ್ತೇವೆ?',
        options: [
          { text: 'Table 🪵', isCorrect: true },
          { text: 'Bottle 🍼', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'obj-cup',
    category: 'objects',
    title: 'Drink Cup',
    difficulty: 'beginner',
    iconEmoji: '☕',
    customVisualHtml: VisualAssets.emoji('☕', 'Cup', '#E0F2FE'),
    description: 'A cup has a handle so we can hold it easily to drink milk, water, or warm soup.',
    simpleExplanation: 'We drink tasty milk or water from a cup.',
    audioText: 'This is a cup. Hold the handle gently to drink.',
    kannadaText: 'ಇದು ಲೋಟ ಅಥವಾ ಕಪ್.',
    questions: [
      {
        id: 'q-obj-cup',
        prompt: 'Find the CUP for drinking.',
        audioPrompt: 'Touch the cup.',
        kannadaPrompt: 'ಕಪ್ ಗುರುತಿಸಿ.',
        options: [
          { text: 'Book 📖', isCorrect: false },
          { text: 'Cup ☕', isCorrect: true },
          { text: 'Chair 🪑', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'obj-bottle',
    category: 'objects',
    title: 'Water Bottle',
    difficulty: 'beginner',
    iconEmoji: '🧴',
    customVisualHtml: VisualAssets.emoji('🧴', 'Bottle', '#CFFAFE'),
    description: 'A water bottle keeps fresh water ready to drink whenever we are thirsty at school or outside.',
    simpleExplanation: 'A water bottle carries water for us.',
    audioText: 'This is a water bottle. Drink plenty of water to stay healthy.',
    kannadaText: 'ಇದು ನೀರಿನ ಬಾಟಲಿ.',
    questions: [
      {
        id: 'q-obj-btl',
        prompt: 'What keeps our drinking water safe? 💧',
        audioPrompt: 'Which object holds water for us to carry?',
        kannadaPrompt: 'ನೀರು ತುಂಬಿಡಲು ಏನು ಬಳಸುತ್ತೇವೆ?',
        options: [
          { text: 'Bottle 🧴', isCorrect: true },
          { text: 'Chair 🪑', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'obj-book',
    category: 'objects',
    title: 'Story Book',
    difficulty: 'beginner',
    iconEmoji: '📖',
    customVisualHtml: VisualAssets.emoji('📖', 'Book', '#FCE7F3'),
    description: 'A book has pages full of beautiful stories, pictures, and exciting things to learn.',
    simpleExplanation: 'We open a book to read stories and look at pictures.',
    audioText: 'This is a book. Reading books makes our mind strong and happy.',
    kannadaText: 'ಇದು ಪುಸ್ತಕ. ನಾವು ಓದಲು ಪುಸ್ತಕ ಬಳಸುತ್ತೇವೆ.',
    questions: [
      {
        id: 'q-obj-bk',
        prompt: 'What do we READ? 📚',
        audioPrompt: 'Which object do we open to read?',
        kannadaPrompt: 'ನಾವು ಏನನ್ನು ಓದುತ್ತೇವೆ?',
        options: [
          { text: 'Book 📖', isCorrect: true },
          { text: 'Cup ☕', isCorrect: false },
          { text: 'Bottle 🧴', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'obj-pencil',
    category: 'objects',
    title: 'Writing Pencil',
    difficulty: 'beginner',
    iconEmoji: '✏️',
    customVisualHtml: VisualAssets.emoji('✏️', 'Pencil', '#FEF3C7'),
    description: 'We hold a pencil with our fingers to draw happy pictures and write numbers and letters.',
    simpleExplanation: 'A pencil helps us draw and write.',
    audioText: 'This is a pencil. Use it gently to draw shapes and write.',
    kannadaText: 'ಇದು ಪೆನ್ಸಿಲ್. ಬರೆಯಲು ಬಳಸುತ್ತೇವೆ.',
    questions: [
      {
        id: 'q-obj-pen',
        prompt: 'Find the tool we use to DRAW.',
        audioPrompt: 'Touch the pencil.',
        kannadaPrompt: 'ಪೆನ್ಸಿಲ್ ಮುಟ್ಟಿ.',
        options: [
          { text: 'Table 🪵', isCorrect: false },
          { text: 'Pencil ✏️', isCorrect: true },
          { text: 'Chair 🪑', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'obj-bag',
    category: 'objects',
    title: 'School Bag',
    difficulty: 'beginner',
    iconEmoji: '🎒',
    customVisualHtml: VisualAssets.emoji('🎒', 'Bag', '#E0E7FF'),
    description: 'We zip up our school bag with our books, lunch, and pencil box inside, then carry it on our shoulders.',
    simpleExplanation: 'We carry our school supplies in a backpack.',
    audioText: 'This is a school bag. It carries your books safely to class.',
    kannadaText: 'ಇದು ಶಾಲಾ ಚೀಲ ಅಥವಾ ಬ್ಯಾಗ್.',
    questions: [
      {
        id: 'q-obj-bg',
        prompt: 'Where do we pack our books for school? 🏫',
        audioPrompt: 'What carries our books to school?',
        kannadaPrompt: 'ಪುಸ್ತಕಗಳನ್ನು ಎಲ್ಲಿ ಇಟ್ಟುಕೊಳ್ಳುತ್ತೇವೆ?',
        options: [
          { text: 'Bag 🎒', isCorrect: true },
          { text: 'Cup ☕', isCorrect: false }
        ]
      }
    ]
  },

  // --- FRUITS AND VEGETABLES ---
  {
    id: 'fav-apple',
    category: 'fruits-veg',
    title: 'Crisp Apple',
    difficulty: 'beginner',
    iconEmoji: '🍎',
    customVisualHtml: VisualAssets.emoji('🍎', 'Apple', '#FEE2E2'),
    description: 'Apples are sweet, crunchy, and healthy fruits. An apple a day keeps the doctor away!',
    simpleExplanation: 'A red sweet apple is a healthy fruit.',
    audioText: 'This is an apple. Apples are sweet, crunchy, and very good for health.',
    kannadaText: 'ಇದು ಸೇಬು ಹಣ್ಣು. ಸಿಹಿ ಮತ್ತು ಆರೋಗ್ಯಕರ.',
    questions: [
      {
        id: 'q-fav-app',
        prompt: 'Which one is an APPLE? 🍎',
        audioPrompt: 'Touch the red apple.',
        kannadaPrompt: 'ಸೇಬು ಹಣ್ಣನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Apple 🍎', isCorrect: true },
          { text: 'Carrot 🥕', isCorrect: false },
          { text: 'Tomato 🍅', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'fav-banana',
    category: 'fruits-veg',
    title: 'Sweet Banana',
    difficulty: 'beginner',
    iconEmoji: '🍌',
    customVisualHtml: VisualAssets.emoji('🍌', 'Banana', '#FEF9C3'),
    description: 'Bananas have a yellow peel. Peel it gently to enjoy the sweet, soft fruit that gives you energy!',
    simpleExplanation: 'Peel the yellow banana and eat the sweet fruit.',
    audioText: 'This is a banana. Bananas are soft, yellow, and give you lots of energy.',
    kannadaText: 'ಇದು ಬಾಳೆಹಣ್ಣು.',
    questions: [
      {
        id: 'q-fav-ban',
        prompt: 'Which fruit is YELLOW and curved? 🍌',
        audioPrompt: 'Find the yellow banana.',
        kannadaPrompt: 'ಹಳದಿ ಬಣ್ಣದ ಬಾಳೆಹಣ್ಣನ್ನು ಮುಟ್ಟಿ.',
        options: [
          { text: 'Orange 🍊', isCorrect: false },
          { text: 'Banana 🍌', isCorrect: true },
          { text: 'Apple 🍎', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'fav-orange',
    category: 'fruits-veg',
    title: 'Juicy Orange',
    difficulty: 'beginner',
    iconEmoji: '🍊',
    customVisualHtml: VisualAssets.emoji('🍊', 'Orange', '#FFEDD5'),
    description: 'An orange is round, orange in colour, and full of sweet and tangy juice with lots of Vitamin C.',
    simpleExplanation: 'An orange is round and bursting with juice.',
    audioText: 'This is an orange fruit. It is sweet, juicy, and bright orange.',
    kannadaText: 'ಇದು ಕಿತ್ತಳೆ ಹಣ್ಣು.',
    questions: [
      {
        id: 'q-fav-org',
        prompt: 'Find the ORANGE fruit.',
        audioPrompt: 'Touch the juicy orange.',
        kannadaPrompt: 'ಕಿತ್ತಳೆ ಹಣ್ಣನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Tomato 🍅', isCorrect: false },
          { text: 'Orange 🍊', isCorrect: true },
          { text: 'Banana 🍌', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'fav-mango',
    category: 'fruits-veg',
    title: 'Golden Mango',
    difficulty: 'beginner',
    iconEmoji: '🥭',
    customVisualHtml: VisualAssets.emoji('🥭', 'Mango', '#FEF08A'),
    description: 'Mango is loved as the King of Fruits! In summer, ripe golden mangoes are super delicious.',
    simpleExplanation: 'Sweet yellow mango is the king of fruits.',
    audioText: 'This is a mango. Ripe mangoes are sweet and delicious.',
    kannadaText: 'ಇದು ಮಾವಿನ ಹಣ್ಣು. ಹಣ್ಣುಗಳ ರಾಜ.',
    questions: [
      {
        id: 'q-fav-mng',
        prompt: 'Which is the MANGO? 🥭',
        audioPrompt: 'Touch the golden mango.',
        kannadaPrompt: 'ಮಾವಿನ ಹಣ್ಣನ್ನು ಮುಟ್ಟಿ.',
        options: [
          { text: 'Mango 🥭', isCorrect: true },
          { text: 'Carrot 🥕', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'fav-carrot',
    category: 'fruits-veg',
    title: 'Crunchy Carrot',
    difficulty: 'beginner',
    iconEmoji: '🥕',
    customVisualHtml: VisualAssets.emoji('🥕', 'Carrot', '#FFEDD5'),
    description: 'Carrots are orange vegetables that grow under the ground. Rabbits love them and they help our eyesight!',
    simpleExplanation: 'Carrots are crunchy orange vegetables.',
    audioText: 'This is a carrot. Carrots are crunchy vegetables that keep your eyes bright and healthy.',
    kannadaText: 'ಇದು ಕ್ಯಾರೆಟ್ ತರಕಾರಿ.',
    questions: [
      {
        id: 'q-fav-crt',
        prompt: 'Which orange vegetable do bunnies love? 🐰',
        audioPrompt: 'Find the crunchy carrot.',
        kannadaPrompt: 'ಮೊಲಕ್ಕೆ ಇಷ್ಟವಾಗುವ ಕ್ಯಾರೆಟ್ ಯಾವುದು?',
        options: [
          { text: 'Apple 🍎', isCorrect: false },
          { text: 'Carrot 🥕', isCorrect: true },
          { text: 'Banana 🍌', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'fav-tomato',
    category: 'fruits-veg',
    title: 'Red Tomato',
    difficulty: 'beginner',
    iconEmoji: '🍅',
    customVisualHtml: VisualAssets.emoji('🍅', 'Tomato', '#FEE2E2'),
    description: 'Tomatoes are round, red, and juicy. They are used in yummy soups, sauces, and salads.',
    simpleExplanation: 'A tomato is round, soft, and red.',
    audioText: 'This is a red tomato. Tomatoes make delicious soups and salads.',
    kannadaText: 'ಇದು ಟೊಮೆಟೊ.',
    questions: [
      {
        id: 'q-fav-tom',
        prompt: 'Find the red TOMATO.',
        audioPrompt: 'Touch the tomato.',
        kannadaPrompt: 'ಟೊಮೆಟೊವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Tomato 🍅', isCorrect: true },
          { text: 'Mango 🥭', isCorrect: false },
          { text: 'Carrot 🥕', isCorrect: false }
        ]
      }
    ]
  },

  // --- EMOTIONS ---
  {
    id: 'emo-happy',
    category: 'emotions',
    title: 'Feeling Happy',
    difficulty: 'beginner',
    iconEmoji: '😊',
    customVisualHtml: VisualAssets.emoji('😊', 'Happy Face', '#FEF9C3'),
    description: 'When we are happy, we smile, laugh, clap our hands, and feel warm inside!',
    simpleExplanation: 'Happy means smiling and feeling joyful.',
    audioText: 'This is happy! When you feel good inside, your face smiles brightly.',
    kannadaText: 'ಇದು ಸಂತೋಷ. ಮುಖದಲ್ಲಿ ನಗು ಇರುತ್ತದೆ.',
    questions: [
      {
        id: 'q-emo-hap',
        prompt: 'Which face shows HAPPY? 😊',
        audioPrompt: 'Touch the smiling happy face.',
        kannadaPrompt: 'ಸಂತೋಷದ ಮುಖವನ್ನು ಮುಟ್ಟಿ.',
        options: [
          { text: 'Happy 😊', isCorrect: true },
          { text: 'Sad 😢', isCorrect: false },
          { text: 'Angry 😠', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'emo-sad',
    category: 'emotions',
    title: 'Feeling Sad',
    difficulty: 'beginner',
    iconEmoji: '😢',
    customVisualHtml: VisualAssets.emoji('😢', 'Sad Face', '#DBEAFE'),
    description: 'Sometimes we feel sad. A warm hug from family, slow breathing, or talking helps us feel better.',
    simpleExplanation: 'It is okay to feel sad. A hug makes us feel better.',
    audioText: 'This is sad. Everyone feels sad sometimes. Remember, your friends and teachers care about you.',
    kannadaText: 'ಇದು ದುಃಖ. ನಾವು ಬೇಸರಗೊಂಡಾಗ ಅಳು ಬರುತ್ತದೆ.',
    questions: [
      {
        id: 'q-emo-sad',
        prompt: 'Which face shows SAD? 😢',
        audioPrompt: 'Touch the sad face.',
        kannadaPrompt: 'ದುಃಖದ ಮುಖವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Happy 😊', isCorrect: false },
          { text: 'Sad 😢', isCorrect: true },
          { text: 'Excited 🤩', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'emo-angry',
    category: 'emotions',
    title: 'Feeling Angry',
    difficulty: 'beginner',
    iconEmoji: '😠',
    customVisualHtml: VisualAssets.emoji('😠', 'Angry Face', '#FEE2E2'),
    description: 'When things feel unfair, we might feel angry. We can stop, take 3 deep breaths, and count to five.',
    simpleExplanation: 'When angry, take deep breaths to cool down.',
    audioText: 'This is angry. When feeling angry, take a deep breath in, and blow it gently out.',
    kannadaText: 'ಇದು ಕೋಪ. ದೀರ್ಘವಾಗಿ ಉಸಿರಾಡಿ ಶಾಂತರಾಗಿ.',
    questions: [
      {
        id: 'q-emo-ang',
        prompt: 'Which face looks ANGRY? 😠',
        audioPrompt: 'Touch the angry face.',
        kannadaPrompt: 'ಕೋಪದ ಮುಖವನ್ನು ಗುರುತಿಸಿ.',
        options: [
          { text: 'Angry 😠', isCorrect: true },
          { text: 'Calm 😌', isCorrect: false },
          { text: 'Happy 😊', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'emo-scared',
    category: 'emotions',
    title: 'Feeling Scared',
    difficulty: 'beginner',
    iconEmoji: '😨',
    customVisualHtml: VisualAssets.emoji('😨', 'Scared Face', '#EDE9FE'),
    description: 'A loud thunder sound might make us feel scared. We can hold a caregiver’s hand to feel safe.',
    simpleExplanation: 'Scared means needing safety. Hold a trusted hand.',
    audioText: 'This is scared. If you are ever scared, ask a teacher or parent for help.',
    kannadaText: 'ಇದು ಭಯ. ಹೆದರಿಕೆಯಾದಾಗ ಹಿರಿಯರ ಸಹಾಯ ಕೇಳಿ.',
    questions: [
      {
        id: 'q-emo-scr',
        prompt: 'What should we do if we feel scared?',
        audioPrompt: 'What should you do when you feel scared?',
        kannadaPrompt: 'ಭಯವಾದಾಗ ಏನು ಮಾಡಬೇಕು?',
        options: [
          { text: 'Ask teacher or parent for a hug 🫂', isCorrect: true },
          { text: 'Run away alone 🏃', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'emo-excited',
    category: 'emotions',
    title: 'Feeling Excited',
    difficulty: 'beginner',
    iconEmoji: '🤩',
    customVisualHtml: VisualAssets.emoji('🤩', 'Excited Face', '#FEF9C3'),
    description: 'When something wonderful is going to happen, like a picnic or birthday, we feel super excited!',
    simpleExplanation: 'Excited means jumpy and joyful!',
    audioText: 'This is excited! You have lots of happy energy to jump and play.',
    kannadaText: 'ಇದು ಅತ್ಯುತ್ಸಾಹ ಅಥವಾ ಸಂತಸ.',
    questions: [
      {
        id: 'q-emo-exc',
        prompt: 'Find the EXCITED face! 🤩',
        audioPrompt: 'Touch the excited face with starry eyes.',
        kannadaPrompt: 'ಉತ್ಸಾಹದ ಮುಖವನ್ನು ಮುಟ್ಟಿ.',
        options: [
          { text: 'Excited 🤩', isCorrect: true },
          { text: 'Sad 😢', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'emo-calm',
    category: 'emotions',
    title: 'Feeling Calm',
    difficulty: 'beginner',
    iconEmoji: '😌',
    customVisualHtml: VisualAssets.emoji('😌', 'Calm Face', '#E0F2FE'),
    description: 'Calm is feeling quiet, peaceful, and relaxed, like lying down on a soft pillow listening to soft music.',
    simpleExplanation: 'Calm is quiet and peaceful.',
    audioText: 'This is calm. Your heart is gentle and your body is relaxed.',
    kannadaText: 'ಇದು ಪ್ರಶಾಂತ ಮನಸ್ಥಿತಿ.',
    questions: [
      {
        id: 'q-emo-clm',
        prompt: 'Find the relaxed and CALM face.',
        audioPrompt: 'Touch the calm and peaceful face.',
        kannadaPrompt: 'ಪ್ರಶಾಂತ ಮುಖವನ್ನು ಆರಿಸಿ.',
        options: [
          { text: 'Calm 😌', isCorrect: true },
          { text: 'Angry 😠', isCorrect: false }
        ]
      }
    ]
  }
];

// Daily-Life Skills data with step-by-step sequencing
const DEFAULT_DAILY_SKILLS = [
  {
    id: 'skill-handwashing',
    category: 'hygiene',
    title: 'Washing Hands Clean',
    icon: '🧼',
    description: 'Wash away germs with soap and water to stay healthy and strong.',
    steps: [
      { step: 1, title: 'Wet Hands', desc: 'Turn on water and wet your hands.', emoji: '💧', audio: 'Step one: wet your hands with clean water.' },
      { step: 2, title: 'Apply Soap', desc: 'Pump soap onto your palms.', emoji: '🧼', audio: 'Step two: take some gentle soap.' },
      { step: 3, title: 'Rub & Lather', desc: 'Rub palms, fingers, and back of hands for 20 seconds.', emoji: '🤲', audio: 'Step three: rub your palms and fingers all around.' },
      { step: 4, title: 'Rinse Clean', desc: 'Rinse away all the soap bubbles with water.', emoji: '🚿', audio: 'Step four: rinse with water until clean.' },
      { step: 5, title: 'Dry with Towel', desc: 'Wipe hands dry with a clean dry towel.', emoji: '🧖', audio: 'Step five: dry hands softly with a towel.' }
    ]
  },
  {
    id: 'skill-brushing',
    category: 'hygiene',
    title: 'Brushing Teeth',
    icon: '🪥',
    description: 'Keep your teeth sparkling white and breath fresh morning and night.',
    steps: [
      { step: 1, title: 'Put Toothpaste', desc: 'Put a pea-sized drop of toothpaste on brush.', emoji: '🪥', audio: 'Step one: put a small amount of toothpaste on your toothbrush.' },
      { step: 2, title: 'Brush Gently', desc: 'Brush teeth gently in small circles front and back.', emoji: '🦷', audio: 'Step two: brush your teeth in gentle round circles.' },
      { step: 3, title: 'Rinse Mouth', desc: 'Spit and rinse your mouth with clean water.', emoji: '🥤', audio: 'Step three: rinse your mouth with water and spit it out.' },
      { step: 4, title: 'Wash Brush', desc: 'Wash your toothbrush and keep it upright.', emoji: '✨', audio: 'Step four: wash your toothbrush clean and put it away.' }
    ]
  },
  {
    id: 'skill-morning-routine',
    category: 'routines',
    title: 'Morning Routine',
    icon: '☀️',
    description: 'Start every day happily with good habits.',
    steps: [
      { step: 1, title: 'Wake Up', desc: 'Open eyes, stretch arms, and smile at the new day.', emoji: '⏰', audio: 'Step one: wake up and stretch with a smile.' },
      { step: 2, title: 'Use Washroom', desc: 'Go to toilet and wash your hands.', emoji: '🚽', audio: 'Step two: visit the washroom and wash your hands.' },
      { step: 3, title: 'Brush & Freshen', desc: 'Brush teeth and wash face with water.', emoji: '🪥', audio: 'Step three: brush teeth and wash your face.' },
      { step: 4, title: 'Eat Healthy Breakfast', desc: 'Eat nutritious food and drink milk or water.', emoji: '🥣', audio: 'Step four: enjoy a healthy breakfast.' },
      { step: 5, title: 'Get Dressed', desc: 'Wear fresh clean clothes for the day.', emoji: '👕', audio: 'Step five: wear comfortable clean clothes.' }
    ]
  },
  {
    id: 'skill-traffic-safety',
    category: 'safety',
    title: 'Traffic Signals & Road Safety',
    icon: '🚦',
    description: 'Understand traffic lights and cross roads safely holding an adult hand.',
    steps: [
      { step: 1, title: 'Red Light Means STOP', desc: 'Never cross when light is red or cars are moving.', emoji: '🔴', audio: 'Red light says stop! Stand safely on the footpath.' },
      { step: 2, title: 'Yellow Light Means WAIT', desc: 'Wait patiently and look both ways.', emoji: '🟡', audio: 'Yellow light says get ready and wait.' },
      { step: 3, title: 'Green Light Means GO', desc: 'Walk safely across zebra crossing holding an adult’s hand.', emoji: '🟢', audio: 'Green light says safe to go across the zebra crossing.' }
    ]
  },
  {
    id: 'skill-greetings',
    category: 'communication',
    title: 'Polite Greetings & Asking Help',
    icon: '🤝',
    description: 'Friendly words that make everyone happy and help us express needs.',
    steps: [
      { step: 1, title: 'Say Hello / Namaste', desc: 'Look at the person and say "Hello" with a warm smile.', emoji: '👋', audio: 'Say hello or namaste with a kind smile.' },
      { step: 2, title: 'Say Please', desc: 'When asking for something, say "Please".', emoji: '🙏', audio: 'Say please when asking for something politely.' },
      { step: 3, title: 'Say Thank You', desc: 'When someone helps you or gives something, say "Thank You".', emoji: '💖', audio: 'Say thank you when someone helps you.' },
      { step: 4, title: 'Ask For Help', desc: 'If feeling stuck or uncomfortable, say "Please help me".', emoji: '🆘', audio: 'If you need help, speak to your teacher or family: please help me.' }
    ]
  }
];

// Pre-seeded Achievements
const DEFAULT_ACHIEVEMENTS = [
  { id: 'ach-1', title: 'First Steps', description: 'Completed your very first lesson!', icon: '🌟', points: 10, unlockedAt: '2026-11-01' },
  { id: 'ach-2', title: 'Rainbow Master', description: 'Learned all 8 basic colours', icon: '🎨', points: 25, unlockedAt: '2026-11-02' },
  { id: 'ach-3', title: 'Counting Champion', description: 'Counted numbers 1 to 10 accurately', icon: '🔢', points: 20, unlockedAt: '2026-11-03' },
  { id: 'ach-4', title: 'Animal Friend', description: 'Identified all friendly animals', icon: '🐾', points: 20, unlockedAt: null },
  { id: 'ach-5', title: 'Shape Detective', description: 'Matched all 5 geometric shapes', icon: '🔷', points: 25, unlockedAt: null },
  { id: 'ach-6', title: 'Clean Hands Hero', description: 'Mastered the Handwashing sequence', icon: '🧼', points: 30, unlockedAt: '2026-11-03' },
  { id: 'ach-7', title: 'Super Listener', description: 'Completed 5 Audio Identification questions', icon: '🎧', points: 30, unlockedAt: null },
  { id: 'ach-8', title: 'Perseverance Star', description: 'Tried an activity 3 times until getting it right', icon: '💪', points: 15, unlockedAt: null }
];

// Pre-seeded Activity Results for analytics visualization
const DEFAULT_RESULTS = [
  {
    id: 'res-1',
    studentId: 'student-1',
    lessonId: 'col-red',
    activityId: 'pic-select',
    activityType: 'Picture Selection',
    category: 'colours',
    correctAnswers: 5,
    incorrectAnswers: 1,
    attempts: 6,
    accuracy: 83,
    completionTime: 42,
    completedAt: '2026-11-01T10:15:00Z',
    pointsEarned: 15
  },
  {
    id: 'res-2',
    studentId: 'student-1',
    lessonId: 'col-blue',
    activityId: 'matching',
    activityType: 'Matching Game',
    category: 'colours',
    correctAnswers: 4,
    incorrectAnswers: 0,
    attempts: 4,
    accuracy: 100,
    completionTime: 35,
    completedAt: '2026-11-02T11:20:00Z',
    pointsEarned: 20
  },
  {
    id: 'res-3',
    studentId: 'student-1',
    lessonId: 'num-1-10',
    activityId: 'quiz',
    activityType: 'Multiple Choice Quiz',
    category: 'numbers',
    correctAnswers: 4,
    incorrectAnswers: 2,
    attempts: 6,
    accuracy: 67,
    completionTime: 65,
    completedAt: '2026-11-02T14:10:00Z',
    pointsEarned: 10
  },
  {
    id: 'res-4',
    studentId: 'student-1',
    lessonId: 'shp-circle',
    activityId: 'memory',
    activityType: 'Memory Card Game',
    category: 'shapes',
    correctAnswers: 6,
    incorrectAnswers: 1,
    attempts: 7,
    accuracy: 85,
    completionTime: 50,
    completedAt: '2026-11-03T09:40:00Z',
    pointsEarned: 25
  },
  {
    id: 'res-5',
    studentId: 'student-1',
    lessonId: 'anm-dog',
    activityId: 'audio-id',
    activityType: 'Audio Identification',
    category: 'animals',
    correctAnswers: 3,
    incorrectAnswers: 1,
    attempts: 4,
    accuracy: 75,
    completionTime: 38,
    completedAt: '2026-11-03T10:05:00Z',
    pointsEarned: 15
  }
];

// Pre-seeded Teacher & Caregiver observations
const DEFAULT_TEACHER_REMARKS = [
  {
    id: 'rem-1',
    studentId: 'student-1',
    authorRole: 'teacher',
    authorName: 'Mrs. S. Mehra (Special Educator)',
    date: '2026-11-02',
    note: 'Rahul is showing high engagement with color lessons and audio cues. Needs extra practice on numbers above 10.',
    goalAssigned: 'Complete Numbers 11-20 practice with visual hints enabled.',
    recommendedTopic: 'numbers'
  },
  {
    id: 'rem-2',
    studentId: 'student-1',
    authorRole: 'caregiver',
    authorName: 'Pooja Sharma (Parent)',
    date: '2026-11-03',
    note: 'Rahul happily washed his hands following the 5-step checklist today before lunch! Great confidence boost.',
    goalAssigned: 'Practice Traffic light signals routine.',
    recommendedTopic: 'hygiene'
  }
];

// LocalStorage Manager Object
const StorageManager = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LESSONS)) {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(DEFAULT_LESSONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(DEFAULT_RESULTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DAILY_SKILLS)) {
      localStorage.setItem(STORAGE_KEYS.DAILY_SKILLS, JSON.stringify(DEFAULT_DAILY_SKILLS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TEACHER_REMARKS)) {
      localStorage.setItem(STORAGE_KEYS.TEACHER_REMARKS, JSON.stringify(DEFAULT_TEACHER_REMARKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, 'student-1');
    }
  },

  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.error(`Storage error reading ${key}`, e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Storage error writing ${key}`, e);
      return false;
    }
  },

  // Student Helpers
  getStudents() {
    return this.get(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  },

  getCurrentStudent() {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT) || 'student-1';
    const students = this.getStudents();
    return students.find(s => s.id === id) || students[0];
  },

  setCurrentStudent(studentId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, studentId);
  },

  updateStudent(updatedStudent) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === updatedStudent.id);
    if (idx !== -1) {
      students[idx] = updatedStudent;
      this.set(STORAGE_KEYS.STUDENTS, students);
    }
  },

  addStudent(newStudent) {
    const students = this.getStudents();
    students.push(newStudent);
    this.set(STORAGE_KEYS.STUDENTS, students);
  },

  // Lessons Helpers
  getLessons() {
    return this.get(STORAGE_KEYS.LESSONS, DEFAULT_LESSONS);
  },

  getLessonById(id) {
    const lessons = this.getLessons();
    return lessons.find(l => l.id === id);
  },

  saveLesson(lesson) {
    const lessons = this.getLessons();
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx !== -1) {
      lessons[idx] = lesson;
    } else {
      lessons.push(lesson);
    }
    this.set(STORAGE_KEYS.LESSONS, lessons);
  },

  deleteLesson(id) {
    let lessons = this.getLessons();
    lessons = lessons.filter(l => l.id !== id);
    this.set(STORAGE_KEYS.LESSONS, lessons);
  },

  // Results & Progress Helpers
  getResults(studentId = null) {
    const results = this.get(STORAGE_KEYS.RESULTS, DEFAULT_RESULTS);
    if (studentId) {
      return results.filter(r => r.studentId === studentId);
    }
    return results;
  },

  addResult(result) {
    const results = this.getResults();
    results.push(result);
    this.set(STORAGE_KEYS.RESULTS, results);

    // Also update student total points and stars
    const student = this.getCurrentStudent();
    if (student && result.pointsEarned) {
      student.totalStars = (student.totalStars || 0) + Math.ceil(result.pointsEarned / 5);
      this.updateStudent(student);
    }
  },

  // Achievements
  getAchievements() {
    return this.get(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS);
  },

  unlockAchievement(id) {
    const achievements = this.getAchievements();
    const ach = achievements.find(a => a.id === id);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = new Date().toISOString();
      this.set(STORAGE_KEYS.ACHIEVEMENTS, achievements);
      return ach;
    }
    return null;
  },

  // Daily Skills
  getDailySkills() {
    return this.get(STORAGE_KEYS.DAILY_SKILLS, DEFAULT_DAILY_SKILLS);
  },

  // Teacher Remarks
  getTeacherRemarks(studentId = null) {
    const remarks = this.get(STORAGE_KEYS.TEACHER_REMARKS, DEFAULT_TEACHER_REMARKS);
    if (studentId) {
      return remarks.filter(r => r.studentId === studentId);
    }
    return remarks;
  },

  addTeacherRemark(remark) {
    const remarks = this.getTeacherRemarks();
    remarks.unshift(remark);
    this.set(STORAGE_KEYS.TEACHER_REMARKS, remarks);
  },

  // Reset all data to factory default
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.LESSONS);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.DAILY_SKILLS);
    localStorage.removeItem(STORAGE_KEYS.TEACHER_REMARKS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.ACCESSIBILITY);
    this.init();
  }
};

// Initialize immediately
StorageManager.init();
