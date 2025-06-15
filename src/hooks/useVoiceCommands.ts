
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface VoiceCommand {
  command: string;
  action: () => void;
  confirmation?: string;
}

export const useVoiceCommands = () => {
  const [isListeningForCommands, setIsListeningForCommands] = useState(false);
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const { toast } = useToast();
  const { speak } = useTextToSpeech();

  const parseVoiceCommand = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Find matching command
    const matchedCommand = commands.find(cmd => 
      lowerTranscript.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      if (matchedCommand.confirmation) {
        speak(matchedCommand.confirmation);
      }
      matchedCommand.action();
      return true;
    }

    // Common accessibility commands
    if (lowerTranscript.includes('help') || lowerTranscript.includes('what can i do')) {
      const helpText = commands.length > 0 
        ? `Available commands: ${commands.map(cmd => cmd.command).join(', ')}`
        : 'No commands available right now. Try saying "show me tools" or "start timer"';
      speak(helpText);
      return true;
    }

    if (lowerTranscript.includes('repeat') || lowerTranscript.includes('say again')) {
      speak('I will repeat the last instruction');
      return true;
    }

    return false;
  }, [commands, speak]);

  const registerCommand = useCallback((command: VoiceCommand) => {
    setCommands(prev => [...prev.filter(cmd => cmd.command !== command.command), command]);
  }, []);

  const unregisterCommand = useCallback((commandText: string) => {
    setCommands(prev => prev.filter(cmd => cmd.command !== commandText));
  }, []);

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  return {
    isListeningForCommands,
    setIsListeningForCommands,
    parseVoiceCommand,
    registerCommand,
    unregisterCommand,
    clearCommands,
    commands
  };
};
