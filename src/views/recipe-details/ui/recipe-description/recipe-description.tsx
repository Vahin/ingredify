import { RecipeHero } from '../recipe-hero/recipe-hero';
import { CookingStep } from '../cooking-step/cooking-step';
import { CommentsCard } from '../comments-card/comments-card';

import { type Recipe } from '@/entities/recipe';

export const RecipeDescription = ({ recipe }: { recipe: Recipe }) => {
  return (
    <>
      <RecipeHero recipe={recipe} />
      <CookingStep recipe={recipe} />
      <CommentsCard recipe={recipe} />
    </>
  );
};
