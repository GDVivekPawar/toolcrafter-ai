
import { useEffect, useRef } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export const useVoiceGuide = () => {
  const { speak } = useTextToSpeech();
  const hasWelcomed = useRef(false);

  const scrollToElement = (elementId: string, delay: number = 0) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, delay);
  };

  const welcomeUser = () => {
    if (hasWelcomed.current) return;
    hasWelcomed.current = true;

    // Welcome message
    speak("Welcome to ToolCrafter.AI! Tell us what you need by describing the tool in the prompt box.");
    
    // Auto-scroll to the input section after 3 seconds
    scrollToElement('main-content', 3000);
  };

  const announceToolReady = () => {
    speak("Your tool is ready!");
    scrollToElement('tool-preview', 1000);
  };

  useEffect(() => {
    // Welcome user when component mounts
    const timer = setTimeout(welcomeUser, 1000);
    return () => clearTimeout(timer);
  }, []);

  return {
    welcomeUser,
    announceToolReady,
    scrollToElement
  };
};
