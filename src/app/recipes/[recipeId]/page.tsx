import type { Metadata } from "next";
import { RecipeDetailsPage } from "@/views/recipes/details/recipe-details-page";

type RecipePageProps = {
  params: Promise<{
    recipeId: string;
  }>;
};

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { recipeId } = await params;

  return {
    title: "Вишнёвый коблер",
    description: `Страница рецепта ${recipeId} в Ingredify.`,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { recipeId } = await params;

  return <RecipeDetailsPage recipeId={recipeId} />;
}
