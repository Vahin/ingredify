import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Prisma } from '@prisma';
import { prisma } from '@/shared/lib/prisma';

const ingredientInclude = {
  recipe: {
    select: {
      id: true,
      title: true,
      description: true,
    },
  },
  _count: {
    select: {
      usages: true,
    },
  },
} satisfies Prisma.IngredientInclude;

type IngredientRow = Prisma.IngredientGetPayload<{
  include: typeof ingredientInclude;
}>;

export type IngredientDetails = {
  id: string;
  name: string;
  sticker: string;
  usageCount: number;
  linkedRecipe?: {
    id: string;
    title: string;
    description: string;
  };
};

function mapIngredientRowToDto(row: IngredientRow): IngredientDetails {
  return {
    id: row.id,
    name: row.name,
    sticker: row.sticker,
    usageCount: row._count.usages,
    ...(row.recipe
      ? {
          linkedRecipe: {
            id: row.recipe.id,
            title: row.recipe.title,
            description: row.recipe.description,
          },
        }
      : {}),
  };
}

export const getIngredient = cache(
  async (ingredientId: string): Promise<IngredientDetails> => {
    const row = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
      include: ingredientInclude,
    });

    if (row === null) {
      notFound();
    }

    return mapIngredientRowToDto(row);
  },
);
