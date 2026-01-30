import { useEffect, useState, useCallback } from 'react';

interface TimerState {
  remaining: number;
  isRunning: boolean;
}

export const usePollTimer = (duration: number, startTime: number) => {
  const [timer, setTimer] = useState<TimerState>({
    remaining: duration,
    isRunning: true
  });

  useEffect(() => {
    // Calculate initial remaining time based on server time
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, duration - elapsed);

    setTimer({
      remaining,
      isRunning: remaining > 0
    });

    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.remaining <= 1) {
          return { remaining: 0, isRunning: false };
        }
        return { remaining: prev.remaining - 1, isRunning: true };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, startTime]);

  const reset = useCallback((newDuration: number, newStartTime: number) => {
    const elapsed = Math.floor((Date.now() - newStartTime) / 1000);
    const remaining = Math.max(0, newDuration - elapsed);

    setTimer({
      remaining,
      isRunning: remaining > 0
    });
  }, []);

  return { ...timer, reset };
};
