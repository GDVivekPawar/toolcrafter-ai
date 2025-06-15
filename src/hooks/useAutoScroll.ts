
import { useEffect } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/hooks/use-toast';

export const useAutoScroll = () => {
  const { speak } = useTextToSpeech();
  const { toast } = useToast();

  const scrollToTool = (announce = true) => {
    // Find the tool preview element
    const toolPreview = document.querySelector('[aria-label="Generated accessibility tool"], [aria-label="Template preview"]');
    
    if (toolPreview) {
      toolPreview.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      if (announce) {
        // Show notification
        toast({
          title: "Tool Ready!",
          description: "Your accessibility tool is ready to use. Scrolling to tool now.",
          duration: 4000,
        });

        // Voice announcement
        setTimeout(() => {
          speak('Your accessibility tool is ready! I\'ve scrolled to show it to you. You can now interact with the tool using voice commands or the interface.');
        }, 1000);
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId) || document.querySelector(`[aria-label="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const announceCurrentScreen = () => {
    const focusedElement = document.activeElement;
    const toolPreview = document.querySelector('[aria-label="Generated accessibility tool"], [aria-label="Template preview"]');
    
    if (toolPreview && toolPreview.contains(focusedElement)) {
      speak('You are currently viewing your accessibility tool. You can interact with it using voice commands or the interface controls.');
    } else {
      speak('You are on the AccessiGen main page. Say "help" for voice commands, or describe what accessibility tool you need.');
    }
  };

  return {
    scrollToTool,
    scrollToSection,
    announceCurrentScreen
  };
};
