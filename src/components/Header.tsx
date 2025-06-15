
import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import HighContrastToggle from '@/components/HighContrastToggle';

const Header = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ToolCrafter.Ai
              </h1>
              <p className="text-sm text-gray-400 font-medium">Revolutionary AI-Powered Accessibility</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-300 bg-gray-800/60 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-700/50">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">Powered by Advanced AI</span>
            </div>
            <HighContrastToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
