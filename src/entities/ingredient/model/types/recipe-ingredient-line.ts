export type RecipeIngredientLine = {
  id: string;
  name: string;
  sticker: string;
  /** Числовое количество для пересчёта по порциям */
  amountNumeric: number;
  amountValue: string;
  amountUnitLabel: string;
  /** Id рецепта приготовления, если ингредиент составной */
  linkedRecipeId?: string;
};
