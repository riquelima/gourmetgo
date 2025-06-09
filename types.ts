
export enum Role {
  ADMIN = 'ADMIN',
  ATTENDANT = 'ATTENDANT',
  CUSTOMER = 'CUSTOMER', // Or PUBLIC for non-logged in users making orders
}

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  categoryId: string;
  categoryName?: string; // Denormalized for convenience
}

export enum OrderStatus {
  NEW = 'Novo',
  PREPARING = 'Em Preparo',
  SENT = 'Enviado',
  DELIVERED = 'Entregue',
  CANCELED = 'Cancelado',
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string; // ISO date string
  userId?: string; // If placed by a logged-in user
}

export interface AppSettings {
  openingTime: string; // e.g., "09:00"
  closingTime: string; // e.g., "22:00"
  isStoreOpenManual: boolean; // Manual override for open/closed status
  deliveryFeeFixed: number;
  // deliveryFeeByNeighborhood: { neighborhood: string, fee: number }[]; // More complex
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    pointBackgroundColor?: string | string[]; // Added for Chart.js line chart points
    pointBorderColor?: string | string[];   // Added for Chart.js line chart points
    hoverBackgroundColor?: string | string[]; // Added for hover states
  }[];
}