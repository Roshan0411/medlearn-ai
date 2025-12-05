import { useState, useEffect } from 'react';

// Loading steps with timing
const LOADING_STEPS = [
  { icon: '🔍', text: 'Analyzing medical topic...', delay: 0 },
  { icon: '📚', text: 'Generating educational content...', delay: 3000 },
  { icon: '🎨', text: 'Creating visual diagrams...', delay: 8000 },
  { icon: '🔊', text: 'Generating audio narration...', delay: 15000 },
  { icon: '📝', text: 'Preparing quiz questions...', delay: 25000 },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  // Progress through loading steps
  useEffect(() => {
    const timers = LOADING_STEPS.map((step, index) => {
      return setTimeout(() => {
        setCurrentStep(index);
      }, step.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-12 sm:py-20">
      {/* Animated Icon */}
      <div className="text-6xl sm:text-8xl mb-6 animate-bounce">
        {LOADING_STEPS[currentStep].icon}
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
        Generating Your Lesson{dots}
      </h2>
      <p className="text-gray-500 mb-8">This may take 30-60 seconds</p>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto space-y-3 px-4">
        {LOADING_STEPS.map((step, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500
              ${
                index < currentStep
                  ? 'bg-green-50 border border-green-200'
                  : index === currentStep
                  ? 'bg-white shadow-md border border-indigo-200'
                  : 'bg-gray-50 opacity-40'
              }`}
          >
            <span
              className={`text-2xl ${
                index === currentStep ? 'animate-pulse' : ''
              }`}
            >
              {index < currentStep ? '✅' : step.icon}
            </span>
            <span
              className={`text-sm font-medium ${
                index <= currentStep ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {step.text}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mt-8 px-4">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{
              width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Step {currentStep + 1} of {LOADING_STEPS.length}
        </p>
      </div>

      {/* Tip */}
      <div className="mt-8 text-sm text-gray-500 px-4">
        <p>💡 Tip: Complex topics may take slightly longer to generate</p>
      </div>
    </div>
  );
}