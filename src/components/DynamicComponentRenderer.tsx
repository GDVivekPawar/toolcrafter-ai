import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useAccessibleTimer, announceToScreenReader, speakText } from '@/utils/accessibilityUtils';

// Import React hooks and essentials
import * as ReactScope from 'react';

// Import all lucide icons
import * as LucideIcons from 'lucide-react';

// Import common shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface DynamicComponentRendererProps {
  code: string;
}

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate code before execution
    const validationResult = validateCode(code);
    
    if (!validationResult.isValid) {
      setError(validationResult.error);
      setComponent(null);
      return;
    }

    // Enhanced scope with more utilities
    const scope = {
      ...ReactScope,
      ...LucideIcons,
      Button,
      Card, CardContent, CardHeader, CardTitle,
      Input,
      Label,
      Textarea,
      Slider,
      Switch,
      Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
      Checkbox,
      RadioGroup, RadioGroupItem,
      Avatar, AvatarFallback, AvatarImage,
      Progress,
      // Accessibility utilities
      useAccessibleTimer,
      announceToScreenReader,
      speakText,
      // Additional utilities
      console,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      Date,
      Math,
      JSON,
      localStorage: typeof window !== 'undefined' ? window.localStorage : null,
    };

    try {
      const fullCode = `${code}\n\nreturn ToolComponent;`;
      const ComponentFactory = new Function(...Object.keys(scope), fullCode);
      const RenderableComponent = ComponentFactory(...Object.values(scope));

      if (typeof RenderableComponent === 'function') {
        setComponent(() => RenderableComponent);
        setError(null);
      } else {
        throw new Error("Generated code did not return a valid React component.");
      }
    } catch (e: any) {
      console.error("Error creating dynamic component:", e);
      
      // Provide more specific error messages
      let errorMessage = e.message;
      if (e.message.includes('Unexpected token')) {
        errorMessage = `Syntax Error: ${e.message}. Check for missing brackets, quotes, or semicolons.`;
      } else if (e.message.includes('is not defined')) {
        errorMessage = `Reference Error: ${e.message}. Make sure all variables and functions are properly defined.`;
      } else if (e.message.includes('Cannot read properties')) {
        errorMessage = `Type Error: ${e.message}. Check for null or undefined values.`;
      }
      
      setError(errorMessage);
      setComponent(null);
    }
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <h2 className="font-bold">Code Compilation Error</h2>
        <p className="mt-2">The generated code has compilation issues:</p>
        <pre className="mt-2 text-sm bg-red-50 p-2 rounded overflow-auto max-h-40">{error}</pre>
        <div className="mt-3 text-sm">
          <p><strong>Common fixes:</strong></p>
          <ul className="list-disc list-inside mt-1">
            <li>Check icon names are PascalCase (Play, not play)</li>
            <li>Ensure all brackets and parentheses are matched</li>
            <li>Add missing semicolons at line ends</li>
            <li>Verify React hooks are used correctly</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {Component ? <Component /> : <p>Loading component...</p>}
    </ErrorBoundary>
  );
};

// Code validation function
const validateCode = (code: string): { isValid: boolean; error: string } => {
  try {
    // 1. Check for forbidden keywords that indicate incorrect structure
    const forbiddenKeywords = ['import', 'export', 'class '];
    for (const keyword of forbiddenKeywords) {
      if (code.includes(keyword)) {
        return {
          isValid: false,
          error: `The code should not contain '${keyword}' statements. All dependencies are already in scope.`,
        };
      }
    }

    // 2. Check for required component definition
    if (!/const\s+ToolComponent\s*=/.test(code)) {
      return {
        isValid: false,
        error: 'Component must be defined as a constant, like `const ToolComponent = () => ...;`',
      };
    }

    // 3. Check for "React." prefix on hooks
    if (/React\.(useState|useEffect|useCallback|useMemo|useRef)/.test(code)) {
      return {
        isValid: false,
        error: 'Do not prefix hooks with "React.". Use `useState`, `useEffect`, etc. directly.',
      };
    }

    // 4. Check for lowercase icon names
    const lowercaseIconRegex = /<(\/)?(play|pause|timer|settings|volume2|volumex|rotateccw|plus|minus|check|x|eye|zap|github|search|code|arrow-up|arrow-down)[\s>]/;
    const match = code.match(lowercaseIconRegex);
    if (match) {
      const iconName = match[2];
      const pascalCaseName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
      return {
        isValid: false,
        error: `Icon names must be PascalCase. Replace '${iconName}' with '${pascalCaseName}'.`,
      };
    }

    // 5. Check for balanced parentheses and brackets
    const brackets: { [key: string]: string } = { '(': ')', '{': '}', '[': ']' };
    const stack: string[] = [];
    for (const char of code) {
      if (brackets.hasOwnProperty(char)) {
        stack.push(char);
      } else if (Object.values(brackets).includes(char)) {
        const lastOpen = stack.pop();
        if (!lastOpen || brackets[lastOpen] !== char) {
          return { isValid: false, error: `Mismatched brackets or parentheses. Found closing '${char}' without a matching opening bracket.` };
        }
      }
    }
    if (stack.length > 0) {
      return { isValid: false, error: `Mismatched brackets or parentheses. Missing closing bracket for '${stack[stack.length - 1]}'.` };
    }

    return { isValid: true, error: '' };
  } catch (e: any) {
    return {
      isValid: false,
      error: `Validation error: ${e.message}`
    };
  }
};

export default DynamicComponentRenderer;
