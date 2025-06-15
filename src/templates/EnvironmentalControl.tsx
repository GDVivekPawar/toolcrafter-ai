
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Home, Lightbulb, Thermometer, Volume2, Tv, Shield, Power } from 'lucide-react';

const EnvironmentalControl: React.FC = () => {
  const [temperature, setTemperature] = useState([72]);
  const [brightness, setBrightness] = useState([75]);
  const [volume, setVolume] = useState([50]);
  const [devices, setDevices] = useState({
    lights: false,
    tv: false,
    security: true,
    heating: true
  });

  const toggleDevice = (device: keyof typeof devices) => {
    setDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span>Environmental Control Hub</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Device Controls */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Quick Controls</h3>
              
              <Button
                onClick={() => toggleDevice('lights')}
                className={`w-full h-20 text-xl font-semibold ${
                  devices.lights 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Lightbulb className="h-8 w-8 mr-3" />
                Lights {devices.lights ? 'ON' : 'OFF'}
              </Button>

              <Button
                onClick={() => toggleDevice('tv')}
                className={`w-full h-20 text-xl font-semibold ${
                  devices.tv 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Tv className="h-8 w-8 mr-3" />
                TV {devices.tv ? 'ON' : 'OFF'}
              </Button>

              <Button
                onClick={() => toggleDevice('security')}
                className={`w-full h-20 text-xl font-semibold ${
                  devices.security 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Shield className="h-8 w-8 mr-3" />
                Security {devices.security ? 'ARMED' : 'DISARMED'}
              </Button>
            </div>

            {/* Environment Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Environment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 text-lg font-medium mb-3">
                    <Thermometer className="h-5 w-5" />
                    <span>Temperature: {temperature[0]}°F</span>
                  </label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={85}
                    min={60}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-lg font-medium mb-3">
                    <Lightbulb className="h-5 w-5" />
                    <span>Brightness: {brightness[0]}%</span>
                  </label>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-lg font-medium mb-3">
                    <Volume2 className="h-5 w-5" />
                    <span>Volume: {volume[0]}%</span>
                  </label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-orange-50 rounded-lg">
            <h4 className="font-bold text-orange-800 mb-2">Voice Commands Available:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-orange-700">
              <p>• "Turn on the lights"</p>
              <p>• "Set temperature to 70"</p>
              <p>• "Turn off TV"</p>
              <p>• "Arm security system"</p>
              <p>• "Increase brightness"</p>
              <p>• "Lower volume"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalControl;
