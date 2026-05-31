'use server';

import {
  applyCartDelta,
  type AddableCartLine,
  type ApplyCartDeltaResult,
  type SessionCart,
} from '@/entities/cart';
import { verifySession } from '@/shared/lib/auth';
import { persistSessionCart } from './persist-cart';

export type AddRecipeLinesToCartInput = {
  recipeId: string;
  outputQuantity: number;
  lines: AddableCartLine[];
  currentCart: SessionCart;
};

export type AddRecipeLinesToCartResult = ApplyCartDeltaResult & {
  cart: SessionCart;
};

/** Добавляет строки рецепта в корзину авторизованного пользователя */
export async function addRecipeLinesToCart(
  input: AddRecipeLinesToCartInput,
): Promise<AddRecipeLinesToCartResult> {
  const user = await verifySession();

  const deltaResult = applyCartDelta(input.currentCart, {
    recipeId: input.recipeId,
    outputQuantity: input.outputQuantity,
    lines: input.lines,
    createId: () => crypto.randomUUID(),
  });

  const cart = await persistSessionCart(user.id, deltaResult.cart);

  return {
    ...deltaResult,
    cart,
  };
}
