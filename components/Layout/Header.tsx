
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, IFOOD_THEME_COLORS, USER_ROLES_CONFIG, THEME_COLORS } from '../../constants';
import { ShoppingCartIcon, UserCircleIcon, LoginIcon, LogoutIcon, HomeIcon, BuildingStorefrontIcon } from '../Common/Icons';

export default function Header(): JSX.Element {
  const { getItemCount } = useCart();
  const { user, logout, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const logoUrl = "https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/logosite.png";

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link
          to={ROUTES.HOME}
          className="flex items-center space-x-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <img src={logoUrl} alt="GourmetGo Logo" className="h-10 w-auto sm:h-12" />
          <span
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: IFOOD_THEME_COLORS.red }}
          >
            GourmetGo
          </span>
        </Link>
        <nav className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          <Link
            to={ROUTES.HOME}
            className="hover:text-red-600 transition-all duration-300 ease-in-out flex items-center space-x-1 group hover:scale-105 active:scale-95"
            style={{ color: IFOOD_THEME_COLORS.textSecondaryDark }}
          >
            <HomeIcon className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">Cardápio</span>
          </Link>
          <Link
            to={ROUTES.CHECKOUT}
            className="relative hover:text-red-600 transition-all duration-300 ease-in-out flex items-center space-x-1 group hover:scale-105 active:scale-95"
            style={{ color: IFOOD_THEME_COLORS.textSecondaryDark }}
          >
            <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">Carrinho</span>
            {getItemCount() > 0 && (
              <span
                className="absolute -top-1.5 -right-2 sm:-top-2 sm:-right-3 text-white text-xs font-semibold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center transition-transform duration-200"
                style={{ backgroundColor: IFOOD_THEME_COLORS.red }}
              >
                {getItemCount()}
              </span>
            )}
          </Link>
          {loadingAuth ? (
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{borderColor: `${IFOOD_THEME_COLORS.red} transparent ${IFOOD_THEME_COLORS.red} transparent`}}></div>
          ) : user ? (
            <div className="relative group">
              <button className="hover:text-red-600 transition-all duration-300 ease-in-out flex items-center space-x-1 hover:scale-105 active:scale-95" style={{ color: IFOOD_THEME_COLORS.textSecondaryDark }}>
                <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">{user.name || user.email.split('@')[0]}</span>
              </button>
              <div
                className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-50 origin-top-right"
                style={{ borderColor: IFOOD_THEME_COLORS.grayInputBorder }}
              >
                {USER_ROLES_CONFIG[user.role] && USER_ROLES_CONFIG[user.role].redirectPath !== ROUTES.HOME && (
                  <Link
                    to={USER_ROLES_CONFIG[user.role].redirectPath}
                    className="block px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium hover:text-white w-full text-left transition-all duration-300 ease-in-out flex items-center space-x-2 hover:scale-105 active:scale-95"
                    style={{ color: IFOOD_THEME_COLORS.textPrimaryDark, borderBottom: `1px solid ${IFOOD_THEME_COLORS.lightGrayBg}`}}
                    onMouseEnter={e => {e.currentTarget.style.backgroundColor = IFOOD_THEME_COLORS.red; e.currentTarget.style.color = IFOOD_THEME_COLORS.white;}}
                    onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = IFOOD_THEME_COLORS.textPrimaryDark;}}
                  >
                    <BuildingStorefrontIcon className="w-4 h-4" />
                    <span>Painel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium w-full text-left transition-all duration-300 ease-in-out flex items-center space-x-2 hover:scale-105 active:scale-95"
                  style={{ color: IFOOD_THEME_COLORS.textPrimaryDark }}
                   onMouseEnter={e => {e.currentTarget.style.backgroundColor = IFOOD_THEME_COLORS.red; e.currentTarget.style.color = IFOOD_THEME_COLORS.white;}}
                   onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = IFOOD_THEME_COLORS.textPrimaryDark;}}
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          ) : (
             <Link
                to={ROUTES.LOGIN}
                className="text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-300 ease-in-out flex items-center space-x-1 sm:space-x-2 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                style={{ backgroundColor: IFOOD_THEME_COLORS.red, color: IFOOD_THEME_COLORS.white }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c71220'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = IFOOD_THEME_COLORS.red}
              >
              <LoginIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
