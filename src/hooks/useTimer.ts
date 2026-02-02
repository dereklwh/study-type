import { useState, useCallback, useRef, useEffect } from 'react';
import type { TestMode } from '../types';

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: (newDuration?: TestMode) => void;
}

export function useTimer(initialDuration: TestMode, onComplete: () => void): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;

    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stop();
          onCompleteRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stop]);

  const reset = useCallback((newDuration?: TestMode) => {
    stop();
    setTimeLeft(newDuration ?? initialDuration);
  }, [stop, initialDuration]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { timeLeft, isRunning, start, stop, reset };
}
