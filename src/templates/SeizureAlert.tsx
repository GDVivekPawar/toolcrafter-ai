
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Phone, AlertTriangle, Clock, FileText, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SeizureAlert: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Dr. Smith', phone: '(555) 123-4567', relation: 'Neurologist' },
    { name: 'John Doe', phone: '(555) 987-6543', relation: 'Emergency Contact' }
  ]);
  const [medicalInfo, setMedicalInfo] = useState({
    medications: 'Levetiracetam 500mg twice daily',
    allergies: 'Penicillin',
    conditions: 'Epilepsy, diagnosed 2018',
    bloodType: 'O+',
    insurance: 'Blue Cross Blue Shield'
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  const startMonitoring = () => {
    setIsMonitoring(true);
    toast({
      title: "🛡️ Monitoring Started",
      description: "Seizure detection is now active",
    });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast({
      title: "Monitoring Stopped",
      description: "Seizure detection has been deactivated",
    });
  };

  const triggerEmergencyAlert = () => {
    toast({
      title: "🚨 EMERGENCY ALERT SENT",
      description: "Emergency contacts have been notified",
      duration: 10000,
    });

    // Simulate emergency call
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Emergency alert activated. Seizure detected. Emergency contacts are being notified."
      );
      speechSynthesis.speak(utterance);
    }
  };

  const logSeizure = () => {
    const timestamp = new Date().toLocaleString();
    toast({
      title: "Seizure Logged",
      description: `Recorded at ${timestamp}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-red-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Seizure Alert System</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {/* Monitoring Status */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full text-lg font-semibold ${
              isMonitoring 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}>
              <div className={`w-4 h-4 rounded-full ${
                isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span>Monitoring {isMonitoring ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`text-lg px-6 py-3 ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
            
            <Button
              onClick={triggerEmergencyAlert}
              className="bg-red-700 hover:bg-red-800 text-white text-lg px-6 py-3"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency Alert
            </Button>
            
            <Button
              onClick={logSeizure}
              variant="outline"
              className="text-lg px-6 py-3 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Clock className="h-5 w-5 mr-2" />
              Log Seizure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Phone className="h-5 w-5" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <h4 className="font-semibold text-orange-900">{contact.name}</h4>
                  <p className="text-orange-700">{contact.relation}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg text-orange-800">{contact.phone}</p>
                  <Button size="sm" className="mt-1 bg-orange-600 hover:bg-orange-700 text-white">
                    Call Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <FileText className="h-5 w-5" />
            <span>Medical Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <Textarea
                  value={medicalInfo.medications}
                  onChange={(e) => setMedicalInfo({...medicalInfo, medications: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                <Textarea
                  value={medicalInfo.conditions}
                  onChange={(e) => setMedicalInfo({...medicalInfo, conditions: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <Input
                  value={medicalInfo.allergies}
                  onChange={(e) => setMedicalInfo({...medicalInfo, allergies: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <Input
                  value={medicalInfo.bloodType}
                  onChange={(e) => setMedicalInfo({...medicalInfo, bloodType: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                <Input
                  value={medicalInfo.insurance}
                  onChange={(e) => setMedicalInfo({...medicalInfo, insurance: e.target.value})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Information */}
      <Card className="border-green-200 bg-green-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Heart className="h-5 w-5" />
            <span>Seizure Safety Protocol</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">During a Seizure:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Stay calm and stay with the person</li>
                <li>• Time the seizure</li>
                <li>• Clear the area of sharp objects</li>
                <li>• Place something soft under their head</li>
                <li>• Do NOT put anything in their mouth</li>
                <li>• Turn them on their side if possible</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Call 911 if:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Seizure lasts longer than 5 minutes</li>
                <li>• Multiple seizures without recovery</li>
                <li>• Difficulty breathing after seizure</li>
                <li>• Injury during seizure</li>
                <li>• No previous seizure history</li>
                <li>• Pregnancy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeizureAlert;
