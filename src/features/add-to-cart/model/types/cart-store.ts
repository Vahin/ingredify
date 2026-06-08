import type {
  AddableCartLine,
  AddItemsResult,
  SessionCart,
  UpdateRecipeCartQuantitiesResult,
} from '@/entities/cart';

export type CartStore = {
  cart: SessionCart;
  isAuthenticated: boolean;
  itemCount: number;
  addItems: (params: {
    recipeId: string;
    recipeTitle: string;
    outputQuantity: number;
    lines: AddableCartLine[];
  }) => Promise<AddItemsResult>;
  updateRecipeCartQuantities: (params: {
    recipeId: string;
    newOutputQuantity: number;
  }) => Promise<UpdateRecipeCartQuantitiesResult>;
  removeItem: (itemId: string) => Promise<void>;
  removeItems: (itemIds: string[]) => Promise<void>;
  setCart: (cart: SessionCart) => void;
};
