
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Brain, Plus, Play, CheckCircle, ArrowRight } from 'lucide-react';

interface MemoryStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  audioHint?: string;
}

const MemoryPalace: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<MemoryStep[]>([
    {
      id: '1',
      title: 'Wake Up',
      description: 'Get out of bed and stretch',
      completed: false,
      audioHint: 'Start your day with gentle stretching'
    },
    {
      id: '2',
      title: 'Brush Teeth',
      description: 'Use toothbrush and toothpaste for 2 minutes',
      completed: false,
      audioHint: 'Remember to brush all surfaces of your teeth'
    },
    {
      id: '3',
      title: 'Take Medication',
      description: 'Take morning pills with water',
      completed: false,
      audioHint: 'Check your pill organizer for today\'s dose'
    },
    {
      id: '4',
      title: 'Eat Breakfast',
      description: 'Have a healthy breakfast',
      completed: false,
      audioHint: 'Include protein and vegetables if possible'
    }
  ]);

  const completeStep = (stepId: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const playAudioHint = (hint: string) => {
    if ('speechSynthesis' in window && hint) {
      const utterance = new SpeechSynthesisUtterance(hint);
      speechSynthesis.speak(utterance);
    }
  };

  const resetProgress = () => {
    setSteps(steps.map(step => ({ ...step, completed: false })));
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const completedCount = steps.filter(step => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-pink-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>Memory Palace Builder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Daily Routine Progress</span>
              <span className="text-lg font-bold text-pink-600">
                {completedCount}/{steps.length} Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          {currentStep && (
            <Card className="border-pink-100 bg-pink-50 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-pink-800">
                    Current Step: {currentStep.title}
                  </h3>
                  <span className="text-lg text-pink-600 font-semibold">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                </div>
                <p className="text-lg text-pink-700 mb-4">{currentStep.description}</p>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => completeStep(currentStep.id)}
                    disabled={currentStep.completed}
                    className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark Complete
                  </Button>
                  
                  {currentStep.audioHint && (
                    <Button
                      onClick={() => playAudioHint(currentStep.audioHint!)}
                      variant="outline"
                      className="text-lg px-6 py-3 border-pink-500 text-pink-600 hover:bg-pink-50"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Audio Hint
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Steps Overview */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Routine</h3>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : index === currentStepIndex
                    ? 'bg-pink-50 border-pink-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : index === currentStepIndex
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    step.completed ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    step.completed ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
                
                {index === currentStepIndex && !step.completed && (
                  <ArrowRight className="h-6 w-6 text-pink-500" />
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={resetProgress}
              variant="outline"
              className="text-lg px-6 py-3 border-gray-500 text-gray-600 hover:bg-gray-50"
            >
              Reset Progress
            </Button>
          </div>

          {completedCount === steps.length && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Congratulations!</h3>
              <p className="text-green-700">You've completed your entire routine! Great job!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryPalace;
