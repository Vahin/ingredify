import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import { normalizeCartQuantity } from './normalize-cart-quantity';
import type { CartItemView, MergedCartItemView } from '../model/types/cart';

export function getCartItemMergeKey(item: CartItemView): string {
  return `${item.name}::${item.unitId}::${item.isSubRecipe ? '1' : '0'}`;
}

/** Объединяет одинаковые продукты из разных рецептов в общий список */
export function mergeCartItems(items: CartItemView[]): MergedCartItemView[] {
  const merged = new Map<string, MergedCartItemView>();

  for (const item of items) {
    const mergeKey = getCartItemMergeKey(item);
    const existing = merged.get(mergeKey);

    if (!existing) {
      merged.set(mergeKey, {
        mergeKey,
        name: item.name,
        sticker: item.sticker,
        quantity: item.quantity,
        amountValue: item.amountValue,
        unit: item.unit,
        unitId: item.unitId,
        isSubRecipe: item.isSubRecipe,
        sourceItemIds: [item.id],
      });
      continue;
    }

    const nextQuantity = normalizeCartQuantity(
      existing.quantity + item.quantity,
      item.unit,
    );

    merged.set(mergeKey, {
      ...existing,
      quantity: nextQuantity,
      amountValue: formatAmountValue(nextQuantity, {
        roundToInteger: item.unit.roundToInteger,
      }),
      sourceItemIds: [...existing.sourceItemIds, item.id],
    });
  }

  return [...merged.values()];
}
