
import { ToolTemplate, TemplateMatch } from '@/types/template';
import FocusTimer from '@/templates/FocusTimer';
import DailyPlanner from '@/templates/DailyPlanner';
import SensoryBreak from '@/templates/SensoryBreak';

export const availableTemplates: ToolTemplate[] = [
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: 'Pomodoro-style timer with accessibility features',
    category: 'timer',
    keywords: ['timer', 'pomodoro', 'focus', 'concentration', 'work', 'productivity', 'adhd', 'break'],
    component: FocusTimer,
    features: [
      'Customizable timer duration',
      'Audio announcements',
      'Screen reader support',
      'Visual time display',
      'Start/pause/reset controls'
    ],
    difficulty: 'basic'
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Task management with time estimates and progress tracking',
    category: 'planner',
    keywords: ['planner', 'tasks', 'todo', 'schedule', 'organize', 'adhd', 'executive function', 'daily'],
    component: DailyPlanner,
    features: [
      'Add/remove tasks',
      'Mark tasks complete',
      'Time estimation',
      'Progress tracking',
      'Accessible task management'
    ],
    difficulty: 'basic'
  },
  {
    id: 'sensory-break',
    name: 'Sensory Break Tool',
    description: 'Guided sensory regulation with breathing exercises',
    category: 'sensory',
    keywords: ['sensory', 'break', 'calm', 'breathing', 'regulation', 'anxiety', 'stress', 'mindfulness'],
    component: SensoryBreak,
    features: [
      '4-7-8 breathing exercise',
      'Multiple sensory activities',
      'Audio guidance',
      'Visual breathing cues',
      'Progress tracking'
    ],
    difficulty: 'intermediate'
  }
];

export const matchPromptToTemplate = (prompt: string): TemplateMatch | null => {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);
  
  let bestMatch: TemplateMatch | null = null;
  let highestScore = 0;

  for (const template of availableTemplates) {
    let score = 0;
    let matchedKeywords: string[] = [];

    // Check for keyword matches
    for (const keyword of template.keywords) {
      if (lowerPrompt.includes(keyword)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }

    // Check for category match
    if (lowerPrompt.includes(template.category)) {
      score += 15;
    }

    // Check for exact name match
    if (lowerPrompt.includes(template.name.toLowerCase())) {
      score += 25;
    }

    // Bonus for multiple keyword matches
    if (matchedKeywords.length > 1) {
      score += matchedKeywords.length * 5;
    }

    const confidence = Math.min(score / 30, 1); // Normalize to 0-1

    if (confidence > 0.3 && score > highestScore) {
      highestScore = score;
      bestMatch = {
        template,
        confidence,
        reasoning: `Matched keywords: ${matchedKeywords.join(', ')}`
      };
    }
  }

  return bestMatch;
};

export const getAllTemplates = (): ToolTemplate[] => {
  return availableTemplates;
};

export const getTemplateById = (id: string): ToolTemplate | null => {
  return availableTemplates.find(template => template.id === id) || null;
};
