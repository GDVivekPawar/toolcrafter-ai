
import React, { useState } from 'react';
import { Heart, Volume2, Eye, Hand, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { announceToScreenReader, speakText } from '@/utils/accessibilityUtils';

interface BreathingExercise {
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  timeLeft: number;
  cycle: number;
}

const SensoryBreak = () => {
  const [isActive, setIsActive] = useState(false);
  const [exercise, setExercise] = useState<BreathingExercise>({
    phase: 'inhale',
    timeLeft: 4,
    cycle: 1
  });

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const sensoryActivities = [
    {
      id: 'breathing',
      name: '4-7-8 Breathing',
      icon: Waves,
      description: 'Calming breathing exercise',
      color: 'blue'
    },
    {
      id: 'visual',
      name: 'Visual Calm',
      icon: Eye,
      description: 'Soothing visual patterns',
      color: 'green'
    },
    {
      id: 'tactile',
      name: 'Finger Exercises',
      icon: Hand,
      description: 'Gentle hand movements',
      color: 'purple'
    },
    {
      id: 'audio',
      name: 'Sound Therapy',
      icon: Volume2,
      description: 'Calming nature sounds',
      color: 'teal'
    }
  ];

  const startBreathingExercise = () => {
    setSelectedActivity('breathing');
    setIsActive(true);
    announceToScreenReader('Starting 4-7-8 breathing exercise');
    speakText('Breathe in for 4 counts');
  };

  const stopExercise = () => {
    setIsActive(false);
    setSelectedActivity(null);
    setExercise({ phase: 'inhale', timeLeft: 4, cycle: 1 });
    announceToScreenReader('Exercise stopped');
  };

  const selectActivity = (activityId: string) => {
    setSelectedActivity(activityId);
    const activity = sensoryActivities.find(a => a.id === activityId);
    if (activity) {
      announceToScreenReader(`Selected ${activity.name}`);
    }
  };

  React.useEffect(() => {
    if (!isActive || selectedActivity !== 'breathing') return;

    const timer = setInterval(() => {
      setExercise(prev => {
        if (prev.timeLeft > 1) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }

        // Move to next phase
        switch (prev.phase) {
          case 'inhale':
            speakText('Hold your breath for 7 counts');
            return { ...prev, phase: 'hold', timeLeft: 7 };
          case 'hold':
            speakText('Exhale slowly for 8 counts');
            return { ...prev, phase: 'exhale', timeLeft: 8 };
          case 'exhale':
            if (prev.cycle < 4) {
              speakText('Breathe in for 4 counts');
              return { ...prev, phase: 'inhale', timeLeft: 4, cycle: prev.cycle + 1 };
            } else {
              speakText('Exercise complete. Well done!');
              setIsActive(false);
              return { phase: 'inhale', timeLeft: 4, cycle: 1 };
            }
          default:
            return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, selectedActivity]);

  const getPhaseInstruction = () => {
    switch (exercise.phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return '';
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-pink-600">
          <Heart className="h-6 w-6" />
          Sensory Break
        </CardTitle>
        <p className="text-gray-600">Take a moment to regulate and recharge</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!selectedActivity && (
          <div className="grid grid-cols-2 gap-4">
            {sensoryActivities.map((activity) => (
              <Button
                key={activity.id}
                variant="outline"
                className="h-24 flex-col gap-2 hover:shadow-md"
                onClick={() => selectActivity(activity.id)}
              >
                <activity.icon className={`h-6 w-6 text-${activity.color}-500`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{activity.name}</div>
                  <div className="text-xs text-gray-500">{activity.description}</div>
                </div>
              </Button>
            ))}
          </div>
        )}

        {selectedActivity === 'breathing' && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div 
                className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center text-2xl font-bold transition-all duration-1000 ${
                  exercise.phase === 'inhale' ? 'border-blue-500 bg-blue-50 scale-110' :
                  exercise.phase === 'hold' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50 scale-90'
                }`}
                aria-live="polite"
              >
                {exercise.timeLeft}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{getPhaseInstruction()}</h3>
                <p className="text-gray-600">Cycle {exercise.cycle} of 4</p>
                <Progress value={(exercise.cycle / 4) * 100} className="w-48 mx-auto" />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              {!isActive ? (
                <Button onClick={startBreathingExercise} className="bg-blue-500 hover:bg-blue-600">
                  Start Exercise
                </Button>
              ) : (
                <Button onClick={stopExercise} variant="outline">
                  Stop Exercise
                </Button>
              )}
            </div>
          </div>
        )}

        {selectedActivity && selectedActivity !== 'breathing' && (
          <div className="text-center space-y-4">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600">
                {selectedActivity === 'visual' && 'Focus on the gentle, flowing patterns...'}
                {selectedActivity === 'tactile' && 'Gently move your fingers and hands...'}
                {selectedActivity === 'audio' && 'Listen to the calming sounds...'}
              </p>
            </div>
            <Button onClick={() => setSelectedActivity(null)} variant="outline">
              Back to Activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SensoryBreak;
