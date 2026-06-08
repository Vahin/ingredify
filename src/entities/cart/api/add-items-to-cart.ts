'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from '@/shared/lib/auth';
import { addItems } from '../lib/add-items';
import type {
  AddableCartLine,
  AddItemsResult,
  SessionCart,
} from '../model/types/cart';
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
