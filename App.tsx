
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ROUTES, USER_ROLES_CONFIG } from './constants';
import { Role } from './types';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Pages
import PublicMenuPage from './pages/PublicMenuPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMenuManagementPage from './pages/admin/AdminMenuManagementPage';
import AdminOrderManagementPage from './pages/admin/AdminOrderManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Attendant Pages
import AttendantOrderManagementPage from './pages/attendant/AttendantOrderManagementPage';

import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/Common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their default page or a generic "unauthorized" page
    // For simplicity, redirecting to their role's default path or home if no specific path
    const userDefaultPath = USER_ROLES_CONFIG[user.role]?.redirectPath || ROUTES.HOME;
    return <Navigate to={userDefaultPath} replace />;
  }

  return <>{children}</>;
};


const AppRoutes: React.FC = () => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div className="flex justify-center items-center h-screen bg-gray-900"><LoadingSpinner size="lg"/></div>;
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<MainLayout><PublicMenuPage /></MainLayout>} />
      <Route path={ROUTES.CHECKOUT} element={<MainLayout><CheckoutPage /></MainLayout>} />
      <Route path={ROUTES.ORDER_SUCCESS} element={<MainLayout><OrderSuccessPage /></MainLayout>} />
      
      {/* Login: Redirect if already logged in */}
      <Route 
        path={ROUTES.LOGIN} 
        element={user ? <Navigate to={USER_ROLES_CONFIG[user.role]?.redirectPath || ROUTES.HOME} /> : <LoginPage />} 
      />

      {/* Admin Routes */}
      <Route 
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminLayout><AdminDashboardPage /></AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.ADMIN_MENU}
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminLayout><AdminMenuManagementPage /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route 
        path={ROUTES.ADMIN_ORDERS}
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminLayout><AdminOrderManagementPage /></AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.ADMIN_SETTINGS}
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminLayout><AdminSettingsPage /></AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Attendant Routes */}
      <Route 
        path={ROUTES.ATTENDANT_ORDERS}
        element={
          <ProtectedRoute allowedRoles={[Role.ATTENDANT, Role.ADMIN]}> {/* Admin can also access attendant orders */}
            <AdminLayout><AttendantOrderManagementPage /></AdminLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
