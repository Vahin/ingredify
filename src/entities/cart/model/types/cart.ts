import type { MeasurementUnitView } from '@/entities/recipe/model/types/measurement-unit';

export type CartItemView = {
  id: string;
  sourceRecipeId: string | null;
  recipeIngredientId: string | null;
  name: string;
  sticker: string;
  quantity: number;
  amountValue: string;
  unit: MeasurementUnitView;
  unitId: string;
  isSubRecipe: boolean;
};

export type CartRecipeSyncView = {
  recipeId: string;
  recipeTitle: string | null;
  syncedOutputQuantity: number;
};

export type SessionCart = {
  items: CartItemView[];
  recipeSyncs: CartRecipeSyncView[];
};

export type AddableCartLine = {
  recipeIngredientId: string;
  name: string;
  sticker: string;
  quantity: number;
  amountValue: string;
  unit: MeasurementUnitView;
  unitId: string;
  isSubRecipe: boolean;
};

export type AddItemsResult = {
  cart: SessionCart;
  addedItems: AddableCartLine[];
  skippedCount: number;
};

export type UpdateRecipeCartQuantitiesResult = {
  cart: SessionCart;
  updatedCount: number;
};

export type MergedCartItemView = {
  mergeKey: string;
  name: string;
  sticker: string;
  quantity: number;
  amountValue: string;
  unit: MeasurementUnitView;
  unitId: string;
  isSubRecipe: boolean;
  sourceItemIds: string[];
};
