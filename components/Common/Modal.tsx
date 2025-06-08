
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
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-3xl'
  };

  const modalBgColor = IFOOD_THEME_COLORS.white;
  const modalTextColor = IFOOD_THEME_COLORS.textPrimaryDark;
  const borderColor = IFOOD_THEME_COLORS.grayInputBorder;
  const closeButtonHoverBg = IFOOD_THEME_COLORS.lightGrayBg;
  const closeButtonColor = IFOOD_THEME_COLORS.grayPlaceholder;


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      <div
        className={`rounded-xl shadow-2xl p-6 w-full ${sizeClasses[size]} flex flex-col max-h-[90vh] transform transition-all duration-300 ease-in-out scale-95 animate-modal-scale-in`}
        style={{ backgroundColor: modalBgColor, color: modalTextColor }}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal content
      >
        {title && (
          <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: `1px solid ${borderColor}`}}>
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
              style={{ color: closeButtonColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = closeButtonHoverBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label="Close modal"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-grow mb-4 custom-scrollbar pr-2">
          {children}
        </div>
        {footer && (
          <div className="mt-auto pt-4 flex justify-end space-x-3" style={{ borderTop: `1px solid ${borderColor}`}}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
