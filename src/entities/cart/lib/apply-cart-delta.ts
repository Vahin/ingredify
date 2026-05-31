import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import {
  isCartDeltaZero,
  normalizeCartQuantity,
} from './normalize-cart-quantity';
import type {
  AddableCartLine,
  ApplyCartDeltaResult,
  CartDeltaChange,
  CartRecipeLineSyncView,
  SessionCart,
} from '../model/types/cart';

const emptyCart = (): SessionCart => ({
  items: [],
  recipeSyncs: [],
});

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

const findLineSync = (
  lineSyncs: CartRecipeLineSyncView[],
  recipeIngredientId: string,
) => lineSyncs.find((line) => line.recipeIngredientId === recipeIngredientId);

/** Применяет delta-добавление строк рецепта к корзине */
export function applyCartDelta(
  cart: SessionCart,
  params: {
    recipeId: string;
    outputQuantity: number;
    lines: AddableCartLine[];
    createId: () => string;
  },
): ApplyCartDeltaResult {
  const { recipeId, outputQuantity, lines, createId } = params;

  if (lines.length === 0) {
    return {
      cart,
      changes: [],
      addedCount: 0,
      isAlreadySynced: true,
    };
  }

  const nextCart: SessionCart = {
    items: cart.items.map((item) => ({ ...item })),
    recipeSyncs: cart.recipeSyncs.map((sync) => ({
      ...sync,
      lineSyncs: sync.lineSyncs.map((line) => ({ ...line })),
    })),
  };

  const changes: CartDeltaChange[] = [];
  let existingSync = findRecipeSync(nextCart, recipeId);

  if (!existingSync) {
    existingSync = {
      recipeId,
      syncedOutputQuantity: outputQuantity,
      lineSyncs: [],
    };
    nextCart.recipeSyncs.push(existingSync);
  }

  for (const line of lines) {
    const currentQuantity = normalizeCartQuantity(line.quantity, line.unit);
    const previousLineSync = findLineSync(
      existingSync.lineSyncs,
      line.recipeIngredientId,
    );
    const previousSyncedQty = previousLineSync?.syncedQuantity ?? 0;
    const delta = currentQuantity - previousSyncedQty;

    if (isCartDeltaZero(delta)) {
      continue;
    }

    const existingItem = findCartItem(
      nextCart,
      recipeId,
      line.recipeIngredientId,
    );
    const nextQuantity = normalizeCartQuantity(
      (existingItem?.quantity ?? 0) + delta,
      line.unit,
    );

    if (nextQuantity <= 0 || isCartDeltaZero(nextQuantity)) {
      nextCart.items = nextCart.items.filter(
        (item) =>
          !(
            item.sourceRecipeId === recipeId &&
            item.recipeIngredientId === line.recipeIngredientId
          ),
      );
    } else if (existingItem) {
      existingItem.quantity = nextQuantity;
      existingItem.amountValue = formatAmountValue(nextQuantity, {
        roundToInteger: line.unit.roundToInteger,
      });
    } else {
      nextCart.items.push({
        id: createId(),
        sourceRecipeId: recipeId,
        recipeIngredientId: line.recipeIngredientId,
        name: line.name,
        sticker: line.sticker,
        quantity: nextQuantity,
        amountValue: formatAmountValue(nextQuantity, {
          roundToInteger: line.unit.roundToInteger,
        }),
        unit: line.unit,
        unitId: line.unitId,
        isSubRecipe: line.isSubRecipe,
      });
    }

    if (previousLineSync) {
      previousLineSync.syncedQuantity = currentQuantity;
    } else {
      existingSync.lineSyncs.push({
        recipeIngredientId: line.recipeIngredientId,
        syncedQuantity: currentQuantity,
      });
    }

    changes.push({
      recipeIngredientId: line.recipeIngredientId,
      name: line.name,
      delta,
      amountValue: formatAmountValue(Math.abs(delta), {
        roundToInteger: line.unit.roundToInteger,
      }),
      unitLabel: line.unit.label,
    });
  }

  // Обновляем выход рецепта только если реально изменились строки
  if (changes.length > 0) {
    existingSync.syncedOutputQuantity = outputQuantity;
  }

  return {
    cart: nextCart,
    changes,
    addedCount: changes.length,
    isAlreadySynced: changes.length === 0,
  };
}

/** Проверяет, изменился ли выход рецепта относительно последней синхронизации */
export function hasOutputQuantityChanged(
  cart: SessionCart,
  recipeId: string,
  outputQuantity: number,
): boolean {
  const sync = findRecipeSync(cart, recipeId);
  if (!sync) {
    return false;
  }

  return sync.syncedOutputQuantity !== outputQuantity;
}

export function getSyncedOutputQuantity(
  cart: SessionCart,
  recipeId: string,
): number | null {
  return findRecipeSync(cart, recipeId)?.syncedOutputQuantity ?? null;
}

/** Сбрасывает синхронизацию строки при удалении позиции из корзины */
export function clearLineSyncForRemovedItem(
  cart: SessionCart,
  item: SessionCart['items'][number],
): SessionCart {
  if (!item.sourceRecipeId || !item.recipeIngredientId) {
    return cart;
  }

  const recipeSync = findRecipeSync(cart, item.sourceRecipeId);
  if (!recipeSync) {
    return cart;
  }

  return {
    ...cart,
    recipeSyncs: cart.recipeSyncs.map((sync) => {
      if (sync.recipeId !== item.sourceRecipeId) {
        return sync;
      }

      return {
        ...sync,
        lineSyncs: sync.lineSyncs.filter(
          (line) => line.recipeIngredientId !== item.recipeIngredientId,
        ),
      };
    }),
  };
}

export { emptyCart };
