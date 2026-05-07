import type { Metadata } from "next";
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

  return {
    title: "Вишневый коблер с миндальной крошкой",
    description: `Страница рецепта ${recipeId} в Ingredify.`,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { recipeId } = await params;

  return <RecipeDetails recipeId={recipeId} />;
}
