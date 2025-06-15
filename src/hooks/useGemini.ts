
import { useState } from 'react';

interface GeminiResponse {
  toolName: string;
  features: string[];
  implementation: string[];
  uiComponents: string[];
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTool = async (description: string): Promise<GeminiResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const API_KEY = 'AIzaSyDU28Mmx4nJIhv4HHiQl3cZA4ccfGsYP7c';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

      const systemPrompt = `You are an accessibility tool generator. For each request, return a JSON response with:
{
  "toolName": "Short descriptive name",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "implementation": ["Step 1", "Step 2", "Step 3"],
  "uiComponents": ["Component 1", "Component 2"]
}

Focus on ADHD/Autism accessibility needs. Make tools voice-controlled, visual, and executive-function friendly.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser request: ${description}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No response generated from Gemini API');
      }

      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini API');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      return parsedResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate tool';
      setError(errorMessage);
      console.error('Gemini API error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateTool,
    isLoading,
    error
  };
};
