import type { MeasurementUnitView } from '@/entities/recipe/model/types/measurement-unit';

export type RecipeIngredientLine = {
  id: string;
  name: string;
  sticker: string;
  /** Числовое количество для пересчёта по порциям */
  amountNumeric: number;
  amountValue: string;
  unit: MeasurementUnitView;
  unitId: string;
  /** Id рецепта приготовления, если ингредиент составной */
  linkedRecipeId?: string;
};
