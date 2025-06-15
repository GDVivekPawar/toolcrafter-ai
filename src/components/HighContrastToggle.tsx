
import React from 'react';
import { Button } from '@/components/ui/button';
import { useHighContrast } from '@/hooks/useHighContrast';
import { Eye, EyeOff } from 'lucide-react';

const HighContrastToggle = () => {
  const { isHighContrast, toggleHighContrast } = useHighContrast();

  return (
    <Button
      onClick={toggleHighContrast}
      variant="outline"
      size="sm"
      className="border-gray-300 hover:bg-gray-100"
      aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
    >
      {isHighContrast ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
      <span className="ml-2 hidden sm:inline">
        {isHighContrast ? 'Disable' : 'Enable'} High Contrast
      </span>
    </Button>
  );
};

export default HighContrastToggle;
