import { hasRecipeServings } from '@/entities/recipe/lib/has-recipe-servings';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';

const MIN_OUTPUT_QUANTITY = 1;
const MAX_SERVINGS = 99;
const MAX_PHYSICAL_OUTPUT = 9999;

/** База для расчёта коэффициента масштабирования (порции или физический выход) */
export function getScalingBase(output: RecipeOutput): number {
  if (hasRecipeServings(output)) {
    return Math.max(MIN_OUTPUT_QUANTITY, Math.round(output.servings!));
  }

  return Math.max(MIN_OUTPUT_QUANTITY, output.quantity);
}

/** Нужно ли округлять выбранное значение до целого */
function shouldRoundSelectedOutput(output: RecipeOutput): boolean {
  return hasRecipeServings(output) || output.unit.roundToInteger;
}

/** Начальное выбранное количество (для state) */
export function getInitialSelectedOutputQuantity(output: RecipeOutput): number {
  return normalizeOutputQuantity(
    getScalingBase(output),
    shouldRoundSelectedOutput(output),
  );
}

/** Верхняя граница выхода в UI */
export function getMaxOutputQuantity(output: RecipeOutput): number {
  return hasRecipeServings(output) ? MAX_SERVINGS : MAX_PHYSICAL_OUTPUT;
}

/** Нормализация значения под правила единицы измерения */
export function normalizeOutputQuantity(
  value: number,
  roundToInteger: boolean,
): number {
  if (roundToInteger) {
    return Math.round(value);
  }

  return Math.round(value * 100) / 100;
}

/** Ограничение значения в допустимый диапазон */
export function clampOutputQuantity(
  value: number,
  output: RecipeOutput,
): number {
  const min = MIN_OUTPUT_QUANTITY;
  const max = getMaxOutputQuantity(output);
  const clamped = Math.min(max, Math.max(min, value));

  return normalizeOutputQuantity(clamped, shouldRoundSelectedOutput(output));
}

/** Парсинг ручного ввода; null — невалидное значение */
export function parseOutputQuantityInput(raw: string): number | null {
  const trimmed = raw.trim().replace(',', '.');

  if (trimmed === '') {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}
