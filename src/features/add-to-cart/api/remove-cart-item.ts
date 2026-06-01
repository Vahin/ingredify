'use server';

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

  return persistSessionCart(user.id, nextCart);
}

/** Удаляет несколько позиций из корзины авторизованного пользователя */
export async function removeCartItems(itemIds: string[]): Promise<SessionCart> {
  const user = await verifySession();
  const currentCart = await getCart();
  const nextCart = removeCartItemsFromSession(currentCart, itemIds);

  return persistSessionCart(user.id, nextCart);
}

/** Возвращает корзину авторизованного пользователя */
export async function fetchUserCart(): Promise<SessionCart> {
  await verifySession();
  return getCart();
}
