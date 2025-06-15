
import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

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

// lucide-react has a default export that we don't need in the scope.
const { default: _, ...icons } = LucideIcons;

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This scope provides the dependencies for the dynamically generated code.
    const scope = {
      ...ReactScope,
      ...icons,
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
      setError(e.message);
      setComponent(null);
    }
  }, [code]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <h2 className="font-bold">Compilation Error</h2>
        <p>There was an error compiling the generated code.</p>
        <pre className="mt-2 text-sm bg-red-50 p-2 rounded">{error}</pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {Component ? <Component /> : <p>Loading component...</p>}
    </ErrorBoundary>
  );
};

export default DynamicComponentRenderer;
