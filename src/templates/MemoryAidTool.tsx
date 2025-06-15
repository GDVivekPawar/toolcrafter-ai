
import React, { useState, useEffect } from 'react';
import { Brain, Plus, Calendar, Clock, Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface MemoryItem {
  id: string;
  text: string;
  type: 'reminder' | 'important' | 'daily' | 'medication';
  time?: string;
  completed: boolean;
  recurring?: boolean;
}

const MemoryAidTool = () => {
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const { speak } = useTextToSpeech();
  const { registerCommand, unregisterCommand } = useVoiceCommands();

  useEffect(() => {
    registerCommand({
      command: 'add reminder',
      action: () => speak('What would you like me to remind you about?'),
      confirmation: 'Ready to add a reminder'
    });

    registerCommand({
      command: 'check reminders',
      action: announceReminders,
      confirmation: 'Checking your reminders'
    });

    registerCommand({
      command: 'mark done',
      action: markFirstIncompleteAsDone,
      confirmation: 'Marking item as complete'
    });

    return () => {
      unregisterCommand('add reminder');
      unregisterCommand('check reminders');
      unregisterCommand('mark done');
    };
  }, [items]);

  const addItem = (text?: string, type: MemoryItem['type'] = 'reminder') => {
    const itemText = text || newItem;
    if (!itemText.trim()) return;

    const item: MemoryItem = {
      id: Date.now().toString(),
      text: itemText,
      type,
      completed: false,
      time: type === 'medication' ? getCurrentTime() : undefined
    };

    setItems(prev => [...prev, item]);
    setNewItem('');
    speak(`${type} added: ${itemText}`);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const announceReminders = () => {
    const activeItems = items.filter(item => !item.completed);
    if (activeItems.length === 0) {
      speak('You have no active reminders. Great job staying on top of things!');
      return;
    }

    const reminderText = `You have ${activeItems.length} active reminders: ${activeItems.map(item => item.text).join(', ')}`;
    speak(reminderText);
  };

  const markFirstIncompleteAsDone = () => {
    const firstIncomplete = items.find(item => !item.completed);
    if (firstIncomplete) {
      markComplete(firstIncomplete.id);
    } else {
      speak('All items are already complete!');
    }
  };

  const markComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: true } : item
    ));
    const item = items.find(i => i.id === id);
    if (item) {
      speak(`Great job! Completed: ${item.text}`);
    }
  };

  const getTypeIcon = (type: MemoryItem['type']) => {
    switch (type) {
      case 'medication': return <Bell className="h-4 w-4" />;
      case 'important': return <Brain className="h-4 w-4" />;
      case 'daily': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: MemoryItem['type']) => {
    switch (type) {
      case 'medication': return 'bg-red-100 text-red-800';
      case 'important': return 'bg-orange-100 text-orange-800';
      case 'daily': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <Brain className="h-6 w-6" />
          Memory Aid Tool
        </CardTitle>
        <p className="text-gray-600">Never forget important things again</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="What do you need to remember? (e.g., 'Take medication at 8 PM')"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className="text-lg"
            aria-label="New memory item"
          />
          <div className="flex gap-2">
            <Button onClick={() => addItem()} disabled={!newItem.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
            <Button onClick={() => addItem(newItem, 'medication')} disabled={!newItem.trim()} variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Medication
            </Button>
          </div>
        </div>

        <div className="space-y-3" role="list" aria-label="Memory items">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                item.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-indigo-300'
              }`}
              role="listitem"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {item.text}
                    </span>
                    <Badge className={getTypeColor(item.type)} variant="secondary">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </Badge>
                  </div>
                  
                  {item.time && (
                    <div className="text-sm text-gray-600">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {item.time}
                    </div>
                  )}
                </div>

                {!item.completed && (
                  <Button
                    onClick={() => markComplete(item.id)}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Done
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Your memory aid is ready!</p>
            <p className="text-sm">Add reminders, medications, or important notes</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryAidTool;
