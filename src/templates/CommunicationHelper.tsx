
import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Phone, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface CommunicationScript {
  id: string;
  title: string;
  category: 'social' | 'professional' | 'emergency' | 'daily';
  script: string;
  tips: string[];
}

const CommunicationHelper = () => {
  const [selectedScript, setSelectedScript] = useState<CommunicationScript | null>(null);
  const [customScript, setCustomScript] = useState('');
  const { speak } = useTextToSpeech();
  const { registerCommand, unregisterCommand } = useVoiceCommands();

  const scripts: CommunicationScript[] = [
    {
      id: '1',
      title: 'Asking for Help',
      category: 'daily',
      script: "Excuse me, I need some help with something. Could you please assist me? I would really appreciate it.",
      tips: ["Make eye contact", "Speak clearly", "Say thank you"]
    },
    {
      id: '2',
      title: 'Phone Call - Appointment',
      category: 'professional',
      script: "Hello, I'd like to schedule an appointment. What times do you have available? I'm flexible with the timing.",
      tips: ["Have calendar ready", "Write down the time", "Ask for confirmation"]
    },
    {
      id: '3',
      title: 'Social Greeting',
      category: 'social',
      script: "Hi! How are you doing today? It's nice to see you.",
      tips: ["Smile", "Use their name if you know it", "Listen to their response"]
    },
    {
      id: '4',
      title: 'Expressing Feelings',
      category: 'social',
      script: "I wanted to share that I'm feeling [emotion] about [situation]. It would help me to talk about it.",
      tips: ["Be honest", "Use 'I' statements", "Ask for support if needed"]
    },
    {
      id: '5',
      title: 'Emergency - Need Help',
      category: 'emergency',
      script: "I need help. This is not an emergency, but I'm having difficulty with [situation]. Can someone assist me?",
      tips: ["Stay calm", "Be specific", "Don't hesitate to ask"]
    }
  ];

  useEffect(() => {
    registerCommand({
      command: 'practice script',
      action: () => speak('Which communication script would you like to practice? Say social, professional, daily, or emergency.'),
      confirmation: 'Let me help you practice communication'
    });

    registerCommand({
      command: 'social script',
      action: () => selectAndRead('social'),
      confirmation: 'Loading social scripts'
    });

    registerCommand({
      command: 'professional script',
      action: () => selectAndRead('professional'),
      confirmation: 'Loading professional scripts'
    });

    registerCommand({
      command: 'emergency script',
      action: () => selectAndRead('emergency'),
      confirmation: 'Loading emergency scripts'
    });

    return () => {
      unregisterCommand('practice script');
      unregisterCommand('social script');
      unregisterCommand('professional script');
      unregisterCommand('emergency script');
    };
  }, []);

  const selectAndRead = (category: CommunicationScript['category']) => {
    const categoryScripts = scripts.filter(s => s.category === category);
    if (categoryScripts.length > 0) {
      const script = categoryScripts[0];
      setSelectedScript(script);
      speak(`${script.title}: ${script.script}`);
    }
  };

  const readScript = (script: CommunicationScript) => {
    setSelectedScript(script);
    speak(`${script.title}: ${script.script}. Tips: ${script.tips.join(', ')}`);
  };

  const getCategoryColor = (category: CommunicationScript['category']) => {
    switch (category) {
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'daily': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: CommunicationScript['category']) => {
    switch (category) {
      case 'social': return <Users className="h-4 w-4" />;
      case 'professional': return <Phone className="h-4 w-4" />;
      case 'emergency': return <Heart className="h-4 w-4" />;
      case 'daily': return <MessageCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-cyan-600">
          <MessageCircle className="h-6 w-6" />
          Communication Helper
        </CardTitle>
        <p className="text-gray-600">Practice conversations and social interactions</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scripts.map((script) => (
            <Button
              key={script.id}
              onClick={() => readScript(script)}
              variant="outline"
              className="h-auto p-4 text-left flex flex-col items-start gap-2"
            >
              <div className="flex items-center gap-2 w-full">
                <Badge className={getCategoryColor(script.category)} variant="secondary">
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(script.category)}
                    {script.category}
                  </span>
                </Badge>
              </div>
              <div className="font-medium text-sm">{script.title}</div>
              <div className="text-xs text-gray-500 line-clamp-2">{script.script}</div>
            </Button>
          ))}
        </div>

        {selectedScript && (
          <Card className="bg-cyan-50 border-cyan-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getCategoryIcon(selectedScript.category)}
                {selectedScript.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border-l-4 border-cyan-400">
                <p className="text-lg font-medium mb-2">Script:</p>
                <p className="text-gray-800">{selectedScript.script}</p>
              </div>
              
              <div>
                <p className="font-medium mb-2">Tips for success:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {selectedScript.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => speak(selectedScript.script)} variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Practice Script
                </Button>
                <Button onClick={() => speak(`Tips: ${selectedScript.tips.join(', ')}`)} variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Read Tips
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationHelper;
