import React from 'react';
import { IFOOD_THEME_COLORS } from '../../constants';

interface CategoryChipProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  // Future: Add optional icon prop if desired
  // icon?: React.ReactNode; 
}

const CategoryChip: React.FC<CategoryChipProps> = ({ name, isActive, onClick }) => {
  const activeClasses = `bg-[${IFOOD_THEME_COLORS.red}] text-white relative after:absolute after:bottom-[-4px] after:left-0 after:h-[3px] after:w-full after:bg-[${IFOOD_THEME_COLORS.red}] after:transition-all after:duration-300`;
  const inactiveClasses = `bg-[${IFOOD_THEME_COLORS.white}] text-[${IFOOD_THEME_COLORS.textSecondaryDark}] border border-[${IFOOD_THEME_COLORS.grayInputBorder}] hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}] hover:border-[${IFOOD_THEME_COLORS.red}] hover:text-[${IFOOD_THEME_COLORS.red}]`;

  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
        focus-visible:ring-[${IFOOD_THEME_COLORS.red}]
        flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap min-w-max justify-center shadow-sm hover:shadow-md
        hover:scale-105 active:scale-95
        ${isActive ? activeClasses : inactiveClasses}
      `}
    >
      {/* {icon && <span className="mr-1.5">{icon}</span>} */}
      {name}
    </button>
  );
};

export default CategoryChip;