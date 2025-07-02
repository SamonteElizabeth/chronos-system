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
    // Request geolocation permission and get current location
    if (navigator.geolocation) {
      // Show geolocation alert
      const userConsent = confirm(
        "This app would like to access your location to track where you're working. This helps with accurate time logging and project management. Do you allow location access?"
      );
      
      if (userConsent) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setActiveTimer({
              taskId,
              startTime: new Date().toISOString(),
              description,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: 'Current Location', // In a real app, you'd reverse geocode this
              },
            });
            alert('Timer started with location tracking enabled!');
          }, 
          (error) => {
            // Handle geolocation error
            console.warn('Geolocation error:', error);
            const fallbackConsent = confirm(
              "Location access was denied or unavailable. Would you like to start the timer without location tracking?"
            );
            
            if (fallbackConsent) {
              setActiveTimer({
                taskId,
                startTime: new Date().toISOString(),
                description,
              });
              alert('Timer started without location tracking.');
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        // User denied location access
        const fallbackConsent = confirm(
          "Location access was denied. Would you like to start the timer without location tracking?"
        );
        
        if (fallbackConsent) {
          setActiveTimer({
            taskId,
            startTime: new Date().toISOString(),
            description,
          });
          alert('Timer started without location tracking.');
        }
      }
    } else {
      // Geolocation not supported
      alert('Geolocation is not supported by this browser. Starting timer without location tracking.');
      setActiveTimer({
        taskId,
        startTime: new Date().toISOString(),
        description,
      });
    }
  };

  const stopTimer = () => {
    if (activeTimer) {
      const hours = elapsedTime / 3600;
      // In a real app, you'd save this to the backend
      console.log('Timer stopped:', {
        taskId: activeTimer.taskId,
        hours: Math.round(hours * 100) / 100,
        description: activeTimer.description,
        location: activeTimer.location,
      });
      
      alert(`Timer stopped! You worked for ${formatTime(elapsedTime)}${activeTimer.location ? ' with location tracking' : ''}.`);
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