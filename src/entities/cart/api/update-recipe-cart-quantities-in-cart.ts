'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from '@/shared/lib/auth';
import { updateRecipeCartQuantities } from '../lib/update-recipe-cart-quantities';
import type {
  SessionCart,
  UpdateRecipeCartQuantitiesResult,
} from '../model/types/cart';
import { persistSessionCart } from './persist-cart';

export type UpdateRecipeCartQuantitiesInput = {
  recipeId: string;
  newOutputQuantity: number;
  currentCart: SessionCart;
};

/** Пересчитывает количества позиций рецепта в корзине */
export async function updateRecipeCartQuantitiesInCart(
  input: UpdateRecipeCartQuantitiesInput,
): Promise<UpdateRecipeCartQuantitiesResult & { cart: SessionCart }> {
  const user = await verifySession();

  const result = updateRecipeCartQuantities(input.currentCart, {
    recipeId: input.recipeId,
    newOutputQuantity: input.newOutputQuantity,
  });

  const cart = await persistSessionCart(user.id, result.cart);
  revalidatePath('/cart');

  return {
    ...result,
    cart,
  };
}
