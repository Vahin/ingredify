'use server';

import { revalidatePath } from 'next/cache';
import {
  addRecipeLines,
  type AddableCartLine,
  type AddRecipeLinesResult,
  type SessionCart,
} from '@/entities/cart';
import { verifySession } from '@/shared/lib/auth';
import { persistSessionCart } from './persist-cart';

export type AddRecipeLinesToCartInput = {
  recipeId: string;
  recipeTitle: string;
  outputQuantity: number;
  lines: AddableCartLine[];
  currentCart: SessionCart;
};

export type AddRecipeLinesToCartResult = AddRecipeLinesResult;

/** Добавляет строки рецепта в корзину авторизованного пользователя */
export async function addRecipeLinesToCart(
  input: AddRecipeLinesToCartInput,
): Promise<AddRecipeLinesToCartResult> {
  const user = await verifySession();

  const result = addRecipeLines(input.currentCart, {
    recipeId: input.recipeId,
    recipeTitle: input.recipeTitle,
    outputQuantity: input.outputQuantity,
    lines: input.lines,
    createId: () => crypto.randomUUID(),
  });

  const cart = await persistSessionCart(user.id, result.cart);
  revalidatePath('/cart');

  return {
    ...result,
    cart,
  };
}
