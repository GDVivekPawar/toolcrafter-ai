
import React, { useState, useEffect } from 'react';
import { Pill, Clock, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  lastTaken?: string;
  frequency: 'daily' | 'twice' | 'three' | 'as-needed';
}

const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const { speak } = useTextToSpeech();
  const { registerCommand, unregisterCommand } = useVoiceCommands();

  useEffect(() => {
    registerCommand({
      command: 'add medication',
      action: () => speak('What medication would you like to add? Please say the name and dosage.'),
      confirmation: 'Ready to add medication'
    });

    registerCommand({
      command: 'check medications',
      action: checkMedications,
      confirmation: 'Checking your medications'
    });

    registerCommand({
      command: 'took medication',
      action: markFirstMedicationTaken,
      confirmation: 'Marking medication as taken'
    });

    // Set up medication reminders
    const reminderInterval = setInterval(() => {
      checkForReminders();
    }, 60000); // Check every minute

    return () => {
      unregisterCommand('add medication');
      unregisterCommand('check medications');
      unregisterCommand('took medication');
      clearInterval(reminderInterval);
    };
  }, [medications]);

  const addMedication = () => {
    if (!newMedName.trim() || !newMedDosage.trim()) return;

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMedName,
      dosage: newMedDosage,
      times: ['08:00', '20:00'], // Default to twice daily
      frequency: 'twice'
    };

    setMedications(prev => [...prev, medication]);
    setNewMedName('');
    setNewMedDosage('');
    speak(`Added ${newMedName} ${newMedDosage} to your medication list`);
  };

  const checkMedications = () => {
    if (medications.length === 0) {
      speak('You have no medications tracked yet. You can add some by saying "add medication".');
      return;
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    const dueNow = medications.filter(med => 
      med.times.some(time => Math.abs(timeToMinutes(time) - timeToMinutes(currentTime)) <= 30)
    );

    if (dueNow.length > 0) {
      const dueNames = dueNow.map(med => `${med.name} ${med.dosage}`).join(', ');
      speak(`You have ${dueNow.length} medications due now: ${dueNames}`);
    } else {
      speak(`You have ${medications.length} medications tracked. No medications are due right now.`);
    }
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const checkForReminders = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    medications.forEach(med => {
      med.times.forEach(time => {
        if (time === currentTime) {
          speak(`Medication reminder: Time to take ${med.name} ${med.dosage}`);
        }
      });
    });
  };

  const markFirstMedicationTaken = () => {
    if (medications.length === 0) {
      speak('No medications to mark as taken');
      return;
    }

    const firstMed = medications[0];
    markTaken(firstMed.id);
  };

  const markTaken = (id: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, lastTaken: now } : med
    ));
    
    const med = medications.find(m => m.id === id);
    if (med) {
      speak(`Marked ${med.name} as taken at ${now}. Good job staying on track!`);
    }
  };

  const getNextDoseTime = (med: Medication): string => {
    const now = new Date();
    const currentMinutes = timeToMinutes(now.toTimeString().slice(0, 5));
    
    const nextTime = med.times.find(time => timeToMinutes(time) > currentMinutes);
    return nextTime || med.times[0];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
          <Pill className="h-6 w-6" />
          Medication Tracker
        </CardTitle>
        <p className="text-gray-600">Never miss a dose with voice reminders</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Medication name (e.g., Aspirin)"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="flex-1"
              aria-label="Medication name"
            />
            <Input
              placeholder="Dosage (e.g., 100mg)"
              value={newMedDosage}
              onChange={(e) => setNewMedDosage(e.target.value)}
              className="w-32"
              aria-label="Medication dosage"
            />
          </div>
          <Button 
            onClick={addMedication} 
            disabled={!newMedName.trim() || !newMedDosage.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        <div className="space-y-3" role="list" aria-label="Medications">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-4 border-2 rounded-lg bg-white border-gray-200 hover:border-emerald-300"
              role="listitem"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{med.name}</h3>
                  <p className="text-gray-600">{med.dosage}</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800" variant="secondary">
                  {med.frequency === 'daily' ? '1x daily' : 
                   med.frequency === 'twice' ? '2x daily' : 
                   med.frequency === 'three' ? '3x daily' : 'As needed'}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Times: {med.times.join(', ')}</span>
                </div>
                {med.lastTaken && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Last taken: {med.lastTaken}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Next dose: {getNextDoseTime(med)}
                </div>
                <Button
                  onClick={() => markTaken(med.id)}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Taken
                </Button>
              </div>
            </div>
          ))}
        </div>

        {medications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Pill className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Your medication tracker is ready!</p>
            <p className="text-sm">Add medications to get voice reminders</p>
          </div>
        )}

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important</p>
                <p className="text-yellow-700">This tool is for tracking only. Always consult your healthcare provider for medical advice.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
