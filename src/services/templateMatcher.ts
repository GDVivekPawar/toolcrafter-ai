import { ToolTemplate, TemplateMatch } from '@/types/template';
import FocusTimer from '@/templates/FocusTimer';
import DailyPlanner from '@/templates/DailyPlanner';
import SensoryBreak from '@/templates/SensoryBreak';
import ADHDTaskManager from '@/templates/ADHDTaskManager';
import AutismRoutineTracker from '@/templates/AutismRoutineTracker';
import MemoryAidTool from '@/templates/MemoryAidTool';
import CommunicationHelper from '@/templates/CommunicationHelper';
import MedicationTracker from '@/templates/MedicationTracker';

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
    id: 'adhd-task-manager',
    name: 'ADHD Task Manager',
    description: 'Voice-controlled task manager with timeboxing and rewards for ADHD users',
    category: 'focus',
    keywords: ['adhd', 'task', 'timeboxing', 'reward', 'voice', 'executive function', 'dopamine', 'motivation', 'focus'],
    component: ADHDTaskManager,
    features: [
      'Voice-controlled task management',
      'Automatic timeboxing',
      'Built-in reward system',
      'Difficulty estimation',
      'Focus mode with timer',
      'Encouraging audio feedback'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'memory-aid-tool',
    name: 'Memory Aid Tool',
    description: 'Voice-controlled memory assistant for reminders and important information',
    category: 'memory',
    keywords: ['memory', 'reminder', 'dementia', 'alzheimer', 'forgetful', 'medication', 'important', 'voice'],
    component: MemoryAidTool,
    features: [
      'Voice-controlled reminders',
      'Medication tracking',
      'Important notes storage',
      'Audio announcements',
      'Different reminder types',
      'Easy completion marking'
    ],
    difficulty: 'basic'
  },
  {
    id: 'medication-tracker',
    name: 'Medication Tracker',
    description: 'Smart medication management with voice reminders and tracking',
    category: 'health',
    keywords: ['medication', 'pills', 'medicine', 'reminder', 'health', 'dose', 'schedule', 'tracking'],
    component: MedicationTracker,
    features: [
      'Medication scheduling',
      'Voice reminders',
      'Dose tracking',
      'Multiple medications',
      'Time-based alerts',
      'Compliance monitoring'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'communication-helper',
    name: 'Communication Helper',
    description: 'Social scripts and conversation practice for autism and social anxiety',
    category: 'communication',
    keywords: ['communication', 'social', 'autism', 'anxiety', 'conversation', 'script', 'practice', 'talking'],
    component: CommunicationHelper,
    features: [
      'Pre-written social scripts',
      'Conversation practice',
      'Professional communication',
      'Emergency scripts',
      'Voice-guided practice',
      'Social tips and guidance'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'autism-routine-tracker',
    name: 'Autism Routine Tracker',
    description: 'Structured routine guidance with visual cues and audio support for autism',
    category: 'routine',
    keywords: ['autism', 'routine', 'structure', 'visual', 'predictable', 'steps', 'transition', 'schedule'],
    component: AutismRoutineTracker,
    features: [
      'Visual cue system',
      'Step-by-step guidance',
      'Audio instructions',
      'Predictable structure',
      'Multiple routine types',
      'Progress tracking'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Task management with time estimates and progress tracking',
    category: 'planner',
    keywords: ['planner', 'tasks', 'todo', 'schedule', 'organize', 'executive function', 'daily'],
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
