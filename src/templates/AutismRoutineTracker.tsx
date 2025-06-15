
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, Star, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { announceToScreenReader } from '@/utils/accessibilityUtils';

interface RoutineStep {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
  completed: boolean;
  important: boolean;
  visualCue?: string;
  audioReminder?: string;
}

const AutismRoutineTracker = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [routineType, setRoutineType] = useState<'morning' | 'work' | 'evening'>('morning');
  const [isActive, setIsActive] = useState(false);
  const { speak } = useTextToSpeech();
  const { registerCommand, unregisterCommand } = useVoiceCommands();

  const routines = {
    morning: [
      {
        id: '1',
        title: 'Wake Up Gently',
        description: 'Take 3 deep breaths and stretch in bed',
        timeEstimate: '2 min',
        completed: false,
        important: true,
        visualCue: '🌅',
        audioReminder: 'Good morning! Take your time waking up with gentle breathing.'
      },
      {
        id: '2',
        title: 'Personal Care',
        description: 'Brush teeth, wash face, get dressed',
        timeEstimate: '15 min',
        completed: false,
        important: true,
        visualCue: '🪥',
        audioReminder: 'Time for personal care. Take your time and follow your usual routine.'
      },
      {
        id: '3',
        title: 'Nutrition',
        description: 'Eat breakfast and drink water',
        timeEstimate: '10 min',
        completed: false,
        important: true,
        visualCue: '🥣',
        audioReminder: 'Breakfast time! Fuel your body for a great day ahead.'
      },
      {
        id: '4',
        title: 'Daily Planning',
        description: 'Review today\'s schedule and set intentions',
        timeEstimate: '5 min',
        completed: false,
        important: false,
        visualCue: '📅',
        audioReminder: 'Let\'s review your plans for today. You\'re prepared and ready!'
      }
    ],
    work: [
      {
        id: '1',
        title: 'Environment Setup',
        description: 'Organize workspace, adjust lighting and sounds',
        timeEstimate: '5 min',
        completed: false,
        important: true,
        visualCue: '🏢',
        audioReminder: 'Setting up your comfortable workspace for optimal focus.'
      },
      {
        id: '2',
        title: 'Priority Review',
        description: 'Identify most important task for this session',
        timeEstimate: '3 min',
        completed: false,
        important: true,
        visualCue: '⭐',
        audioReminder: 'What\'s your top priority right now? Focus on one thing at a time.'
      },
      {
        id: '3',
        title: 'Focused Work',
        description: 'Work on chosen task with minimal interruptions',
        timeEstimate: '25 min',
        completed: false,
        important: true,
        visualCue: '💻',
        audioReminder: 'Beginning focused work time. You have everything you need to succeed.'
      },
      {
        id: '4',
        title: 'Break & Reset',
        description: 'Step away, move body, prepare for next session',
        timeEstimate: '5 min',
        completed: false,
        important: false,
        visualCue: '🚶',
        audioReminder: 'Great work! Time for a restorative break.'
      }
    ],
    evening: [
      {
        id: '1',
        title: 'Transition Time',
        description: 'Change clothes, wash hands, signal end of day',
        timeEstimate: '10 min',
        completed: false,
        important: true,
        visualCue: '🌇',
        audioReminder: 'Transitioning to evening routine. You\'ve done well today.'
      },
      {
        id: '2',
        title: 'Reflection',
        description: 'Think about positive moments from today',
        timeEstimate: '5 min',
        completed: false,
        important: false,
        visualCue: '💭',
        audioReminder: 'Time to reflect on the good things that happened today.'
      },
      {
        id: '3',
        title: 'Prepare Tomorrow',
        description: 'Lay out clothes, prepare bag, check schedule',
        timeEstimate: '10 min',
        completed: false,
        important: true,
        visualCue: '👕',
        audioReminder: 'Preparing for tomorrow helps you feel ready and confident.'
      },
      {
        id: '4',
        title: 'Wind Down',
        description: 'Relaxing activity: read, music, or quiet time',
        timeEstimate: '15 min',
        completed: false,
        important: true,
        visualCue: '📖',
        audioReminder: 'Time to wind down with your favorite calming activity.'
      }
    ]
  };

  const [steps, setSteps] = useState<RoutineStep[]>(routines[routineType]);

  useEffect(() => {
    setSteps(routines[routineType]);
    setCurrentStep(0);
  }, [routineType]);

  useEffect(() => {
    // Register voice commands
    registerCommand({
      command: 'next step',
      action: nextStep,
      confirmation: 'Moving to next step'
    });

    registerCommand({
      command: 'complete step',
      action: completeCurrentStep,
      confirmation: 'Step completed! Well done!'
    });

    registerCommand({
      command: 'repeat instructions',
      action: () => {
        const current = steps[currentStep];
        if (current && current.audioReminder) {
          speak(current.audioReminder);
        }
      }
    });

    registerCommand({
      command: 'start morning routine',
      action: () => {
        setRoutineType('morning');
        setIsActive(true);
        speak('Starting your morning routine. Take your time and follow each step.');
      }
    });

    return () => {
      unregisterCommand('next step');
      unregisterCommand('complete step');
      unregisterCommand('repeat instructions');
      unregisterCommand('start morning routine');
    };
  }, [currentStep, steps]);

  const startRoutine = (type: 'morning' | 'work' | 'evening') => {
    setRoutineType(type);
    setIsActive(true);
    setCurrentStep(0);
    
    const routineNames = {
      morning: 'morning',
      work: 'work focus',
      evening: 'evening wind-down'
    };
    
    speak(`Starting your ${routineNames[type]} routine. I'll guide you through each step at your own pace.`);
    announceToScreenReader(`${routineNames[type]} routine started`);
  };

  const completeCurrentStep = () => {
    const updatedSteps = [...steps];
    updatedSteps[currentStep].completed = true;
    setSteps(updatedSteps);
    
    const current = updatedSteps[currentStep];
    speak(`${current.title} completed! Great job!`);
    announceToScreenReader(`${current.title} marked as complete`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      const next = steps[currentStep + 1];
      speak(`Next step: ${next.title}. ${next.audioReminder || next.description}`);
    } else {
      // Routine complete
      setIsActive(false);
      speak('Routine completed! You did an excellent job following through. Be proud of yourself!');
      announceToScreenReader('Routine completed successfully');
    }
  };

  const announceCurrentStep = () => {
    const current = steps[currentStep];
    if (current && current.audioReminder) {
      speak(current.audioReminder);
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  const completedCount = steps.filter(step => step.completed).length;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <Calendar className="h-6 w-6" />
          Routine Tracker
        </CardTitle>
        <div className="flex items-center gap-4">
          <Progress value={getProgressPercentage()} className="flex-1 h-3" />
          <Badge variant="secondary">
            {completedCount}/{steps.length} steps
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(routines).map(([type, routine]) => (
              <Button
                key={type}
                onClick={() => startRoutine(type as any)}
                variant="outline"
                className="h-24 flex-col gap-2 hover:bg-indigo-50"
              >
                <div className="text-2xl">
                  {type === 'morning' ? '🌅' : type === 'work' ? '💻' : '🌙'}
                </div>
                <div className="text-center">
                  <div className="font-medium capitalize">{type} Routine</div>
                  <div className="text-xs text-gray-500">{routine.length} steps</div>
                </div>
              </Button>
            ))}
          </div>
        )}

        {isActive && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">
                {steps[currentStep]?.visualCue || '⭐'}
              </div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-2">
                Step {currentStep + 1}: {steps[currentStep]?.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {steps[currentStep]?.description}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {steps[currentStep]?.timeEstimate}
                </span>
                {steps[currentStep]?.important && (
                  <Badge variant="destructive" className="ml-2">
                    <Star className="h-3 w-3 mr-1" />
                    Important
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={announceCurrentStep}
                variant="outline"
                size="lg"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Repeat
              </Button>
              
              <Button
                onClick={completeCurrentStep}
                disabled={steps[currentStep]?.completed}
                className="bg-green-500 hover:bg-green-600"
                size="lg"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {steps[currentStep]?.completed ? 'Completed' : 'Mark Complete'}
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={currentStep >= steps.length - 1}
                className="bg-indigo-500 hover:bg-indigo-600"
                size="lg"
              >
                Next Step
              </Button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="text-center">
                <h3 className="font-medium text-indigo-800">Remember</h3>
                <p className="text-sm text-indigo-600 mt-1">
                  Go at your own pace. Each step is important, and you're doing great! 💙
                </p>
              </div>
            </div>
          </div>
        )}

        {isActive && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">All Steps:</h3>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                  index === currentStep
                    ? 'border-indigo-400 bg-indigo-50'
                    : step.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-2xl">{step.visualCue}</div>
                <div className="flex-1">
                  <div className={`font-medium ${step.completed ? 'line-through text-gray-500' : ''}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-600">{step.timeEstimate}</div>
                </div>
                {step.completed && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {index === currentStep && !step.completed && (
                  <AlertTriangle className="h-5 w-5 text-indigo-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutismRoutineTracker;
