import React from 'react';

export const useAccessibleTimer = (initialMinutes: number = 25) => {
  const [minutes, setMinutes] = React.useState(initialMinutes);
  const [seconds, setSeconds] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          announceCompletion();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, minutes, seconds]);

  const announceCompletion = () => {
    // Screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = 'Timer completed!';
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    // Audio notification if available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Timer completed!');
      speechSynthesis.speak(utterance);
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setMinutes(initialMinutes);
    setSeconds(0);
  };

  const addMinute = () => {
    setMinutes(prev => prev + 1);
  };

  const subtractMinute = () => {
    if (minutes > 1) {
      setMinutes(prev => prev - 1);
    }
  };

  return {
    minutes,
    seconds,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    addMinute,
    subtractMinute,
    timeDisplay: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  };
};

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.textContent = message;
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};
