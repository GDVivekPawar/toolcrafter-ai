
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent leading-tight">
            Accessibility
            <br />
            <span className="text-4xl md:text-6xl">Reimagined</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover powerful, AI-driven accessibility tools designed for real-world impact. 
            From reading assistance to emergency systems, we're building the future of inclusive technology.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/40 shadow-lg">
            <span className="text-blue-400 font-semibold">✨ AI-Powered</span>
          </div>
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/40 shadow-lg">
            <span className="text-purple-400 font-semibold">🎯 Real-World Tools</span>
          </div>
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/40 shadow-lg">
            <span className="text-green-400 font-semibold">♿ Accessibility First</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
