'use server';

import { revalidatePath } from 'next/cache';
import {
  addItems,
  type AddableCartLine,
  type AddItemsResult,
  type SessionCart,
} from '@/entities/cart';
import { verifySession } from '@/shared/lib/auth';
import { persistSessionCart } from './persist-cart';

export type AddItemsToCartInput = {
  recipeId: string;
  recipeTitle: string;
  outputQuantity: number;
  lines: AddableCartLine[];
  currentCart: SessionCart;
};

export type AddItemsToCartResult = AddItemsResult;

/** Добавляет позиции рецепта в корзину авторизованного пользователя */
export async function addItemsToCart(
  input: AddItemsToCartInput,
): Promise<AddItemsToCartResult> {
  const user = await verifySession();

  const result = addItems(input.currentCart, {
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
