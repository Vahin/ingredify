import { notFound } from 'next/navigation';
import type { Prisma } from '@prisma';
import { prisma } from '@/shared/lib/prisma';
import type { Recipe } from '../model/types/recipe';

const recipeInclude = {
  nutrition: true,
  ingredients: { orderBy: { order: 'asc' as const } },
  equipment: { orderBy: { order: 'asc' as const } },
  steps: { orderBy: { order: 'asc' as const } },
  comments: { orderBy: { order: 'asc' as const } },
} satisfies Prisma.RecipeInclude;

type RecipeRow = Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>;

/** Форматирование макронутриентов для карточек КБЖУ в UI */
function formatMacroGrams(value: Prisma.Decimal | number): string {
  const n = typeof value === 'number' ? value : Number(value);
  const rounded = Math.round(n * 10) / 10;
  const str = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(/\.0$/, '');
  return `${str} г`;
}

/**
 * Сборка визуальных «статов» из числовых нутриентов.
 * Иконки, подписи и цвета не хранятся в БД.
 */
function mapNutritionToStats(
  nutrition: RecipeRow['nutrition'],
): Recipe['stats'] {
  if (nutrition === null) {
    return [];
  }

  return [
    {
      icon: '/icons/kbju/calories.svg',
      label: 'Калории',
      value: String(nutrition.calories),
      tone: 'text-orange-500',
    },
    {
      icon: '/icons/kbju/protein.svg',
      label: 'Белки',
      value: formatMacroGrams(nutrition.protein),
      tone: 'text-accent',
    },
    {
      icon: '/icons/kbju/fat.svg',
      label: 'Жиры',
      value: formatMacroGrams(nutrition.fat),
      tone: 'text-amber-500',
    },
    {
      icon: '/icons/kbju/carbs.svg',
      label: 'Углеводы',
      value: formatMacroGrams(nutrition.carbs),
      tone: 'text-violet-500',
    },
  ];
}

/** Преобразование строк БД в DTO для UI */
function mapRecipeRowToDto(row: RecipeRow): Recipe {
  return {
    author: row.author,
    authorRole: row.authorRole,
    title: row.title,
    description: row.description,
    image: row.image,
    stats: mapNutritionToStats(row.nutrition),
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
