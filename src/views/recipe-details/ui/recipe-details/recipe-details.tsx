import { IngredientsCard } from '../ingredient-card/ingredient-card';
import { EquipmentCard } from '../equipment-card/equipment-card';
import { getRecipe } from '@/entities/recipe';
import { RecipeDescription } from '../recipe-description/recipe-description';
import { RecipeLayout } from '../recipe-layout/recipe-layout';

type RecipeDetailsProps = {
  recipeId: string;
};

export async function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  const recipe = await getRecipe(recipeId);

  return (
    <RecipeLayout
      content={<RecipeDescription recipe={recipe} />}
      sidebar={
        <>
          <IngredientsCard recipe={recipe} />
          <EquipmentCard recipe={recipe} />
        </>
      }
    />
  );
}
