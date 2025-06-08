
import React, { useEffect, useState } from 'react';
import { XIcon, BellIcon, CheckCircleIcon as SuccessIcon, XCircleIcon as ErrorIcon } from './Icons';
import { IFOOD_THEME_COLORS } from '../../constants';

interface NotificationPopupProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in milliseconds
  onClose?: () => void;
  title?: string;
}

const playNotificationSound = () => {
  // In a real app, you might use Audio API:
  // const audio = new Audio('/path/to/notification.mp3');
  // audio.play().catch(e => console.warn("Audio play failed:", e));
  console.log("Playing notification sound (mock)");
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  title,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    playNotificationSound();
    if (duration > 0 && duration !== Infinity) { // Allow Infinity for persistent notifications
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!visible) return null;

  const typeStyles = {
    success: {
      bgColor: IFOOD_THEME_COLORS.greenBanner,
      borderColor: '#359659', // Darker green
      iconColor: IFOOD_THEME_COLORS.white,
      textColor: IFOOD_THEME_COLORS.white,
      icon: <SuccessIcon className="w-6 h-6" />, 
    },
    error: {
      bgColor: IFOOD_THEME_COLORS.red,
      borderColor: IFOOD_THEME_COLORS.redHover, 
      iconColor: IFOOD_THEME_COLORS.white,
      textColor: IFOOD_THEME_COLORS.white,
      icon: <ErrorIcon className="w-6 h-6" />,
    },
    info: { // Using orange for info, similar to iFood's style for some alerts
      bgColor: IFOOD_THEME_COLORS.orangeButtonBanner,
      borderColor: '#D95B08', // Darker orange
      iconColor: IFOOD_THEME_COLORS.white,
      textColor: IFOOD_THEME_COLORS.white,
      icon: <BellIcon className="w-6 h-6" />,
    },
    warning: {
      bgColor: IFOOD_THEME_COLORS.yellowAccent,
      borderColor: '#DAB95E', // Darker yellow
      iconColor: IFOOD_THEME_COLORS.textPrimaryDark, 
      textColor: IFOOD_THEME_COLORS.textPrimaryDark,
      icon: <BellIcon className="w-6 h-6" />,
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl border-l-4 max-w-sm w-[calc(100%-40px)] sm:max-w-md z-[200] transform transition-all duration-300 ease-in-out animate-slide-in-right`}
      style={{ 
        backgroundColor: currentStyle.bgColor, 
        borderColor: currentStyle.borderColor, 
        color: currentStyle.textColor 
      }}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`shrink-0 mr-3`} style={{color: currentStyle.iconColor}}>
          {currentStyle.icon}
        </div>
        <div className="flex-grow">
          {title && <h4 className="font-bold text-base md:text-lg mb-0.5">{title}</h4>}
          <p className="text-sm md:text-base">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 -mt-1 -mr-1 p-1.5 rounded-full hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/50 transition-colors"
          aria-label="Close notification"
          style={{ color: currentStyle.iconColor }} // Make close icon color match other icon for consistency
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
