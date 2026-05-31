'use client';

import { createContext, useContext } from 'react';
import type { SessionCart } from '@/entities/cart';
import { useCartState } from './lib/use-cart-state';

type CartContextValue = ReturnType<typeof useCartState>;

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: React.ReactNode;
  isAuthenticated: boolean;
  initialCart?: SessionCart;
};

export const CartProvider = ({
  children,
  isAuthenticated,
  initialCart,
}: CartProviderProps) => {
  const value = useCartState({ isAuthenticated, initialCart });

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}
