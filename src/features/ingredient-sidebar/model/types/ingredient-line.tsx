export type IngredientLine = {
  id: string;
  name: string;
  sticker: string;
  amountNumeric: number;
  amountValue: string;
  amountUnitLabel: string;
  /** Id рецепта приготовления, если ингредиент составной */
  linkedRecipeId?: string;
};

export type IngredientSection = {
  id: string | null;
  label: string | null;
  lines: IngredientLine[];
};
