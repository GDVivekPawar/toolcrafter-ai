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

    const systemPrompt = `You are an expert React developer specializing in creating single-file, fully self-contained, and accessible React components for an online tool builder. Your output MUST be a clean, error-free React functional component.

**CRITICAL REQUIREMENTS:**
1.  **COMPONENT DEFINITION:** The component MUST be defined as a const arrow function: \`const ToolComponent = () => { ... };\`
2.  **NO IMPORTS/EXPORTS:** Do NOT include \`import\` or \`export\` statements. All necessary components and hooks are already in scope.
3.  **STRICTLY PASCALCASE ICONS:** All Lucide icons MUST be in PascalCase (e.g., \`Play\`, \`Timer\`, NOT \`play\`, \`timer\`). This is a common source of errors.
4.  **PROPER HOOK USAGE:** Use React hooks (\`useState\`, \`useEffect\`, etc.) directly, without the \`React.\` prefix. Hooks must be called at the top level of the component.
5.  **COMPLETE & VALID JSX:** Ensure all JSX tags are properly closed. Return a single root element, using fragments \`<>\` if necessary.
6.  **TAILWIND CSS FOR STYLING:** Use \`className\` with Tailwind CSS classes for all styling. Do NOT use inline styles.
7.  **JSON OUTPUT:** Your entire response must be a single, valid JSON object, with the component code as a string in the \`componentCode\` field. Do NOT wrap the JSON in markdown fences.

**AVAILABLE SCOPE (DO NOT IMPORT):**

*   **React Hooks:** \`useState\`, \`useEffect\`, \`useCallback\`, \`useMemo\`, \`useRef\`
*   **Custom Hooks:**
    *   \`useAccessibleTimer\`: A hook for creating timers. Returns \`{ minutes, seconds, isActive, isPaused, startTimer, pauseTimer, resetTimer, addMinute, subtractMinute, timeDisplay }\`.
*   **Lucide Icons (PascalCase ONLY):**
    *   Action: \`Play\`, \`Pause\`, \`RotateCcw\`, \`Plus\`, \`Minus\`, \`Check\`, \`X\`, \`Settings\`, \`Search\`, \`Eye\`, \`Zap\`, \`Github\`, \`Code\`
    *   Volume: \`Volume2\`, \`VolumeX\`
    *   Objects: \`Timer\`
    *   Arrows: \`ArrowUp\`, \`ArrowDown\`
*   **Shadcn/UI Components:**
    *   Layout: \`Card\`, \`CardHeader\`, \`CardTitle\`, \`CardContent\`
    *   Form: \`Button\`, \`Input\`, \`Label\`, \`Textarea\`, \`Slider\`, \`Switch\`, \`Select\`, \`Checkbox\`, \`RadioGroup\`
    *   Display: \`Progress\`, \`Avatar\`
*   **Accessibility Utils:**
    *   \`announceToScreenReader(message: string)\`: Announce a message to screen readers.
    *   \`speakText(text: string)\`: Use browser speech synthesis to speak text.

**EXAMPLE OF A PERFECTLY FORMATTED COMPONENT:**
\`\`\`typescript
const ToolComponent = () => {
  const { timeDisplay, isActive, startTimer, pauseTimer, resetTimer } = useAccessibleTimer(1);

  return (
    <Card className="w-full max-w-sm mx-auto p-4 border-2 border-blue-500 rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-2xl font-bold text-gray-800">
          <Timer className="mr-2 h-6 w-6 text-blue-600" />
          Mini Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-6xl font-mono bg-gray-100 rounded-md p-4">{timeDisplay}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={isActive ? pauseTimer : startTimer} size="lg" className="w-28">
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
\`\`\`

**COMMON ERRORS TO AVOID:**
-   Lowercase icon names: \`<play />\` -> **WRONG**. Use \`<Play />\` -> **CORRECT**.
-   Using \`React.useState\`: **WRONG**. Use \`useState\` -> **CORRECT**.
-   Including \`import React from 'react';\`: **WRONG**.
-   Missing \`;\` at the end of the component definition.
-   Invalid JSON format. The entire output must be a single JSON object.

**RESPONSE FORMAT (Strict JSON):**
\`\`\`json
{
  "toolName": "Descriptive Tool Name",
  "features": ["Clear Feature 1", "Clear Feature 2"],
  "implementation": ["Implementation Step 1", "Implementation Step 2"],
  "uiComponents": ["Button", "Card", "Timer"],
  "componentCode": "const ToolComponent = () => { /* ...COMPLETE, CLEAN, ERROR-FREE COMPONENT CODE... */ };"
}
\`\`\`

Now, fulfill the user's request. Focus on creating high-quality, accessible tools for users with ADHD and Autism, such as visual timers, task managers, or sensory regulators. Ensure the code is robust and immediately runnable.`;

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

  // 1. Remove markdown code block fences
  code = code.replace(/^```(typescript|jsx|javascript)?\n/, '').replace(/\n```$/, '');

  // 2. Fix common icon naming issues (case-insensitive)
  const iconReplacements = {
    'play': 'Play', 'pause': 'Pause', 'timer': 'Timer', 'settings': 'Settings',
    'volume2': 'Volume2', 'volumex': 'VolumeX', 'rotateccw': 'RotateCcw',
    'plus': 'Plus', 'minus': 'Minus', 'check': 'Check', 'x': 'X', 'eye': 'Eye',
    'zap': 'Zap', 'github': 'Github', 'search': 'Search', 'code': 'Code',
    'arrow-up': 'ArrowUp', 'arrow-down': 'ArrowDown',
  };

  Object.entries(iconReplacements).forEach(([lowercase, pascalcase]) => {
    // Replace both as component tags and as simple words
    const tagRegex = new RegExp(`(<[/]?)${lowercase}(\\s|>)`, 'gi');
    code = code.replace(tagRegex, `$1${pascalcase}$2`);
  });

  // 3. Remove "React." prefix from hooks
  code = code.replace(/React\.(useState|useEffect|useCallback|useMemo|useRef)/g, '$1');

  // 4. Ensure the component is defined correctly
  if (!code.includes('const ToolComponent =')) {
    // If it's just a function body, wrap it
    if (code.trim().startsWith('() =>')) {
      code = `const ToolComponent = ${code.trim()}`;
    } else if (code.trim().startsWith('<')) {
       code = `const ToolComponent = () => (\n${code.trim()}\n);`;
    }
  }
  
  // Add a semicolon if it's missing at the end of the component definition.
  if (code.includes('const ToolComponent =') && !code.trim().endsWith(';')) {
      code = code.trim() + ';';
  }

  // 5. Remove any import/export statements
  code = code.replace(/import\s+.*\s+from\s+['"].*['"];?/g, '');
  code = code.replace(/export\s+default\s+ToolComponent;?/g, '');


  return {
    ...tool,
    componentCode: code.trim(),
  };
};
