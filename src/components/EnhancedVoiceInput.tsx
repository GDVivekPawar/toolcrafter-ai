
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
  autoStart?: boolean;
  welcomeMessage?: string;
}

const EnhancedVoiceInput: React.FC<EnhancedVoiceInputProps> = ({ 
  onTranscript, 
  onCommand,
  mode = 'both',
  autoStart = true,
  welcomeMessage = "Welcome to AccessiGen! Voice control is now active. Say 'help' to hear available commands, or describe what accessibility tool you need."
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(autoStart);
  const [isStarting, setIsStarting] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { speak } = useTextToSpeech();
  const { parseVoiceCommand } = useVoiceCommands();

  // Clear all timeouts
  const clearAllTimeouts = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (welcomeTimeoutRef.current) {
      clearTimeout(welcomeTimeoutRef.current);
      welcomeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setIsStarting(false);
    };

    recognitionRef.current.onresult = (event) => {
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input received:', transcript);
        
        // Try to parse as command first
        if ((mode === 'command' || mode === 'both')) {
          const wasCommand = parseVoiceCommand(transcript);
          if (wasCommand && onCommand) {
            onCommand(transcript);
            return;
          }
        }
        
        // If not a command or in transcript mode, pass to transcript handler
        if ((mode === 'transcript' || mode === 'both') && onTranscript) {
          onTranscript(transcript);
        }
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsStarting(false);
      clearAllTimeouts();
      
      // Only restart for specific errors and if still enabled
      if (isEnabled && (event.error === 'no-speech' || event.error === 'network')) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isEnabled && !isListening && !isStarting) {
            startListening();
          }
        }, 2000);
      }
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      setIsStarting(false);
      
      // Auto-restart only if enabled and not manually stopped
      if (isEnabled && !isStarting) {
        restartTimeoutRef.current = setTimeout(() => {
          if (isEnabled && !isListening && !isStartening) {
            startListening();
          }
        }, 1000);
      }
    };

    // Auto-start with welcome message (only once)
    if (autoStart && isEnabled && !hasWelcomed) {
      setHasWelcomed(true);
      welcomeTimeoutRef.current = setTimeout(() => {
        if (welcomeMessage) {
          speak(welcomeMessage);
        }
        setTimeout(() => {
          if (isEnabled && !isListening && !isStarting) {
            startListening();
          }
        }, 4000);
      }, 1000);
    }

    return () => {
      clearAllTimeouts();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || !isEnabled || isListening || isStarting) {
      console.log('Cannot start listening:', { 
        hasRecognition: !!recognitionRef.current, 
        isEnabled, 
        isListening,
        isStarting 
      });
      return;
    }
    
    try {
      setIsStarting(true);
      recognitionRef.current.start();
      console.log('Starting speech recognition...');
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsStarting(false);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    clearAllTimeouts();
    setIsStarting(false);
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
    }
  };

  const toggleVoiceControl = () => {
    if (isEnabled) {
      setIsEnabled(false);
      stopListening();
      speak('Voice control disabled');
    } else {
      setIsEnabled(true);
      speak('Voice control enabled. Say help for available commands.');
      setTimeout(() => {
        if (!isListening && !isStarting) {
          startListening();
        }
      }, 2000);
    }
  };

  const announceHelp = () => {
    speak('Voice commands: Say "help" for instructions, "start timer" for focus session, "memory aid" for reminders, "medication tracker" for pill reminders, "communication practice" for social scripts, "ADHD help" for task management, "autism routine" for structured guidance, or describe what you need help with.');
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={toggleVoiceControl}
        variant={isEnabled ? (isListening ? "destructive" : "default") : "outline"}
        className={`px-4 py-2 ${
          isEnabled 
            ? isListening
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
              : "bg-blue-500 hover:bg-blue-600 text-white"
            : "border-gray-300 hover:bg-gray-50"
        }`}
        size="sm"
        aria-label={isEnabled ? "Voice control active" : "Voice control disabled"}
      >
        {isEnabled ? (
          isListening ? (
            <>
              <Mic className="h-3 w-3 mr-1" />
              Listening
            </>
          ) : (
            <>
              <Mic className="h-3 w-3 mr-1" />
              Voice On
            </>
          )
        ) : (
          <>
            <MicOff className="h-3 w-3 mr-1" />
            Voice Off
          </>
        )}
      </Button>
      
      <Button
        onClick={announceHelp}
        variant="outline"
        size="sm"
        aria-label="Get voice help"
      >
        <Volume2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default EnhancedVoiceInput;
