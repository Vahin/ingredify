import type { SessionCart } from '../model/types/cart';
import { getSyncedOutputQuantity } from './update-recipe-cart-quantities';

export type RecipeCartMeta = {
  inCartIds: Set<string>;
  itemIdsByLineId: Map<string, string>;
  syncedOutputQuantity: number | null;
};

export function getRecipeCartMeta(
  cart: SessionCart,
  recipeId: string,
): RecipeCartMeta {
  const inCartIds = new Set<string>();
  const itemIdsByLineId = new Map<string, string>();

  for (const item of cart.items) {
    if (item.sourceRecipeId !== recipeId || !item.recipeIngredientId) {
      continue;
    }

    inCartIds.add(item.recipeIngredientId);
    itemIdsByLineId.set(item.recipeIngredientId, item.id);
  }

  return {
    inCartIds,
    itemIdsByLineId,
    syncedOutputQuantity: getSyncedOutputQuantity(cart, recipeId),
  };
}
