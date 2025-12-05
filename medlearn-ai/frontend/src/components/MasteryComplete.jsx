import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function MasteryComplete({ topic, onRestart }) {
  // Celebration animation on mount
  useEffect(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side confetti
      confetti({
        particleCount: particleCount / 2,
        startVelocity: 30,
        spread: 60,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      });

      // Right side confetti
      confetti({
        particleCount: particleCount / 2,
        startVelocity: 30,
        spread: 60,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-8 sm:py-12">
      {/* Trophy Animation */}
      <div className="text-8xl sm:text-9xl mb-6 animate-bounce">🏆</div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Mastery Achieved!
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-gray-600 mb-8 px-4">
        Congratulations! You've mastered
        <br />
        <span className="font-bold text-indigo-600">{topic}</span>
      </p>

      {/* Level Badges */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-10 px-4">
        {[
          { level: 1, name: 'Beginner', icon: '🌱', color: 'bg-green-100 text-green-700 border-green-300' },
          { level: 2, name: 'Intermediate', icon: '📈', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
          { level: 3, name: 'Advanced', icon: '🔥', color: 'bg-orange-100 text-orange-700 border-orange-300' },
          { level: 4, name: 'Expert', icon: '👑', color: 'bg-red-100 text-red-700 border-red-300' },
        ].map((item) => (
          <div
            key={item.level}
            className={`${item.color} p-3 sm:p-4 rounded-xl border-2`}
          >
            <div className="text-2xl sm:text-3xl mb-1">✅</div>
            <div className="text-xs sm:text-sm font-medium">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 mx-4">
        <h3 className="font-semibold text-gray-900 mb-4">Your Achievement</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600">4/4</div>
            <div className="text-sm text-gray-500">Levels Cleared</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-500">⭐</div>
            <div className="text-sm text-gray-500">Expert Status</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-semibold
            rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Learn Another Topic →
        </button>
      </div>

      {/* Motivational Message */}
      <p className="mt-8 text-gray-500 text-sm px-4">
        🩺 Keep learning to become a medical expert!
      </p>
    </div>
  );
}