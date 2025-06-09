
import React from 'react';
import { IFOOD_THEME_COLORS } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Added 'xs'
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = `font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ease-in-out inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:shadow-inner hover:scale-105 active:scale-95`;

  // Adjusted base padding (for mobile) and scaled up for sm+
  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs min-h-[28px]', // New smaller size
    sm: 'px-3 py-2 text-xs sm:text-sm min-h-[36px]',
    md: 'px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base min-h-[40px] sm:min-h-[44px]',
    lg: 'px-5 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg min-h-[48px] sm:min-h-[52px]',
    xl: 'px-7 py-3.5 sm:px-8 sm:py-4 text-lg sm:text-xl min-h-[56px] sm:min-h-[60px]',
  };

  const variantStyles = {
    primary: `bg-[${IFOOD_THEME_COLORS.red}] text-white hover:bg-[${IFOOD_THEME_COLORS.redHover}] active:bg-[${IFOOD_THEME_COLORS.redActive}] focus-visible:ring-[${IFOOD_THEME_COLORS.red}] focus-visible:ring-offset-white`,
    secondary: `bg-[${IFOOD_THEME_COLORS.orangeButtonBanner}] text-white hover:bg-[#E05F09] active:bg-[#C75408] focus-visible:ring-[${IFOOD_THEME_COLORS.orangeButtonBanner}] focus-visible:ring-offset-white`,
    danger: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600 focus-visible:ring-offset-white`,
    ghost: `bg-transparent text-[${IFOOD_THEME_COLORS.red}] hover:bg-[${IFOOD_THEME_COLORS.red}]/10 active:bg-[${IFOOD_THEME_COLORS.red}]/20 focus-visible:ring-[${IFOOD_THEME_COLORS.red}] focus-visible:ring-offset-transparent`,
    outline: `bg-transparent text-[${IFOOD_THEME_COLORS.red}] border-2 border-[${IFOOD_THEME_COLORS.red}] hover:bg-[${IFOOD_THEME_COLORS.red}] hover:text-white active:bg-[${IFOOD_THEME_COLORS.redActive}] active:border-[${IFOOD_THEME_COLORS.redActive}] focus-visible:ring-[${IFOOD_THEME_COLORS.red}] focus-visible:ring-offset-white`,
    success: `bg-[${IFOOD_THEME_COLORS.greenBanner}] text-white hover:bg-[#3DAA64] active:bg-[#359659] focus-visible:ring-[${IFOOD_THEME_COLORS.greenBanner}] focus-visible:ring-offset-white`,
  };
  
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className={`animate-spin h-4 w-4 sm:h-5 sm:w-5 ${children ? '-ml-0.5 mr-2 sm:mr-3' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className={`inline-flex items-center justify-center ${children ? "mr-1.5 sm:mr-2" : ""}`}>{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className={`inline-flex items-center justify-center ${children ? "ml-1.5 sm:ml-2" : ""}`}>{rightIcon}</span>}
    </button>
  );
};

export default Button;