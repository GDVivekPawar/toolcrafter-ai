import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Zap, Brain, Calendar, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import VoiceInput from '@/components/VoiceInput';
import ToolPreview from '@/components/ToolPreview';
import TemplateGallery from '@/components/TemplateGallery';
import TemplatePreview from '@/components/TemplatePreview';
import { useGemini } from '@/hooks/useGemini';
import HighContrastToggle from '@/components/HighContrastToggle';
import Footer from '@/components/Footer';
import { useTemplateEngine } from '@/hooks/useTemplateEngine';

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const {
    selectedTemplate,
    isProcessing,
    match,
    error,
    processPrompt,
    selectTemplate,
    resetSelection,
    getAvailableTemplates
  } = useTemplateEngine();

  const handleVoiceInput = (transcript: string) => {
    setPrompt(transcript);
  };

  const handleTemplateSelect = (template: string) => {
    setPrompt(template);
  };

  const handleGenerateTool = () => {
    if (prompt.trim()) {
      processPrompt(prompt);
    }
  };

  const availableTemplates = getAvailableTemplates();

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
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Powered by Google Gemini</span>
              </div>
              <HighContrastToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skip link for keyboard navigation */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="main-content">
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
                    placeholder="Example: I need a timer for focus sessions, or help me plan my daily tasks..."
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
                      onClick={handleGenerateTool}
                      disabled={isProcessing || !prompt.trim()}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-3"
                      size="lg"
                      aria-label="Find matching accessibility tool"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Finding Tool...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Find My Tool
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <p>{error}</p>
                      <p className="text-sm mt-2">
                        Try keywords like: "timer", "planner", "daily tasks", "focus", "breathing", "sensory break"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Template Gallery */}
            <TemplateGallery onTemplateSelect={handleTemplateSelect} />

            {/* Template Preview */}
            {(selectedTemplate || isProcessing) && (
              <TemplatePreview 
                template={selectedTemplate}
                match={match}
                isProcessing={isProcessing}
                onReset={resetSelection}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Available Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {availableTemplates.slice(0, 3).map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="w-full justify-start border-gray-200 hover:bg-gray-50 h-auto py-3"
                    onClick={() => selectTemplate(template)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-800">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm text-yellow-700 space-y-2">
                <ul className="space-y-1">
                  <li>• Describe what you need in simple terms</li>
                  <li>• We'll match you with the perfect tool</li>
                  <li>• Use it immediately - no setup required</li>
                  <li>• All tools are fully accessible</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
