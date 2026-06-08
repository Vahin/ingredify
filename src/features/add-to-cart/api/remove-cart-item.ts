'use server';

import { revalidatePath } from 'next/cache';
import { getCart } from '@/entities/cart/api/get-cart';
import {
  removeCartItemFromSession,
  removeCartItemsFromSession,
  type SessionCart,
} from '@/entities/cart';
import { verifySession } from '@/shared/lib/auth';
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
