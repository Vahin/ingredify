import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  applyCartDelta,
  clearLineSyncForRemovedItem,
  emptyCart,
  readSessionCart,
  writeSessionCart,
  type AddableCartLine,
  type ApplyCartDeltaResult,
  type SessionCart,
} from '@/entities/cart';
import { addRecipeLinesToCart } from '../../api/add-recipe-lines-to-cart';
import { removeCartItem as removeCartItemAction } from '../../api/remove-cart-item';

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

  const addRecipeLines = useCallback(
    async (params: {
      recipeId: string;
      outputQuantity: number;
      lines: AddableCartLine[];
    }): Promise<ApplyCartDeltaResult> => {
      if (isAuthenticated) {
        const result = await addRecipeLinesToCart({
          ...params,
          currentCart: cart,
        });
        setCart(result.cart);
        return result;
      }

      const result = applyCartDelta(cart, {
        ...params,
        createId: () => crypto.randomUUID(),
      });
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

      setCart((current) => {
        const removedItem = current.items.find((item) => item.id === itemId);
        if (!removedItem) {
          return current;
        }

        const withoutItem: SessionCart = {
          ...current,
          items: current.items.filter((item) => item.id !== itemId),
        };

        return clearLineSyncForRemovedItem(withoutItem, removedItem);
      });
    },
    [isAuthenticated],
  );

  return useMemo(
    () => ({
      cart,
      itemCount,
      addRecipeLines,
      removeItem,
      setCart,
    }),
    [addRecipeLines, cart, itemCount, removeItem],
  );
}
