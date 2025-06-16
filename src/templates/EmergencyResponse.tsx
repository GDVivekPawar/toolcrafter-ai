
import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, User, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const EmergencyResponse = () => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: 'Emergency Services', number: '911', type: 'emergency' },
    { name: 'Primary Contact', number: '', type: 'personal' },
    { name: 'Secondary Contact', number: '', type: 'personal' }
  ]);
  const [medicalInfo, setMedicalInfo] = useState({
    conditions: '',
    medications: '',
    allergies: '',
    bloodType: ''
  });

  const handleEmergencyAlert = () => {
    setIsEmergencyActive(true);
    // In a real implementation, this would trigger actual emergency protocols
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 10000);
  };

  const handleQuickCall = (number: string) => {
    if (number) {
      window.open(`tel:${number}`, '_self');
    }
  };

  if (isEmergencyActive) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="border-red-500 bg-red-50 animate-pulse">
          <CardHeader className="bg-red-500 text-white">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="h-8 w-8 animate-bounce" />
              EMERGENCY ALERT ACTIVE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🚨</div>
            <p className="text-xl mb-6 font-semibold text-red-700">
              Emergency alert has been sent to your contacts
            </p>
            <p className="text-gray-600 mb-8">
              Location sharing is active. Help is on the way.
            </p>
            <Button
              onClick={() => setIsEmergencyActive(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
            >
              Cancel Alert
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="border-red-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Emergency Response System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Button
              onClick={handleEmergencyAlert}
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-6 text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <AlertTriangle className="h-8 w-8 mr-3" />
              EMERGENCY ALERT
            </Button>
            <p className="text-gray-600 mt-4">
              Press this button in case of emergency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Phone className="h-5 w-5" />
                  Quick Call
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickCall(contact.number)}
                    variant="outline"
                    className="w-full justify-between h-12"
                    disabled={!contact.number && contact.type === 'personal'}
                  >
                    <span>{contact.name}</span>
                    <span className="text-sm text-gray-500">{contact.number || 'Not set'}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <MapPin className="h-5 w-5" />
                  Location Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => navigator.geolocation?.getCurrentPosition(() => {})}
                  >
                    Share My Location
                  </Button>
                  <p className="text-sm text-gray-600">
                    Your location will be shared with emergency contacts when alert is activated
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Heart className="h-5 w-5" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Medical Conditions</label>
              <Textarea
                value={medicalInfo.conditions}
                onChange={(e) => setMedicalInfo({...medicalInfo, conditions: e.target.value})}
                placeholder="List any medical conditions..."
                className="h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current Medications</label>
              <Textarea
                value={medicalInfo.medications}
                onChange={(e) => setMedicalInfo({...medicalInfo, medications: e.target.value})}
                placeholder="List medications and dosages..."
                className="h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Allergies</label>
              <Input
                value={medicalInfo.allergies}
                onChange={(e) => setMedicalInfo({...medicalInfo, allergies: e.target.value})}
                placeholder="Food, drug, or other allergies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Blood Type</label>
              <Input
                value={medicalInfo.bloodType}
                onChange={(e) => setMedicalInfo({...medicalInfo, bloodType: e.target.value})}
                placeholder="e.g., A+, O-, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <User className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.slice(1).map((contact, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <Input
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...emergencyContacts];
                    newContacts[index + 1].name = e.target.value;
                    setEmergencyContacts(newContacts);
                  }}
                  placeholder="Contact Name"
                />
                <Input
                  value={contact.number}
                  onChange={(e) => {
                    const newContacts = [...emergencyContacts];
                    newContacts[index + 1].number = e.target.value;
                    setEmergencyContacts(newContacts);
                  }}
                  placeholder="Phone Number"
                  type="tel"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyResponse;
