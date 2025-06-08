
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, IFOOD_THEME_COLORS } from '../../constants';
import { Role } from '../../types';
import { ChartBarIcon, CogIcon, DocumentTextIcon, HomeIcon, LogoutIcon, ShoppingBagIcon, XIcon } from '../Common/Icons';


interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const { user, logout } = useAuth();

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const commonLinkClasses = "flex items-center px-4 py-3 rounded-lg transition-all duration-300 ease-in-out font-medium hover:scale-105 active:scale-95";
  const activeLinkClasses = `bg-[${IFOOD_THEME_COLORS.red}] text-white`;
  const inactiveLinkClasses = `text-[${IFOOD_THEME_COLORS.textSecondaryDark}] hover:bg-[${IFOOD_THEME_COLORS.pinkBgCategories}] hover:text-[${IFOOD_THEME_COLORS.red}]`;

  const navLinks = [
    ...(user?.role === Role.ADMIN ? [
      { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5 mr-3" /> },
      { path: ROUTES.ADMIN_MENU, label: 'Gerenciar Cardápio', icon: <DocumentTextIcon className="w-5 h-5 mr-3" /> },
      { path: ROUTES.ADMIN_ORDERS, label: 'Gerenciar Pedidos', icon: <ShoppingBagIcon className="w-5 h-5 mr-3" /> },
      { path: ROUTES.ADMIN_SETTINGS, label: 'Configurações', icon: <CogIcon className="w-5 h-5 mr-3" /> },
    ] : []),
    ...(user?.role === Role.ATTENDANT ? [
      { path: ROUTES.ATTENDANT_ORDERS, label: 'Pedidos', icon: <ShoppingBagIcon className="w-5 h-5 mr-3" /> },
    ] : []),
  ];

  return (
    <div className={`lg:w-64 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-64 shrink-0 p-4 transition-all duration-300 ease-in-out border-r
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{backgroundColor: IFOOD_THEME_COLORS.white, borderColor: IFOOD_THEME_COLORS.grayInputBorder}}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <Link to={user?.role === Role.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.ATTENDANT_ORDERS} className="block transition-transform duration-300 hover:scale-105 active:scale-95">
            <h1 className="text-2xl font-bold" style={{color: IFOOD_THEME_COLORS.red}}>GourmetGo</h1>
            <p className="text-xs font-normal" style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}>Painel {user?.role === Role.ADMIN ? 'Admin' : 'Atendente'}</p>
          </Link>
          <button
            ref={trigger}
            className="lg:hidden transition-transform duration-300 hover:scale-110 active:scale-95"
            style={{color: IFOOD_THEME_COLORS.textSecondaryDark}}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-2">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`${commonLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                onClick={() => sidebarOpen && setSidebarOpen(false)}
              >
                {React.cloneElement(link.icon, { className: `w-5 h-5 mr-3 ${isActive ? 'text-white' : `text-[${IFOOD_THEME_COLORS.textSecondaryDark}] group-hover:text-[${IFOOD_THEME_COLORS.red}]`}`})}
                <span>{link.label}</span>
              </Link>
            )
           })}
        </div>
        
        <div className="mt-auto pt-4 space-y-2">
           <Link
              to={ROUTES.HOME}
              className={`${commonLinkClasses} ${inactiveLinkClasses}`} 
              onClick={() => sidebarOpen && setSidebarOpen(false)}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              <span>Ver Site Público</span>
            </Link>
          <button
            onClick={async () => {
              await logout();
              if (sidebarOpen) setSidebarOpen(false);
            }}
            className={`${commonLinkClasses} ${inactiveLinkClasses} w-full`}
          >
            <LogoutIcon className="w-5 h-5 mr-3" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
