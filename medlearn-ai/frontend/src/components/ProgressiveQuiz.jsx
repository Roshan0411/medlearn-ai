import { useState } from 'react';
import confetti from 'canvas-confetti';
import QuizResult from './QuizResult';
import { evaluateQuiz } from '../services/api';

// Styling for each quiz level
const LEVEL_STYLES = {
  1: {
    name: 'Beginner',
    bg: 'bg-green-50',
    border: 'border-green-400',
    btn: 'bg-green-600 hover:bg-green-700',
    text: 'text-green-700',
    icon: '🌱',
  },
  2: {
    name: 'Intermediate',
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    btn: 'bg-yellow-600 hover:bg-yellow-700',
    text: 'text-yellow-700',
    icon: '📈',
  },
  3: {
    name: 'Advanced',
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    btn: 'bg-orange-600 hover:bg-orange-700',
    text: 'text-orange-700',
    icon: '🔥',
  },
  4: {
    name: 'Expert',
    bg: 'bg-red-50',
    border: 'border-red-400',
    btn: 'bg-red-600 hover:bg-red-700',
    text: 'text-red-700',
    icon: '👑',
  },
};

export default function ProgressiveQuiz({ quizData, sessionId, onComplete }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [levelResult, setLevelResult] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levelData = quizData.levels[currentLevel.toString()];
  const questions = levelData?.questions || [];
  const question = questions[currentQuestion];
  const styles = LEVEL_STYLES[currentLevel];

  const handleAnswerSelect = (option) => {
    if (showResult || isSubmitting) return;
    setSelectedAnswer(option);
  };

  const handleNext = async () => {
    // Save current answer
    const newAnswers = { ...userAnswers, [question.id]: selectedAnswer };
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Submit level for evaluation
      setIsSubmitting(true);
      try {
        const result = await evaluateQuiz(sessionId, currentLevel, newAnswers);
        setLevelResult(result);
        setShowResult(true);

        if (result.passed) {
          // Celebration!
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setCompletedLevels([...completedLevels, currentLevel]);

          if (result.mastery_achieved) {
            // Big celebration for mastery!
            setTimeout(() => {
              confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
              });
              onComplete({ masteryAchieved: true });
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Evaluation error:', error);
        alert('Failed to evaluate quiz. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const proceedToNextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setShowResult(false);
    setLevelResult(null);
  };

  const retryLevel = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setShowResult(false);
    setLevelResult(null);
  };

  // Show result screen after level completion
  if (showResult && levelResult) {
    return (
      <QuizResult
        result={levelResult}
        levelStyle={styles}
        onNextLevel={proceedToNextLevel}
        onRetry={retryLevel}
        onReview={() => onComplete({ reviewNeeded: true })}
      />
    );
  }

  // Loading state
  if (!question) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz Card */}
      <div className={`${styles.bg} rounded-2xl border-2 ${styles.border} p-6`}>
        {/* Level Progress Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          {/* Level Indicators */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  font-bold text-sm transition-all
                  ${
                    level === currentLevel
                      ? `${styles.btn} text-white shadow-lg`
                      : completedLevels.includes(level)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                title={`Level ${level}: ${LEVEL_STYLES[level].name}`}
              >
                {completedLevels.includes(level) ? '✓' : LEVEL_STYLES[level].icon}
              </div>
            ))}
          </div>

          {/* Current Level Label */}
          <div className={`text-sm font-medium ${styles.text}`}>
            Level {currentLevel}: {styles.name}
          </div>
        </div>

        {/* Question Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>
              Pass: {levelData.pass_threshold}/{levelData.total}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                styles.btn.split(' ')[0]
              }`}
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {question.question}
          </h3>
          {question.concept && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>💡</span>
              <span>Concept: {question.concept}</span>
            </p>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswerSelect(key)}
              disabled={isSubmitting}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all
                ${
                  selectedAnswer === key
                    ? `${styles.border} ${styles.bg} ring-2 ring-offset-2 shadow-md`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${
                    selectedAnswer === key
                      ? `${styles.btn} text-white`
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {key}
                </span>
                <span className="text-gray-800 flex-1">{value}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleNext}
          disabled={!selectedAnswer || isSubmitting}
          className={`w-full py-4 ${styles.btn} text-white rounded-xl font-semibold
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            flex items-center justify-center gap-2 shadow-lg`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Evaluating...</span>
            </>
          ) : currentQuestion === questions.length - 1 ? (
            <>
              <span>Submit Level</span>
              <span>✓</span>
            </>
          ) : (
            <>
              <span>Next Question</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}