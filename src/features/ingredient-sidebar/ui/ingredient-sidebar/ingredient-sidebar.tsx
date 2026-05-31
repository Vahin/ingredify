'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RecipeIngredientGroupView } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import {
  getSyncedOutputQuantity,
} from '@/entities/cart';
import {
  collectAddableLines,
  IngredientSelectionBar,
  IngredientSidebarMenu,
  showCartAddToasts,
  showOutputQuantityChangedToast,
  useCart,
  useCartFlyAnimation,
  useIngredientSelection,
} from '@/features/add-to-cart';
import { hasRecipeServings } from '@/entities/recipe/lib/has-recipe-servings';
import { getScalingBase } from '../../model/lib/output-quantity';
import { useRecipeOutputQuantity } from '../../model/lib/use-recipe-output-quantity';
import { IngredientSidebarHeader } from '../ingredient-sidebar-header/ingredient-sidebar-header';
import { IngredientSidebarLayout } from '../ingredient-sidebar-layout/ingredient-sidebar-layout';
import { IngredientSidebarList } from '@/entities/ingredient';

type IngredientSidebarProps = {
  recipeId: string;
  groups: RecipeIngredientGroupView[];
  output: RecipeOutput;
};

export const IngredientSidebar = ({
  recipeId,
  groups,
  output,
}: IngredientSidebarProps) => {
  const { cart, addRecipeLines } = useCart();
  const { flyStickers } = useCartFlyAnimation();
  const {
    isSelectionMode,
    selectedIds,
    selectedCount,
    toggleSelectionMode,
    toggleLine,
    exitSelectionMode,
  } = useIngredientSelection();

  const {
    selectedOutputQuantity,
    setOutputQuantity,
    increaseOutputQuantity,
    decreaseOutputQuantity,
    scaledGroups,
  } = useRecipeOutputQuantity(output, groups);

  const previousOutputRef = useRef<number>(selectedOutputQuantity);

  useEffect(() => {
    const previousSynced = getSyncedOutputQuantity(cart, recipeId);

    if (
      previousSynced !== null &&
      previousSynced !== selectedOutputQuantity &&
      previousOutputRef.current !== selectedOutputQuantity
    ) {
      const portionRecipe = hasRecipeServings(output);
      const unitLabel = portionRecipe ? 'порций' : output.unit.label;
      showOutputQuantityChangedToast(
        previousSynced,
        selectedOutputQuantity,
        unitLabel,
      );
    }

    previousOutputRef.current = selectedOutputQuantity;
  }, [cart, output, recipeId, selectedOutputQuantity]);

  const runFlyAnimation = useCallback((lineIds: string[]) => {
    const sourceElements = lineIds
      .map((lineId) =>
        document.querySelector(
          `[data-ingredient-row-id="${lineId}"] [data-ingredient-sticker]`,
        ),
      )
      .filter((element): element is Element => element !== null);

    const stickers = lineIds
      .map((lineId) => {
        const groupLine = scaledGroups
          .flatMap((group) => group.lines)
          .find((line) => line.id === lineId);
        return groupLine?.sticker;
      })
      .filter((sticker): sticker is string => Boolean(sticker));

    flyStickers(stickers, sourceElements);
  }, [flyStickers, scaledGroups]);

  const handleAddLines = useCallback(
    async (selectedOnly: boolean) => {
      const scaleFactor =
        selectedOutputQuantity / getScalingBase(output);

      const lines = collectAddableLines(
        groups,
        scaleFactor,
        selectedOnly ? selectedIds : undefined,
      );

      if (lines.length === 0) {
        return;
      }

      const result = await addRecipeLines({
        recipeId,
        outputQuantity: selectedOutputQuantity,
        lines,
      });

      showCartAddToasts(result, {
        selectionCount: selectedOnly ? selectedCount : lines.length,
      });

      if (!result.isAlreadySynced) {
        runFlyAnimation(lines.map((line) => line.recipeIngredientId));
      }

      if (selectedOnly) {
        exitSelectionMode();
      }
    },
    [
      addRecipeLines,
      exitSelectionMode,
      groups,
      output,
      recipeId,
      runFlyAnimation,
      selectedCount,
      selectedIds,
      selectedOutputQuantity,
    ],
  );

  return (
    <IngredientSidebarLayout
      footer={
        isSelectionMode ? (
          <IngredientSelectionBar
            onAddSelected={() => void handleAddLines(true)}
            selectedCount={selectedCount}
          />
        ) : null
      }
      header={
        <IngredientSidebarHeader
          menu={
            <IngredientSidebarMenu
              isSelectionMode={isSelectionMode}
              onAddAllToCart={() => void handleAddLines(false)}
              onToggleSelectionMode={toggleSelectionMode}
            />
          }
          quantityControl={{
            value: selectedOutputQuantity,
            output,
            onChange: setOutputQuantity,
            onDecrease: decreaseOutputQuantity,
            onIncrease: increaseOutputQuantity,
          }}
        />
      }
      list={
        <IngredientSidebarList
          groups={scaledGroups}
          isSelectionMode={isSelectionMode}
          onToggleLine={toggleLine}
          selectedIds={selectedIds}
        />
      }
    />
  );
};
