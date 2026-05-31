'use server';

import { getCart } from '@/entities/cart/api/get-cart';
import type { SessionCart } from '@/entities/cart/model/types/cart';
import { verifySession } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { cartInclude, mapCartToSessionCart } from '@/entities/cart/lib/map-cart-to-session';

/** Удаляет позицию из корзины авторизованного пользователя */
export async function removeCartItem(itemId: string): Promise<SessionCart> {
  const user = await verifySession();

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!cart) {
    return getCart();
  }

  const removedItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
    select: {
      sourceRecipeId: true,
      recipeIngredientId: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (
    removedItem?.sourceRecipeId &&
    removedItem.recipeIngredientId
  ) {
    const recipeSync = await prisma.cartRecipeSync.findUnique({
      where: {
        cartId_recipeId: {
          cartId: cart.id,
          recipeId: removedItem.sourceRecipeId,
        },
      },
      select: { id: true },
    });

    if (recipeSync) {
      await prisma.cartRecipeLineSync.deleteMany({
        where: {
          syncId: recipeSync.id,
          recipeIngredientId: removedItem.recipeIngredientId,
        },
      });
    }
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: cartInclude,
  });

  if (!updated) {
    return getCart();
  }

  return mapCartToSessionCart(updated);
}

/** Возвращает корзину авторизованного пользователя */
export async function fetchUserCart(): Promise<SessionCart> {
  await verifySession();
  return getCart();
}
