import { cache } from 'react';
import { getCurrentUser } from '@/entities/user';
import { prisma } from '@/shared/lib/prisma';
import { emptyCart } from '../lib/empty-cart';
import { cartInclude, mapCartToSessionCart } from '../lib/map-cart-to-session';
import type { SessionCart } from '../model/types/cart';

/** Возвращает корзину текущего пользователя или пустую для гостя */
export const getCart = cache(async (): Promise<SessionCart> => {
  const user = await getCurrentUser();
  if (!user) {
    return emptyCart();
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: cartInclude,
  });

  if (!cart) {
    return emptyCart();
  }

  return mapCartToSessionCart(cart);
});

/** Количество позиций в корзине авторизованного пользователя */
export const getCartItemCount = cache(async (): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) {
    return 0;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: {
      _count: { select: { items: true } },
    },
  });

  return cart?._count.items ?? 0;
});
