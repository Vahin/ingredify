import { notFound } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';

export type RecipeForEdit = {
  userId: string;
  title: string;
  slug: string;
};

/** Минимальные данные рецепта для страницы редактирования и проверки владельца */
export async function getRecipeForEdit(
  recipeId: string,
): Promise<RecipeForEdit> {
  const row = await prisma.recipe.findUnique({
    where: { slug: recipeId },
    select: {
      userId: true,
      title: true,
      slug: true,
    },
  });

  if (row === null) {
    notFound();
  }

  return row;
}
