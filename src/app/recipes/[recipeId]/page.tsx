import type { Metadata } from "next";
import { getRecipe } from "@/entities/recipe";
import { RecipeDetails } from "@/views/recipe-details";

type RecipePageProps = {
  params: Promise<{
    recipeId: string;
  }>;
};

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { recipeId } = await params;
  const recipe = await getRecipe(recipeId);

  return {
    title: recipe.title,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { recipeId } = await params;

  return <RecipeDetails recipeId={recipeId} />;
}
