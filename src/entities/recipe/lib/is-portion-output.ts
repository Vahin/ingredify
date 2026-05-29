import { SERVING_UNIT_SHORT_NAME } from '../model/constants/recipe-output';
import type { RecipeOutput } from '../model/types/recipe-output';

/** Выход рецепта задан в порциях (можно масштабировать ингредиенты) */
export function isPortionOutput(output: RecipeOutput): boolean {
  return output.unitShortName === SERVING_UNIT_SHORT_NAME;
}
