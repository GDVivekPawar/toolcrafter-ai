
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Volume2, Heart, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      // Timer finished
      setIsActive(false);
      setIsBreak(!isBreak);
      setMinutes(isBreak ? 25 : 5);
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak]);

  useEffect(() => {
    if (showBreathingGuide) {
      const breathingInterval = setInterval(() => {
        setBreathingCount(prev => {
          if (prev <= 1) {
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return 7;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return 8;
            } else {
              setBreathingPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(breathingInterval);
    }
  }, [showBreathingGuide, breathingPhase]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  const adjustMinutes = (delta: number) => {
    if (!isActive) {
      setMinutes(Math.max(1, Math.min(60, minutes + delta)));
    }
  };

  const totalSeconds = (isBreak ? 5 : 25) * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="text-2xl font-bold text-center">
            {isBreak ? '🌱 Break Time' : '🎯 Focus Session'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <Progress value={progress} className="w-full h-3 mb-4" />
            <p className="text-gray-600">
              {isBreak ? 'Take a deep breath and relax' : 'Stay focused on your task'}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustMinutes(-5)}
              disabled={isActive}
            >
              <Minus className="h-4 w-4" />
              5min
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustMinutes(-1)}
              disabled={isActive}
            >
              <Minus className="h-4 w-4" />
              1min
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustMinutes(1)}
              disabled={isActive}
            >
              <Plus className="h-4 w-4" />
              1min
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustMinutes(5)}
              disabled={isActive}
            >
              <Plus className="h-4 w-4" />
              5min
            </Button>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
            >
              {isActive ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              className="px-8 py-3 text-lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {isBreak && (
            <div className="text-center">
              <Button
                onClick={() => setShowBreathingGuide(!showBreathingGuide)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Wind className="h-4 w-4 mr-2" />
                {showBreathingGuide ? 'Stop' : 'Start'} Breathing Exercise
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showBreathingGuide && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-center text-green-700">4-7-8 Breathing</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <div className="text-4xl mb-4">
              {breathingPhase === 'inhale' ? '🌬️ Breathe In' : 
               breathingPhase === 'hold' ? '⏸️ Hold' : '😤 Breathe Out'}
            </div>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {breathingCount}
            </div>
            <p className="text-gray-600">
              {breathingPhase === 'inhale' ? 'Inhale slowly through your nose' :
               breathingPhase === 'hold' ? 'Hold your breath' :
               'Exhale slowly through your mouth'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FocusTimer;
