
import React, { useState, useEffect } from 'react';
import { Plus, Timer, Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { announceToScreenReader } from '@/utils/accessibilityUtils';

interface ADHDTask {
  id: string;
  text: string;
  completed: boolean;
  timeBox: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  reward: string;
  isActive: boolean;
  timeLeft?: number;
}

const ADHDTaskManager = () => {
  const [tasks, setTasks] = useState<ADHDTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [completedToday, setCompletedToday] = useState(0);
  const { speak } = useTextToSpeech();
  const { registerCommand, unregisterCommand } = useVoiceCommands();

  useEffect(() => {
    // Register voice commands
    registerCommand({
      command: 'add task',
      action: () => speak('What task would you like to add? Please describe it.'),
      confirmation: 'Ready to add a new task'
    });

    registerCommand({
      command: 'start timer',
      action: startFirstIncompleteTask,
      confirmation: 'Starting timer for your next task'
    });

    registerCommand({
      command: 'take break',
      action: () => {
        pauseAllTimers();
        speak('Great job! Taking a well-deserved break. Come back when you\'re ready to continue.');
      }
    });

    registerCommand({
      command: 'how am I doing',
      action: () => speak(`You've completed ${completedToday} tasks today. Keep up the great work!`)
    });

    return () => {
      unregisterCommand('add task');
      unregisterCommand('start timer');
      unregisterCommand('take break');
      unregisterCommand('how am I doing');
    };
  }, [completedToday]);

  const addTask = (taskText?: string) => {
    const text = taskText || newTask;
    if (!text.trim()) return;
    
    const task: ADHDTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      timeBox: estimateTimeBox(text),
      difficulty: estimateDifficulty(text),
      reward: generateReward(),
      isActive: false
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask('');
    
    const announcement = `Task added: ${text}. Estimated time: ${task.timeBox} minutes. Difficulty: ${task.difficulty}. Reward: ${task.reward}`;
    announceToScreenReader(announcement);
    speak(announcement);
  };

  const estimateTimeBox = (text: string): number => {
    const wordCount = text.split(' ').length;
    if (wordCount <= 3) return 15; // Quick task
    if (wordCount <= 6) return 25; // Medium task
    return 45; // Complex task
  };

  const estimateDifficulty = (text: string): 'easy' | 'medium' | 'hard' => {
    const complexWords = ['research', 'analyze', 'write', 'plan', 'organize', 'study'];
    const hasComplexWords = complexWords.some(word => text.toLowerCase().includes(word));
    
    if (hasComplexWords) return 'hard';
    if (text.split(' ').length > 5) return 'medium';
    return 'easy';
  };

  const generateReward = (): string => {
    const rewards = [
      '5-minute favorite video',
      'Stretch break with music',
      'Healthy snack time',
      'Quick walk outside',
      'Chat with a friend',
      'Listen to favorite song'
    ];
    return rewards[Math.floor(Math.random() * rewards.length)];
  };

  const startTimer = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => ({
      ...t,
      isActive: t.id === taskId,
      timeLeft: t.id === taskId ? t.timeBox * 60 : t.timeLeft
    })));
    
    setActiveTimer(taskId);
    speak(`Starting ${task.timeBox} minute timer for: ${task.text}. You can do this!`);
  };

  const startFirstIncompleteTask = () => {
    const firstIncomplete = tasks.find(t => !t.completed);
    if (firstIncomplete) {
      startTimer(firstIncomplete.id);
    } else {
      speak('All tasks completed! Time to add a new one or take a well-deserved break.');
    }
  };

  const pauseAllTimers = () => {
    setActiveTimer(null);
    setTasks(prev => prev.map(t => ({ ...t, isActive: false })));
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true, isActive: false } : t
    ));
    
    setCompletedToday(prev => prev + 1);
    setActiveTimer(null);
    
    const celebration = `Fantastic! Task completed: ${task.text}. Your reward: ${task.reward}. You're doing amazing!`;
    announceToScreenReader(celebration);
    speak(celebration);
  };

  // Timer countdown effect
  useEffect(() => {
    if (!activeTimer) return;

    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.id === activeTimer && task.timeLeft && task.timeLeft > 0) {
          const newTimeLeft = task.timeLeft - 1;
          
          // Voice announcements at key intervals
          if (newTimeLeft === 300) { // 5 minutes
            speak('5 minutes remaining. You\'re doing great!');
          } else if (newTimeLeft === 60) { // 1 minute
            speak('One minute left. Almost there!');
          } else if (newTimeLeft === 0) {
            speak('Time\'s up! Great work on staying focused.');
            setActiveTimer(null);
          }
          
          return { ...task, timeLeft: newTimeLeft };
        }
        return task;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, speak]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-purple-600">
          <Zap className="h-6 w-6" />
          ADHD Task Manager
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {completedToday} completed today
          </Badge>
          <Progress value={(completedToday / Math.max(tasks.length, 1)) * 100} className="flex-1 h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="What needs to get done? (e.g., 'Write email to mom')"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="text-lg"
            aria-label="New task description"
          />
          <Button 
            onClick={() => addTask()} 
            disabled={!newTask.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task (Auto-timeboxed)
          </Button>
        </div>

        <div className="space-y-3" role="list" aria-label="ADHD-friendly tasks">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                task.completed 
                  ? 'bg-green-50 border-green-200' 
                  : task.isActive 
                    ? 'bg-blue-50 border-blue-400 shadow-md'
                    : 'bg-white border-gray-200'
              }`}
              role="listitem"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.text}
                    </span>
                    <Badge className={getDifficultyColor(task.difficulty)} variant="secondary">
                      {task.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Timer className="h-3 w-3" />
                    <span>{task.timeBox} min</span>
                    <Award className="h-3 w-3 ml-2" />
                    <span className="italic">{task.reward}</span>
                  </div>
                  
                  {task.isActive && task.timeLeft !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-lg font-mono font-bold text-blue-600">
                        <AlertCircle className="h-4 w-4" />
                        {formatTime(task.timeLeft)}
                      </div>
                      <Progress 
                        value={((task.timeBox * 60 - task.timeLeft) / (task.timeBox * 60)) * 100} 
                        className="mt-1 h-2"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {!task.completed && !task.isActive && (
                    <Button
                      onClick={() => startTimer(task.id)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Timer className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  {task.isActive && (
                    <Button
                      onClick={() => completeTask(task.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Done!
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Ready to tackle your day?</p>
            <p className="text-sm">Add your first task and I'll help you break it down!</p>
          </div>
        )}

        {activeTimer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <h3 className="font-medium text-blue-800">Focus Mode Active</h3>
              <p className="text-sm text-blue-600 mt-1">
                Stay on track! You've got this. 🎯
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ADHDTaskManager;
