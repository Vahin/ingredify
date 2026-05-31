import type { RecipeOutput } from '../model/types/recipe-output';

/** У рецепта задано базовое количество порций */
export function hasRecipeServings(output: RecipeOutput): boolean {
  return output.servings != null && output.servings > 0;
}
