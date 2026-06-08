'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecipeIngredientGroupView } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import {
  useCartActions,
  useRecipeCartMeta,
  useCartStore,
} from '@/entities/cart';
import {
  collectAddableLines,
  CartUpdateDialog,
  IngredientSidebarMenu,
  showCartAddToasts,
  showCartUpdatedToast,
} from '@/features/add-to-cart';
import { hasRecipeServings } from '@/entities/recipe/lib/has-recipe-servings';
import { getScalingBase } from '../../model/lib/output-quantity';
import { useRecipeOutputQuantity } from '../../model/lib/use-recipe-output-quantity';
import { IngredientSidebarHeader } from '../ingredient-sidebar-header/ingredient-sidebar-header';
import { IngredientSidebarLayout } from '../ingredient-sidebar-layout/ingredient-sidebar-layout';
import { IngredientSidebarList } from '../ingredient-sidebar-list/ingredient-sidebar-list';

const OUTPUT_CHANGE_DEBOUNCE_MS = 600;

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
  const { addItems, updateRecipeCartQuantities } = useCartActions();
  const { inCartIds, syncedOutputQuantity } = useRecipeCartMeta(recipeId);

  const {
    selectedOutputQuantity,
    setOutputQuantity,
    increaseOutputQuantity,
    decreaseOutputQuantity,
    scaledGroups,
  } = useRecipeOutputQuantity(output, groups);

  const hasUserChangedOutputRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [dialogQuantities, setDialogQuantities] = useState({
    previous: selectedOutputQuantity,
    next: selectedOutputQuantity,
  });

  const markUserOutputChange = useCallback(() => {
    hasUserChangedOutputRef.current = true;
  }, []);

  const wrappedSetOutputQuantity = useCallback(
    (value: number) => {
      markUserOutputChange();
      setOutputQuantity(value);
    },
    [markUserOutputChange, setOutputQuantity],
  );

  const wrappedIncreaseOutputQuantity = useCallback(() => {
    markUserOutputChange();
    increaseOutputQuantity();
  }, [increaseOutputQuantity, markUserOutputChange]);

  const wrappedDecreaseOutputQuantity = useCallback(() => {
    markUserOutputChange();
    decreaseOutputQuantity();
  }, [decreaseOutputQuantity, markUserOutputChange]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!hasUserChangedOutputRef.current) {
      return;
    }

    if (
      syncedOutputQuantity === null ||
      syncedOutputQuantity === selectedOutputQuantity ||
      inCartIds.size === 0
    ) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setDialogQuantities({
        previous: syncedOutputQuantity,
        next: selectedOutputQuantity,
      });
      setUpdateDialogOpen(true);
    }, OUTPUT_CHANGE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inCartIds.size, selectedOutputQuantity, syncedOutputQuantity]);

  const handleConfirmCartUpdate = useCallback(async () => {
    setUpdateDialogOpen(false);

    const result = await updateRecipeCartQuantities({
      recipeId,
      newOutputQuantity: selectedOutputQuantity,
    });

    showCartUpdatedToast(result.updatedCount);
  }, [recipeId, selectedOutputQuantity, updateRecipeCartQuantities]);

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
        nextQuantity={dialogQuantities.next}
        onConfirm={() => void handleConfirmCartUpdate()}
        onOpenChange={setUpdateDialogOpen}
        open={updateDialogOpen}
        previousQuantity={dialogQuantities.previous}
        unitLabel={unitLabel}
      />
    </>
  );
};
