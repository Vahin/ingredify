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
  IngredientSidebarMenu,
  showCartAddToasts,
  showCartRemovedToast,
  showCartUpdatedToast,
  useCart,
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
  const {
    cart,
    addRecipeLines,
    removeItem,
    updateRecipeCartQuantities,
  } = useCart();

  const inCartIds = useMemo(
    () => getRecipeCartLineIds(cart, recipeId),
    [cart, recipeId],
  );
  const cartItemIdsByLineId = useMemo(() => {
    const ids = new Map<string, string>();

    for (const item of cart.items) {
      if (item.sourceRecipeId === recipeId && item.recipeIngredientId) {
        ids.set(item.recipeIngredientId, item.id);
      }
    }

    return ids;
  }, [cart.items, recipeId]);

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
  const [addingLineIds, setAddingLineIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [removingLineIds, setRemovingLineIds] = useState<Set<string>>(
    () => new Set(),
  );

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

  const handleAddAllLines = useCallback(async () => {
    const scaleFactor = selectedOutputQuantity / getScalingBase(output);

    const newLines = collectAddableLines(groups, scaleFactor).filter(
      (line) => !inCartIds.has(line.recipeIngredientId),
    );

    if (newLines.length === 0) {
      showCartAddToasts(
        { cart, addedLines: [], skippedCount: 0 },
        { emptyMessage: 'Все ингредиенты уже в корзине' },
      );
      return;
    }

    const lineIds = newLines.map((line) => line.recipeIngredientId);

    setAddingLineIds((current) => {
      const next = new Set(current);
      for (const lineId of lineIds) {
        next.add(lineId);
      }
      return next;
    });

    try {
      const result = await addRecipeLines({
        recipeId,
        recipeTitle,
        outputQuantity: selectedOutputQuantity,
        lines: newLines,
      });

      showCartAddToasts(result);
    } finally {
      setAddingLineIds((current) => {
        const next = new Set(current);
        for (const lineId of lineIds) {
          next.delete(lineId);
        }
        return next;
      });
    }
  }, [
    addRecipeLines,
    cart,
    groups,
    inCartIds,
    output,
    recipeId,
    recipeTitle,
    selectedOutputQuantity,
  ]);

  const handleAddLineToCart = useCallback(
    async (lineId: string) => {
      if (inCartIds.has(lineId)) {
        return;
      }

      const scaleFactor = selectedOutputQuantity / getScalingBase(output);

      const newLines = collectAddableLines(
        groups,
        scaleFactor,
        new Set([lineId]),
      ).filter((line) => !inCartIds.has(line.recipeIngredientId));

      if (newLines.length === 0) {
        showCartAddToasts(
          { cart, addedLines: [], skippedCount: 0 },
          { emptyMessage: 'Ингредиент уже в корзине' },
        );
        return;
      }

      setAddingLineIds((current) => {
        const next = new Set(current);
        next.add(lineId);
        return next;
      });

      try {
        const result = await addRecipeLines({
          recipeId,
          recipeTitle,
          outputQuantity: selectedOutputQuantity,
          lines: newLines,
        });

        showCartAddToasts(result, {
          emptyMessage: 'Ингредиент уже в корзине',
        });
      } finally {
        setAddingLineIds((current) => {
          const next = new Set(current);
          next.delete(lineId);
          return next;
        });
      }
    },
    [
      addRecipeLines,
      cart,
      groups,
      inCartIds,
      output,
      recipeId,
      recipeTitle,
      selectedOutputQuantity,
    ],
  );

  const handleRemoveLineFromCart = useCallback(
    async (lineId: string) => {
      const itemId = cartItemIdsByLineId.get(lineId);

      if (!itemId) {
        return;
      }

      setRemovingLineIds((current) => {
        const next = new Set(current);
        next.add(lineId);
        return next;
      });

      try {
        await removeItem(itemId);
        showCartRemovedToast();
      } finally {
        setRemovingLineIds((current) => {
          const next = new Set(current);
          next.delete(lineId);
          return next;
        });
      }
    },
    [cartItemIdsByLineId, removeItem],
  );

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
            addingLineIds={addingLineIds}
            groups={scaledGroups}
            inCartIds={inCartIds}
            onAddLine={(lineId) => void handleAddLineToCart(lineId)}
            onRemoveLine={(lineId) => void handleRemoveLineFromCart(lineId)}
            removingLineIds={removingLineIds}
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
