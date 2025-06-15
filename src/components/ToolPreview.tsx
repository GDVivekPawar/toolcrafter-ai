
import React from 'react';
import { Card, Card-Content, Card-Header, Card-Title } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Share, Code } from 'lucide-react';

interface ToolPreviewProps {
  tool: any;
  isProcessing: boolean;
}

const ToolPreview: React.FC<ToolPreviewProps> = ({ tool, isProcessing }) => {
  if (isProcessing) {
    return (
      <Card className="border-green-200 shadow-lg">
        <Card-Header className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <Card-Title className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Generating Your Accessibility Tool...</span>
          </Card-Title>
        </Card-Header>
        <Card-Content className="p-6">
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </Card-Content>
      </Card>
    );
  }

  // Mock generated tool preview
  const mockTool = {
    title: "ADHD Daily Planner Pro",
    description: "A voice-controlled daily planner designed specifically for ADHD users with task breakdown and audio reminders.",
    features: [
      "Voice-to-text task input",
      "Automatic task breakdown",
      "Customizable audio reminders",
      "Visual progress tracking",
      "Dopamine reward system",
      "Flexible rescheduling"
    ],
    preview: "Interactive daily planner with color-coded tasks and gentle notification sounds"
  };

  return (
    <Card className="border-green-200 shadow-lg">
      <Card-Header className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <Card-Title className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Generated Tool Preview</span>
        </Card-Title>
      </Card-Header>
      <Card-Content className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{mockTool.title}</h3>
          <p className="text-gray-600 mb-4">{mockTool.description}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mockTool.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-2">Tool Preview:</h4>
          <div className="bg-white p-4 rounded border border-gray-200 min-h-[200px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto flex items-center justify-center">
                <span className="text-white text-xl">📅</span>
              </div>
              <p className="text-gray-600">{mockTool.preview}</p>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Eye className="h-4 w-4 mr-2" />
            Live Preview
          </Button>
          <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="border-gray-500 text-gray-600 hover:bg-gray-50">
            <Code className="h-4 w-4 mr-2" />
            View Code
          </Button>
        </div>
      </Card-Content>
    </Card>
  );
};

export default ToolPreview;
