import { notFound } from 'next/navigation';
import type { Prisma } from '@prisma';
import { prisma } from '@/shared/lib/prisma';
import { formatAmountValue } from '../lib/format-amount-value';
import type {
  Recipe,
  RecipeIngredientSection,
} from '../model/types/recipe';

const recipeInclude = {
  author: true,
  outputUnit: true,
  nutrition: true,
  ingredientGroups: {
    orderBy: { order: 'asc' as const },
  },
  ingredients: {
    orderBy: { order: 'asc' as const },
    include: {
      ingredient: { include: { recipe: { select: { id: true } } } },
      unit: true,
    },
  },
  equipment: { orderBy: { order: 'asc' as const } },
  steps: { orderBy: { order: 'asc' as const } },
  comments: { orderBy: { order: 'asc' as const } },
} satisfies Prisma.RecipeInclude;

type RecipeRow = Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>;

/** Округление макронутриентов для карточек КБЖУ в UI */
function formatMacroGrams(value: Prisma.Decimal | number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Math.round(n * 10) / 10;
}

/** Преобразование строк БД в DTO для UI */
function mapRecipeRowToDto(row: RecipeRow): Recipe {
  const outputQuantity = Number(row.outputQuantity);
  const ingredientLines = row.ingredients.map((line) => {
    const amountNumeric = Number(line.quantity);

    return {
      id: line.id,
      name: line.ingredient.name,
      sticker: line.ingredient.sticker,
      amountNumeric,
      amountValue: formatAmountValue(amountNumeric, {
        unitShortName: line.unit.shortName,
      }),
      amountUnitLabel: line.unit.shortName,
      ...(line.ingredient.recipe ? { linkedRecipeId: line.ingredient.recipe.id } : {}),
    };
  });

  const linesById = new Map(
    ingredientLines.map((line) => [line.id, line] as const),
  );
  const linesWithoutGroupIds = row.ingredients
    .filter((line) => line.groupId === null)
    .map((line) => line.id);
  const sectionWithoutGroup: RecipeIngredientSection | null =
    linesWithoutGroupIds.length > 0
      ? {
          id: null,
          label: null,
          lines: linesWithoutGroupIds
            .map((id) => linesById.get(id))
            .filter((line) => line !== undefined),
        }
      : null;

  const groupedSections: RecipeIngredientSection[] = row.ingredientGroups
    .map((group) => {
      const groupLineIds = row.ingredients
        .filter((line) => line.groupId === group.id)
        .map((line) => line.id);

      return {
        id: group.id,
        label: group.label,
        lines: groupLineIds
          .map((id) => linesById.get(id))
          .filter((line) => line !== undefined),
      };
    })
    .filter((section) => section.lines.length > 0);

  const ingredientSections: RecipeIngredientSection[] =
    groupedSections.length === 0
      ? [
          {
            id: null,
            label: null,
            lines: ingredientLines,
          },
        ]
      : sectionWithoutGroup
        ? [sectionWithoutGroup, ...groupedSections]
        : groupedSections;

  return {
    author: row.author.name,
    title: row.title,
    description: row.description,
    image: row.image,
    output: {
      quantity: outputQuantity,
      unitShortName: row.outputUnit.shortName,
      unitLabel: row.outputUnit.shortName,
    },
    nutrition: {
      calories: row.nutrition?.calories ?? 0,
      protein: formatMacroGrams(row.nutrition?.protein ?? 0),
      fat: formatMacroGrams(row.nutrition?.fat ?? 0),
      carbs: formatMacroGrams(row.nutrition?.carbs ?? 0),
    },
    ingredientSections,
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
    where: { id: recipeId },
    include: recipeInclude,
  });

  if (row === null) {
    notFound();
  }

  return mapRecipeRowToDto(row);
};
