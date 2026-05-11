import { RecipeHero } from '../recipe-hero/recipe-hero';
import { CookingStep } from '../cooking-step/cooking-step';
import { type Recipe } from '@/entities/recipe';
import { CommentsCard } from '@/entities/comment';

export const RecipeDetailsContent = ({ recipe }: { recipe: Recipe }) => {
  return (
    <>
      <RecipeHero recipe={recipe} />
      <CookingStep recipe={recipe} />
      <CommentsCard recipe={recipe} />
    </>
  );
};
