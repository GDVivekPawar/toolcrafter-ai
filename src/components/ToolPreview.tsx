
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { exportToText, exportToPDF } from '@/utils/exportUtils';

interface ToolPreviewProps {
  toolData: {
    toolName: string;
    features: string[];
    implementation: string[];
    uiComponents: string[];
  } | null;
  isLoading: boolean;
}

const ToolPreview: React.FC<ToolPreviewProps> = ({ toolData, isLoading }) => {
  const { speak, stop, isSpeaking } = useTextToSpeech();

  if (isLoading) {
    return (
      <Card className="border-blue-200 shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Generating your accessibility tool...</p>
        </CardContent>
      </Card>
    );
  }

  if (!toolData) {
    return null;
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      const textToSpeak = `Tool: ${toolData.toolName}. Features: ${toolData.features.join(', ')}. Implementation: ${toolData.implementation.join(', ')}. UI Components: ${toolData.uiComponents.join(', ')}.`;
      speak(textToSpeak);
    }
  };

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span>{toolData.toolName}</span>
          <div className="flex space-x-2">
            <Button
              onClick={handleSpeak}
              variant="secondary"
              size="sm"
              aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
              title={isSpeaking ? "Stop reading" : "Read aloud"}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => exportToText(toolData)}
              variant="secondary"
              size="sm"
              aria-label="Export as text file"
              title="Export as text file"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => exportToPDF(toolData)}
              variant="secondary"
              size="sm"
              aria-label="Export as PDF"
              title="Export as PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Features</h3>
          <ul className="space-y-2">
            {toolData.features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Implementation Steps</h3>
          <ol className="space-y-2">
            {toolData.implementation.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">UI Components</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {toolData.uiComponents.map((component, index) => (
              <div
                key={index}
                className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium"
              >
                {component}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolPreview;
