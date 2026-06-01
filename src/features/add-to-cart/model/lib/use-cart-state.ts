import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { addRecipeLinesToCart } from '../../api/add-recipe-lines-to-cart';
import {
  removeCartItem as removeCartItemAction,
  removeCartItems as removeCartItemsAction,
} from '../../api/remove-cart-item';
import { updateRecipeCartQuantitiesInCart } from '../../api/update-recipe-cart-quantities-in-cart';

type UseCartOptions = {
  isAuthenticated: boolean;
  initialCart?: SessionCart;
};

export function useCartState({ isAuthenticated, initialCart }: UseCartOptions) {
  const [cart, setCart] = useState<SessionCart>(() => {
    if (isAuthenticated) {
      return initialCart ?? emptyCart();
    }
    return readSessionCart();
  });

  useEffect(() => {
    if (!isAuthenticated) {
      writeSessionCart(cart);
    }
  }, [cart, isAuthenticated]);

  const itemCount = cart.items.length;

  const addRecipeLinesToCartState = useCallback(
    async (params: {
      recipeId: string;
      recipeTitle: string;
      outputQuantity: number;
      lines: AddableCartLine[];
    }): Promise<AddRecipeLinesResult> => {
      if (isAuthenticated) {
        const result = await addRecipeLinesToCart({
          ...params,
          currentCart: cart,
        });
        setCart(result.cart);
        return result;
      }

      const result = addRecipeLines(cart, {
        ...params,
        createId: () => crypto.randomUUID(),
      });
      setCart(result.cart);
      return result;
    },
    [cart, isAuthenticated],
  );

  const updateRecipeCartQuantitiesState = useCallback(
    async (params: {
      recipeId: string;
      newOutputQuantity: number;
    }): Promise<UpdateRecipeCartQuantitiesResult> => {
      if (isAuthenticated) {
        const result = await updateRecipeCartQuantitiesInCart({
          ...params,
          currentCart: cart,
        });
        setCart(result.cart);
        return result;
      }

      const result = updateRecipeCartQuantities(cart, params);
      setCart(result.cart);
      return result;
    },
    [cart, isAuthenticated],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (isAuthenticated) {
        const nextCart = await removeCartItemAction(itemId);
        setCart(nextCart);
        return;
      }

      setCart((current) => removeCartItemFromSession(current, itemId));
    },
    [isAuthenticated],
  );

  const removeItems = useCallback(
    async (itemIds: string[]) => {
      if (isAuthenticated) {
        const nextCart = await removeCartItemsAction(itemIds);
        setCart(nextCart);
        return;
      }

      setCart((current) => removeCartItemsFromSession(current, itemIds));
    },
    [isAuthenticated],
  );

  return useMemo(
    () => ({
      cart,
      itemCount,
      addRecipeLines: addRecipeLinesToCartState,
      updateRecipeCartQuantities: updateRecipeCartQuantitiesState,
      removeItem,
      removeItems,
      setCart,
    }),
    [
      addRecipeLinesToCartState,
      cart,
      itemCount,
      removeItem,
      removeItems,
      updateRecipeCartQuantitiesState,
    ],
  );
}
