
import React, { useState } from 'react';
import TemplateGallery from '@/components/TemplateGallery';
import TemplatePreview from '@/components/TemplatePreview';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import InputSection from '@/components/InputSection';
import Sidebar from '@/components/Sidebar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useTemplateEngine } from '@/hooks/useTemplateEngine';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';

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

  // Initialize voice guide
  useVoiceGuide();

  const handleVoiceInput = (transcript: string) => {
    setPrompt(transcript);
  };

  const handleTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    // Automatically process the template prompt
    processPrompt(templatePrompt);
  };

  const handleGenerateTool = () => {
    if (prompt.trim()) {
      processPrompt(prompt);
    }
  };

  const availableTemplates = getAvailableTemplates();

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <AnimatedBackground />
      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-8">
            <InputSection
              prompt={prompt}
              setPrompt={setPrompt}
              isProcessing={isProcessing}
              error={error}
              onGenerateTool={handleGenerateTool}
              onVoiceInput={handleVoiceInput}
            />

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
          <Sidebar
            availableTemplates={availableTemplates}
            onSelectTemplate={selectTemplate}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
