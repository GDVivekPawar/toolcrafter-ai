
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced geometric patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/30 rounded-lg rotate-45 animate-pulse-gentle"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-purple-400/30 rounded-lg rotate-12 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-16 w-40 h-40 border border-green-400/30 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-yellow-400/30 rounded-full animate-pulse-gentle" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border border-pink-400/30 rounded-lg rotate-45 animate-bounce-gentle" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Enhanced gradient orbs with animation */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      {/* Enhanced grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse-gentle"></div>
      
      {/* Additional floating elements */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce-gentle" style={{ animationDelay: '5s' }}></div>
      <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-green-400/40 rounded-full animate-float" style={{ animationDelay: '6s' }}></div>
      <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse-gentle" style={{ animationDelay: '7s' }}></div>
    </div>
  );
};

export default AnimatedBackground;
