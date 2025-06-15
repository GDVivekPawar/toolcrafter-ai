
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Refs for preventing multiple initializations and managing state
  const hasInitializedRef = useRef(false);
  const hasWelcomedRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const { toast } = useToast();
  const { parseVoiceCommand } = useVoiceCommands();

  // Clear all timeouts and cleanup
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up voice input...');
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Cleanup recognition error:', error);
      }
    }
    
    setIsSpeaking(false);
    setIsListening(false);
  }, []);

  // Speech synthesis with proper completion handling
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      // Cancel any ongoing speech
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      console.log('🗣️ Speaking:', text);
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        console.log('🗣️ Speech ended');
        setIsSpeaking(false);
        speechSynthesisRef.current = null;
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('🗣️ Speech error:', error);
        setIsSpeaking(false);
        speechSynthesisRef.current = null;
        resolve();
      };

      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  }, [toast]);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback((): boolean => {
    if (hasInitializedRef.current) {
      console.log('🎤 Speech recognition already initialized');
      return true;
    }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('🎤 Speech recognition not available');
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('🎤 Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript.trim();
          console.log('🎤 Voice input received:', transcript);
          
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
        console.error('🎤 Speech recognition error:', event.error);
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
        
        // Auto-restart for recoverable errors only if enabled and not speaking
        if (isEnabled && !isSpeaking && (event.error === 'no-speech' || event.error === 'network')) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isEnabled && !isListening && !isSpeaking) {
              startListening();
            }
          }, 2000);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🎤 Speech recognition ended');
        setIsListening(false);
        
        // Auto-restart if enabled and not speaking
        if (isEnabled && !isSpeaking) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isEnabled && !isListening && !isSpeaking) {
              startListening();
            }
          }, 1000);
        }
      };

      hasInitializedRef.current = true;
      console.log('🎤 Speech recognition initialized successfully');
      return true;
    } catch (error) {
      console.error('🎤 Failed to initialize speech recognition:', error);
      return false;
    }
  }, [isEnabled, isSpeaking, isListening, mode, onCommand, onTranscript, parseVoiceCommand, toast]);

  // Start listening function
  const startListening = useCallback(() => {
    if (!hasInitializedRef.current || !recognitionRef.current || !isEnabled || isListening || isSpeaking) {
      console.log('🎤 Cannot start listening:', { 
        initialized: hasInitializedRef.current,
        hasRecognition: !!recognitionRef.current,
        isEnabled,
        isListening,
        isSpeaking
      });
      return;
    }
    
    try {
      recognitionRef.current.start();
      console.log('🎤 Starting speech recognition...');
    } catch (error) {
      const err = error as Error;
      console.error('🎤 Failed to start recognition:', err.message);
      
      if (err.name === 'InvalidStateError') {
        // Recognition is already running, just update state
        setIsListening(true);
      }
    }
  }, [isEnabled, isListening, isSpeaking]);

  // Stop listening function
  const stopListening = useCallback(() => {
    console.log('🎤 Stopping speech recognition...');
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('🎤 Error stopping recognition:', error);
      }
    }
  }, []);

  // Toggle voice control
  const toggleVoiceControl = useCallback(async () => {
    if (!hasInitializedRef.current) {
      toast({
        title: "Voice Control Not Ready",
        description: "Please wait for voice control to initialize.",
        variant: "destructive"
      });
      return;
    }

    if (isEnabled) {
      console.log('🔇 Disabling voice control');
      setIsEnabled(false);
      cleanup();
      await speak('Voice control disabled');
    } else {
      console.log('🔊 Enabling voice control');
      setIsEnabled(true);
      await speak('Voice control enabled. Say help for available commands.');
      
      // Start listening after speech completes
      setTimeout(() => {
        if (!isSpeaking) {
          startListening();
        }
      }, 500);
    }
  }, [isEnabled, cleanup, speak, startListening, isSpeaking, toast]);

  // Announce help
  const announceHelp = useCallback(async () => {
    const helpText = 'Voice commands: Say "help" for instructions, "start timer" for focus session, "memory aid" for reminders, "medication tracker" for pill reminders, "communication practice" for social scripts, "ADHD help" for task management, "autism routine" for structured guidance, or describe what you need help with.';
    await speak(helpText);
  }, [speak]);

  // Initialize on component mount - ONLY ONCE
  useEffect(() => {
    if (hasInitializedRef.current || isInitializing) {
      return;
    }

    console.log('🚀 Initializing EnhancedVoiceInput...');
    setIsInitializing(true);
    
    const initializeAsync = async () => {
      const initialized = initializeSpeechRecognition();
      
      if (initialized && autoStart && !hasWelcomedRef.current) {
        hasWelcomedRef.current = true;
        setIsEnabled(true);
        
        if (welcomeMessage) {
          console.log('🎉 Playing welcome message...');
          await speak(welcomeMessage);
          
          // Start listening after welcome message
          setTimeout(() => {
            if (isEnabled && !isSpeaking) {
              startListening();
            }
          }, 500);
        } else {
          // Start immediately if no welcome message
          setTimeout(() => {
            startListening();
          }, 500);
        }
      }
      
      setIsInitializing(false);
    };

    initializeAsync();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Component unmounting, cleaning up...');
      cleanup();
    };
  }, []); // Empty dependency array - initialize only once

  // Effect to handle speech recognition restart when speech ends
  useEffect(() => {
    if (!isSpeaking && isEnabled && !isListening && hasInitializedRef.current) {
      const timeout = setTimeout(() => {
        if (!isSpeaking && isEnabled && !isListening) {
          startListening();
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isSpeaking, isEnabled, isListening, startListening]);

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
        disabled={!hasInitializedRef.current}
        aria-label="Get voice help"
      >
        <Volume2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default EnhancedVoiceInput;
