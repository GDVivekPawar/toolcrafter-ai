
import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Zap, Brain, Calendar, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import VoiceInput from '@/components/VoiceInput';
import ToolPreview from '@/components/ToolPreview';
import TemplateGallery from '@/components/TemplateGallery';
import GeminiProcessor from '@/components/GeminiProcessor';

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedTool, setGeneratedTool] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a description of the accessibility tool you need.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // This will be handled by the GeminiProcessor component
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated processing
      toast({
        title: "Tool Generated Successfully!",
        description: "Your accessibility tool has been created.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your tool. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setPrompt(transcript);
  };

  const handleTemplateSelect = (template: string) => {
    setPrompt(template);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AccessiGen</h1>
                <p className="text-sm text-gray-600">AI-Powered Accessibility Tools</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Powered by Google Gemini</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Describe Your Accessibility Need</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Example: Create a voice-controlled daily planner for ADHD that breaks tasks into small steps and provides audio reminders..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    aria-label="Describe the accessibility tool you need"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <VoiceInput 
                      onTranscript={handleVoiceInput}
                      isListening={isListening}
                      setIsListening={setIsListening}
                    />
                    
                    <Button 
                      onClick={handlePromptSubmit}
                      disabled={isProcessing || !prompt.trim()}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-3"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Generate Tool
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Gallery */}
            <TemplateGallery onTemplateSelect={handleTemplateSelect} />

            {/* Generated Tool Preview */}
            {(generatedTool || isProcessing) && (
              <ToolPreview 
                tool={generatedTool} 
                isProcessing={isProcessing}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { icon: Calendar, text: "Daily Planner", color: "blue" },
                  { icon: Timer, text: "Focus Timer", color: "green" },
                  { icon: Brain, text: "Memory Aids", color: "purple" },
                ].map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start border-gray-200 hover:bg-gray-50"
                    onClick={() => handleTemplateSelect(`Create a ${template.text.toLowerCase()} tool for neurodivergent users`)}
                  >
                    <template.icon className={`h-4 w-4 mr-2 text-${template.color}-500`} />
                    {template.text}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-800">Tips for Better Results</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm text-yellow-700 space-y-2">
                <p>• Be specific about your needs and challenges</p>
                <p>• Mention any sensory preferences</p>
                <p>• Include your daily routine context</p>
                <p>• Specify accessibility requirements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Gemini Processor */}
      <GeminiProcessor 
        prompt={prompt}
        isProcessing={isProcessing}
        onToolGenerated={setGeneratedTool}
      />
    </div>
  );
};

export default Index;
