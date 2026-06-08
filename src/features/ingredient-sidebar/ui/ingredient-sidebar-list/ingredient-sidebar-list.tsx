import { useCallback, useState } from 'react';
import {
  useCartActions,
  useCartStore,
  useRecipeCartMeta,
} from '@/entities/cart';
import type { RecipeIngredientGroupView } from '@/entities/recipe';
import type { RecipeOutput } from '@/entities/recipe';
import {
  collectAddableLines,
  showCartAddToasts,
  showCartRemovedToast,
} from '@/features/add-to-cart';
import { getScalingBase } from '../../model/lib/output-quantity';
import { IngredientSidebarGroup } from '../ingredient-sidebar-group/ingredient-sidebar-group';

type IngredientSidebarListProps = {
  groups: RecipeIngredientGroupView[];
  recipeId: string;
  recipeTitle: string;
  sourceGroups: RecipeIngredientGroupView[];
  output: RecipeOutput;
  selectedOutputQuantity: number;
};

export const IngredientSidebarList = ({
  groups,
  recipeId,
  recipeTitle,
  sourceGroups,
  output,
  selectedOutputQuantity,
}: IngredientSidebarListProps) => {
  const cart = useCartStore((state) => state.cart);
  const { addItems, removeItem } = useCartActions();
  const { inCartIds, itemIdsByLineId } = useRecipeCartMeta(recipeId);
  const [addingLineIds, setAddingLineIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [removingLineIds, setRemovingLineIds] = useState<Set<string>>(
    () => new Set(),
  );

  const handleAddLineToCart = useCallback(
    async (lineId: string) => {
      if (inCartIds.has(lineId)) {
        return;
      }

      const scaleFactor = selectedOutputQuantity / getScalingBase(output);

      const newLines = collectAddableLines(
        sourceGroups,
        scaleFactor,
        new Set([lineId]),
      ).filter((line) => !inCartIds.has(line.recipeIngredientId));

      if (newLines.length === 0) {
        showCartAddToasts(
          { cart, addedItems: [], skippedCount: 0 },
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
        const result = await addItems({
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
      addItems,
      cart,
      inCartIds,
      output,
      recipeId,
      recipeTitle,
      selectedOutputQuantity,
      sourceGroups,
    ],
  );

  const handleRemoveLineFromCart = useCallback(
    async (lineId: string) => {
      const itemId = itemIdsByLineId.get(lineId);

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
    [itemIdsByLineId, removeItem],
  );

  return (
    <div className='flex flex-col gap-2'>
      {groups.map((group) => (
        <IngredientSidebarGroup
          addingLineIds={addingLineIds}
          group={group}
          inCartIds={inCartIds}
          key={group.id}
          onAddLine={(lineId) => void handleAddLineToCart(lineId)}
          onRemoveLine={(lineId) => void handleRemoveLineFromCart(lineId)}
          removingLineIds={removingLineIds}
        />
      ))}
    </div>
  );
};
