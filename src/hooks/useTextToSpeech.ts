import { useState } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error("Text-to-Speech Not Supported: Your browser doesn't support this feature.");
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error("Speech synthesis error:", event.error);
    };

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stopSpeaking, isSpeaking };
};
