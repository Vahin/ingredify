import { notFound } from 'next/navigation';
import type { Prisma } from '@prisma';
import { prisma } from '@/shared/lib/prisma';
import type { Recipe } from '../model/types/recipe';

const recipeInclude = {
  stats: { orderBy: { order: 'asc' as const } },
  ingredients: { orderBy: { order: 'asc' as const } },
  equipment: { orderBy: { order: 'asc' as const } },
  steps: { orderBy: { order: 'asc' as const } },
  comments: { orderBy: { order: 'asc' as const } },
} satisfies Prisma.RecipeInclude;

type RecipeRow = Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>;

/** Преобразование строк БД в DTO для UI */
function mapRecipeRowToDto(row: RecipeRow): Recipe {
  return {
    author: row.author,
    authorRole: row.authorRole,
    title: row.title,
    description: row.description,
    image: row.image,
    stats: row.stats.map((s) => ({
      icon: s.icon,
      label: s.label,
      value: s.value,
      tone: s.tone,
    })),
    ingredients: row.ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      ...(ing.checked ? { checked: true } : {}),
    })),
    equipment: row.equipment.map((eq) => eq.label),
    steps: row.steps.map((step) => ({
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
    comments: row.comments.map((c) => ({
      initials: c.initials,
      name: c.name,
      text: c.text,
      ...(c.label ? { label: c.label } : {}),
    })),
  };
}

export const getRecipe = async (recipeId: string): Promise<Recipe> => {
  const row = await prisma.recipe.findUnique({
    where: { slug: recipeId },
    include: recipeInclude,
  });

  if (row === null) {
    notFound();
  }

  return mapRecipeRowToDto(row);
};
