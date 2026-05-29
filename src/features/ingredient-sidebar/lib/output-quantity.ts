import { isPortionOutput } from '@/entities/recipe/lib/is-portion-output';
import type { RecipeOutput } from '@/entities/recipe/model/types/recipe-output';

const MIN_OUTPUT_QUANTITY = 1;
const MAX_PORTION_OUTPUT = 99;
const MAX_OTHER_OUTPUT = 9999;

/** Базовое количество выхода рецепта для расчёта коэффициента масштабирования */
export function getBaseOutputQuantity(output: RecipeOutput): number {
  const quantity = output.quantity;

  if (isPortionOutput(output)) {
    return Math.max(MIN_OUTPUT_QUANTITY, Math.round(quantity));
  }

  return Math.max(MIN_OUTPUT_QUANTITY, quantity);
}

/** Начальное выбранное количество (для state) */
export function getInitialSelectedOutputQuantity(output: RecipeOutput): number {
  return normalizeOutputQuantity(
    getBaseOutputQuantity(output),
    output.unitShortName,
  );
}

/** Верхняя граница выхода в UI */
export function getMaxOutputQuantity(output: RecipeOutput): number {
  return isPortionOutput(output) ? MAX_PORTION_OUTPUT : MAX_OTHER_OUTPUT;
}

/** Нормализация значения под единицу измерения */
export function normalizeOutputQuantity(
  value: number,
  unitShortName: string,
): number {
  if (
    unitShortName === 'г' ||
    unitShortName === 'мл' ||
    unitShortName === 'порц.'
  ) {
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

  return normalizeOutputQuantity(clamped, output.unitShortName);
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
