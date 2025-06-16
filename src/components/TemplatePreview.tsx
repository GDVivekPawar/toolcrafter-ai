
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { ToolTemplate, TemplateMatch } from '@/types/template';

interface TemplatePreviewProps {
  template: ToolTemplate | null;
  match: TemplateMatch | null;
  isProcessing: boolean;
  onReset: () => void;
}

const getHowToUseText = (templateId: string | undefined): string => {
  if (!templateId) return "No instructions available for this tool.";
  switch (templateId) {
    case 'calculator':
      return "To use the Calculator, click the number buttons to enter numbers. Use the operation buttons plus, minus, multiply, and divide to perform calculations. Press equals to see the result. The Clear button, marked C, will reset the calculator. The display shows your current number or result.";
    case 'daily-planner':
      return "To use the Daily Planner, type a task in the input box. You can also add a time estimate. Click 'Add Task' to add it to your list. Check the box next to a task to mark it as complete, and use the trash icon to delete it. The progress bar shows how many tasks you've completed.";
    case 'focus-timer':
      return "To use the Focus Timer, first set your desired work duration using the plus and minus one minute buttons. When you are ready, press Start. The timer will count down. You can pause and resume the timer at any time. Press Reset to start over with the default 25 minutes.";
    case 'medication-reminder':
      return "To use the Medication Reminder, add a new medication by typing its name, selecting a time, and clicking 'Add Reminder'. Your reminders will appear in the list. When you take your medication, click the 'Take' button to mark it as complete. The button will change to 'Taken'. You can click it again to undo.";
    case 'environmental-control':
      return "With the Environmental Control Hub, you can manage your surroundings. Use the large buttons to turn lights, the TV, and the security system on or off. Adjust the temperature, brightness, and audio volume using the sliders.";
    case 'sensory-break':
      return "Welcome to your Sensory Break. First, choose an activity like '4-7-8 Breathing' or 'Visual Calm'. If you select the breathing exercise, follow the on-screen prompts to inhale, hold, and exhale. For other activities, follow the simple instructions displayed. You can stop or go back at any time.";
    case 'memory-palace':
      return "The Memory Palace helps you follow your daily routine. It shows you one step at a time, like 'Wake Up' or 'Brush Teeth'. Once you've done a step, click 'Mark Complete' to move to the next one. You can also listen to an audio hint for each step. If you need to start over, just press 'Reset Progress'.";
    case 'reading-assistant':
      return "To use the Reading Assistant, paste or type your text into the box. You can change the font size, line spacing, and color filter to make it easier to read. Use the 'Start Reading' button to have the text read aloud with highlighting. You can also switch to a dyslexia-friendly font.";
    case 'communication-board':
      return "The Communication Board helps you express yourself. Simply click on the pictures or phrases that represent what you want to say. The tool will speak your selection aloud.";
    case 'seizure-alert':
      return "The Seizure Alert tool is for your safety. If you feel a seizure coming on, or if you need help, press the large 'Send Alert' button. This will immediately notify your pre-selected contacts or emergency services.";
    default:
      return "This is an interactive tool. Follow the on-screen instructions to use its features.";
  }
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  template, 
  match, 
  isProcessing, 
  onReset 
}) => {
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();
  const { announceToolReady, scrollToElement } = useVoiceGuide({ disableWelcome: true });
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [hasAnnouncedReady, setHasAnnouncedReady] = useState(false);
  const [speakingSource, setSpeakingSource] = useState<null | 'description' | 'livetool'>(null);

  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingSource(null);
    }
  }, [isSpeaking]);

  // Announce when tool is ready
  useEffect(() => {
    if (template && !isProcessing && !hasAnnouncedReady) {
      setHasAnnouncedReady(true);
      announceToolReady();
    }
  }, [template, isProcessing, hasAnnouncedReady, announceToolReady]);

  // Reset announcement flag when template changes
  useEffect(() => {
    setHasAnnouncedReady(false);
  }, [template?.id]);

  const handleTextToSpeech = () => {
    if (!template) return;
    
    if (speakingSource === 'description') {
      stopSpeaking();
    } else {
      const textToSpeak = `
        Tool: ${template.name}. 
        Description: ${template.description}. 
        Features: ${template.features.join(', ')}.
        ${match ? `Match confidence: ${Math.round(match.confidence * 100)}%` : ''}
      `;
      speak(textToSpeak);
      setSpeakingSource('description');
    }
  };

  const handleLiveToolNarration = () => {
    if (!template) return;
    
    if (speakingSource === 'livetool') {
        stopSpeaking();
    } else {
        const textToSpeak = getHowToUseText(template.id);
        speak(textToSpeak);
        setSpeakingSource('livetool');
        scrollToElement('live-tool-preview', 200);
    }
  };

  if (isProcessing) {
    return (
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Finding Your Perfect Tool...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!template) return null;

  return (
    <div id="tool-preview">
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Your Accessibility Tool</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleTextToSpeech}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {speakingSource === 'description' ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                onClick={onReset}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4">{template.description}</p>
            
            {match && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Match Confidence:</strong> {Math.round(match.confidence * 100)}%
                </p>
                <p className="text-sm text-blue-700 mt-1">{match.reasoning}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {template.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setShowLivePreview(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Use This Tool
            </Button>
          </div>
        </CardContent>
      </Card>

      {showLivePreview && (
        <div id="live-tool-preview" className="mt-6">
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <span>Live Tool</span>
                <div className="flex items-center space-x-2">
                  <Button
                      onClick={handleLiveToolNarration}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      aria-label={speakingSource === 'livetool' ? "Stop narrator" : "Start narrator for live tool"}
                  >
                      {speakingSource === 'livetool' ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setShowLivePreview(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <template.component />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;
