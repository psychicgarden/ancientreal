import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockMs?: number;
}

interface RateLimitState {
  isBlocked: boolean;
  attemptsRemaining: number;
  timeUntilReset: number;
}

export function useRateLimit(config: RateLimitConfig) {
  const { maxAttempts, windowMs, blockMs = windowMs } = config;
  const [state, setState] = useState<RateLimitState>({
    isBlocked: false,
    attemptsRemaining: maxAttempts,
    timeUntilReset: 0,
  });

  const attemptsRef = useRef<number[]>([]);
  const blockUntilRef = useRef<number>(0);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    // Check if still blocked
    if (blockUntilRef.current > now) {
      const timeUntilReset = blockUntilRef.current - now;
      setState(prev => ({ ...prev, isBlocked: true, timeUntilReset }));
      return false;
    }

    // Remove old attempts outside the window
    attemptsRef.current = attemptsRef.current.filter(
      timestamp => now - timestamp < windowMs
    );

    // Check if we can make another attempt
    if (attemptsRef.current.length >= maxAttempts) {
      blockUntilRef.current = now + blockMs;
      setState({
        isBlocked: true,
        attemptsRemaining: 0,
        timeUntilReset: blockMs,
      });
      return false;
    }

    setState({
      isBlocked: false,
      attemptsRemaining: maxAttempts - attemptsRef.current.length,
      timeUntilReset: 0,
    });
    return true;
  }, [maxAttempts, windowMs, blockMs]);

  const executeWithRateLimit = useCallback(async <T>(
    action: () => Promise<T>
  ): Promise<T | null> => {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    attemptsRef.current.push(Date.now());
    
    try {
      return await action();
    } catch (error) {
      // Don't count failed attempts against rate limit for network errors
      if (error instanceof Error && error.message.includes('network')) {
        attemptsRef.current.pop();
      }
      throw error;
    }
  }, [checkRateLimit]);

  const reset = useCallback(() => {
    attemptsRef.current = [];
    blockUntilRef.current = 0;
    setState({
      isBlocked: false,
      attemptsRemaining: maxAttempts,
      timeUntilReset: 0,
    });
  }, [maxAttempts]);

  return {
    ...state,
    executeWithRateLimit,
    reset,
    checkRateLimit,
  };
}