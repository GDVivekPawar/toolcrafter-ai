
import React from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccessibleTimer, announceToScreenReader, speakText } from '@/utils/accessibilityUtils';

const FocusTimer = () => {
  const {
    minutes,
    seconds,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    addMinute,
    subtractMinute,
    timeDisplay
  } = useAccessibleTimer(25);

  const handleStart = () => {
    startTimer();
    announceToScreenReader('Timer started');
  };

  const handlePause = () => {
    pauseTimer();
    announceToScreenReader(isPaused ? 'Timer resumed' : 'Timer paused');
  };

  const handleReset = () => {
    resetTimer();
    announceToScreenReader('Timer reset');
  };

  const handleAnnounceTime = () => {
    speakText(`${minutes} minutes and ${seconds} seconds remaining`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-blue-600">Focus Timer</CardTitle>
        <p className="text-gray-600">Pomodoro technique for better focus</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div 
            className="text-6xl font-mono font-bold text-gray-800"
            aria-live="polite"
            aria-label={`Timer showing ${minutes} minutes and ${seconds} seconds`}
          >
            {timeDisplay}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={subtractMinute}
            disabled={isActive}
            aria-label="Decrease timer by 1 minute"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addMinute}
            disabled={isActive}
            aria-label="Increase timer by 1 minute"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnnounceTime}
            aria-label="Announce current time remaining"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={isActive ? handlePause : handleStart}
            className="bg-blue-500 hover:bg-blue-600"
            size="lg"
          >
            {isActive && !isPaused ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                {isPaused ? 'Resume' : 'Start'}
              </>
            )}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>25 minutes focused work • 5 minutes break</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusTimer;
