
import React, { useEffect } from 'react';
import { XIcon } from './Icons';
import { IFOOD_THEME_COLORS } from '../../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm', // Good for mobile
    md: 'max-w-md sm:max-w-lg', // Allow slightly wider on sm+
    lg: 'max-w-md sm:max-w-xl md:max-w-2xl',
    xl: 'max-w-md sm:max-w-2xl md:max-w-3xl',
    full: 'max-w-md sm:max-w-xl md:max-w-4xl' // Example, adjust as needed
  };

  const modalBgColor = IFOOD_THEME_COLORS.white;
  const modalTextColor = IFOOD_THEME_COLORS.textPrimaryDark;
  const borderColor = IFOOD_THEME_COLORS.grayInputBorder;
  const closeButtonHoverBg = IFOOD_THEME_COLORS.lightGrayBg;
  const closeButtonColor = IFOOD_THEME_COLORS.grayPlaceholder;


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-3 sm:p-4 transition-opacity duration-300 ease-in-out" // Base padding for overlay
      onClick={onClose} // Close on overlay click
    >
      <div
        className={`rounded-xl shadow-xl p-4 sm:p-6 w-full ${sizeClasses[size]} flex flex-col max-h-[90vh] transform transition-all duration-300 ease-in-out scale-95 animate-modal-scale-in`}
        style={{ backgroundColor: modalBgColor, color: modalTextColor }}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal content
      >
        {title && (
          <div className="flex justify-between items-center mb-3 sm:mb-4 pb-3 sm:pb-4" style={{ borderBottom: `1px solid ${borderColor}`}}>
            <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
              style={{ color: closeButtonColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = closeButtonHoverBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Close modal"
            >
              <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-grow mb-3 sm:mb-4 custom-scrollbar pr-1 sm:pr-2">
          {children}
        </div>
        {footer && (
          <div className="mt-auto pt-3 sm:pt-4 flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0" style={{ borderTop: `1px solid ${borderColor}`}}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
