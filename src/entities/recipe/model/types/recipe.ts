import type { RecipeIngredientLine } from '@/entities/ingredient/model/types/recipe-ingredient-line';
import type { PhysicalOutput } from './physical-output';
import type { RecipeOutput } from './recipe-output';

export type RecipeIngredientSection = {
  id: string;
  label: string | null;
  output: PhysicalOutput;
  lines: RecipeIngredientLine[];
};

export type Recipe = {
  output: RecipeOutput;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  author: string;
  title: string;
  description: string;
  image: string;
  ingredientSections: RecipeIngredientSection[];
  equipment: string[];
  steps: {
    text: string;
    image?: string;
  }[];
  comments: {
    initials: string;
    name: string;
    text: string;
    label?: string;
  }[];
};
