
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface EnhancedVoiceInputProps {
  onTranscript?: (transcript: string) => void;
  onCommand?: (command: string) => void;
  mode: 'transcript' | 'command' | 'both';
  continuousListening?: boolean;
  welcomeMessage?: string;
}

const EnhancedVoiceInput: React.FC<EnhancedVoiceInputProps> = ({ 
  onTranscript, 
  onCommand,
  mode = 'both',
  continuousListening = false,
  welcomeMessage = "Voice input ready. Say 'help' for available commands."
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { speak } = useTextToSpeech();
  const { parseVoiceCommand } = useVoiceCommands();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = continuousListening;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          console.log('Voice input received:', finalTranscript);
          
          // Try to parse as command first
          if ((mode === 'command' || mode === 'both')) {
            const wasCommand = parseVoiceCommand(finalTranscript);
            if (wasCommand && onCommand) {
              onCommand(finalTranscript);
              return;
            }
          }
          
          // If not a command or in transcript mode, pass to transcript handler
          if ((mode === 'transcript' || mode === 'both') && onTranscript) {
            onTranscript(finalTranscript);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          speak('I didn\'t hear anything. Please try speaking again.');
        } else {
          toast({
            title: "Voice Input Error",
            description: "There was an issue with voice recognition. Please try again.",
            variant: "destructive"
          });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (continuousListening && isListening) {
          // Restart if in continuous mode
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onCommand, mode, continuousListening, isListening, parseVoiceCommand, speak, toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      speak('Voice input is not supported on this device. Please use the text input instead.');
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please type your request instead.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      speak('Voice input stopped');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      if (welcomeMessage) {
        speak(welcomeMessage);
      }
    }
  };

  const announceHelp = () => {
    speak('Voice commands available: Say help for instructions, start timer to begin focus session, or describe what you need help with.');
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "outline"}
        className={`px-6 py-3 ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
            : "border-blue-200 hover:bg-blue-50"
        }`}
        size="lg"
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-2" />
            Listening...
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Voice Control
          </>
        )}
      </Button>
      
      <Button
        onClick={announceHelp}
        variant="outline"
        size="lg"
        aria-label="Get voice help"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EnhancedVoiceInput;
