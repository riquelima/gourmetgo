
import React from 'react';
import { IFOOD_THEME_COLORS } from '../../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Hex color
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = IFOOD_THEME_COLORS.red, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-[6px]',
  };

  return (
    <div 
      className={`animate-spin rounded-full ${sizeClasses[size]} ${className}`}
      style={{ 
        borderColor: `${color} transparent ${color} transparent`,
        borderTopColor: color,
        borderRightColor: 'transparent',
        borderBottomColor: color,
        borderLeftColor: 'transparent'
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;