import { useCallback } from 'react';
import { useCartActions, useCartStore } from '@/entities/cart';
import type { RecipeIngredientGroupView, RecipeOutput } from '@/entities/recipe';
import {
  collectAddableLines,
  showCartAddToasts,
} from '@/features/add-to-cart';
import { getScalingBase } from './output-quantity';

type UseAddAllIngredientsToCartParams = {
  recipeId: string;
  recipeTitle: string;
  groups: RecipeIngredientGroupView[];
  output: RecipeOutput;
  selectedOutputQuantity: number;
  inCartIds: Set<string>;
};

export function useAddAllIngredientsToCart({
  recipeId,
  recipeTitle,
  groups,
  output,
  selectedOutputQuantity,
  inCartIds,
}: UseAddAllIngredientsToCartParams) {
  const cart = useCartStore((state) => state.cart);
  const { addItems } = useCartActions();

  const addAllIngredientsToCart = useCallback(async () => {
    const scaleFactor = selectedOutputQuantity / getScalingBase(output);

    const newLines = collectAddableLines(groups, scaleFactor).filter(
      (line) => !inCartIds.has(line.recipeIngredientId),
    );

    if (newLines.length === 0) {
      showCartAddToasts(
        { cart, addedItems: [], skippedCount: 0 },
        { emptyMessage: 'Все ингредиенты уже в корзине' },
      );
      return;
    }

    const result = await addItems({
      recipeId,
      recipeTitle,
      outputQuantity: selectedOutputQuantity,
      lines: newLines,
    });

    showCartAddToasts(result);
  }, [
    addItems,
    cart,
    groups,
    inCartIds,
    output,
    recipeId,
    recipeTitle,
    selectedOutputQuantity,
  ]);

  return {
    addAllIngredientsToCart,
  };
}
