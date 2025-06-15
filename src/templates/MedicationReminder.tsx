
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, Plus, Trash2, Bell, Phone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  taken: boolean[];
  emergencyContact?: string;
}

const MedicationReminder: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      times: ['08:00', '20:00'],
      taken: [false, false],
      emergencyContact: 'Dr. Smith: (555) 123-4567'
    }
  ]);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkMedicationAlerts();
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [medications]);

  const checkMedicationAlerts = () => {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    medications.forEach((med) => {
      med.times.forEach((time, index) => {
        if (time === currentTimeStr && !med.taken[index]) {
          // Trigger medication alert
          toast({
            title: `💊 Medication Reminder`,
            description: `Time to take ${med.name} (${med.dosage})`,
            duration: 10000,
          });
          
          // Audio alert
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              `Medication reminder: It's time to take your ${med.name}, ${med.dosage}`
            );
            speechSynthesis.speak(utterance);
          }
        }
      });
    });
  };

  const addMedication = () => {
    if (newMed.name && newMed.dosage && newMed.time) {
      const medication: Medication = {
        id: Date.now().toString(),
        name: newMed.name,
        dosage: newMed.dosage,
        times: [newMed.time],
        taken: [false]
      };
      setMedications([...medications, medication]);
      setNewMed({ name: '', dosage: '', time: '' });
      toast({
        title: "Medication Added",
        description: `${newMed.name} has been added to your schedule`,
      });
    }
  };

  const markAsTaken = (medId: string, timeIndex: number) => {
    setMedications(medications.map(med => {
      if (med.id === medId) {
        const newTaken = [...med.taken];
        newTaken[timeIndex] = true;
        return { ...med, taken: newTaken };
      }
      return med;
    }));
    
    const med = medications.find(m => m.id === medId);
    if (med) {
      toast({
        title: "✅ Medication Taken",
        description: `${med.name} marked as taken`,
      });
    }
  };

  const removeMedication = (medId: string) => {
    setMedications(medications.filter(med => med.id !== medId));
    toast({
      title: "Medication Removed",
      description: "Medication has been removed from your schedule",
    });
  };

  const getNextDose = (med: Medication) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (let i = 0; i < med.times.length; i++) {
      const [hours, minutes] = med.times[i].split(':').map(Number);
      const doseTime = hours * 60 + minutes;
      
      if (doseTime > currentTime && !med.taken[i]) {
        return med.times[i];
      }
    }
    
    // Next dose is tomorrow
    return med.times.find((_, index) => !med.taken[index]) || med.times[0];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-6 w-6" />
            <span>Smart Medication Reminder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-gray-600">
              {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Medication */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Plus className="h-5 w-5" />
            <span>Add New Medication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Medication name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <Input
              placeholder="Dosage (e.g., 10mg)"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
            />
            <Input
              type="time"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
            />
            <Button 
              onClick={addMedication}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newMed.name || !newMed.dosage || !newMed.time}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <div className="space-y-4">
        {medications.map((med) => (
          <Card key={med.id} className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                  <p className="text-gray-600">{med.dosage}</p>
                  {med.emergencyContact && (
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {med.emergencyContact}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Next: {getNextDose(med)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMedication(med.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Today's Schedule
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {med.times.map((time, index) => (
                    <Button
                      key={index}
                      variant={med.taken[index] ? "default" : "outline"}
                      size="sm"
                      onClick={() => markAsTaken(med.id, index)}
                      disabled={med.taken[index]}
                      className={`
                        ${med.taken[index] 
                          ? 'bg-green-600 text-white' 
                          : 'border-green-600 text-green-600 hover:bg-green-50'
                        }
                      `}
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      {time}
                      {med.taken[index] && ' ✓'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Information */}
      <Card className="border-red-200 bg-red-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-bold text-red-800 mb-2">Emergency Information</h3>
              <p className="text-red-700 text-sm mb-2">
                In case of medication emergency or adverse reactions:
              </p>
              <div className="space-y-1 text-sm text-red-700">
                <p>• Contact your doctor immediately</p>
                <p>• Call emergency services: 911</p>
                <p>• Have your medication list ready</p>
                <p>• Never double-dose without medical advice</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationReminder;
