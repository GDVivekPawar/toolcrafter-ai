
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGemini = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedTool, setGeneratedTool] = useState(null);
  const { toast } = useToast();

  const generateTool = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a description of the accessibility tool you need.",
        variant: "destructive"
      });
      return;
    }
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please provide your Google Gemini API key to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setGeneratedTool(null);

    const systemPrompt = `You are an accessibility tool generator. For each request, return a JSON response with:
{
  "toolName": "Short descriptive name",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "implementation": ["Step 1", "Step 2", "Step 3"],
  "uiComponents": ["Component 1", "Component 2"]
}

Focus on ADHD/Autism accessibility needs. Make tools voice-controlled, visual, and executive-function friendly.`;

    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Gemini API request failed');
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const tool = JSON.parse(jsonString);

      setGeneratedTool(tool);
      toast({
        title: "Tool Generated Successfully!",
        description: "Your accessibility tool preview is ready.",
      });

    } catch (error: any) {
      console.error('Gemini processing error:', error);
      toast({
        title: "Processing Error",
        description: error.message || "There was an error processing your request. Please check your API key and try again.",
        variant: "destructive"
      });
      setGeneratedTool(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, generatedTool, generateTool };
};
