'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RecipeIngredientGroupView } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import {
  getRecipeCartLineIds,
  getSyncedOutputQuantity,
} from '@/entities/cart';
import {
  collectAddableLines,
  CartUpdateDialog,
  IngredientSelectionBar,
  IngredientSidebarMenu,
  showCartAddToasts,
  showCartUpdatedToast,
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
  const { cart, addRecipeLines, updateRecipeCartQuantities } = useCart();
  const { flyStickers } = useCartFlyAnimation();

  const inCartIds = useMemo(
    () => getRecipeCartLineIds(cart, recipeId),
    [cart, recipeId],
  );

  const {
    isSelectionMode,
    selectedCount,
    toggleSelectionMode,
    toggleLine,
    exitSelectionMode,
    isLineSelected,
  } = useIngredientSelection(inCartIds);

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

    const syncedOutput = getSyncedOutputQuantity(cart, recipeId);

    if (
      syncedOutput === null ||
      syncedOutput === selectedOutputQuantity ||
      inCartIds.size === 0
    ) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setDialogQuantities({
        previous: syncedOutput,
        next: selectedOutputQuantity,
      });
      setUpdateDialogOpen(true);
    }, OUTPUT_CHANGE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cart, inCartIds.size, recipeId, selectedOutputQuantity]);

  const handleConfirmCartUpdate = useCallback(async () => {
    setUpdateDialogOpen(false);

    const result = await updateRecipeCartQuantities({
      recipeId,
      newOutputQuantity: selectedOutputQuantity,
    });

    showCartUpdatedToast(result.updatedCount);
  }, [recipeId, selectedOutputQuantity, updateRecipeCartQuantities]);

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

      const newLines = selectedOnly
        ? collectAddableLines(
            groups,
            scaleFactor,
            new Set(
              groups
                .flatMap((group) => group.lines)
                .map((line) => line.id)
                .filter((id) => isLineSelected(id) && !inCartIds.has(id)),
            ),
          )
        : collectAddableLines(groups, scaleFactor).filter(
            (line) => !inCartIds.has(line.recipeIngredientId),
          );

      if (newLines.length === 0) {
        showCartAddToasts({ cart, addedLines: [], skippedCount: 0 });
        if (selectedOnly) {
          exitSelectionMode();
        }
        return;
      }

      const result = await addRecipeLines({
        recipeId,
        recipeTitle,
        outputQuantity: selectedOutputQuantity,
        lines: newLines,
      });

      showCartAddToasts(result, {
        selectionCount: selectedOnly ? selectedCount : newLines.length,
      });

      if (result.addedLines.length > 0) {
        runFlyAnimation(result.addedLines.map((line) => line.recipeIngredientId));
      }

      if (selectedOnly) {
        exitSelectionMode();
      }
    },
    [
      addRecipeLines,
      cart,
      exitSelectionMode,
      groups,
      inCartIds,
      isLineSelected,
      output,
      recipeId,
      recipeTitle,
      runFlyAnimation,
      selectedCount,
      selectedOutputQuantity,
    ],
  );

  const portionRecipe = hasRecipeServings(output);
  const unitLabel = portionRecipe ? 'порций' : output.unit.label;

  return (
    <>
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
              onChange: wrappedSetOutputQuantity,
              onDecrease: wrappedDecreaseOutputQuantity,
              onIncrease: wrappedIncreaseOutputQuantity,
            }}
          />
        }
        list={
          <IngredientSidebarList
            groups={scaledGroups}
            inCartIds={inCartIds}
            isLineSelected={isLineSelected}
            isSelectionMode={isSelectionMode}
            onToggleLine={toggleLine}
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
