'use client';

import { createStore } from 'zustand/vanilla';
import { addItemsToCart } from '../api/add-items-to-cart';
import {
  removeCartItem as removeCartItemAction,
  removeCartItems as removeCartItemsAction,
} from '../api/remove-cart-item';
import { updateRecipeCartQuantitiesInCart } from '../api/update-recipe-cart-quantities-in-cart';
import { addItems } from '../lib/add-items';
import { emptyCart } from '../lib/empty-cart';
import {
  removeCartItemFromSession,
  removeCartItemsFromSession,
} from '../lib/remove-cart-item';
import {
  readSessionCart,
  writeSessionCart,
} from '../lib/session-cart-storage';
import { updateRecipeCartQuantities } from '../lib/update-recipe-cart-quantities';
import type { SessionCart } from './types/cart';
import type { CartStore } from './types/cart-store';

export type CreateCartStoreOptions = {
  isAuthenticated: boolean;
  initialCart?: SessionCart;
};

function getInitialCart({
  isAuthenticated,
  initialCart,
}: CreateCartStoreOptions): SessionCart {
  if (isAuthenticated) {
    return initialCart ?? emptyCart();
  }

  return readSessionCart();
}

export function createCartStore(options: CreateCartStoreOptions) {
  const initialCart = getInitialCart(options);

  return createStore<CartStore>()((set, get) => {
    const commitCart = (cart: SessionCart) => {
      set({
        cart,
        itemCount: cart.items.length,
      });

      if (!get().isAuthenticated) {
        writeSessionCart(cart);
      }
    };

    return {
      cart: initialCart,
      isAuthenticated: options.isAuthenticated,
      itemCount: initialCart.items.length,
      addItems: async (params) => {
        const { cart, isAuthenticated } = get();

        if (isAuthenticated) {
          const result = await addItemsToCart({
            ...params,
            currentCart: cart,
          });
          commitCart(result.cart);
          return result;
        }

        const result = addItems(cart, {
          ...params,
          createId: () => crypto.randomUUID(),
        });
        commitCart(result.cart);
        return result;
      },
      updateRecipeCartQuantities: async (params) => {
        const { cart, isAuthenticated } = get();

        if (isAuthenticated) {
          const result = await updateRecipeCartQuantitiesInCart({
            ...params,
            currentCart: cart,
          });
          commitCart(result.cart);
          return result;
        }

        const result = updateRecipeCartQuantities(cart, params);
        commitCart(result.cart);
        return result;
      },
      removeItem: async (itemId) => {
        const { cart, isAuthenticated } = get();

        if (isAuthenticated) {
          const nextCart = await removeCartItemAction(itemId);
          commitCart(nextCart);
          return;
        }

        commitCart(removeCartItemFromSession(cart, itemId));
      },
      removeItems: async (itemIds) => {
        const { cart, isAuthenticated } = get();

        if (isAuthenticated) {
          const nextCart = await removeCartItemsAction(itemIds);
          commitCart(nextCart);
          return;
        }

        commitCart(removeCartItemsFromSession(cart, itemIds));
      },
      setCart: commitCart,
    };
  });
}
