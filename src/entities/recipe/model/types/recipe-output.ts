/** Выход рецепта: порции для блюда или вес/объём для заготовки */
export type RecipeOutput = {
  quantity: number;
  unitShortName: string;
  unitLabel: string;
};
