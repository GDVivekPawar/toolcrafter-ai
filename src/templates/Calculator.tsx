
import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Delete, Equal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { announceToScreenReader } from '@/utils/accessibilityUtils';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
    announceToScreenReader(`${digit}`);
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
    announceToScreenReader('decimal point');
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    announceToScreenReader('Calculator cleared');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      announceToScreenReader(`Result: ${newValue}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    
    if (nextOperation !== '=') {
      announceToScreenReader(`${getOperationName(nextOperation)}`);
    }
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const getOperationName = (op: string): string => {
    switch (op) {
      case '+': return 'plus';
      case '-': return 'minus';
      case '×': return 'multiply';
      case '÷': return 'divide';
      default: return '';
    }
  };

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-500 hover:bg-red-600 text-white col-span-2' },
    { label: '÷', action: () => performOperation('÷'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '×', action: () => performOperation('×'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '7', action: () => inputDigit('7'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '8', action: () => inputDigit('8'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '9', action: () => inputDigit('9'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '-', action: () => performOperation('-'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '4', action: () => inputDigit('4'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '5', action: () => inputDigit('5'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '6', action: () => inputDigit('6'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '+', action: () => performOperation('+'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '1', action: () => inputDigit('1'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '2', action: () => inputDigit('2'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '3', action: () => inputDigit('3'), className: 'bg-gray-200 hover:bg-gray-300' },
    { label: '=', action: () => performOperation('='), className: 'bg-green-500 hover:bg-green-600 text-white row-span-2' },
    
    { label: '0', action: () => inputDigit('0'), className: 'bg-gray-200 hover:bg-gray-300 col-span-2' },
    { label: '.', action: inputDot, className: 'bg-gray-200 hover:bg-gray-300' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-blue-600">
          <CalculatorIcon className="h-6 w-6" />
          Calculator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
          <div 
            className="text-right text-3xl font-mono font-bold text-gray-800 min-h-[2.5rem] flex items-center justify-end animate-scale-in"
            aria-live="polite"
            aria-label={`Calculator display showing ${display}`}
          >
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((button, index) => {
            const isEqualsButton = button.label === '=';
            const gridClasses = button.className.includes('col-span-2') 
              ? 'col-span-2' 
              : isEqualsButton 
                ? 'row-span-2' 
                : '';
            
            return (
              <Button
                key={index}
                onClick={button.action}
                className={`h-14 text-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${button.className} ${gridClasses}`}
                aria-label={`${button.label} ${button.label === '=' ? 'equals' : button.label === 'C' ? 'clear' : ''}`}
              >
                {button.label}
              </Button>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Use the buttons or keyboard for input</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
