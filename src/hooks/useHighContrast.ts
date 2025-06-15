
import { useState, useEffect } from 'react';

export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    const saved = localStorage.getItem('high-contrast');
    return saved === 'true';
  });

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('high-contrast', isHighContrast.toString());
  }, [isHighContrast]);

  const toggleHighContrast = () => setIsHighContrast(!isHighContrast);

  return { isHighContrast, toggleHighContrast };
};
