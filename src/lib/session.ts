/**
 * Session Tracking Module
 * 
 * Provides session ID generation and management for request correlation.
 * Session IDs persist across page loads within a browser session.
 * 
 * @module lib/session
 */

const SESSION_STORAGE_KEY = 'mindmaker_session_id';

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `sess_${timestamp}_${randomPart}`;
}

/**
 * Get or create the current session ID
 * Persists in sessionStorage to survive page reloads
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // SSR fallback
    return generateSessionId();
  }

  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Reset the session ID (useful for logout or new user flows)
 */
export function resetSessionId(): string {
  const newSessionId = generateSessionId();
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  }
  
  return newSessionId;
}

/**
 * Get session metadata for logging/analytics
 */
export function getSessionMetadata(): {
  sessionId: string;
  startTime: number;
  userAgent: string;
  referrer: string;
} {
  return {
    sessionId: getSessionId(),
    startTime: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    referrer: typeof document !== 'undefined' ? document.referrer : 'unknown'
  };
}
