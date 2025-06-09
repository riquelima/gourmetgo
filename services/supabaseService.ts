
import { User, Role, Dish, Category, Order, OrderStatus, AppSettings, CartItem } from '../types';
import { MOCK_API_DELAY, THEME_COLORS } from '../constants';

// Mock Data
let mockUsers: User[] = [
  { id: 'admin-user-id', email: 'admin@gourmetgo.com', role: Role.ADMIN, name: 'Admin User' },
  { id: 'attendant-user-id', email: 'attendant@gourmetgo.com', role: Role.ATTENDANT, name: 'Attendant User' },
];

let mockCategories: Category[] = [
  { id: 'cat1', name: 'Entradas' },
  { id: 'cat2', name: 'Pratos Principais' },
  { id: 'cat3', name: 'Sobremesas' },
  { id: 'cat4', name: 'Bebidas' },
];

let mockDishes: Dish[] = [
  { id: 'dish1', name: 'Bruschetta Clássica', description: 'Pão italiano tostado com tomates frescos, alho, manjericão e azeite extra virgem.', price: 25.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Bruschetta%20Cl%C3%A1ssica.png', available: true, categoryId: 'cat1', categoryName: 'Entradas' },
  { id: 'dish2', name: 'Salada Caprese', description: 'Fatias de tomate fresco, mussarela de búfala e manjericão, regados com azeite balsâmico.', price: 30.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Salada%20Caprese.png', available: true, categoryId: 'cat1', categoryName: 'Entradas' },
  { id: 'dish3', name: 'Filé Mignon ao Molho Madeira', description: 'Medalhões de filé mignon grelhados, cobertos com molho madeira e acompanhados de risoto de parmesão.', price: 75.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Fil%C3%A9%20Mignon%20ao%20Molho%20Madeira.png', available: true, categoryId: 'cat2', categoryName: 'Pratos Principais' },
  { id: 'dish4', name: 'Salmão Grelhado com Legumes', description: 'Posta de salmão fresco grelhado na perfeição, servido com uma seleção de legumes da estação.', price: 68.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Salm%C3%A3o%20Grelhado%20com%20Legumes.png', available: true, categoryId: 'cat2', categoryName: 'Pratos Principais' },
  { id: 'dish5', name: 'Risoto de Camarão', description: 'Arroz arbóreo cremoso com camarões frescos, tomate cereja e um toque de limão siciliano.', price: 72.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Risoto%20de%20Camar%C3%A3o.png', available: true, categoryId: 'cat2', categoryName: 'Pratos Principais' },
  { id: 'dish6', name: 'Tiramisù Italiano', description: 'Sobremesa italiana clássica com camadas de biscoitos champagne embebidos em café, creme de mascarpone e cacau em pó.', price: 35.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Tiramis%C3%B9%20Italiano.png', available: true, categoryId: 'cat3', categoryName: 'Sobremesas' },
  { id: 'dish7', name: 'Petit Gateau com Sorvete', description: 'Bolo de chocolate com interior cremoso, servido quente com uma bola de sorvete de creme.', price: 32.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Petit%20Gateau%20com%20Sorvete.png', available: true, categoryId: 'cat3', categoryName: 'Sobremesas' },
  { id: 'dish8', name: 'Água Mineral (500ml)', description: 'Água mineral natural sem gás.', price: 5.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/%C3%81gua%20Mineral%20(500ml).png', available: true, categoryId: 'cat4', categoryName: 'Bebidas' },
  { id: 'dish9', name: 'Refrigerante Lata (350ml)', description: 'Coca-Cola, Guaraná Antarctica ou Fanta Laranja.', price: 7.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Refrigerante%20Lata.png', available: true, categoryId: 'cat4', categoryName: 'Bebidas' },
  { id: 'dish10', name: 'Suco Natural (300ml)', description: 'Laranja, Limão, Abacaxi com Hortelã.', price: 10.00, imageUrl: 'https://raw.githubusercontent.com/riquelima/gourmetgo/refs/heads/main/Suco%20Natural.png', available: true, categoryId: 'cat4', categoryName: 'Bebidas' },
];

let mockOrders: Order[] = [
  { id: 'order1', customerName: 'João Silva', customerPhone: '11999998888', customerAddress: 'Rua das Flores, 123, São Paulo', items: [{ dish: mockDishes[2], quantity: 1 }, { dish: mockDishes[6], quantity: 1 }], status: OrderStatus.DELIVERED, totalAmount: 110.00, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Entregar na portaria.' },
  { id: 'order2', customerName: 'Maria Oliveira', customerPhone: '21988887777', customerAddress: 'Avenida Copacabana, 456, Rio de Janeiro', items: [{ dish: mockDishes[3], quantity: 2 }], status: OrderStatus.SENT, totalAmount: 136.00, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'order3', customerName: 'Carlos Pereira', customerPhone: '31977776666', customerAddress: 'Praça da Liberdade, 789, Belo Horizonte', items: [{ dish: mockDishes[0], quantity: 1 }, { dish: mockDishes[4], quantity: 1 }, { dish: mockDishes[8], quantity: 2 }], status: OrderStatus.PREPARING, totalAmount: 111.00, createdAt: new Date().toISOString() },
  { id: 'order4', customerName: 'Ana Costa', customerPhone: '51966665555', customerAddress: 'Rua dos Andradas, 101, Porto Alegre', items: [{ dish: mockDishes[1], quantity: 1 }], status: OrderStatus.NEW, totalAmount: 30.00, createdAt: new Date(Date.now() + 60000).toISOString(), notes: 'Sem cebola, por favor.' }, // Future new order
];

let mockSettings: AppSettings = {
  openingTime: "09:00",
  closingTime: "23:00",
  isStoreOpenManual: true,
  deliveryFeeFixed: 5.00,
};

const simulateDelay = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), MOCK_API_DELAY));
};

// To simulate new orders appearing
setInterval(() => {
  const shouldAddNewOrder = Math.random() < 0.1; // 10% chance every 30 seconds
  if (shouldAddNewOrder && mockDishes.length > 0) {
    const randomDish1 = mockDishes[Math.floor(Math.random() * mockDishes.length)];
    const randomDish2 = mockDishes[Math.floor(Math.random() * mockDishes.length)];
    const newOrder: Order = {
      id: `order${mockOrders.length + 1 + Date.now().toString().slice(-4)}`,
      customerName: `Cliente ${Math.floor(Math.random() * 1000)}`,
      customerPhone: `XX9${Math.floor(Math.random()*100000000).toString().padStart(8,'0')}`,
      customerAddress: `Rua Aleatória, ${Math.floor(Math.random() * 1000)}`,
      items: [{ dish: randomDish1, quantity: 1 }, ...(Math.random() > 0.5 ? [{ dish: randomDish2, quantity: 1 }] : [])],
      status: OrderStatus.NEW,
      totalAmount: randomDish1.price + (randomDish2 && Math.random() > 0.5 ? randomDish2.price : 0),
      createdAt: new Date().toISOString(),
      notes: Math.random() > 0.7 ? 'Observação aleatória.' : undefined,
    };
    mockOrders.unshift(newOrder); // Add to the beginning
    console.log("Simulated new order:", newOrder.id);
  }
}, 30000);


export const supabaseService = {
  // Auth
  signInWithEmail: async (email: string, pass: string): Promise<User | null> => {
    await simulateDelay(null);
    const user = mockUsers.find(u => u.email === email);
    if (user && pass === "1234") { // Check for password "1234"
      // Store something to persist login state for mock
      localStorage.setItem('gourmetgo-currentUser', JSON.stringify(user));
      return user;
    }
    throw new Error("Invalid email or password.");
  },

  signOut: async (): Promise<void> => {
    await simulateDelay(null);
    localStorage.removeItem('gourmetgo-currentUser');
  },

  getCurrentUser: async (): Promise<User | null> => {
    await simulateDelay(null);
    const storedUser = localStorage.getItem('gourmetgo-currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  },

  // Menu
  fetchCategories: async (): Promise<Category[]> => simulateDelay(mockCategories),

  fetchDishes: async (categoryId?: string, searchTerm?: string): Promise<Dish[]> => {
    await simulateDelay(null);
    let dishes = mockDishes.map(d => ({...d, categoryName: mockCategories.find(c=>c.id === d.categoryId)?.name || 'Sem Categoria'}));
    if (categoryId) {
      dishes = dishes.filter(d => d.categoryId === categoryId);
    }
    if (searchTerm) {
      dishes = dishes.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return dishes;
  },
  
  fetchDishById: async (id: string): Promise<Dish | undefined> => {
    await simulateDelay(null);
    return mockDishes.find(d => d.id === id);
  },

  addDish: async (dishData: Omit<Dish, 'id' | 'categoryName' | 'imageUrl'> & { imageFile?: File }): Promise<Dish> => {
    await simulateDelay(null);
    const newDish: Dish = {
      ...dishData,
      id: `dish${Date.now()}`,
      imageUrl: dishData.imageFile ? `https://picsum.photos/seed/new${Date.now()}/400/300` : 'https://picsum.photos/seed/placeholder/400/300', // Mock upload
      categoryName: mockCategories.find(c => c.id === dishData.categoryId)?.name
    };
    mockDishes.push(newDish);
    return newDish;
  },

  updateDish: async (dishId: string, dishData: Partial<Dish> & { imageFile?: File }): Promise<Dish> => {
    await simulateDelay(null);
    let dishIndex = mockDishes.findIndex(d => d.id === dishId);
    if (dishIndex === -1) throw new Error("Dish not found");
    
    const updatedDish = { ...mockDishes[dishIndex], ...dishData };
    if (dishData.imageFile) {
        updatedDish.imageUrl = `https://picsum.photos/seed/updated${Date.now()}/400/300`; // Mock upload
    }
    if (dishData.categoryId) {
      updatedDish.categoryName = mockCategories.find(c => c.id === dishData.categoryId)?.name;
    }

    mockDishes[dishIndex] = updatedDish;
    return updatedDish;
  },

  deleteDish: async (dishId: string): Promise<void> => {
    await simulateDelay(null);
    mockDishes = mockDishes.filter(d => d.id !== dishId);
  },

  uploadImage: async (file: File): Promise<string> => {
    await simulateDelay(null);
    // In a real scenario, this would upload to Supabase Storage and return the public URL
    return `https://picsum.photos/seed/${file.name}${Date.now()}/400/300`;
  },

  // Orders
  fetchOrders: async (filters?: { status?: OrderStatus, date?: string, searchTerm?: string }): Promise<Order[]> => {
    await simulateDelay(null);
    let orders = [...mockOrders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first
    if (filters?.status) {
        orders = orders.filter(o => o.status === filters.status);
    }
    if (filters?.date) {
        orders = orders.filter(o => o.createdAt.startsWith(filters.date!));
    }
    if (filters?.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        orders = orders.filter(o => 
            o.customerName.toLowerCase().includes(term) || 
            o.id.toLowerCase().includes(term) ||
            o.customerPhone.includes(term)
        );
    }
    return orders;
  },
  
  fetchOrderById: async (id: string): Promise<Order | undefined> => {
    await simulateDelay(null);
    return mockOrders.find(o => o.id === id);
  },

  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'totalAmount'> & { items: CartItem[] }): Promise<Order> => {
    await simulateDelay(null);
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0) + mockSettings.deliveryFeeFixed;
    const newOrder: Order = {
      ...orderData,
      id: `order${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: OrderStatus.NEW,
      totalAmount: totalAmount,
    };
    mockOrders.unshift(newOrder); // Add to the beginning of the list
    return newOrder;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    await simulateDelay(null);
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error("Order not found");
    mockOrders[orderIndex].status = status;
    return mockOrders[orderIndex];
  },

  // Settings
  fetchSettings: async (): Promise<AppSettings> => simulateDelay(mockSettings),

  updateSettings: async (settingsData: Partial<AppSettings>): Promise<AppSettings> => {
    await simulateDelay(null);
    mockSettings = { ...mockSettings, ...settingsData };
    return mockSettings;
  },

  // Mock for dashboard data
  getOrdersPerDay: async (days: number = 7): Promise<{ date: string, count: number }[]> => {
    await simulateDelay(null);
    const data: { date: string, count: number }[] = [];
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const count = mockOrders.filter(o => o.createdAt.startsWith(dateString)).length;
        data.push({ date: dateString, count });
    }
    return data.reverse();
  },

  getRevenuePerDay: async (days: number = 7): Promise<{ date: string, revenue: number }[]> => {
    await simulateDelay(null);
    const data: { date: string, revenue: number }[] = [];
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const revenue = mockOrders
            .filter(o => o.createdAt.startsWith(dateString) && o.status !== OrderStatus.CANCELED)
            .reduce((sum, o) => sum + o.totalAmount, 0);
        data.push({ date: dateString, revenue });
    }
    return data.reverse();
  },

  getOrdersByStatus: async (): Promise<{ status: OrderStatus, count: number }[]> => {
    await simulateDelay(null);
    const statusCounts: Record<OrderStatus, number> = {
      [OrderStatus.NEW]: 0,
      [OrderStatus.PREPARING]: 0,
      [OrderStatus.SENT]: 0,
      [OrderStatus.DELIVERED]: 0,
      [OrderStatus.CANCELED]: 0,
    };
    mockOrders.forEach(order => {
      statusCounts[order.status]++;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({ status: status as OrderStatus, count }));
  },

  getDashboardSummary: async (): Promise<{ totalOrdersToday: number, revenueToday: number, pendingOrders: number }> => {
    await simulateDelay(null);
    const todayString = new Date().toISOString().split('T')[0];
    const ordersToday = mockOrders.filter(o => o.createdAt.startsWith(todayString));
    const totalOrdersToday = ordersToday.length;
    const revenueToday = ordersToday
      .filter(o => o.status !== OrderStatus.CANCELED)
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = mockOrders.filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.PREPARING).length;
    return { totalOrdersToday, revenueToday, pendingOrders };
  }
};