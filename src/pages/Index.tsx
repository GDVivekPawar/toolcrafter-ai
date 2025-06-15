
import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Zap, Brain, Calendar, Timer, Shield, BookOpen, Heart, Home } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AccessiGen
                </h1>
                <p className="text-sm text-gray-600 font-medium">Revolutionary AI-Powered Accessibility</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-600 bg-white/60 rounded-full px-4 py-2 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Powered by Advanced AI</span>
              </div>
              <HighContrastToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Accessibility
              <br />
              <span className="text-4xl md:text-6xl">Reimagined</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover powerful, AI-driven accessibility tools designed for real-world impact. 
              From reading assistance to emergency systems, we're building the future of inclusive technology.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/40 shadow-lg">
              <span className="text-blue-600 font-semibold">✨ AI-Powered</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/40 shadow-lg">
              <span className="text-purple-600 font-semibold">🎯 Real-World Tools</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/40 shadow-lg">
              <span className="text-green-600 font-semibold">♿ Accessibility First</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-white/40 shadow-xl bg-white/90 backdrop-blur-xl overflow-hidden">
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
                    className="min-h-[140px] text-lg border-white/60 bg-white/50 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400 rounded-xl resize-none"
                    aria-label="Describe the accessibility tool you need"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <VoiceInput 
                      onTranscript={handleVoiceInput}
                      isListening={isListening}
                      setIsListening={setIsListening}
                    />
                    
                    <Button 
                      onClick={handleGenerateTool}
                      disabled={isProcessing || !prompt.trim()}
                      className="bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 hover:from-blue-600 hover:via-purple-700 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
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
                    <div className="p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl text-red-700">
                      <p className="font-medium">{error}</p>
                      <p className="text-sm mt-2">
                        Try describing tools like: "reading assistant", "medication reminder", "communication board", "smart home control"
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

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            <Card className="border-white/40 shadow-xl bg-gradient-to-br from-green-50/90 to-blue-50/90 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Featured Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {availableTemplates.slice(0, 3).map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="w-full justify-start border-white/60 bg-white/70 hover:bg-white/90 h-auto py-4 px-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg rounded-xl"
                    onClick={() => selectTemplate(template)}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-sm text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/40 shadow-xl bg-gradient-to-br from-yellow-50/90 to-orange-50/90 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-orange-800 flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Why AccessiGen?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm text-orange-700 space-y-3">
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>AI understands your unique needs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Instantly deployed, ready to use</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Designed by accessibility experts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Works on all devices and browsers</span>
                  </li>
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
