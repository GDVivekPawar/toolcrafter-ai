
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, Heart, Utensils, Home, Play, Volume2, Plus, Settings } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Symbol {
  id: string;
  text: string;
  icon: React.ElementType;
  category: string;
  color: string;
}

const CommunicationBoard: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const { speak } = useTextToSpeech();

  const symbols: Symbol[] = [
    // Basic Needs
    { id: '1', text: 'I want', icon: Heart, category: 'basic', color: 'bg-blue-500' },
    { id: '2', text: 'I need', icon: Heart, category: 'basic', color: 'bg-green-500' },
    { id: '3', text: 'Help', icon: Heart, category: 'basic', color: 'bg-red-500' },
    { id: '4', text: 'Please', icon: Heart, category: 'basic', color: 'bg-purple-500' },
    { id: '5', text: 'Thank you', icon: Heart, category: 'basic', color: 'bg-pink-500' },
    
    // Actions
    { id: '6', text: 'Go', icon: Play, category: 'actions', color: 'bg-orange-500' },
    { id: '7', text: 'Stop', icon: Play, category: 'actions', color: 'bg-red-600' },
    { id: '8', text: 'Come', icon: Play, category: 'actions', color: 'bg-blue-600' },
    { id: '9', text: 'Look', icon: Play, category: 'actions', color: 'bg-green-600' },
    
    // Objects/Places
    { id: '10', text: 'Food', icon: Utensils, category: 'objects', color: 'bg-yellow-500' },
    { id: '11', text: 'Water', icon: Utensils, category: 'objects', color: 'bg-blue-400' },
    { id: '12', text: 'Home', icon: Home, category: 'objects', color: 'bg-brown-500' },
    { id: '13', text: 'Bathroom', icon: Home, category: 'objects', color: 'bg-teal-500' },
    
    // Emotions
    { id: '14', text: 'Happy', icon: Heart, category: 'emotions', color: 'bg-yellow-400' },
    { id: '15', text: 'Sad', icon: Heart, category: 'emotions', color: 'bg-blue-700' },
    { id: '16', text: 'Angry', icon: Heart, category: 'emotions', color: 'bg-red-700' },
    { id: '17', text: 'Tired', icon: Heart, category: 'emotions', color: 'bg-gray-500' },
  ];

  const quickPhrases = [
    'I want to go home',
    'I need help',
    'I am hungry',
    'I am thirsty',
    'I want to play',
    'I feel sick',
    'I love you',
    'Good morning',
    'Good night',
    'See you later'
  ];

  const addToMessage = (text: string) => {
    setCurrentMessage([...currentMessage, text]);
  };

  const clearMessage = () => {
    setCurrentMessage([]);
  };

  const speakMessage = () => {
    const message = currentMessage.join(' ') || customText;
    if (message.trim()) {
      speak(message);
    }
  };

  const speakQuickPhrase = (phrase: string) => {
    speak(phrase);
    setCurrentMessage(phrase.split(' '));
  };

  const removeLastWord = () => {
    setCurrentMessage(currentMessage.slice(0, -1));
  };

  const categories = ['basic', 'actions', 'objects', 'emotions'];
  const categoryLabels = {
    basic: 'Basic Words',
    actions: 'Actions',
    objects: 'Objects & Places',
    emotions: 'Emotions'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Message Display */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span>Communication Board</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Current Message */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] border-2 border-dashed border-gray-300">
              <div className="text-lg mb-2 font-semibold text-gray-700">Current Message:</div>
              <div className="text-2xl font-bold text-gray-900 min-h-[40px] flex items-center">
                {currentMessage.length > 0 ? currentMessage.join(' ') : 'Tap symbols to build your message...'}
              </div>
            </div>

            {/* Custom Text Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Or type your message here..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Message Controls */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={speakMessage}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3"
                disabled={currentMessage.length === 0 && !customText.trim()}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Speak
              </Button>
              <Button
                onClick={removeLastWord}
                variant="outline"
                className="text-lg px-4 py-3"
                disabled={currentMessage.length === 0}
              >
                Remove Last
              </Button>
              <Button
                onClick={clearMessage}
                variant="outline"
                className="text-lg px-4 py-3 text-red-600 border-red-600 hover:bg-red-50"
                disabled={currentMessage.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Phrases */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-800">Quick Phrases</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickPhrases.map((phrase, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => speakQuickPhrase(phrase)}
                className="h-auto py-3 px-2 text-sm border-blue-300 hover:bg-blue-50 text-center"
              >
                {phrase}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Symbol Categories */}
      {categories.map((category) => (
        <Card key={category} className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {symbols
                .filter((symbol) => symbol.category === category)
                .map((symbol) => (
                  <Button
                    key={symbol.id}
                    onClick={() => addToMessage(symbol.text)}
                    className={`
                      ${symbol.color} hover:opacity-90 text-white h-24 w-full 
                      flex flex-col items-center justify-center space-y-2 
                      text-sm font-semibold shadow-lg hover:shadow-xl 
                      transition-all duration-200 hover:scale-105
                    `}
                  >
                    <symbol.icon className="h-8 w-8" />
                    <span>{symbol.text}</span>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Settings and Customization */}
      <Card className="border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Settings className="h-5 w-5" />
            <span>Customization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Features:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Voice output with natural speech</li>
                <li>• Customizable symbol categories</li>
                <li>• Quick phrase shortcuts</li>
                <li>• Message building and editing</li>
                <li>• Large, accessible buttons</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Coming Soon:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Personal symbol uploads</li>
                <li>• Voice customization</li>
                <li>• Gesture recognition</li>
                <li>• Word prediction</li>
                <li>• Conversation history</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationBoard;
