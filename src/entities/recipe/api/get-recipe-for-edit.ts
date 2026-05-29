import { notFound } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';

export type RecipeForEdit = {
  id: string;
  authorId: string;
  title: string;
};

/** Минимальные данные рецепта для страницы редактирования и проверки владельца */
export async function getRecipeForEdit(
  recipeId: string,
): Promise<RecipeForEdit> {
  const row = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: {
      id: true,
      authorId: true,
      title: true,
    },
  });

  if (row === null) {
    notFound();
  }

  return row;
}
