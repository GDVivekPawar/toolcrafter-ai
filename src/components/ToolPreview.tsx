import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Volume2, VolumeX, Zap, Github } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import LivePreviewModal from './LivePreviewModal';
import { GeneratedTool } from '@/types/tool';

interface ToolPreviewProps {
  tool: GeneratedTool | null;
  isProcessing: boolean;
}

const ToolPreview: React.FC<ToolPreviewProps> = ({ tool, isProcessing }) => {
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleTextToSpeech = () => {
    if (!tool) return;
    
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToSpeak = `
      Tool: ${tool.toolName}. 
      Features: ${tool.features.join(', ')}. 
      Implementation: ${tool.implementation.join(', ')}. 
      UI Components: ${tool.uiComponents.join(', ')}.
    `;
    
    speak(textToSpeak);
  };

  if (isProcessing) {
    return (
      <Card className="border-green-200 shadow-lg" role="region" aria-label="Tool generation in progress">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <div 
              className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" 
              role="status"
              aria-label="Loading"
            />
            <span>Generating Your Accessibility Tool...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="animate-pulse space-y-3" aria-hidden="true">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <p className="sr-only">Please wait while your accessibility tool is being generated...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tool) {
    return null;
  }

  return (
    <>
      <Card className="border-green-200 shadow-lg" role="region" aria-label="Generated accessibility tool">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" aria-hidden="true" />
              <span>Generated Tool Preview</span>
            </div>
            <Button
              onClick={handleTextToSpeech}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              aria-label={isSpeaking ? "Stop reading tool description" : "Read tool description aloud"}
              title={isSpeaking ? "Stop reading" : "Read aloud"}
            >
              {isSpeaking ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.toolName}</h3>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2" role="list">
              {tool.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700" role="list">
              {tool.implementation.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Suggested UI Components:</h4>
            <div className="flex flex-wrap gap-2" role="list">
              {tool.uiComponents.map((component, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {component}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t" role="group" aria-label="Tool actions">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              aria-label="View live preview of the tool"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
              Live Preview
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              aria-label="Deploy the tool (coming soon)"
              disabled
              title="Deployment feature coming soon"
            >
              <Zap className="h-4 w-4 mr-2" />
              Deploy
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-500 text-gray-600 hover:bg-gray-50"
              aria-label="View on Git (coming soon)"
              disabled
              title="GitHub integration coming soon"
            >
              <Github className="h-4 w-4 mr-2" />
              View on Git
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <LivePreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        tool={tool}
      />
    </>
  );
};

export default ToolPreview;
