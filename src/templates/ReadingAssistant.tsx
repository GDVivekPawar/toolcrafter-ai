
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { BookOpen, Play, Pause, Square, Type, Palette, Volume2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

const ReadingAssistant: React.FC = () => {
  const [text, setText] = useState('Paste your text here or type what you want to read. This reading assistant will help you with dyslexia-friendly features, text-to-speech, and visual aids to improve your reading experience.');
  const [fontSize, setFontSize] = useState([16]);
  const [lineSpacing, setLineSpacing] = useState([1.5]);
  const [readingSpeed, setReadingSpeed] = useState([1]);
  const [colorFilter, setColorFilter] = useState('none');
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();
  const textRef = useRef<HTMLDivElement>(null);

  const colorFilters = [
    { name: 'None', value: 'none', bg: 'bg-white' },
    { name: 'Blue Tint', value: 'blue', bg: 'bg-blue-50' },
    { name: 'Yellow Tint', value: 'yellow', bg: 'bg-yellow-50' },
    { name: 'Green Tint', value: 'green', bg: 'bg-green-50' },
    { name: 'Pink Tint', value: 'pink', bg: 'bg-pink-50' },
    { name: 'Gray Tint', value: 'gray', bg: 'bg-gray-50' }
  ];

  const handleStartReading = () => {
    if (isSpeaking) {
      stopSpeaking();
      setCurrentWordIndex(-1);
      return;
    }

    const words = text.split(/\s+/);
    let wordIndex = 0;

    const speakWords = () => {
      if (wordIndex < words.length) {
        setCurrentWordIndex(wordIndex);
        const utterance = new SpeechSynthesisUtterance(words[wordIndex]);
        utterance.rate = readingSpeed[0];
        utterance.onend = () => {
          wordIndex++;
          setTimeout(speakWords, 100);
        };
        speechSynthesis.speak(utterance);
      } else {
        setCurrentWordIndex(-1);
      }
    };

    speakWords();
  };

  const handleStopReading = () => {
    stopSpeaking();
    setCurrentWordIndex(-1);
  };

  const renderHighlightedText = () => {
    const words = text.split(/\s+/);
    return words.map((word, index) => (
      <span
        key={index}
        className={`${
          index === currentWordIndex
            ? 'bg-yellow-300 font-bold text-yellow-900'
            : ''
        } transition-all duration-200`}
      >
        {word}{' '}
      </span>
    ));
  };

  const getFilterClasses = () => {
    const filter = colorFilters.find(f => f.value === colorFilter);
    return filter ? filter.bg : 'bg-white';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>Reading Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Font Size */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Type className="h-4 w-4" />
                <span>Font Size: {fontSize[0]}px</span>
              </label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={32}
                min={12}
                step={2}
                className="w-full"
              />
            </div>

            {/* Line Spacing */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Line Spacing: {lineSpacing[0]}x
              </label>
              <Slider
                value={lineSpacing}
                onValueChange={setLineSpacing}
                max={3}
                min={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Reading Speed */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Volume2 className="h-4 w-4" />
                <span>Speed: {readingSpeed[0]}x</span>
              </label>
              <Slider
                value={readingSpeed}
                onValueChange={setReadingSpeed}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Color Filters */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium">
              <Palette className="h-4 w-4" />
              <span>Color Filter</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colorFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={colorFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColorFilter(filter.value)}
                  className={`${filter.bg} border-2`}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Dyslexia Font Toggle */}
          <div className="flex items-center space-x-3">
            <Button
              variant={dyslexiaFont ? "default" : "outline"}
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              className="font-semibold"
            >
              {dyslexiaFont ? 'Standard Font' : 'Dyslexia-Friendly Font'}
            </Button>
          </div>

          {/* Reading Controls */}
          <div className="flex space-x-3">
            <Button
              onClick={handleStartReading}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!text.trim()}
            >
              {isSpeaking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isSpeaking ? 'Pause' : 'Start Reading'}
            </Button>
            <Button
              onClick={handleStopReading}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Text Input */}
      <Card className="border-gray-200 shadow-lg">
        <CardContent className="p-6">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="min-h-[120px] mb-4"
          />
        </CardContent>
      </Card>

      {/* Reading Display */}
      <Card className={`border-gray-200 shadow-lg ${getFilterClasses()}`}>
        <CardContent className="p-8">
          <div
            ref={textRef}
            className={`
              leading-relaxed
              ${dyslexiaFont ? 'font-mono' : 'font-sans'}
            `}
            style={{
              fontSize: `${fontSize[0]}px`,
              lineHeight: lineSpacing[0],
            }}
          >
            {renderHighlightedText()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingAssistant;
