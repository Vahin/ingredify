import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import { normalizeCartQuantity } from './normalize-cart-quantity';
import type {
  SessionCart,
  UpdateRecipeCartQuantitiesResult,
} from '../model/types/cart';

const findRecipeSync = (cart: SessionCart, recipeId: string) =>
  cart.recipeSyncs.find((sync) => sync.recipeId === recipeId);

/** Пропорционально пересчитывает количества позиций рецепта в корзине */
export function updateRecipeCartQuantities(
  cart: SessionCart,
  params: {
    recipeId: string;
    newOutputQuantity: number;
  },
): UpdateRecipeCartQuantitiesResult {
  const { recipeId, newOutputQuantity } = params;
  const recipeSync = findRecipeSync(cart, recipeId);

  if (!recipeSync || recipeSync.syncedOutputQuantity === newOutputQuantity) {
    return { cart, updatedCount: 0 };
  }

  const scaleRatio = newOutputQuantity / recipeSync.syncedOutputQuantity;
  let updatedCount = 0;

  const nextCart: SessionCart = {
    items: cart.items.map((item) => {
      if (item.sourceRecipeId !== recipeId) {
        return item;
      }

      const nextQuantity = normalizeCartQuantity(
        item.quantity * scaleRatio,
        item.unit,
      );
      updatedCount += 1;

      return {
        ...item,
        quantity: nextQuantity,
        amountValue: formatAmountValue(nextQuantity, item.unit),
      };
    }),
    recipeSyncs: cart.recipeSyncs.map((sync) =>
      sync.recipeId === recipeId
        ? { ...sync, syncedOutputQuantity: newOutputQuantity }
        : sync,
    ),
  };

  return {
    cart: nextCart,
    updatedCount,
  };
}

export function getSyncedOutputQuantity(
  cart: SessionCart,
  recipeId: string,
): number | null {
  return findRecipeSync(cart, recipeId)?.syncedOutputQuantity ?? null;
}
