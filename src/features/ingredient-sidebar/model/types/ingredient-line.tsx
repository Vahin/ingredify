import type { PhysicalOutput } from '@/entities/recipe/model/types/physical-output';

export type IngredientLine = {
  id: string;
  name: string;
  sticker: string;
  amountNumeric: number;
  amountValue: string;
  unit: PhysicalOutput['unit'];
  /** Id рецепта приготовления, если ингредиент составной */
  linkedRecipeId?: string;
};

export type IngredientSection = {
  id: string;
  label: string | null;
  output: PhysicalOutput;
  lines: IngredientLine[];
};
