
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES, IFOOD_THEME_COLORS } from '../../constants';
import { UserCircleIcon, LogoutIcon, MenuAlt2Icon, BellIcon } from '../Common/Icons';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean; // Added to manage aria-expanded for hamburger
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ setSidebarOpen, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header 
      className="shadow-md sticky top-0 z-40" 
      style={{backgroundColor: IFOOD_THEME_COLORS.white, borderBottom: `1px solid ${IFOOD_THEME_COLORS.grayInputBorder}`}}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className={`p-1.5 rounded-md lg:hidden transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}]`}
              style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="w-6 h-6" />
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <button 
              className={`relative p-1.5 rounded-full transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}]`} 
              style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}
              aria-label="Notifications"
            >
                <BellIcon className="w-6 h-6"/>
                <span 
                  className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ring-1 ring-white transition-transform duration-200" 
                  style={{backgroundColor: IFOOD_THEME_COLORS.red }} 
                ></span>
            </button>
            {user && (
              <div className="relative group">
                <button 
                  className={`flex items-center space-x-2 p-1.5 rounded-md transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}]`}
                  style={{color: IFOOD_THEME_COLORS.textPrimaryDark }}
                >
                  <UserCircleIcon className={`w-7 h-7 text-[${IFOOD_THEME_COLORS.textSecondaryDark}] group-hover:text-[${IFOOD_THEME_COLORS.red}] transition-colors duration-300`} />
                  <span className={`hidden md:block text-sm font-medium text-[${IFOOD_THEME_COLORS.textPrimaryDark}] group-hover:text-[${IFOOD_THEME_COLORS.red}] transition-colors duration-300`}>{user.name || user.email.split('@')[0]}</span>
                </button>
                <div 
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-50 origin-top-right"
                    style={{borderColor: IFOOD_THEME_COLORS.grayInputBorder}}
                >
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2.5 text-sm w-full text-left transition-all duration-300 ease-in-out flex items-center space-x-2 hover:scale-105 active:scale-95"
                    style={{ color: IFOOD_THEME_COLORS.textPrimaryDark }}
                    onMouseEnter={e => {e.currentTarget.style.backgroundColor = IFOOD_THEME_COLORS.red; e.currentTarget.style.color = IFOOD_THEME_COLORS.white;}}
                    onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = IFOOD_THEME_COLORS.textPrimaryDark;}}
                  >
                    <LogoutIcon className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
