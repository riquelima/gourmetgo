
import { OrderStatus, Role } from './types';

// Original Dark Theme Colors (Primarily for Admin Panel Base)
// This will be mostly deprecated for UI styling, kept for potential non-UI logic or if a dark mode toggle is added later.
export const THEME_COLORS = {
  background: '#1E1E2F', 
  primaryDark: '#161625', 
  accent: '#7C3AED', 
  accentHover: '#6D28D9', 
  textPrimary: '#F4F4F5', 
  textSecondary: '#A1A1AA', 
  border: '#39394A', 
  success: '#10B981', 
  warning: '#F59E0B', 
  error: '#EF4444', 
};

// New iFood-Inspired Theme Colors
export const IFOOD_THEME_COLORS = {
  red: '#EA1D2C', // Primary action, highlights, promotions
  redHover: '#C1001F', // Darker red for hover
  redActive: '#A7001A', // Even darker for active
  pinkBgCategories: '#FFE5EB',
  pinkPromoBg: '#FFBAC8',
  yellowAccent: '#FFE070', // For icons, secondary highlights, or specific statuses
  orangeButtonBanner: '#F66A0A', // For secondary buttons or banners
  greenBanner: '#45B86F', // For success states or promotional banners
  lightGrayBg: '#F7F7F7', // Main background for PUBLIC pages - UPDATED
  adminLightGrayBg: '#F7F7F7', // Tailwind gray-50, for ADMIN page backgrounds - UPDATED
  textPrimaryDark: '#1F2937', // Tailwind gray-800, Primary text on light backgrounds
  textSecondaryDark: '#4B5563', // Tailwind gray-600, Secondary text on light backgrounds
  white: '#FFFFFF', // Card backgrounds, clean areas
  black: '#000000', // For very strong text if needed
  grayInputBorder: '#D1D5DB', // Tailwind gray-300, Subtle border for inputs
  grayPlaceholder: '#6B7280', // Tailwind gray-500, Placeholder text
  shadow: 'rgba(0, 0, 0, 0.05)', // For subtle shadows
  tableHeaderBg: '#F3F4F6', // Tailwind gray-100 for table headers
  tableRowHoverBg: '#F9FAFB', // Tailwind gray-50 for table row hover
};


export const ROUTES = {
  HOME: '/', // Public Menu Page
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MENU: '/admin/menu',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_SETTINGS: '/admin/settings',
  ATTENDANT_ORDERS: '/attendant/orders',
  ORDER_SUCCESS: '/order-success',
};

export const USER_ROLES_CONFIG: Record<Role, { name: string; redirectPath: string }> = {
  [Role.ADMIN]: { name: 'Administrador', redirectPath: ROUTES.ADMIN_DASHBOARD },
  [Role.ATTENDANT]: { name: 'Atendente', redirectPath: ROUTES.ATTENDANT_ORDERS },
  [Role.CUSTOMER]: { name: 'Cliente', redirectPath: ROUTES.HOME },
};

export const ORDER_STATUS_OPTIONS = Object.values(OrderStatus);

// Updated ORDER_STATUS_COLORS for light theme
export const ORDER_STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border?: string }> = {
  [OrderStatus.NEW]: { 
    bg: `bg-[${IFOOD_THEME_COLORS.pinkPromoBg}]`, // Light Pink/Red
    text: `text-[${IFOOD_THEME_COLORS.red}]`, // Dark Red
    border: `border-[${IFOOD_THEME_COLORS.red}]`
  },
  [OrderStatus.PREPARING]: {
    bg: `bg-[${IFOOD_THEME_COLORS.yellowAccent}]/60`, // Light Yellow
    text: `text-yellow-700`, // Dark Yellow/Orange
    border: `border-yellow-600`
  },
  [OrderStatus.SENT]: {
    bg: 'bg-blue-100', // Light Blue
    text: 'text-blue-700', // Dark Blue
    border: 'border-blue-600'
  },
  [OrderStatus.DELIVERED]: {
    bg: `bg-[${IFOOD_THEME_COLORS.greenBanner}]/30`, // Light Green
    text: `text-green-700`, // Dark Green
    border: `border-green-600`
  },
  [OrderStatus.CANCELED]: {
    bg: 'bg-slate-200', // Light Gray
    text: `text-[${IFOOD_THEME_COLORS.textSecondaryDark}]`, // Dark Gray
    border: `border-slate-500`
  },
};


export const MOCK_API_DELAY = 1000; // ms for simulating network latency
export const NEW_ORDER_POLL_INTERVAL = 15000; // ms to check for new orders
