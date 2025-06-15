
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center space-y-2">
          <p className="text-gray-300 flex items-center justify-center space-x-2">
            <span>Built for accessibility hackathon with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>by ToolCrafter.Ai</span>
          </p>
          <p className="text-sm text-gray-400">
            Empowering everyone through accessible technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
