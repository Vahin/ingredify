'use client';

import { useCallback } from 'react';
import type { RecipeIngredientGroupView } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import { useCartActions, useRecipeCartMeta, useCartStore } from '@/entities/cart';
import {
  collectAddableLines,
  CartUpdateDialog,
  IngredientSidebarMenu,
  showCartAddToasts,
} from '@/features/add-to-cart';
import { hasRecipeServings } from '@/entities/recipe/lib/has-recipe-servings';
import { getScalingBase } from '../../model/lib/output-quantity';
import { useCartOutputUpdateDialog } from '../../model/lib/use-cart-output-update-dialog';
import { useRecipeOutputQuantity } from '../../model/lib/use-recipe-output-quantity';
import { IngredientSidebarHeader } from '../ingredient-sidebar-header/ingredient-sidebar-header';
import { IngredientSidebarLayout } from '../ingredient-sidebar-layout/ingredient-sidebar-layout';
import { IngredientSidebarList } from '../ingredient-sidebar-list/ingredient-sidebar-list';

type IngredientSidebarProps = {
  recipeId: string;
  recipeTitle: string;
  groups: RecipeIngredientGroupView[];
  output: RecipeOutput;
};

export const IngredientSidebar = ({
  recipeId,
  recipeTitle,
  groups,
  output,
}: IngredientSidebarProps) => {
  const cart = useCartStore((state) => state.cart);
  const { addItems } = useCartActions();
  const { inCartIds, syncedOutputQuantity } = useRecipeCartMeta(recipeId);

  const {
    selectedOutputQuantity,
    setOutputQuantity,
    increaseOutputQuantity,
    decreaseOutputQuantity,
    scaledGroups,
  } = useRecipeOutputQuantity(output, groups);

  const { cartUpdateDialog, markOutputQuantityChanged } =
    useCartOutputUpdateDialog({
      cartIngredientCount: inCartIds.size,
      recipeId,
      selectedOutputQuantity,
      syncedOutputQuantity,
    });

  const wrappedSetOutputQuantity = useCallback(
    (value: number) => {
      markOutputQuantityChanged();
      setOutputQuantity(value);
    },
    [markOutputQuantityChanged, setOutputQuantity],
  );

  const wrappedIncreaseOutputQuantity = useCallback(() => {
    markOutputQuantityChanged();
    increaseOutputQuantity();
  }, [increaseOutputQuantity, markOutputQuantityChanged]);

  const wrappedDecreaseOutputQuantity = useCallback(() => {
    markOutputQuantityChanged();
    decreaseOutputQuantity();
  }, [decreaseOutputQuantity, markOutputQuantityChanged]);

  const handleAddAllLines = useCallback(async () => {
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

  const portionRecipe = hasRecipeServings(output);
  const unitLabel = portionRecipe ? 'порций' : output.unit.label;

  return (
    <>
      <IngredientSidebarLayout
        footer={null}
        header={
          <IngredientSidebarHeader
            menu={
              <IngredientSidebarMenu
                onAddAllToCart={() => void handleAddAllLines()}
              />
            }
            quantityControl={{
              value: selectedOutputQuantity,
              output,
              onChange: wrappedSetOutputQuantity,
              onDecrease: wrappedDecreaseOutputQuantity,
              onIncrease: wrappedIncreaseOutputQuantity,
            }}
          />
        }
        list={
          <IngredientSidebarList
            groups={scaledGroups}
            output={output}
            recipeId={recipeId}
            recipeTitle={recipeTitle}
            selectedOutputQuantity={selectedOutputQuantity}
            sourceGroups={groups}
          />
        }
      />

      <CartUpdateDialog
        {...cartUpdateDialog}
        unitLabel={unitLabel}
      />
    </>
  );
};
