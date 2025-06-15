
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedTool } from '@/types/tool';

export const useGemini = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedTool, setGeneratedTool] = useState<GeneratedTool | null>(null);
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

    const systemPrompt = `You are an expert React developer specializing in accessibility tools. Generate CLEAN, ERROR-FREE, fully functional React components.

CRITICAL REQUIREMENTS:
1. Use ONLY PascalCase for Lucide icons: Play, Pause, Timer, Settings (NOT play, pause, timer, settings)
2. Always use proper React hooks: useState, useEffect with correct syntax
3. Include ALL necessary semicolons and proper bracket matching
4. Use proper TypeScript syntax with correct type annotations
5. Test all logic paths to ensure they work correctly

AVAILABLE IMPORTS (use EXACTLY as shown):
- React hooks: useState, useEffect, useCallback, useMemo
- Lucide icons: Play, Pause, Timer, Settings, Volume2, VolumeX, RotateCcw, Plus, Minus, Check, X
- UI components: Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Progress, Switch
- Use className with Tailwind CSS classes

WORKING CODE EXAMPLE:
\`\`\`typescript
const ToolComponent = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Example Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{count}</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleStart} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
          <Button onClick={handleStop} variant="outline" className="flex-1">
            <Pause className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
\`\`\`

COMMON ERRORS TO AVOID:
- Using lowercase icon names (play instead of Play)
- Missing semicolons at line ends
- Incorrect hook usage or placement
- Missing closing brackets or parentheses
- Invalid TypeScript syntax
- Missing className attributes for styling

RESPONSE FORMAT - Return valid JSON:
{
  "toolName": "Descriptive tool name",
  "features": ["Clear feature 1", "Clear feature 2", "Clear feature 3"],
  "implementation": ["Implementation step 1", "Implementation step 2", "Implementation step 3"],
  "uiComponents": ["Button", "Card", "Timer"],
  "componentCode": "const ToolComponent = () => { /* COMPLETE, CLEAN, ERROR-FREE COMPONENT CODE */ };"
}

Focus on ADHD/Autism accessibility: voice controls, visual feedback, executive function support. Ensure code compiles and runs without errors.`;

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
      let tool = JSON.parse(jsonString) as GeneratedTool;

      // Validate the tool structure
      if (!tool.toolName || !tool.features || !tool.implementation || !tool.uiComponents || !tool.componentCode) {
        throw new Error('Generated tool is missing required fields');
      }

      // Code sanitization and validation
      tool = sanitizeCode(tool);

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

// Code sanitization function to fix common issues
const sanitizeCode = (tool: GeneratedTool): GeneratedTool => {
  let code = tool.componentCode;
  
  // Fix common icon naming issues
  const iconReplacements = {
    '<play ': '<Play ',
    '<pause ': '<Pause ',
    '<timer ': '<Timer ',
    '<settings ': '<Settings ',
    '<volume2 ': '<Volume2 ',
    '<volumex ': '<VolumeX ',
    '<rotateccw ': '<RotateCcw ',
    '<plus ': '<Plus ',
    '<minus ': '<Minus ',
    '<check ': '<Check ',
  };
  
  Object.entries(iconReplacements).forEach(([wrong, correct]) => {
    code = code.replace(new RegExp(wrong, 'gi'), correct);
  });
  
  // Ensure proper component structure
  if (!code.includes('const ToolComponent = ()')) {
    console.warn('Component structure may be incorrect');
  }
  
  // Add missing semicolons at common locations
  code = code.replace(/(\w+\))\s*(\n|\r\n)/g, '$1;$2');
  
  return {
    ...tool,
    componentCode: code
  };
};
