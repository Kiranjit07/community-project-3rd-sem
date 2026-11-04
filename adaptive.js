/**
 * Accessible Learning Companion - Personalized Adaptive Learning Engine
 * 
 * Works 100% locally in Vanilla JavaScript without external AI APIs.
 * Tracks student accuracy, attempts, mastery, and adjusts:
 * - Number of answer options (2 options for <50%, 3-4 options for higher)
 * - Visual hints and scaffolding
 * - Topic mastery classification
 * - Automatic recommendation generation with transparent explanations
 */

const AdaptiveEngine = {
  /**
   * Analyzes student history to determine overall metrics & topic categorization
   */
  analyzePerformance(studentId = null) {
    const sId = studentId || (window.StorageManager ? window.StorageManager.getCurrentStudent().id : 'student-1');
    const results = window.StorageManager ? window.StorageManager.getResults(sId) : [];

    if (results.length === 0) {
      return {
        overallAccuracy: 80,
        totalAttempts: 0,
        completedLessonsCount: 0,
        masteredTopics: ['colours'],
        revisionTopics: [],
        currentLevel: 'beginner',
        recommendation: {
          category: 'colours',
          lessonId: 'col-red',
          title: 'Red Colour',
          reason: 'A bright, friendly starting lesson to build confidence and joy in learning.'
        }
      };
    }

    let totalCorrect = 0;
    let totalAttempts = 0;
    const categoryStats = {};

    results.forEach(res => {
      totalCorrect += (res.correctAnswers || 0);
      totalAttempts += (res.attempts || 1);

      const cat = res.category || 'general';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { correct: 0, attempts: 0, count: 0 };
      }
      categoryStats[cat].correct += (res.correctAnswers || 0);
      categoryStats[cat].attempts += (res.attempts || 1);
      categoryStats[cat].count += 1;
    });

    const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 75;

    const masteredTopics = [];
    const revisionTopics = [];

    Object.keys(categoryStats).forEach(cat => {
      const stat = categoryStats[cat];
      const acc = Math.round((stat.correct / stat.attempts) * 100);
      if (acc >= 80 && stat.attempts >= 4) {
        masteredTopics.push(cat);
      } else if (acc < 65 || stat.attempts >= 3 && acc < 70) {
        revisionTopics.push(cat);
      }
    });

    // Determine current level based on performance
    let currentLevel = 'beginner';
    if (overallAccuracy > 85 && masteredTopics.length >= 3) {
      currentLevel = 'advanced';
    } else if (overallAccuracy >= 70 && masteredTopics.length >= 1) {
      currentLevel = 'intermediate';
    }

    // Generate intelligent recommendation with transparent explanation
    const recommendation = this.generateRecommendation(revisionTopics, masteredTopics, currentLevel);

    return {
      overallAccuracy,
      totalAttempts,
      completedLessonsCount: results.length,
      masteredTopics,
      revisionTopics,
      currentLevel,
      recommendation,
      categoryStats
    };
  },

  /**
   * Generates a tailored recommendation based on mastery and needed revision
   */
  generateRecommendation(revisionTopics, masteredTopics, currentLevel) {
    const allLessons = window.StorageManager ? window.StorageManager.getLessons() : [];

    // If there is a revision topic, prioritize gentle revision practice!
    if (revisionTopics.length > 0) {
      const revCat = revisionTopics[0];
      const candidate = allLessons.find(l => l.category === revCat) || allLessons[0];
      return {
        category: revCat,
        lessonId: candidate.id,
        title: candidate.title,
        reason: `Recommended for gentle practice because recent accuracy in ${this.formatCategoryName(revCat)} was lower. Practicing builds confidence!`
      };
    }

    // Otherwise find an unmastered category suited to current level
    const unmastered = allLessons.filter(l => !masteredTopics.includes(l.category));
    if (unmastered.length > 0) {
      const nextLesson = unmastered.find(l => l.difficulty === currentLevel) || unmastered[0];
      return {
        category: nextLesson.category,
        lessonId: nextLesson.id,
        title: nextLesson.title,
        reason: `Recommended because you have mastered your previous concepts with great accuracy! Ready to discover new ${this.formatCategoryName(nextLesson.category)}.`
      };
    }

    // Default friendly fallback
    return {
      category: 'colours',
      lessonId: 'col-red',
      title: 'Red Colour',
      reason: 'Recommended for a joyful refresher lesson with cheerful pictures and stars.'
    };
  },

  formatCategoryName(catKey) {
    const map = {
      'colours': 'Colours',
      'numbers': 'Numbers',
      'shapes': 'Shapes',
      'animals': 'Animals',
      'objects': 'Everyday Objects',
      'fruits-veg': 'Fruits & Vegetables',
      'emotions': 'Emotions',
      'hygiene': 'Personal Hygiene',
      'routines': 'Daily Routines',
      'safety': 'Safety Skills',
      'communication': 'Communication'
    };
    return map[catKey] || catKey;
  },

  /**
   * Filter options dynamically based on student level / accuracy.
   * If student needs help (<50% accuracy or requested hint), reduce options to 2 (1 correct + 1 distractor).
   */
  adaptQuestionOptions(question, accuracy = 75) {
    if (!question || !question.options || question.options.length <= 2) {
      return question ? question.options : [];
    }

    if (accuracy < 50) {
      // Keep correct option and exactly 1 wrong option for maximum emotional safety
      const correctOpt = question.options.find(o => o.isCorrect);
      const wrongOpts = question.options.filter(o => !o.isCorrect);
      const chosenWrong = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
      
      const adapted = [correctOpt, chosenWrong].filter(Boolean);
      // Shuffle two options so correct is not always first
      return adapted.sort(() => Math.random() - 0.5);
    }

    return question.options;
  },

  /**
   * Generates a gentle hint when student requests help or misses an answer
   */
  generateHint(lesson, question) {
    if (!question) return 'Look closely at the pictures. You can do it!';

    const correct = question.options ? question.options.find(o => o.isCorrect) : null;
    if (correct) {
      return `Hint: Look for the option with "${correct.text}"! Milo is cheering for you! 🌟`;
    }

    return lesson ? `Remember: ${lesson.simpleExplanation || lesson.description}` : 'Take your time!';
  }
};

window.AdaptiveEngine = AdaptiveEngine;
