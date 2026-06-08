'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import { createCartStore } from './cart-store';
import { getRecipeCartMeta } from '../lib/get-recipe-cart-meta';
import { readSessionCart } from '../lib/session-cart-storage';
import type { SessionCart } from './types/cart';
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

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    store.getState().setCart(readSessionCart());
  }, [isAuthenticated, store]);

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

export function useCartItems() {
  return useCartStore((state) => state.cart.items);
}

export function useCartItemCount() {
  return useCartStore((state) => state.itemCount);
}

export function useCartActions() {
  const addItems = useCartStore((state) => state.addItems);
  const updateRecipeCartQuantities = useCartStore(
    (state) => state.updateRecipeCartQuantities,
  );
  const removeItem = useCartStore((state) => state.removeItem);
  const removeItems = useCartStore((state) => state.removeItems);
  const setCart = useCartStore((state) => state.setCart);

  return useMemo(
    () => ({
      addItems,
      updateRecipeCartQuantities,
      removeItem,
      removeItems,
      setCart,
    }),
    [addItems, removeItem, removeItems, setCart, updateRecipeCartQuantities],
  );
}

export function useRecipeCartMeta(recipeId: string) {
  const cart = useCartStore((state) => state.cart);

  return useMemo(() => getRecipeCartMeta(cart, recipeId), [cart, recipeId]);
}
