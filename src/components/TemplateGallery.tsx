import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Timer, Brain, CheckSquare, Bell, Headphones, Heart, Zap } from 'lucide-react';
import { useTemplateEngine } from '@/hooks/useTemplateEngine';

interface TemplateGalleryProps {
  onTemplateSelect: (template: string) => void;
}

const templates = [
  {
    icon: Timer,
    title: "Focus Timer",
    description: "Pomodoro timer with audio cues and accessibility features",
    prompt: "I need a focus timer with voice announcements for work sessions",
    color: "blue"
  },
  {
    icon: Calendar,
    title: "Daily Task Planner",
    description: "Break down daily tasks with time estimates and progress tracking",
    prompt: "I want to plan my daily tasks with time estimates and completion tracking",
    color: "green"
  },
  {
    icon: Heart,
    title: "Sensory Break Tool",
    description: "Guided breathing exercises and sensory regulation activities",
    prompt: "I need a tool for sensory breaks with breathing exercises and calming activities",
    color: "pink"
  },
  {
    icon: Brain,
    title: "Memory Support",
    description: "Coming soon - Visual and audio memory aids",
    prompt: "memory support tool with visual and audio cues for daily tasks",
    color: "purple"
  },
  {
    icon: CheckSquare,
    title: "Executive Function Helper",
    description: "Coming soon - Step-by-step guidance for complex tasks",
    prompt: "executive function support tool that breaks complex tasks into steps",
    color: "orange"
  },
  {
    icon: Headphones,
    title: "Audio Processing Aid",
    description: "Coming soon - Text-to-speech with adjustable settings",
    prompt: "audio processing aid that converts text to speech with speed controls",
    color: "indigo"
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onTemplateSelect }) => {
  return (
    <Card className="border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Quick Start Templates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
                    disabled={template.description.includes("Coming soon")}
                  >
                    {template.description.includes("Coming soon") ? "Coming Soon" : "Try This"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateGallery;
