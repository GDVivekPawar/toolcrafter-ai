
import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import TemplateGallery from '@/components/TemplateGallery';
import TemplatePreview from '@/components/TemplatePreview';
import HighContrastToggle from '@/components/HighContrastToggle';
import Footer from '@/components/Footer';
import { useTemplateEngine } from '@/hooks/useTemplateEngine';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import EnhancedVoiceInput from '@/components/EnhancedVoiceInput';

const Index = () => {
  const [prompt, setPrompt] = useState('');
  
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

  const { scrollToTool, scrollToSection } = useAutoScroll();

  // Auto-scroll when a tool is ready
  useEffect(() => {
    if (selectedTemplate && !isProcessing) {
      setTimeout(() => {
        scrollToTool(true);
      }, 500);
    }
  }, [selectedTemplate, isProcessing, scrollToTool]);

  const handleVoiceInput = (transcript: string) => {
    setPrompt(transcript);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('show tools') || lowerCommand.includes('what tools')) {
      scrollToSection('Available tools');
      return;
    }
    
    if (lowerCommand.includes('start timer') || lowerCommand.includes('focus timer')) {
      const timerTemplate = getAvailableTemplates().find(t => t.id === 'focus-timer');
      if (timerTemplate) {
        selectTemplate(timerTemplate);
      }
      return;
    }
    
    if (lowerCommand.includes('adhd') || lowerCommand.includes('task manager')) {
      const adhdTemplate = getAvailableTemplates().find(t => t.id === 'adhd-task-manager');
      if (adhdTemplate) {
        selectTemplate(adhdTemplate);
      }
      return;
    }
    
    if (lowerCommand.includes('routine') || lowerCommand.includes('autism')) {
      const routineTemplate = getAvailableTemplates().find(t => t.id === 'autism-routine-tracker');
      if (routineTemplate) {
        selectTemplate(routineTemplate);
      }
      return;
    }

    if (lowerCommand.includes('memory') || lowerCommand.includes('reminder')) {
      const memoryTemplate = getAvailableTemplates().find(t => t.id === 'memory-aid-tool');
      if (memoryTemplate) {
        selectTemplate(memoryTemplate);
      }
      return;
    }

    if (lowerCommand.includes('medication') || lowerCommand.includes('pills')) {
      const medicationTemplate = getAvailableTemplates().find(t => t.id === 'medication-tracker');
      if (medicationTemplate) {
        selectTemplate(medicationTemplate);
      }
      return;
    }

    if (lowerCommand.includes('communication') || lowerCommand.includes('social')) {
      const commTemplate = getAvailableTemplates().find(t => t.id === 'communication-helper');
      if (commTemplate) {
        selectTemplate(commTemplate);
      }
      return;
    }
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
                <span>Voice-First AI Tools</span>
              </div>
              <HighContrastToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <span>Voice-First Accessibility Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Try: 'I need help with ADHD task management', 'medication reminders', 'communication practice', or 'memory assistance'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    aria-label="Describe the accessibility tool you need"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <EnhancedVoiceInput 
                      onTranscript={handleVoiceInput}
                      onCommand={handleVoiceCommand}
                      mode="both"
                      autoStart={true}
                      welcomeMessage="Welcome to AccessiGen! Voice control is active. Say 'help' for commands, or describe what accessibility tool you need. You can also say 'memory help', 'medication tracker', 'communication practice', or 'ADHD support'."
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
                        Try: "ADHD help", "medication tracker", "memory aid", "communication practice", "focus timer"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <TemplateGallery onTemplateSelect={handleTemplateSelect} />

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
                <CardTitle className="text-lg">Popular Accessibility Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3" aria-label="Available tools">
                {availableTemplates.slice(0, 6).map((template) => (
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

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">Voice Commands</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm text-purple-700 space-y-2">
                <ul className="space-y-1">
                  <li>• "ADHD help" - Task management</li>
                  <li>• "Memory aid" - Reminders & notes</li>
                  <li>• "Medication tracker" - Pill reminders</li>
                  <li>• "Communication practice" - Social scripts</li>
                  <li>• "Autism routine" - Structured guidance</li>
                  <li>• "Start timer" - Focus session</li>
                  <li>• "Help" - All commands</li>
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
