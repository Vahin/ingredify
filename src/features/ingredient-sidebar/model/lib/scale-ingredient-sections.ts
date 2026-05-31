import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import type { RecipeIngredientSection } from '@/entities/recipe/model/types/recipe';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';
import type { IngredientSection } from '../types/ingredient-line';
import { getScalingBase } from './output-quantity';

/** Пересчитывает количества ингредиентов под выбранный выход рецепта */
export function scaleIngredientSections(
  sections: RecipeIngredientSection[],
  selectedOutputQuantity: number,
  recipeOutput: RecipeOutput,
): IngredientSection[] {
  const baseOutput = getScalingBase(recipeOutput);
  const scaleFactor = selectedOutputQuantity / baseOutput;

  return sections.map((section) => ({
    id: section.id,
    label: section.label,
    output: section.output,
    lines: section.lines.map((line) => ({
      ...line,
      amountValue: formatAmountValue(line.amountNumeric * scaleFactor, {
        roundToInteger: line.unit.roundToInteger,
      }),
    })),
  }));
}
