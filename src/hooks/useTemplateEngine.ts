
import { useState } from 'react';
import { matchPromptToTemplate, getAllTemplates } from '@/services/templateMatcher';
import { ToolTemplate, TemplateMatch } from '@/types/template';

interface TemplateEngineState {
  selectedTemplate: ToolTemplate | null;
  isProcessing: boolean;
  match: TemplateMatch | null;
  error: string | null;
}

export const useTemplateEngine = () => {
  const [state, setState] = useState<TemplateEngineState>({
    selectedTemplate: null,
    isProcessing: false,
    match: null,
    error: null
  });

  const processPrompt = async (prompt: string): Promise<void> => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Add small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));

      const match = matchPromptToTemplate(prompt);
      
      if (match) {
        setState({
          selectedTemplate: match.template,
          isProcessing: false,
          match,
          error: null
        });
      } else {
        setState({
          selectedTemplate: null,
          isProcessing: false,
          match: null,
          error: 'No matching template found. Please try describing a timer, planner, or sensory tool.'
        });
      }
    } catch (error) {
      setState({
        selectedTemplate: null,
        isProcessing: false,
        match: null,
        error: 'Error processing your request. Please try again.'
      });
    }
  };

  const selectTemplate = (template: ToolTemplate): void => {
    setState({
      selectedTemplate: template,
      isProcessing: false,
      match: { template, confidence: 1, reasoning: 'Directly selected' },
      error: null
    });
  };

  const resetSelection = (): void => {
    setState({
      selectedTemplate: null,
      isProcessing: false,
      match: null,
      error: null
    });
  };

  const getAvailableTemplates = (): ToolTemplate[] => {
    return getAllTemplates();
  };

  return {
    ...state,
    processPrompt,
    selectTemplate,
    resetSelection,
    getAvailableTemplates
  };
};
