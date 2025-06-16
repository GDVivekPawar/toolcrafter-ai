
import React from 'react';
import { Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolTemplate } from '@/types/template';

interface SidebarProps {
  availableTemplates: ToolTemplate[];
  onSelectTemplate: (template: ToolTemplate) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ availableTemplates, onSelectTemplate }) => {
  return (
    <div className="space-y-8">
      <Card className="border-gray-700/40 shadow-2xl bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Featured Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {availableTemplates.slice(0, 3).map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start border-gray-600/60 bg-gray-800/70 hover:bg-gray-700/90 h-auto py-4 px-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg rounded-xl text-gray-200 hover:text-white"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="text-left w-full overflow-hidden">
                <div className="font-semibold text-sm text-gray-200 truncate">{template.name}</div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed break-words hyphens-auto">{template.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gray-700/40 shadow-2xl bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-orange-300 flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Why ToolCrafter.Ai?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-sm text-orange-200 space-y-3">
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>AI understands your unique needs</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Instantly deployed, ready to use</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Designed by accessibility experts</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <span>Works on all devices and browsers</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
