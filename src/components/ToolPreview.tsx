
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Share, Code } from 'lucide-react';

interface ToolPreviewProps {
  tool: {
    toolName: string;
    features: string[];
    implementation: string[];
    uiComponents: string[];
  } | null;
  isProcessing: boolean;
}

const ToolPreview: React.FC<ToolPreviewProps> = ({ tool, isProcessing }) => {
  if (isProcessing) {
    return (
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Generating Your Accessibility Tool...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>
    );
  }

  if (!tool) {
    return null;
  }

  return (
    <Card className="border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Generated Tool Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.toolName}</h3>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tool.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {tool.implementation.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Suggested UI Components:</h4>
          <div className="flex flex-wrap gap-2">
            {tool.uiComponents.map((component, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {component}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-6 border-t">
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
      </CardContent>
    </Card>
  );
};

export default ToolPreview;
