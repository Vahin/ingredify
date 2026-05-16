import { CookingStep } from '../cooking-step/cooking-step';
import { type Recipe } from '@/entities/recipe';
import { CommentsCard } from '@/entities/comment';
import { RecipeIntro } from '@/widgets/recipe-intro';

export const RecipeDetailsContent = ({ recipe }: { recipe: Recipe }) => {
  return (
    <>
      <RecipeIntro recipe={recipe} />
      <CookingStep recipe={recipe} />
      <CommentsCard recipe={recipe} />
    </>
  );
};
