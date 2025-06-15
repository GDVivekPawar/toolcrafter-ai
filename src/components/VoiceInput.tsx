
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isListening, setIsListening }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false; // Changed to false to prevent conflicts
      recognitionRef.current.interimResults = false; // Changed to false for cleaner results
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setHasError(false);
        console.log('Voice recognition started');
        // Stop any ongoing speech synthesis to prevent conflicts
        if ('speechSynthesis' in window && speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input received:', transcript);
        onTranscript(transcript);
        setIsListening(false); // Auto-stop after getting result
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setHasError(true);
        setIsListening(false);
        
        // Handle different error types with reduced noise
        if (event.error === 'no-speech') {
          // Don't show toast for no speech - just silently stop
          return;
        }
        
        let errorMessage = "Voice input error occurred.";
        let description = "Please try again.";
        
        switch (event.error) {
          case 'network':
            errorMessage = "Network Error";
            description = "Check your internet connection and try again.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone Access Error";
            description = "Please check your microphone permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone Permission Denied";
            description = "Please allow microphone access to use voice input.";
            break;
          case 'service-not-allowed':
            errorMessage = "Voice Service Unavailable";
            description = "Voice recognition service is not available.";
            break;
        }
        
        toast({
          title: errorMessage,
          description: description,
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onTranscript, setIsListening, toast]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      // Stop any ongoing speech before starting recognition
      if ('speechSynthesis' in window && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      setHasError(false);
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your accessibility tool request now.",
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setHasError(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please type your request instead.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <Button
      onClick={toggleListening}
      variant={isListening ? "destructive" : "outline"}
      className={`px-6 py-3 transition-all duration-300 ${
        isListening 
          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30" 
          : hasError
          ? "border-orange-400 hover:bg-orange-50 text-orange-600"
          : "border-blue-400 hover:bg-blue-950 text-blue-400 hover:text-blue-300"
      }`}
      size="lg"
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
    >
      {hasError ? (
        <>
          <AlertCircle className="h-4 w-4 mr-2" />
          Try Again
        </>
      ) : isListening ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          Stop Listening
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </>
      )}
    </Button>
  );
};

export default VoiceInput;
