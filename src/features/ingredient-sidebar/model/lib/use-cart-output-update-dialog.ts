import { useCallback, useEffect, useRef, useState } from 'react';
import { useCartActions } from '@/entities/cart';
import { showCartUpdatedToast } from '@/features/add-to-cart';

const OUTPUT_CHANGE_DEBOUNCE_MS = 600;

type UseCartOutputUpdateDialogParams = {
  recipeId: string;
  selectedOutputQuantity: number;
  syncedOutputQuantity: number | null;
  cartIngredientCount: number;
};

export function useCartOutputUpdateDialog({
  recipeId,
  selectedOutputQuantity,
  syncedOutputQuantity,
  cartIngredientCount,
}: UseCartOutputUpdateDialogParams) {
  const { updateRecipeCartQuantities } = useCartActions();
  const hasUserChangedOutputRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState({
    previous: selectedOutputQuantity,
    next: selectedOutputQuantity,
  });

  const markOutputQuantityChanged = useCallback(() => {
    hasUserChangedOutputRef.current = true;
  }, []);

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
      cartIngredientCount === 0
    ) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setQuantities({
        previous: syncedOutputQuantity,
        next: selectedOutputQuantity,
      });
      setOpen(true);
    }, OUTPUT_CHANGE_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [cartIngredientCount, selectedOutputQuantity, syncedOutputQuantity]);

  const confirmCartUpdate = useCallback(async () => {
    setOpen(false);

    const result = await updateRecipeCartQuantities({
      recipeId,
      newOutputQuantity: selectedOutputQuantity,
    });

    showCartUpdatedToast(result.updatedCount);
  }, [recipeId, selectedOutputQuantity, updateRecipeCartQuantities]);

  return {
    cartUpdateDialog: {
      nextQuantity: quantities.next,
      onConfirm: () => void confirmCartUpdate(),
      onOpenChange: setOpen,
      open,
      previousQuantity: quantities.previous,
    },
    markOutputQuantityChanged,
  };
}
