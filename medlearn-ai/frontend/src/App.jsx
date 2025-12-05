import { useState } from 'react';
import QueryInput from './components/QueryInput';
import LoadingScreen from './components/LoadingScreen';
import PresentationViewer from './components/PresentationViewer';
import ProgressiveQuiz from './components/ProgressiveQuiz';
import MasteryComplete from './components/MasteryComplete';
import { generateLearning } from './services/api';

export default function App() {
  // Application state
  const [stage, setStage] = useState('input'); // input, loading, learning, quiz, complete
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle query submission from input form
   */
  const handleQuerySubmit = async (query) => {
    setStage('loading');
    setError(null);

    try {
      console.log('🚀 Generating content for:', query);
      const data = await generateLearning(query);
      console.log('✅ Content generated:', data);
      setSessionData(data);
      setStage('learning');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
      setStage('input');
    }
  };

  /**
   * Handle completion of learning slides
   */
  const handleLearningComplete = () => {
    console.log('📚 Learning complete, starting quiz');
    setStage('quiz');
  };

  /**
   * Handle quiz completion
   */
  const handleQuizComplete = (result) => {
    console.log('📝 Quiz result:', result);
    if (result.masteryAchieved) {
      setStage('complete');
    } else if (result.reviewNeeded) {
      setStage('learning');
    }
  };

  /**
   * Reset to start a new learning session
   */
  const handleRestart = () => {
    setSessionData(null);
    setError(null);
    setStage('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer" onClick={handleRestart}>
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <span>🩺</span>
              <span>MedLearn AI</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Adaptive Medical Learning
            </p>
          </div>

          {/* Navigation */}
          {stage !== 'input' && stage !== 'loading' && (
            <button
              onClick={handleRestart}
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <span>←</span>
              <span>New Topic</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="font-medium text-red-800">Something went wrong</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stage: Query Input */}
        {stage === 'input' && (
          <QueryInput onSubmit={handleQuerySubmit} />
        )}

        {/* Stage: Loading */}
        {stage === 'loading' && (
          <LoadingScreen />
        )}

        {/* Stage: Learning (Presentation) */}
        {stage === 'learning' && sessionData && (
          <PresentationViewer
            slides={sessionData.content.slides}
            topic={sessionData.content.topic}
            onComplete={handleLearningComplete}
          />
        )}

        {/* Stage: Quiz */}
        {stage === 'quiz' && sessionData && (
          <ProgressiveQuiz
            quizData={sessionData.quiz_data}
            sessionId={sessionData.session_id}
            onComplete={handleQuizComplete}
          />
        )}

        {/* Stage: Mastery Complete */}
        {stage === 'complete' && sessionData && (
          <MasteryComplete
            topic={sessionData.content.topic}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>Built with 💙 for Medical Students</p>
      </footer>
    </div>
  );
}