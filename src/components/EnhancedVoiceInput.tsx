
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
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isInitializedRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { speak, isSpeaking, stopSpeaking } = useTextToSpeech();
  const { parseVoiceCommand } = useVoiceCommands();

  // Clear all timeouts
  const clearTimeouts = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = null;
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = (): boolean => {
    if (isInitializedRef.current || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Speech recognition not available or already initialized');
      return isInitializedRef.current;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript.trim();
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
        
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsEnabled(false);
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access and refresh the page to use voice control.",
            variant: "destructive"
          });
          return;
        }
        
        // Auto-restart for recoverable errors
        if (isEnabled && !isSpeaking && (event.error === 'no-speech' || event.error === 'network' || event.error === 'aborted')) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isEnabled && !isListening && !isSpeaking) {
              startListening();
            }
          }, 1500);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // Auto-restart if enabled and not speaking
        if (isEnabled && !isSpeaking) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isEnabled && !isListening && !isSpeaking) {
              startListening();
            }
          }, 800);
        }
      };

      isInitializedRef.current = true;
      console.log('Speech recognition initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      return false;
    }
  };

  // Start listening function
  const startListening = () => {
    if (!isInitializedRef.current || !recognitionRef.current || !isEnabled || isListening || isSpeaking) {
      console.log('Cannot start listening:', { 
        initialized: isInitializedRef.current,
        hasRecognition: !!recognitionRef.current,
        isEnabled,
        isListening,
        isSpeaking
      });
      return;
    }
    
    try {
      recognitionRef.current.start();
      console.log('Starting speech recognition...');
    } catch (error) {
      const err = error as Error;
      console.error('Failed to start recognition:', err.message);
      
      if (err.name === 'InvalidStateError') {
        // Recognition is already running, just update state
        setIsListening(true);
      }
    }
  };

  // Stop listening function
  const stopListening = () => {
    clearTimeouts();
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
    }
  };

  // Toggle voice control
  const toggleVoiceControl = () => {
    if (!isInitializedRef.current) {
      toast({
        title: "Voice Control Not Ready",
        description: "Please wait for voice control to initialize.",
        variant: "destructive"
      });
      return;
    }

    if (isEnabled) {
      // Disable voice control
      setIsEnabled(false);
      stopListening();
      stopSpeaking();
      speak('Voice control disabled');
    } else {
      // Enable voice control
      setIsEnabled(true);
      speak('Voice control enabled. Say help for available commands.');
      
      // Start listening after speech completes
      setTimeout(() => {
        if (!isSpeaking && isEnabled) {
          startListening();
        }
      }, 3000);
    }
  };

  // Announce help
  const announceHelp = () => {
    const helpText = 'Voice commands: Say "help" for instructions, "start timer" for focus session, "memory aid" for reminders, "medication tracker" for pill reminders, "communication practice" for social scripts, "ADHD help" for task management, "autism routine" for structured guidance, or describe what you need help with.';
    speak(helpText);
  };

  // Initialize on component mount
  useEffect(() => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    
    initTimeoutRef.current = setTimeout(() => {
      const initialized = initializeSpeechRecognition();
      
      if (initialized && autoStart && !hasWelcomed) {
        setHasWelcomed(true);
        setIsEnabled(true);
        
        if (welcomeMessage) {
          setTimeout(() => {
            speak(welcomeMessage);
            
            // Start listening after welcome message
            setTimeout(() => {
              if (isEnabled && !isSpeaking) {
                startListening();
              }
            }, 8000); // Wait longer for speech to complete
          }, 1000);
        } else {
          // Start immediately if no welcome message
          setIsEnabled(true);
          setTimeout(() => {
            startListening();
          }, 500);
        }
      }
      
      setIsInitializing(false);
    }, 1000);

    return () => {
      clearTimeouts();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
    };
  }, []);

  return (
    <div className="flex gap-2">
      <Button
        onClick={toggleVoiceControl}
        disabled={isInitializing}
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
        {isInitializing ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-1" />
            Loading
          </>
        ) : isEnabled ? (
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
        disabled={!isInitializedRef.current}
        aria-label="Get voice help"
      >
        <Volume2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default EnhancedVoiceInput;
