
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CartItem, Dish } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (dish: Dish, quantity?: number) => void;
  removeItemFromCart: (dishId: string) => void;
  updateItemQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('gourmetgo-cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('gourmetgo-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (dish: Dish, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.dish.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { dish, quantity }];
    });
  };

  const removeItemFromCart = (dishId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.dish.id !== dishId));
  };

  const updateItemQuantity = (dishId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.dish.id === dishId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.dish.price * item.quantity, 0);
  };

  const getItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };


  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
