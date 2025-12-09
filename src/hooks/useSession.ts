/**
 * Session Hook
 * 
 * React hook for accessing session data and tracking.
 * Provides session ID, metadata, and reset functionality.
 * 
 * @module hooks/useSession
 */

import { useState, useEffect, useCallback } from 'react';
import { getSessionId, resetSessionId, getSessionMetadata } from '@/lib/session';
import { logger, setTraceId } from '@/lib/logger';

interface SessionData {
  sessionId: string;
  startTime: number;
  userAgent: string;
  referrer: string;
}

/**
 * Hook for session management
 * 
 * @returns Session data and control functions
 */
export function useSession() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const metadata = getSessionMetadata();
    setSessionData(metadata);
    
    // Set trace ID for logger correlation
    setTraceId(metadata.sessionId);
    
    logger.info('Session initialized', {
      sessionId: metadata.sessionId,
      referrer: metadata.referrer
    });
  }, []);

  const reset = useCallback(() => {
    const newSessionId = resetSessionId();
    const newMetadata = getSessionMetadata();
    setSessionData(newMetadata);
    setTraceId(newSessionId);
    
    logger.info('Session reset', { sessionId: newSessionId });
    
    return newSessionId;
  }, []);

  return {
    sessionId: sessionData?.sessionId ?? null,
    sessionData,
    isReady: sessionData !== null,
    reset
  };
}

export default useSession;
