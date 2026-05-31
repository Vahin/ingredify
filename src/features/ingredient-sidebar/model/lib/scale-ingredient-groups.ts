import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import type { RecipeIngredientGroupView } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import { getScalingBase } from './output-quantity';

/** Пересчитывает количества ингредиентов под выбранный выход рецепта */
export function scaleIngredientGroups(
  groups: RecipeIngredientGroupView[],
  selectedOutputQuantity: number,
  recipeOutput: RecipeOutput,
): RecipeIngredientGroupView[] {
  const scalingBase = getScalingBase(recipeOutput);
  const scaleFactor = selectedOutputQuantity / scalingBase;

  return groups.map((group) => ({
    id: group.id,
    label: group.label,
    baseOutput: group.baseOutput,
    lines: group.lines.map((line) => ({
      ...line,
      amountValue: formatAmountValue(line.amountNumeric * scaleFactor, {
        roundToInteger: line.unit.roundToInteger,
      }),
    })),
  }));
}
