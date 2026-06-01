import type { SessionCart } from '../model/types/cart';

/** Удаляет позицию из корзины; при последней позиции рецепта — удаляет sync */
export function removeCartItemFromSession(
  cart: SessionCart,
  itemId: string,
): SessionCart {
  const removedItem = cart.items.find((item) => item.id === itemId);
  if (!removedItem) {
    return cart;
  }

  const nextItems = cart.items.filter((item) => item.id !== itemId);
  const recipeId = removedItem.sourceRecipeId;

  if (!recipeId) {
    return { ...cart, items: nextItems };
  }

  const hasRemainingRecipeItems = nextItems.some(
    (item) => item.sourceRecipeId === recipeId,
  );

  return {
    items: nextItems,
    recipeSyncs: hasRemainingRecipeItems
      ? cart.recipeSyncs
      : cart.recipeSyncs.filter((sync) => sync.recipeId !== recipeId),
  };
}

/** Удаляет все позиции с указанными id */
export function removeCartItemsFromSession(
  cart: SessionCart,
  itemIds: string[],
): SessionCart {
  const idsToRemove = new Set(itemIds);
  const nextItems = cart.items.filter((item) => !idsToRemove.has(item.id));

  const affectedRecipeIds = new Set(
    cart.items
      .filter((item) => idsToRemove.has(item.id) && item.sourceRecipeId)
      .map((item) => item.sourceRecipeId as string),
  );

  const recipeIdsToClear = [...affectedRecipeIds].filter(
    (recipeId) =>
      !nextItems.some((item) => item.sourceRecipeId === recipeId),
  );

  return {
    items: nextItems,
    recipeSyncs: cart.recipeSyncs.filter(
      (sync) => !recipeIdsToClear.includes(sync.recipeId),
    ),
  };
}
