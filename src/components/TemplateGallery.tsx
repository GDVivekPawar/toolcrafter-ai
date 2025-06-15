
import React from 'react';
import { Card, Card-Content, Card-Header, Card-Title } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Timer, Brain, CheckSquare, Bell, Headphones, Heart, Zap } from 'lucide-react';

interface TemplateGalleryProps {
  onTemplateSelect: (template: string) => void;
}

const templates = [
  {
    icon: Calendar,
    title: "ADHD Daily Planner",
    description: "Break down tasks into manageable steps with reminders",
    prompt: "Create a voice-controlled daily planner for ADHD that breaks tasks into small, manageable steps with audio reminders and visual progress tracking. Include dopamine rewards and flexible scheduling.",
    color: "blue"
  },
  {
    icon: Timer,
    title: "Pomodoro Focus Timer",
    description: "Customizable work/break intervals with calming transitions",
    prompt: "Design a Pomodoro timer specifically for neurodivergent users with customizable work/break intervals, gentle transition sounds, and visual cues that don't overwhelm. Include fidget-friendly interface elements.",
    color: "green"
  },
  {
    icon: Brain,
    title: "Memory Support Tool",
    description: "Visual and audio memory aids for daily tasks",
    prompt: "Build a memory support tool that uses both visual and audio cues to help with daily tasks, medication reminders, and important appointments. Include spaced repetition and gentle notifications.",
    color: "purple"
  },
  {
    icon: CheckSquare,
    title: "Executive Function Helper",
    description: "Step-by-step guidance for complex tasks",
    prompt: "Create an executive function support tool that breaks complex tasks into step-by-step instructions with visual checkboxes, time estimates, and optional voice guidance for each step.",
    color: "orange"
  },
  {
    icon: Bell,
    title: "Sensory Break Reminder",
    description: "Personalized sensory regulation alerts",
    prompt: "Design a sensory break reminder system that learns user patterns and suggests appropriate sensory regulation activities based on time of day, stress levels, and personal preferences.",
    color: "pink"
  },
  {
    icon: Headphones,
    title: "Audio Processing Aid",
    description: "Text-to-speech with adjustable speed and clarity",
    prompt: "Build an audio processing aid that converts text to speech with adjustable speed, pitch, and clarity. Include word highlighting, pause controls, and background noise filtering options.",
    color: "indigo"
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onTemplateSelect }) => {
  return (
    <Card className="border-purple-200 shadow-lg">
      <Card-Header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <Card-Title className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Accessibility Tool Templates</span>
        </Card-Title>
      </Card-Header>
      <Card-Content className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-${template.color}-100`}>
                  <template.icon className={`h-5 w-5 text-${template.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {template.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTemplateSelect(template.prompt)}
                    className="text-xs border-gray-300 hover:bg-gray-50"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card-Content>
    </Card>
  );
};

export default TemplateGallery;
