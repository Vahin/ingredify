import { formatAmountValue } from '@/entities/recipe/lib/format-amount-value';
import type { RecipeIngredientSection } from '@/entities/recipe/model/types/recipe';
import type { IngredientSection } from '../types/ingredient-line';
import { getBaseOutputQuantity } from './output-quantity';

/** Пересчитывает количества ингредиентов под выбранный выход рецепта */
export function scaleIngredientSections(
  sections: RecipeIngredientSection[],
  selectedOutputQuantity: number,
): IngredientSection[] {
  return sections.map((section) => {
    const baseOutput = getBaseOutputQuantity(section.output);
    const scaleFactor = selectedOutputQuantity / baseOutput;

    return {
      id: section.id,
      label: section.label,
      output: section.output,
      lines: section.lines.map((line) => ({
        ...line,
        amountValue: formatAmountValue(line.amountNumeric * scaleFactor, {
          unitShortName: line.amountUnitLabel,
        }),
      })),
    };
  });
}
