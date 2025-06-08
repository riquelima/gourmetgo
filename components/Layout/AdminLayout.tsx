
import React from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { IFOOD_THEME_COLORS } from '../../constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div 
        className="min-h-screen flex" 
        style={{ backgroundColor: IFOOD_THEME_COLORS.adminLightGrayBg, color: IFOOD_THEME_COLORS.textPrimaryDark }}
    >
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <main 
            className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8"
            style={{backgroundColor: IFOOD_THEME_COLORS.adminLightGrayBg}} // Main content area background
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
