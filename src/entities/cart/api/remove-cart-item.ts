'use server';

import { revalidatePath } from 'next/cache';
import { verifySession } from '@/shared/lib/auth';
import {
  removeCartItemFromSession,
  removeCartItemsFromSession,
} from '../lib/remove-cart-item';
import type { SessionCart } from '../model/types/cart';
import { getCart } from './get-cart';
import { persistSessionCart } from './persist-cart';

/** Удаляет позицию из корзины авторизованного пользователя */
export async function removeCartItem(itemId: string): Promise<SessionCart> {
  const user = await verifySession();
  const currentCart = await getCart();
  const nextCart = removeCartItemFromSession(currentCart, itemId);

  const cart = await persistSessionCart(user.id, nextCart);
  revalidatePath('/cart');

  return cart;
}

/** Удаляет несколько позиций из корзины авторизованного пользователя */
export async function removeCartItems(itemIds: string[]): Promise<SessionCart> {
  const user = await verifySession();
  const currentCart = await getCart();
  const nextCart = removeCartItemsFromSession(currentCart, itemIds);

  const cart = await persistSessionCart(user.id, nextCart);
  revalidatePath('/cart');

  return cart;
}

/** Возвращает корзину авторизованного пользователя */
export async function fetchUserCart(): Promise<SessionCart> {
  await verifySession();
  return getCart();
}
