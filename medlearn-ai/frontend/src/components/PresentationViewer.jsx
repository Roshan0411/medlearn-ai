import { useState, useRef, useEffect } from 'react';

export default function PresentationViewer({ slides, topic, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const audioRef = useRef(null);

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  // Reset states when slide changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentSlide]);

  // Auto-play audio when slide changes
  useEffect(() => {
    if (audioRef.current && slide.audio_url) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {
        // Autoplay blocked - that's okay, user can click play
        console.log('Autoplay blocked');
      });
    }
  }, [currentSlide, slide.audio_url]);

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleSlideSelect = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentSlide(index);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Topic Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{topic}</h2>
        <p className="text-gray-500 mt-1">Interactive Learning Module</p>
      </div>

      {/* Slide Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideSelect(index)}
            className={`h-3 rounded-full transition-all duration-300
              ${
                index === currentSlide
                  ? 'bg-indigo-600 w-8'
                  : index < currentSlide
                  ? 'bg-green-500 w-3'
                  : 'bg-gray-300 w-3 hover:bg-gray-400'
              }`}
            title={`Slide ${index + 1}: ${slides[index].title}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <span className="font-medium text-indigo-600">{slide.title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Slide Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h3 className="text-xl sm:text-2xl font-bold">{slide.title}</h3>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 min-h-[200px] sm:min-h-[280px]">
          {/* Loading Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-2">🎨</div>
                <p className="text-gray-500 text-sm">Loading image...</p>
              </div>
            </div>
          )}

          {/* Image */}
          {!imageError ? (
            <img
              src={slide.image_url}
              alt={slide.title}
              className={`w-full h-48 sm:h-64 object-contain rounded-lg transition-opacity duration-500
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl">📊</span>
                <p className="text-indigo-600 font-medium mt-2">{slide.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Key Points */}
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-3 text-gray-900 flex items-center gap-2">
              <span>📌</span>
              <span>Key Points</span>
            </h4>
            <ul className="space-y-3">
              {slide.bullet_points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1 flex-shrink-0">▸</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audio Player */}
          {slide.audio_url && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudio}
                  className="w-14 h-14 bg-indigo-600 text-white rounded-full
                    flex items-center justify-center hover:bg-indigo-700
                    transition-all flex-shrink-0 shadow-lg hover:shadow-xl"
                >
                  <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
                </button>
                <div className="flex-1">
                  <p className="font-medium text-indigo-900">Audio Explanation</p>
                  <p className="text-sm text-indigo-600">
                    {isPlaying ? 'Now playing...' : 'Click to listen'}
                  </p>
                </div>
                <audio
                  ref={audioRef}
                  src={slide.audio_url}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>
          )}

          {/* Narration Transcript (Collapsible) */}
          <details className="bg-gray-50 rounded-xl">
            <summary className="p-4 font-medium text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
              📖 Read Full Transcript
            </summary>
            <div className="px-4 pb-4">
              <p className="text-gray-600 leading-relaxed">{slide.narration}</p>
            </div>
          </details>
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 pb-6 flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-xl
              hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors font-medium flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button
            onClick={handleNext}
            className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl
              hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <span className="hidden sm:inline">
              {isLastSlide ? 'Take Quiz' : 'Next'}
            </span>
            <span className="sm:hidden">{isLastSlide ? 'Quiz' : 'Next'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}