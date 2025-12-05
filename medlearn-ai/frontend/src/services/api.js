/**
 * API Service for MedLearn AI
 * Handles all communication with the backend
 */

// Base URL - empty for proxy, or set full URL for production
const API_BASE = '';

/**
 * Generate learning content for a medical topic
 * @param {string} query - The medical topic to learn about
 * @returns {Promise<Object>} Session data with slides and quiz
 */
export async function generateLearning(query) {
  const response = await fetch(`${API_BASE}/api/learn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to generate learning content');
  }

  return response.json();
}

/**
 * Evaluate quiz answers for a specific level
 * @param {string} sessionId - The session ID
 * @param {number} level - Quiz level (1-4)
 * @param {Object} userAnswers - User's answers {questionId: "A"|"B"|"C"|"D"}
 * @returns {Promise<Object>} Evaluation results
 */
export async function evaluateQuiz(sessionId, level, userAnswers) {
  const response = await fetch(`${API_BASE}/api/quiz/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      level: level,
      user_answers: userAnswers,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to evaluate quiz');
  }

  return response.json();
}

/**
 * Get session data by ID
 * @param {string} sessionId - The session ID
 * @returns {Promise<Object>} Session data
 */
export async function getSession(sessionId) {
  const response = await fetch(`${API_BASE}/api/session/${sessionId}`);

  if (!response.ok) {
    throw new Error('Session not found');
  }

  return response.json();
}

/**
 * Test API connectivity
 * @returns {Promise<Object>} API status
 */
export async function testApi() {
  const response = await fetch(`${API_BASE}/api/test`);
  return response.json();
}