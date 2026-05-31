import type { RecipeIngredientGroupView } from '@/entities/recipe';
import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import { normalizeCartQuantity } from '@/entities/cart/lib/normalize-cart-quantity';
import type { RecipeIngredientLine } from '@/entities/ingredient/model/types/recipe-ingredient-line';
import type { AddableCartLine } from '@/entities/cart';

/** Собирает строки для добавления в корзину с актуальными масштабированными количествами */
export function collectAddableLines(
  groups: RecipeIngredientGroupView[],
  scaleFactor: number,
  selectedIds?: Set<string>,
): AddableCartLine[] {
  const lines: AddableCartLine[] = [];

  for (const group of groups) {
    for (const line of group.lines) {
      if (selectedIds && !selectedIds.has(line.id)) {
        continue;
      }

      lines.push(mapLineToAddable(line, scaleFactor));
    }
  }

  return lines;
}

function mapLineToAddable(
  line: RecipeIngredientLine,
  scaleFactor: number,
): AddableCartLine {
  const quantity = normalizeCartQuantity(
    line.amountNumeric * scaleFactor,
    line.unit,
  );

  return {
    recipeIngredientId: line.id,
    name: line.name,
    sticker: line.sticker,
    quantity,
    amountValue: formatAmountValue(quantity, {
      roundToInteger: line.unit.roundToInteger,
    }),
    unit: line.unit,
    unitId: line.unitId,
    isSubRecipe: Boolean(line.linkedRecipeId),
  };
}
