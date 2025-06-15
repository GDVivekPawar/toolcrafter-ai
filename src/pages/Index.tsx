
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Accessibility } from "lucide-react";
import TemplateGallery from "@/components/TemplateGallery";
import VoiceInput from "@/components/VoiceInput";
import ToolPreview from "@/components/ToolPreview";
import HighContrastToggle from "@/components/HighContrastToggle";
import Footer from "@/components/Footer";
import { useGemini } from "@/hooks/useGemini";

const Index = () => {
  const [description, setDescription] = useState("");
  const [toolData, setToolData] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const { generateTool, isLoading, error } = useGemini();

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description of the accessibility tool you need.",
        variant: "destructive"
      });
      return;
    }

    const result = await generateTool(description);
    if (result) {
      setToolData(result);
      toast({
        title: "Tool Generated Successfully!",
        description: "Your accessibility tool has been created.",
      });
    } else if (error) {
      toast({
        title: "Generation Failed",
        description: error,
        variant: "destructive"
      });
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setDescription(prev => prev + " " + transcript);
  };

  const handleTemplateSelect = (template: string) => {
    setDescription(template);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with High Contrast Toggle */}
      <div className="flex justify-between items-center p-4">
        <div></div>
        <HighContrastToggle />
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Accessibility className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Accessibility Tool Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create personalized accessibility tools for ADHD, Autism, and other neurodivergent needs. 
            Describe what you need, and AI will generate a custom solution.
          </p>
        </div>

        {/* Template Gallery */}
        <TemplateGallery onTemplateSelect={handleTemplateSelect} />

        {/* Main Input Card */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Describe Your Accessibility Tool</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Textarea
              placeholder="Example: I need a voice-controlled timer that helps me focus with ADHD. It should have visual progress bars, gentle reminder sounds, and break down tasks into smaller chunks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 text-base border-gray-300 focus:border-blue-500"
              aria-label="Describe your accessibility tool needs"
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <VoiceInput 
                onTranscript={handleVoiceTranscript}
                isListening={isListening}
                setIsListening={setIsListening}
              />
              
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !description.trim()}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
                size="lg"
                aria-label="Generate accessibility tool"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Tool
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tool Preview */}
        <ToolPreview toolData={toolData} isLoading={isLoading} />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
