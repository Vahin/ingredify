'use client';

import { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import type { SessionCart } from '@/entities/cart';
import { createCartStore } from './cart-store';
import type { CartStore } from './types/cart-store';

type CartStoreApi = ReturnType<typeof createCartStore>;

type CartProviderProps = {
  children: React.ReactNode;
  isAuthenticated: boolean;
  initialCart?: SessionCart;
};

const CartStoreContext = createContext<CartStoreApi | null>(null);

export const CartProvider = ({
  children,
  isAuthenticated,
  initialCart,
}: CartProviderProps) => {
  const [store] = useState(() =>
    createCartStore({ isAuthenticated, initialCart }),
  );

  return (
    <CartStoreContext.Provider value={store}>
      {children}
    </CartStoreContext.Provider>
  );
};

export function useCartStore<T>(selector: (state: CartStore) => T): T {
  const store = useContext(CartStoreContext);

  if (!store) {
    throw new Error('useCartStore должен использоваться внутри CartProvider');
  }

  return useStore(store, selector);
}

export function useCart() {
  return useCartStore((state) => state);
}
