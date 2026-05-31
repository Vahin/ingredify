import type { PhysicalOutput } from './physical-output';

/** Выход рецепта: физический + опциональные порции */
export type RecipeOutput = PhysicalOutput & {
  servings: number | null;
};
