import { useEffect, useRef } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export const useVoiceGuide = () => {
  const { speak } = useTextToSpeech();
  const hasWelcomed = useRef(false);

  const scrollToElement = (elementId: string, delay: number = 0) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        // Reduced scroll offset to keep element more visible
        const offsetTop = element.offsetTop - 100;
        window.scrollTo({ 
          top: offsetTop, 
          behavior: 'smooth' 
        });
      }
    }, delay);
  };

  const welcomeUser = () => {
    if (hasWelcomed.current) return;
    hasWelcomed.current = true;

    // Welcome message
    speak("Welcome to ToolCrafter.AI! Tell us what you need by describing the tool in the prompt box.");
    
    // Reduced delay and gentler scroll to input section
    scrollToElement('main-content', 2000);
  };

  const announceToolReady = () => {
    speak("Your tool is ready!");
    scrollToElement('tool-preview', 500);
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
