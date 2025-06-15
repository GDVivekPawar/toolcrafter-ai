
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Pill, MessageSquare, Home, Brain, Shield, Zap } from 'lucide-react';

interface TemplateGalleryProps {
  onTemplateSelect: (template: string) => void;
}

const templates = [
  {
    icon: BookOpen,
    title: "Reading Assistant",
    description: "AI-powered reading support with dyslexia-friendly features and text-to-speech",
    prompt: "I need help reading text on my screen with text-to-speech and color filters for dyslexia",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Pill,
    title: "Smart Medication Reminder",
    description: "Intelligent pill management with dosage tracking and emergency alerts",
    prompt: "Create a medication reminder system with visual alerts and dosage tracking",
    color: "green",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: MessageSquare,
    title: "Communication Board",
    description: "AAC communication system with customizable symbols and voice output",
    prompt: "I need a communication board with symbols and text-to-speech for nonverbal communication",
    color: "purple",
    gradient: "from-purple-500 to-violet-500"
  },
  {
    icon: Home,
    title: "Environmental Control",
    description: "Voice-controlled smart home hub with accessibility-first design",
    prompt: "I want to control my smart home devices with voice commands and large buttons",
    color: "orange",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Brain,
    title: "Memory Palace Builder",
    description: "Visual memory aid system with cognitive training and task guidance",
    prompt: "Create a memory palace tool with visual cues and step-by-step task guidance",
    color: "pink",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Shield,
    title: "Seizure Alert System",
    description: "Emergency detection and response system for seizure management",
    prompt: "I need a seizure alert system with emergency contacts and medical information storage",
    color: "red",
    gradient: "from-red-500 to-pink-500"
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onTemplateSelect }) => {
  return (
    <Card className="border-white/40 shadow-xl bg-white/90 backdrop-blur-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <Zap className="h-6 w-6" />
          <span>Powerful Accessibility Tools</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`relative p-3 rounded-xl bg-gradient-to-r ${template.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <template.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gray-800 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {template.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onTemplateSelect(template.prompt)}
                      className={`bg-gradient-to-r ${template.gradient} hover:shadow-lg text-white border-0 font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105`}
                    >
                      Try This Tool
                    </Button>
                  </div>
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${template.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border border-white/60 backdrop-blur-sm">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Revolutionary Features</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Real-time AI assistance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Emergency response integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Personalized user experiences</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Cross-platform compatibility</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateGallery;
