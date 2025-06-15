
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
    
    // WARNING: For demonstration purposes, the API key is hardcoded below.
    // This is insecure for production applications. It's better to use
    // environment variables, which can be configured in your project settings.
    const apiKey = "AIzaSyDU28Mmx4nJIhv4HHiQl3cZA4ccfGsYP7c";

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
        let errorMessage = 'Failed to generate tool';
        
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your Gemini API key.';
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (response.status >= 500) {
          errorMessage = 'Gemini service is temporarily unavailable. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const textResponse = data.candidates[0].content.parts[0].text;
      
      const jsonString = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const tool = JSON.parse(jsonString);

      // Validate the tool structure
      if (!tool.toolName || !tool.features || !tool.implementation || !tool.uiComponents) {
        throw new Error('Generated tool is missing required fields');
      }

      setGeneratedTool(tool);
      toast({
        title: "Tool Generated Successfully!",
        description: "Your accessibility tool preview is ready.",
      });

    } catch (error: any) {
      console.error('Gemini processing error:', error);
      
      let userMessage = "There was an error processing your request. Please try again.";
      
      if (error.message.includes('JSON')) {
        userMessage = "The AI generated an invalid response. Please try rephrasing your request.";
      } else if (error.message.includes('API key')) {
        userMessage = error.message;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        userMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        userMessage = error.message;
      }
      
      toast({
        title: "Processing Error",
        description: userMessage,
        variant: "destructive"
      });
      setGeneratedTool(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, generatedTool, generateTool };
};
