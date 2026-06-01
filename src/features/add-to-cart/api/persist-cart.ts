import type { SessionCart } from '@/entities/cart';
import { cartInclude, mapCartToSessionCart } from '@/entities/cart/lib/map-cart-to-session';
import { prisma } from '@/shared/lib/prisma';

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: { userId },
    include: cartInclude,
  });
}

export async function persistSessionCart(userId: string, cart: SessionCart) {
  const dbCart = await getOrCreateCart(userId);

  await prisma.$transaction(async (tx) => {
    const existingItems = await tx.cartItem.findMany({
      where: { cartId: dbCart.id },
    });
    const nextItemIds = new Set(cart.items.map((item) => item.id));

    for (const item of cart.items) {
      if (!item.sourceRecipeId || !item.recipeIngredientId) {
        continue;
      }

      await tx.cartItem.upsert({
        where: {
          cartId_sourceRecipeId_recipeIngredientId: {
            cartId: dbCart.id,
            sourceRecipeId: item.sourceRecipeId,
            recipeIngredientId: item.recipeIngredientId,
          },
        },
        create: {
          id: item.id,
          cartId: dbCart.id,
          sourceRecipeId: item.sourceRecipeId,
          recipeIngredientId: item.recipeIngredientId,
          name: item.name,
          sticker: item.sticker,
          quantity: item.quantity,
          unitId: item.unitId,
          isSubRecipe: item.isSubRecipe,
        },
        update: {
          name: item.name,
          sticker: item.sticker,
          quantity: item.quantity,
          unitId: item.unitId,
          isSubRecipe: item.isSubRecipe,
        },
      });
    }

    for (const existingItem of existingItems) {
      if (!nextItemIds.has(existingItem.id)) {
        await tx.cartItem.delete({ where: { id: existingItem.id } });
      }
    }

    const nextRecipeIds = new Set(cart.recipeSyncs.map((sync) => sync.recipeId));

    for (const sync of cart.recipeSyncs) {
      await tx.cartRecipeSync.upsert({
        where: {
          cartId_recipeId: {
            cartId: dbCart.id,
            recipeId: sync.recipeId,
          },
        },
        create: {
          cartId: dbCart.id,
          recipeId: sync.recipeId,
          recipeTitle: sync.recipeTitle,
          syncedOutputQuantity: sync.syncedOutputQuantity,
        },
        update: {
          recipeTitle: sync.recipeTitle,
          syncedOutputQuantity: sync.syncedOutputQuantity,
        },
      });
    }

    const existingSyncs = await tx.cartRecipeSync.findMany({
      where: { cartId: dbCart.id },
      select: { id: true, recipeId: true },
    });

    for (const existingSync of existingSyncs) {
      if (!nextRecipeIds.has(existingSync.recipeId)) {
        await tx.cartRecipeSync.delete({ where: { id: existingSync.id } });
      }
    }
  });

  const updated = await prisma.cart.findUniqueOrThrow({
    where: { id: dbCart.id },
    include: cartInclude,
  });

  return mapCartToSessionCart(updated);
}
