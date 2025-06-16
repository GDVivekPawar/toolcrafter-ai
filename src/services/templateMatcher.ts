import { ToolTemplate, TemplateMatch } from '@/types/template';
import ReadingAssistant from '@/templates/ReadingAssistant';
import MedicationReminder from '@/templates/MedicationReminder';
import CommunicationBoard from '@/templates/CommunicationBoard';
import EnvironmentalControl from '@/templates/EnvironmentalControl';
import MemoryPalace from '@/templates/MemoryPalace';
import SeizureAlert from '@/templates/SeizureAlert';
import Calculator from '@/templates/Calculator';
import DailyPlanner from '@/templates/DailyPlanner';
import FocusTimer from '@/templates/FocusTimer';
import SensoryBreak from '@/templates/SensoryBreak';
import EmergencyResponse from '@/templates/EmergencyResponse';

// Synonym mapping for better keyword matching
const synonyms: Record<string, string[]> = {
  'timer': ['pomodoro', 'countdown', 'stopwatch', 'clock', 'time', 'focus', 'productivity', 'work'],
  'calculator': ['math', 'arithmetic', 'compute', 'calculate', 'numbers', 'addition', 'subtraction'],
  'planner': ['schedule', 'organize', 'todo', 'tasks', 'agenda', 'calendar', 'daily', 'planning'],
  'reading': ['text', 'dyslexia', 'comprehension', 'books', 'study', 'learning', 'literacy'],
  'medication': ['pills', 'medicine', 'drugs', 'prescription', 'dosage', 'health', 'medical'],
  'communication': ['speech', 'talk', 'aac', 'nonverbal', 'autism', 'symbols', 'phrases'],
  'memory': ['remember', 'cognitive', 'dementia', 'alzheimer', 'recall', 'brain', 'routine'],
  'emergency': ['panic', 'crisis', 'help', 'alert', 'sos', 'urgent', 'safety', 'danger'],
  'sensory': ['calm', 'anxiety', 'stress', 'overwhelm', 'regulation', 'stimming', 'fidget'],
  'seizure': ['epilepsy', 'convulsions', 'fits', 'neurological', 'episode'],
  'smart home': ['lights', 'temperature', 'devices', 'automation', 'control', 'environment']
};

// Emotional state indicators for better context analysis
const emotionalStates: Record<string, string[]> = {
  'urgent': ['emergency', 'urgent', 'immediate', 'now', 'quick', 'fast', 'help'],
  'stressed': ['stressed', 'anxious', 'overwhelmed', 'panic', 'worried', 'scared'],
  'calm': ['calm', 'relax', 'peaceful', 'soothing', 'quiet', 'gentle'],
  'focused': ['focus', 'concentrate', 'attention', 'productivity', 'work', 'study']
};

export const availableTemplates: ToolTemplate[] = [
  {
    id: 'focus-timer',
    name: 'Focus Timer with Sensory Breaks',
    description: 'Pomodoro timer with integrated sensory regulation and breathing exercises for ADHD and focus support',
    category: 'timer',
    keywords: ['timer', 'focus', 'adhd', 'pomodoro', 'breaks', 'concentration', 'productivity', 'work', 'study', 'breathing', 'sensory'],
    component: FocusTimer,
    features: [
      'Customizable work/break intervals',
      'Integrated breathing exercises',
      'Visual progress tracking',
      'Audio notifications',
      'ADHD-friendly design',
      'Sensory break activities'
    ],
    difficulty: 'basic'
  },
  {
    id: 'sensory-break',
    name: 'Sensory Regulation Tool',
    description: 'Comprehensive sensory toolkit with breathing exercises, visual patterns, fidget tools, and calming sounds',
    category: 'sensory',
    keywords: ['sensory', 'calm', 'stimming', 'fidget', 'breathing', 'anxiety', 'overwhelm', 'stress', 'regulation', 'autism', 'adhd'],
    component: SensoryBreak,
    features: [
      '4-7-8 breathing exercises',
      'Interactive fidget tools',
      'Calming visual patterns',
      'Nature and ambient sounds',
      'Customizable intensity levels',
      'Multiple sensory activities'
    ],
    difficulty: 'basic'
  },
  {
    id: 'emergency-response',
    name: 'Emergency Response System',
    description: 'Comprehensive emergency alert system with one-touch alerts, medical information storage, and safety protocols',
    category: 'timer',
    keywords: ['emergency', 'panic', 'crisis', 'help', 'alert', 'safety', 'sos', 'urgent', 'medical', 'contact', 'response'],
    component: EmergencyResponse,
    features: [
      'One-touch emergency alerts',
      'Medical information storage',
      'Emergency contact management',
      'Location sharing capability',
      'Quick-call functionality',
      'Safety protocol guidance'
    ],
    difficulty: 'advanced'
  },
  {
    id: 'calculator',
    name: 'Accessible Calculator',
    description: 'Large button calculator with screen reader support and keyboard navigation',
    category: 'focus',
    keywords: ['calculator', 'math', 'numbers', 'arithmetic', 'compute', 'calculate', 'addition', 'subtraction', 'multiplication', 'division'],
    component: Calculator,
    features: [
      'Large, high-contrast buttons',
      'Screen reader announcements',
      'Keyboard navigation support',
      'Clear audio feedback',
      'Simple operation display',
      'Error prevention features'
    ],
    difficulty: 'basic'
  },
  {
    id: 'daily-planner',
    name: 'Daily Task Planner',
    description: 'Accessible task management with progress tracking and time estimation',
    category: 'planner',
    keywords: ['planner', 'tasks', 'todo', 'schedule', 'organize', 'daily', 'time', 'management', 'productivity', 'checklist'],
    component: DailyPlanner,
    features: [
      'Task creation and management',
      'Progress tracking visualization',
      'Time estimation for tasks',
      'Completion status tracking',
      'Screen reader friendly',
      'Keyboard accessible interface'
    ],
    difficulty: 'basic'
  },
  {
    id: 'reading-assistant',
    name: 'Reading Assistant',
    description: 'Advanced text-to-speech with dyslexia support, font adjustment, and color filters',
    category: 'focus',
    keywords: ['reading', 'dyslexia', 'text-to-speech', 'font', 'color', 'overlay', 'vision', 'text', 'speech', 'highlight', 'comprehension'],
    component: ReadingAssistant,
    features: [
      'Text-to-speech with speed control',
      'Dyslexia-friendly fonts',
      'Color overlay filters',
      'Word-by-word highlighting',
      'Font size and spacing adjustment',
      'Reading progress tracking'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'medication-reminder',
    name: 'Smart Medication Reminder',
    description: 'Intelligent pill reminder system with visual cues, dosage tracking, and emergency contacts',
    category: 'timer',
    keywords: ['medication', 'pills', 'reminder', 'medicine', 'dosage', 'health', 'emergency', 'contact', 'alert', 'schedule', 'tracking'],
    component: MedicationReminder,
    features: [
      'Visual and audio medication alerts',
      'Dosage tracking and history',
      'Emergency contact integration',
      'Pill identification assistance',
      'Medication interaction warnings',
      'Prescription refill reminders'
    ],
    difficulty: 'advanced'
  },
  {
    id: 'communication-board',
    name: 'Communication Board',
    description: 'Customizable AAC communication system with symbols, text-to-speech, and gesture support',
    category: 'communication',
    keywords: ['communication', 'speech', 'aac', 'symbols', 'gestures', 'autism', 'nonverbal', 'alternative', 'augmentative', 'board', 'phrases'],
    component: CommunicationBoard,
    features: [
      'Customizable symbol boards',
      'Text-to-speech communication',
      'Quick phrase shortcuts',
      'Emotion and needs expressions',
      'Gesture recognition support',
      'Personalized vocabulary'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'environmental-control',
    name: 'Environmental Control Hub',
    description: 'Voice and touch-controlled smart home system with accessibility-first design',
    category: 'focus',
    keywords: ['smart home', 'control', 'environment', 'voice', 'lights', 'temperature', 'devices', 'automation', 'accessibility', 'hub', 'remote'],
    component: EnvironmentalControl,
    features: [
      'Voice-controlled smart devices',
      'Large button interface',
      'Automated accessibility routines',
      'Emergency lighting controls',
      'Temperature and comfort settings',
      'Device status monitoring'
    ],
    difficulty: 'advanced'
  },
  {
    id: 'memory-palace',
    name: 'Memory Palace Builder',
    description: 'Visual memory aid system with step-by-step guidance, audio cues, and progress tracking',
    category: 'memory',
    keywords: ['memory', 'palace', 'visual', 'cognitive', 'steps', 'guidance', 'reminders', 'tasks', 'sequence', 'brain', 'training'],
    component: MemoryPalace,
    features: [
      'Visual memory palace creation',
      'Step-by-step task guidance',
      'Audio memory cues',
      'Progress and completion tracking',
      'Cognitive exercise routines',
      'Personalized memory strategies'
    ],
    difficulty: 'advanced'
  },
  {
    id: 'seizure-alert',
    name: 'Seizure Alert System',
    description: 'Emergency seizure detection and alert system with medical information and safety protocols',
    category: 'timer',
    keywords: ['seizure', 'epilepsy', 'emergency', 'alert', 'medical', 'safety', 'contact', 'detection', 'health', 'monitor', 'response'],
    component: SeizureAlert,
    features: [
      'Seizure detection monitoring',
      'Automatic emergency alerts',
      'Medical information storage',
      'Safety protocol guidance',
      'Emergency contact system',
      'Seizure tracking and patterns'
    ],
    difficulty: 'advanced'
  }
];

// Enhanced matching algorithm with synonym support and context analysis
export const matchPromptToTemplate = (prompt: string): TemplateMatch | null => {
  const lowerPrompt = prompt.toLowerCase();
  const words = lowerPrompt.split(/\s+/);
  
  let bestMatch: TemplateMatch | null = null;
  let highestScore = 0;

  // Detect emotional state for context
  let emotionalContext = '';
  for (const [state, indicators] of Object.entries(emotionalStates)) {
    if (indicators.some(indicator => lowerPrompt.includes(indicator))) {
      emotionalContext = state;
      break;
    }
  }

  for (const template of availableTemplates) {
    let score = 0;
    let matchedKeywords: string[] = [];

    // Direct keyword matching
    for (const keyword of template.keywords) {
      if (lowerPrompt.includes(keyword)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }

    // Synonym matching
    for (const keyword of template.keywords) {
      const synonymList = synonyms[keyword] || [];
      for (const synonym of synonymList) {
        if (lowerPrompt.includes(synonym) && !matchedKeywords.includes(keyword)) {
          score += 8;
          matchedKeywords.push(`${synonym} (${keyword})`);
        }
      }
    }

    // Category match
    if (lowerPrompt.includes(template.category)) {
      score += 15;
    }

    // Exact name match
    if (lowerPrompt.includes(template.name.toLowerCase())) {
      score += 25;
    }

    // Emotional context bonuses
    if (emotionalContext === 'urgent' && template.category === 'timer' && template.id.includes('emergency')) {
      score += 30;
    }
    if (emotionalContext === 'stressed' && template.category === 'sensory') {
      score += 20;
    }
    if (emotionalContext === 'focused' && (template.category === 'timer' || template.category === 'focus')) {
      score += 15;
    }

    // Multiple keyword bonus
    if (matchedKeywords.length > 1) {
      score += matchedKeywords.length * 5;
    }

    // High-impact keyword bonuses
    const highImpactKeywords = [
      'emergency', 'seizure', 'medication', 'communication', 'reading', 
      'smart home', 'memory', 'calculator', 'planner', 'sensory', 'focus', 'timer'
    ];
    for (const keyword of highImpactKeywords) {
      if (lowerPrompt.includes(keyword)) {
        score += 20;
      }
    }

    // Intent-based scoring
    if (lowerPrompt.includes('help') && template.features.some(f => f.includes('support'))) {
      score += 10;
    }
    if (lowerPrompt.includes('need') && template.difficulty === 'basic') {
      score += 5;
    }

    const confidence = Math.min(score / 50, 1); // Adjusted normalization

    if (confidence > 0.2 && score > highestScore) {
      highestScore = score;
      bestMatch = {
        template,
        confidence,
        reasoning: `Matched: ${matchedKeywords.join(', ')}${emotionalContext ? ` | Context: ${emotionalContext}` : ''}`
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
