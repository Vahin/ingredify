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

export type CartRecipeLineSyncView = {
  recipeIngredientId: string;
  syncedQuantity: number;
};

export type CartRecipeSyncView = {
  recipeId: string;
  syncedOutputQuantity: number;
  lineSyncs: CartRecipeLineSyncView[];
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

export type CartDeltaChange = {
  recipeIngredientId: string;
  name: string;
  delta: number;
  amountValue: string;
  unitLabel: string;
};

export type ApplyCartDeltaResult = {
  cart: SessionCart;
  changes: CartDeltaChange[];
  addedCount: number;
  isAlreadySynced: boolean;
};
