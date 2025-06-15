
import { ToolTemplate, TemplateMatch } from '@/types/template';
import ReadingAssistant from '@/templates/ReadingAssistant';
import MedicationReminder from '@/templates/MedicationReminder';
import CommunicationBoard from '@/templates/CommunicationBoard';
import EnvironmentalControl from '@/templates/EnvironmentalControl';
import MemoryPalace from '@/templates/MemoryPalace';
import SeizureAlert from '@/templates/SeizureAlert';

export const availableTemplates: ToolTemplate[] = [
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

    // Special scoring for high-impact keywords
    const highImpactKeywords = ['medication', 'seizure', 'communication', 'reading', 'smart home', 'memory'];
    for (const keyword of highImpactKeywords) {
      if (lowerPrompt.includes(keyword)) {
        score += 20;
      }
    }

    const confidence = Math.min(score / 40, 1); // Normalize to 0-1

    if (confidence > 0.25 && score > highestScore) {
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
