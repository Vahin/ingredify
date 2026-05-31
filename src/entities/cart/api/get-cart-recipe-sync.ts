import { cache } from 'react';
import { getCurrentUser } from '@/entities/user';
import { prisma } from '@/shared/lib/prisma';
import type { CartRecipeSyncView } from '../model/types/cart';

/** Снимок синхронизации рецепта с корзиной пользователя */
export const getCartRecipeSync = cache(
  async (recipeId: string): Promise<CartRecipeSyncView | null> => {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    const sync = await prisma.cartRecipeSync.findFirst({
      where: {
        recipeId,
        cart: { userId: user.id },
      },
      include: { lineSyncs: true },
    });

    if (!sync) {
      return null;
    }

    return {
      recipeId: sync.recipeId,
      syncedOutputQuantity: Number(sync.syncedOutputQuantity),
      lineSyncs: sync.lineSyncs.map((line) => ({
        recipeIngredientId: line.recipeIngredientId,
        syncedQuantity: Number(line.syncedQuantity),
      })),
    };
  },
);
