
import React, { useState, useEffect } from 'react';
import { Heart, Wind, Eye, Volume2, Hand, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const SensoryBreak = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [visualIntensity, setVisualIntensity] = useState([50]);
  const [soundVolume, setSoundVolume] = useState([30]);

  const activities = [
    {
      id: 'breathing',
      name: '4-7-8 Breathing',
      icon: Wind,
      description: 'Calming breathing exercise',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'visual',
      name: 'Visual Calm',
      icon: Eye,
      description: 'Soothing visual patterns',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'fidget',
      name: 'Digital Fidget',
      icon: Hand,
      description: 'Interactive calming tools',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'sounds',
      name: 'Calming Sounds',
      icon: Volume2,
      description: 'Nature and ambient sounds',
      color: 'from-orange-400 to-yellow-400'
    }
  ];

  useEffect(() => {
    if (isBreathing) {
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
  }, [isBreathing, breathingPhase]);

  const renderBreathingActivity = () => (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardContent className="text-center p-8">
        <div className="text-4xl mb-6">
          {breathingPhase === 'inhale' ? '🌬️ Breathe In' : 
           breathingPhase === 'hold' ? '⏸️ Hold' : '😤 Breathe Out'}
        </div>
        <div className="text-8xl font-bold text-blue-600 mb-6 transition-all duration-1000">
          {breathingCount}
        </div>
        <p className="text-gray-600 mb-6 text-lg">
          {breathingPhase === 'inhale' ? 'Inhale slowly through your nose' :
           breathingPhase === 'hold' ? 'Hold your breath gently' :
           'Exhale slowly through your mouth'}
        </p>
        <Button
          onClick={() => setIsBreathing(!isBreathing)}
          className={`${isBreathing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-8 py-4 text-lg`}
        >
          {isBreathing ? 'Stop' : 'Start'} Breathing
        </Button>
      </CardContent>
    </Card>
  );

  const renderVisualActivity = () => (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="text-center p-8">
        <div className="mb-6">
          <div 
            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"
            style={{ 
              animationDuration: `${3 - (visualIntensity[0] / 50)}s`,
              opacity: visualIntensity[0] / 100 
            }}
          />
        </div>
        <p className="text-gray-600 mb-4">Focus on the gentle pulsing circle</p>
        <div className="w-full max-w-xs mx-auto">
          <label className="block text-sm text-gray-600 mb-2">Visual Intensity</label>
          <Slider
            value={visualIntensity}
            onValueChange={setVisualIntensity}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFidgetActivity = () => (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="text-center p-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(9)].map((_, i) => (
            <Button
              key={i}
              variant="outline"
              className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 border-2 border-green-300 transform transition-all duration-200 hover:scale-110 active:scale-95"
              onClick={() => {}}
            >
              <div className="w-8 h-8 bg-white rounded-full opacity-70" />
            </Button>
          ))}
        </div>
        <p className="text-gray-600">Tap the circles for a calming fidget experience</p>
      </CardContent>
    </Card>
  );

  const renderSoundsActivity = () => (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardContent className="text-center p-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {['🌊 Ocean Waves', '🌧️ Rain', '🔥 Fireplace', '🌳 Forest'].map((sound) => (
            <Button
              key={sound}
              variant="outline"
              className="h-20 bg-gradient-to-r from-orange-200 to-yellow-200 hover:from-orange-300 hover:to-yellow-300 text-lg"
            >
              {sound}
            </Button>
          ))}
        </div>
        <div className="w-full max-w-xs mx-auto">
          <label className="block text-sm text-gray-600 mb-2">Volume</label>
          <Slider
            value={soundVolume}
            onValueChange={setSoundVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  if (selectedActivity) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Button
            onClick={() => setSelectedActivity(null)}
            variant="outline"
            className="mb-4"
          >
            ← Back to Activities
          </Button>
        </div>
        
        {selectedActivity === 'breathing' && renderBreathingActivity()}
        {selectedActivity === 'visual' && renderVisualActivity()}
        {selectedActivity === 'fidget' && renderFidgetActivity()}
        {selectedActivity === 'sounds' && renderSoundsActivity()}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-purple-200 shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Heart className="h-6 w-6" />
            Sensory Break
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-center text-gray-600 mb-8 text-lg">
            Choose an activity to help you regulate and feel calm
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <Button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  variant="outline"
                  className="h-32 p-6 border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${activity.color} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{activity.name}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensoryBreak;
