import type {
  AddableCartLine,
  AddRecipeLinesResult,
  SessionCart,
} from '../model/types/cart';

const findCartItem = (
  cart: SessionCart,
  sourceRecipeId: string,
  recipeIngredientId: string,
) =>
  cart.items.find(
    (item) =>
      item.sourceRecipeId === sourceRecipeId &&
      item.recipeIngredientId === recipeIngredientId,
  );

const findRecipeSync = (cart: SessionCart, recipeId: string) =>
  cart.recipeSyncs.find((sync) => sync.recipeId === recipeId);

/** Добавляет в корзину только новые строки рецепта */
export function addRecipeLines(
  cart: SessionCart,
  params: {
    recipeId: string;
    recipeTitle: string;
    outputQuantity: number;
    lines: AddableCartLine[];
    createId: () => string;
  },
): AddRecipeLinesResult {
  const { recipeId, recipeTitle, outputQuantity, lines, createId } = params;

  if (lines.length === 0) {
    return {
      cart,
      addedLines: [],
      skippedCount: 0,
    };
  }

  const nextCart: SessionCart = {
    items: cart.items.map((item) => ({ ...item })),
    recipeSyncs: cart.recipeSyncs.map((sync) => ({ ...sync })),
  };

  const addedLines: AddableCartLine[] = [];
  let skippedCount = 0;

  for (const line of lines) {
    if (findCartItem(nextCart, recipeId, line.recipeIngredientId)) {
      skippedCount += 1;
      continue;
    }

    nextCart.items.push({
      id: createId(),
      sourceRecipeId: recipeId,
      recipeIngredientId: line.recipeIngredientId,
      name: line.name,
      sticker: line.sticker,
      quantity: line.quantity,
      amountValue: line.amountValue,
      unit: line.unit,
      unitId: line.unitId,
      isSubRecipe: line.isSubRecipe,
    });
    addedLines.push(line);
  }

  if (addedLines.length > 0) {
    const existingSync = findRecipeSync(nextCart, recipeId);

    if (existingSync) {
      existingSync.syncedOutputQuantity = outputQuantity;
      if (recipeTitle) {
        existingSync.recipeTitle = recipeTitle;
      }
    } else {
      nextCart.recipeSyncs.push({
        recipeId,
        recipeTitle,
        syncedOutputQuantity: outputQuantity,
      });
    }
  }

  return {
    cart: nextCart,
    addedLines,
    skippedCount,
  };
}
