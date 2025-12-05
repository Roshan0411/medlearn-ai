import { useState } from 'react';

// Suggested medical topics for quick selection
const SUGGESTED_TOPICS = [
  'Myocardial Infarction',
  'Diabetes Mellitus Type 2',
  'Pneumonia',
  'Hypertension',
  'Stroke',
  'Asthma',
  'Heart Failure',
  'COPD',
];

export default function QueryInput({ onSubmit }) {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onSubmit(query.trim());
    setIsSubmitting(false);
  };

  const handleTopicClick = (topic) => {
    setQuery(topic);
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-8 sm:py-12">
      {/* Hero Icon */}
      <div className="text-6xl sm:text-8xl mb-6 animate-bounce-slow">🧠</div>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        What do you want to learn?
      </h2>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-gray-600 mb-8 px-4">
        Enter any medical topic and get an interactive visual lesson with
        progressive quizzes to test your knowledge.
      </p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4 px-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Explain the pathophysiology of heart failure"
            className="w-full px-5 py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl
              focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none
              transition-all placeholder:text-gray-400"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!query.trim() || isSubmitting}
          className="w-full py-4 bg-indigo-600 text-white text-lg font-semibold
            rounded-xl hover:bg-indigo-700 disabled:opacity-50
            disabled:cursor-not-allowed transition-all
            flex items-center justify-center gap-2"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Generating Lesson...</span>
            </>
          ) : (
            <>
              <span>Generate Lesson</span>
              <span>🚀</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested Topics */}
      <div className="mt-10 px-4">
        <p className="text-sm text-gray-500 mb-4">Or try these popular topics:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full
                text-sm hover:bg-indigo-50 hover:border-indigo-300
                transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white/20">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900 mb-1">Visual Slides</h3>
          <p className="text-sm text-gray-600">
            AI-generated diagrams & explanations
          </p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white/20">
          <div className="text-3xl mb-3">🔊</div>
          <h3 className="font-semibold text-gray-900 mb-1">Audio Narration</h3>
          <p className="text-sm text-gray-600">Listen while you learn</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white/20">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="font-semibold text-gray-900 mb-1">Progressive Quiz</h3>
          <p className="text-sm text-gray-600">4 levels from basic to expert</p>
        </div>
      </div>
    </div>
  );
}