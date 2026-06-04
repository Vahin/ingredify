import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Prisma } from '@prisma';
import { prisma } from '@/shared/lib/prisma';
import type { RecipeIngredientLine } from '@/entities/ingredient/model/types/recipe-ingredient-line';
import { formatAmountValue } from '../lib/format-amount-value';
import type {
  MeasurementUnitKind,
  MeasurementUnitShortName,
} from '../model/constants/measurement-units';
import type { MeasurementUnitView } from '../model/types/measurement-unit';
import type {
  Recipe,
  RecipeIngredientGroupView,
} from '../model/types/recipe';

const recipeInclude = {
  author: true,
  outputUnit: true,
  nutrition: true,
  ingredientGroups: {
    orderBy: { order: 'asc' as const },
    include: {
      outputUnit: true,
      ingredients: {
        orderBy: { order: 'asc' as const },
        include: {
          ingredient: { include: { recipe: { select: { id: true } } } },
          unit: true,
        },
      },
    },
  },
  equipment: { orderBy: { order: 'asc' as const } },
  steps: { orderBy: { order: 'asc' as const } },
  comments: { orderBy: { order: 'asc' as const } },
} satisfies Prisma.RecipeInclude;

type RecipeRow = Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>;

type UnitRow = RecipeRow['outputUnit'];

/** Преобразование единицы измерения БД в DTO */
function mapUnit(row: UnitRow): MeasurementUnitView {
  return {
    shortName: row.shortName as MeasurementUnitShortName,
    label: row.shortName,
    kind: row.kind as MeasurementUnitKind,
    roundToInteger: row.roundToInteger,
  };
}

/** Округление макронутриентов для карточек КБЖУ в UI */
function formatMacroGrams(value: Prisma.Decimal | number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Math.round(n * 10) / 10;
}

/** Преобразование строки ингредиента БД в DTO */
function mapIngredientLineToDto(
  line: RecipeRow['ingredientGroups'][number]['ingredients'][number],
): RecipeIngredientLine {
  const unit = mapUnit(line.unit);
  const amountNumeric = Number(line.quantity);

  return {
    id: line.id,
    name: line.ingredient.name,
    sticker: line.ingredient.sticker,
    amountNumeric,
    amountValue: formatAmountValue(amountNumeric, unit),
    unit,
    unitId: line.unitId,
    ...(line.ingredient.recipe ? { linkedRecipeId: line.ingredient.recipe.id } : {}),
  };
}

/** Преобразование строк БД в DTO для UI */
function mapRecipeRowToDto(row: RecipeRow): Recipe {
  const outputQuantity = Number(row.outputQuantity);
  const outputUnit = mapUnit(row.outputUnit);

  const ingredientGroups: RecipeIngredientGroupView[] = row.ingredientGroups
    .map((group) => ({
      id: group.id,
      label: group.label,
      baseOutput: {
        quantity: Number(group.outputQuantity),
        unit: mapUnit(group.outputUnit),
      },
      lines: group.ingredients.map(mapIngredientLineToDto),
    }))
    .filter((group) => group.lines.length > 0);

  return {
    author: row.author.name,
    title: row.title,
    description: row.description,
    image: row.image,
    output: {
      quantity: outputQuantity,
      unit: outputUnit,
      servings: row.servings,
    },
    nutrition: {
      calories: row.nutrition?.calories ?? 0,
      protein: formatMacroGrams(row.nutrition?.protein ?? 0),
      fat: formatMacroGrams(row.nutrition?.fat ?? 0),
      carbs: formatMacroGrams(row.nutrition?.carbs ?? 0),
    },
    ingredientGroups,
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

/** Загрузка рецепта для UI (кеш на один server-запрос, дедупликация по recipeId) */
export const getRecipe = cache(async (recipeId: string): Promise<Recipe> => {
  const row = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: recipeInclude,
  });

  if (row === null) {
    notFound();
  }

  return mapRecipeRowToDto(row);
});
