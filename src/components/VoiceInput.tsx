
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
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setHasError(false);
        console.log('Voice recognition started');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          console.log('Voice input received:', finalTranscript);
          onTranscript(finalTranscript);
          setRetryCount(0); // Reset retry count on successful recognition
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setHasError(true);
        setIsListening(false);
        
        // Handle different error types
        let errorMessage = "Voice input error occurred.";
        let description = "Please try again.";
        
        switch (event.error) {
          case 'network':
            errorMessage = "Network Error";
            description = "Check your internet connection and try again.";
            break;
          case 'no-speech':
            errorMessage = "No Speech Detected";
            description = "Please speak clearly and try again.";
            return; // Don't show toast for no speech
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
          default:
            errorMessage = "Voice Input Error";
            description = `Error type: ${event.error}. Please try again.`;
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
        
        // Auto-retry for certain errors (max 2 retries)
        if (hasError && retryCount < 2) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            startListening();
          }, 1000);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [onTranscript, setIsListening, toast, hasError, retryCount]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
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
          Retry Voice
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
