
export interface ToolTemplate {
  id: string;
  name: string;
  description: string;
  category: 'timer' | 'planner' | 'sensory' | 'memory' | 'focus' | 'communication' | 'health' | 'routine';
  keywords: string[];
  component: React.ComponentType;
  features: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface TemplateMatch {
  template: ToolTemplate;
  confidence: number;
  reasoning: string;
}
