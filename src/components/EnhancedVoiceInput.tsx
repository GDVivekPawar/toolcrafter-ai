
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
  const [recognitionState, setRecognitionState] = useState<'idle' | 'starting' | 'listening' | 'stopping'>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { speak } = useTextToSpeech();
  const { parseVoiceCommand } = useVoiceCommands();

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
      setRecognitionState('listening');
      setIsListening(true);
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
      setRecognitionState('idle');
      setIsListening(false);
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      // Don't show error toasts for network errors or aborted, just retry
      if (event.error === 'network' || event.error === 'aborted') {
        console.log('Network/abort error, will retry listening...');
        if (isEnabled) {
          restartTimeoutRef.current = setTimeout(() => {
            startListening();
          }, 2000);
        }
        return;
      }
      
      if (event.error === 'no-speech') {
        // Automatically restart listening after no speech
        if (isEnabled) {
          restartTimeoutRef.current = setTimeout(() => {
            startListening();
          }, 1000);
        }
      }
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setRecognitionState('idle');
      setIsListening(false);
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      // Auto-restart if enabled and not manually stopped
      if (isEnabled && recognitionState !== 'stopping') {
        restartTimeoutRef.current = setTimeout(() => {
          if (isEnabled && recognitionState === 'idle') {
            startListening();
          }
        }, 500);
      }
    };

    // Auto-start if enabled
    if (autoStart && isEnabled) {
      setTimeout(() => {
        if (welcomeMessage) {
          speak(welcomeMessage);
        }
        setTimeout(() => {
          if (isEnabled) {
            startListening();
          }
        }, 3000); // Wait for welcome message to finish
      }, 1000);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [onTranscript, onCommand, mode, isEnabled, autoStart, welcomeMessage, parseVoiceCommand, speak]);

  const startListening = () => {
    if (!recognitionRef.current || !isEnabled || recognitionState !== 'idle') {
      console.log('Cannot start listening:', { hasRecognition: !!recognitionRef.current, isEnabled, recognitionState });
      return;
    }
    
    try {
      setRecognitionState('starting');
      recognitionRef.current.start();
      console.log('Starting speech recognition...');
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setRecognitionState('idle');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && recognitionState !== 'idle') {
      setRecognitionState('stopping');
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
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
        if (recognitionState === 'idle') {
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
