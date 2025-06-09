
import React from 'react';
import { IFOOD_THEME_COLORS } from '../../constants';

interface IconElementProps {
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactElement<IconElementProps>;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, icon, className, containerClassName, ...props }) => {
  const inputBaseStyle = `
    form-input
    w-full 
    py-2 pr-4 sm:py-2.5 sm:pr-4 
    rounded-md 
    shadow-sm 
    focus:ring-2 focus:border-transparent
    transition-all duration-300 ease-in-out
    text-sm sm:text-base 
    text-[${IFOOD_THEME_COLORS.textPrimaryDark}] bg-[${IFOOD_THEME_COLORS.white}] 
    border ${error ? 'border-red-500' : `border-[${IFOOD_THEME_COLORS.grayInputBorder}]`} 
    focus:ring-[${IFOOD_THEME_COLORS.red}]
    placeholder-[${IFOOD_THEME_COLORS.grayPlaceholder}] 
  `;

  return (
    <div className={`w-full ${containerClassName || ''}`}>
      {label && (
        <label htmlFor={name} className={`block text-xs sm:text-sm font-medium mb-1 text-[${IFOOD_THEME_COLORS.textSecondaryDark}]`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {React.cloneElement(icon, { className: `h-4 w-4 sm:h-5 sm:w-5 text-[${IFOOD_THEME_COLORS.grayPlaceholder}]` })}
          </div>
        )}
        <input
          id={name}
          name={name}
          className={`
            ${inputBaseStyle}
            ${icon ? 'pl-10 sm:pl-10' : 'pl-4 sm:pl-4'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, name, error, className, containerClassName, ...props }) => {
  const textareaBaseStyle = `
    form-textarea
    w-full 
    py-2 px-3 sm:py-2.5 sm:px-4
    rounded-md 
    shadow-sm
    focus:ring-2 focus:border-transparent
    transition-all duration-300 ease-in-out
    text-sm sm:text-base
    text-[${IFOOD_THEME_COLORS.textPrimaryDark}] bg-[${IFOOD_THEME_COLORS.white}] 
    border ${error ? 'border-red-500' : `border-[${IFOOD_THEME_COLORS.grayInputBorder}]`} 
    focus:ring-[${IFOOD_THEME_COLORS.red}]
    placeholder-[${IFOOD_THEME_COLORS.grayPlaceholder}] 
  `;
  
  return (
    <div className={`w-full ${containerClassName || ''}`}>
      {label && (
        <label htmlFor={name} className={`block text-xs sm:text-sm font-medium mb-1 text-[${IFOOD_THEME_COLORS.textSecondaryDark}]`}>
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className={`
          ${textareaBaseStyle}
          ${className}
        `}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ label, name, error, options, className, placeholder, containerClassName, ...props }) => {
  const selectBaseStyle = `
    form-select
    w-full 
    py-2 pl-3 pr-8 sm:py-2.5 sm:pl-4 sm:pr-10
    rounded-md 
    shadow-sm
    focus:ring-2 focus:border-transparent
    transition-all duration-300 ease-in-out
    appearance-none 
    text-sm sm:text-base
    text-[${IFOOD_THEME_COLORS.textPrimaryDark}] bg-[${IFOOD_THEME_COLORS.white}] 
    border ${error ? 'border-red-500' : `border-[${IFOOD_THEME_COLORS.grayInputBorder}]`} 
    focus:ring-[${IFOOD_THEME_COLORS.red}]
    placeholder-[${IFOOD_THEME_COLORS.grayPlaceholder}]
  `;

  return (
    <div className={`w-full ${containerClassName || ''}`}>
      {label && (
        <label htmlFor={name} className={`block text-xs sm:text-sm font-medium mb-1 text-[${IFOOD_THEME_COLORS.textSecondaryDark}]`}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          className={`
            ${selectBaseStyle}
            ${props.value ? '' : `text-[${IFOOD_THEME_COLORS.grayPlaceholder}]`}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="" disabled className="text-gray-400">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value} className="text-gray-800">{option.label}</option>
          ))}
        </select>
        <div className={`absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none text-[${IFOOD_THEME_COLORS.grayPlaceholder}]`}>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};


export default Input;