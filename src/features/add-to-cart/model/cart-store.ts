'use client';

import { createStore } from 'zustand/vanilla';
import {
  addRecipeLines,
  emptyCart,
  readSessionCart,
  removeCartItemFromSession,
  removeCartItemsFromSession,
  updateRecipeCartQuantities,
  writeSessionCart,
  type AddableCartLine,
  type AddRecipeLinesResult,
  type SessionCart,
  type UpdateRecipeCartQuantitiesResult,
} from '@/entities/cart';
import { addRecipeLinesToCart } from '../api/add-recipe-lines-to-cart';
import {
  removeCartItem as removeCartItemAction,
  removeCartItems as removeCartItemsAction,
} from '../api/remove-cart-item';
import { updateRecipeCartQuantitiesInCart } from '../api/update-recipe-cart-quantities-in-cart';

export type CreateCartStoreOptions = {
  isAuthenticated: boolean;
  initialCart?: SessionCart;
};

export type CartStore = {
  cart: SessionCart;
  isAuthenticated: boolean;
  itemCount: number;
  addRecipeLines: (params: {
    recipeId: string;
    recipeTitle: string;
    outputQuantity: number;
    lines: AddableCartLine[];
  }) => Promise<AddRecipeLinesResult>;
  updateRecipeCartQuantities: (params: {
    recipeId: string;
    newOutputQuantity: number;
  }) => Promise<UpdateRecipeCartQuantitiesResult>;
  removeItem: (itemId: string) => Promise<void>;
  removeItems: (itemIds: string[]) => Promise<void>;
  setCart: (cart: SessionCart) => void;
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
      addRecipeLines: async (params) => {
        const { cart, isAuthenticated } = get();

        if (isAuthenticated) {
          const result = await addRecipeLinesToCart({
            ...params,
            currentCart: cart,
          });
          commitCart(result.cart);
          return result;
        }

        const result = addRecipeLines(cart, {
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
