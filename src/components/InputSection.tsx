
import React from 'react';
import { Send, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface InputSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isProcessing: boolean;
  error: string | null;
  onGenerateTool: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  prompt,
  setPrompt,
  isProcessing,
  error,
  onGenerateTool,
}) => {
  return (
    <Card className="border-gray-700/40 shadow-2xl bg-gray-800/90 backdrop-blur-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 text-white">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <Brain className="h-6 w-6" />
          <span>Tell Us What You Need</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-6">
          <Textarea
            placeholder="Try: 'I need help reading text on my screen' or 'Create a medication reminder system' or 'I want to control my smart home with voice commands'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[140px] text-lg border-gray-600/60 bg-gray-700/50 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400 rounded-xl resize-none text-white placeholder:text-gray-400"
            aria-label="Describe the accessibility tool you need"
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onGenerateTool}
              disabled={isProcessing || !prompt.trim()}
              className="bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 hover:from-blue-600 hover:via-purple-700 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl w-full"
              size="lg"
              aria-label="Find matching accessibility tool"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Creating Your Tool...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-3" />
                  Build My Tool
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-6 bg-red-900/50 backdrop-blur-sm border border-red-700/60 rounded-xl text-red-300">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-2 text-red-400">
                Try describing tools like: "reading assistant", "medication reminder", "communication board", "smart home control"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InputSection;
