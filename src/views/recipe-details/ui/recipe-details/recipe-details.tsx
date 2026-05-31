import { getRecipe } from '@/entities/recipe';
import { RecipeDetailsContent } from '../recipe-details-content/recipe-details-content';
import { RecipeLayout } from '../recipe-layout/recipe-layout';
import { EquipmentCard } from '../equipment-card/equipment-card';
import { IngredientSidebar } from '@/features/ingredient-sidebar';

type RecipeDetailsProps = {
  recipeId: string;
};

export async function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  const recipe = await getRecipe(recipeId);

  return (
    <RecipeLayout
      content={<RecipeDetailsContent recipe={recipe} />}
      sidebar={
        <>
          <IngredientSidebar
            groups={recipe.ingredientGroups}
            output={recipe.output}
            recipeId={recipeId}
          />
          <EquipmentCard recipe={recipe} />
        </>
      }
    />
  );
}
