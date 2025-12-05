export default function QuizResult({
  result,
  levelStyle,
  onNextLevel,
  onRetry,
  onReview,
}) {
  const percentage =
    result.percentage || Math.round((result.score / result.total) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Result Header */}
        <div
          className={`${
            result.passed
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          } text-white px-6 py-8 text-center`}
        >
          <div className="text-6xl mb-4">{result.passed ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2">
            Level {result.level}: {result.passed ? 'Passed!' : 'Keep Trying!'}
          </h2>
          <p className="text-xl opacity-90">
            Score: {result.score}/{result.total} ({percentage}%)
          </p>
          <p className="text-sm opacity-75 mt-2">
            Required: {result.pass_threshold}/{result.total} to pass
          </p>
        </div>

        {/* Results Details */}
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
            <span>📋</span>
            <span>Question Review</span>
          </h3>

          {/* Scrollable Results */}
          <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2">
            {result.results.map((r, idx) => (
              <div
                key={r.question_id}
                className={`p-4 rounded-xl border ${
                  r.is_correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {r.is_correct ? '✅' : '❌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 mb-1">
                      Q{idx + 1}: {r.question}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Your answer:{' '}
                      <span
                        className={`font-medium ${
                          r.is_correct ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {r.user_answer || 'Not answered'}
                      </span>
                      {!r.is_correct && (
                        <>
                          {' '}
                          | Correct:{' '}
                          <span className="font-medium text-green-600">
                            {r.correct_answer}
                          </span>
                        </>
                      )}
                    </p>
                    <div className="text-sm text-gray-700 bg-white/60 p-3 rounded-lg">
                      <span className="font-medium">💡 Explanation: </span>
                      {r.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {result.passed ? (
              !result.mastery_achieved && (
                <button
                  onClick={onNextLevel}
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl
                    hover:bg-indigo-700 font-semibold transition-colors
                    flex items-center justify-center gap-2"
                >
                  <span>Proceed to Level {result.level + 1}</span>
                  <span>→</span>
                </button>
              )
            ) : (
              <>
                <button
                  onClick={onRetry}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl
                    hover:bg-gray-200 font-semibold transition-colors
                    flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  <span>Retry Level</span>
                </button>
                <button
                  onClick={onReview}
                  className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl
                    hover:bg-indigo-700 font-semibold transition-colors
                    flex items-center justify-center gap-2"
                >
                  <span>📖</span>
                  <span>Review Content</span>
                </button>
              </>
            )}
          </div>

          {/* Mastery Achievement */}
          {result.mastery_achieved && (
            <div className="mt-6 text-center p-6 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-xl font-bold text-yellow-800">
                Mastery Achieved!
              </p>
              <p className="text-yellow-700">
                Congratulations! You've completed all 4 levels!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}