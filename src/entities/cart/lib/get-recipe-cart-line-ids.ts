import type { SessionCart } from '../model/types/cart';

/** Возвращает id строк рецепта, которые уже есть в корзине */
export function getRecipeCartLineIds(
  cart: SessionCart,
  recipeId: string,
): Set<string> {
  const ids = new Set<string>();

  for (const item of cart.items) {
    if (
      item.sourceRecipeId === recipeId &&
      item.recipeIngredientId
    ) {
      ids.add(item.recipeIngredientId);
    }
  }

  return ids;
}
