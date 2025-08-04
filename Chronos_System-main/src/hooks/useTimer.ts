import { useState, useEffect, useRef } from 'react';
import { ActiveTimer } from '../types';

export const useTimer = () => {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (activeTimer) {
      intervalRef.current = setInterval(() => {
        const start = new Date(activeTimer.startTime).getTime();
        const now = new Date().getTime();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setElapsedTime(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTimer]);

  const startTimer = (taskId: string, description: string = '') => {
    setActiveTimer({
      taskId,
      startTime: new Date().toISOString(),
      description,
    });
  };

  const stopTimer = () => {
    if (activeTimer) {
      const hours = elapsedTime / 3600;
      // In a real app, you'd save this to the backend
      console.log('Timer stopped:', {
        taskId: activeTimer.taskId,
        hours: Math.round(hours * 100) / 100,
        description: activeTimer.description,
      });
      
      alert(`Timer stopped! You worked for ${formatTime(elapsedTime)}.`);
      setActiveTimer(null);
      return hours;
    }
    return 0;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    activeTimer,
    elapsedTime,
    startTimer,
    stopTimer,
    formatTime,
    isActive: !!activeTimer,
  };
};