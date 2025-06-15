
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Volume2, VolumeX, Zap, RotateCcw } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ToolTemplate, TemplateMatch } from '@/types/template';

interface TemplatePreviewProps {
  template: ToolTemplate | null;
  match: TemplateMatch | null;
  isProcessing: boolean;
  onReset: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  template, 
  match, 
  isProcessing, 
  onReset 
}) => {
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();
  const [showLivePreview, setShowLivePreview] = useState(false);

  const handleTextToSpeech = () => {
    if (!template) return;
    
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToSpeak = `
      Tool: ${template.name}. 
      Description: ${template.description}. 
      Features: ${template.features.join(', ')}.
      ${match ? `Match confidence: ${Math.round(match.confidence * 100)}%` : ''}
    `;
    
    speak(textToSpeak);
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
    <>
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
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
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
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled
              title="Deployment feature coming soon"
            >
              <Zap className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </div>
        </CardContent>
      </Card>

      {showLivePreview && (
        <Card className="border-purple-200 shadow-lg mt-6">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span>Live Tool</span>
              <Button
                onClick={() => setShowLivePreview(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <template.component />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TemplatePreview;
