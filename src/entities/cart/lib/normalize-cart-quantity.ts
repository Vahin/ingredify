import type { MeasurementUnitView } from '@/entities/recipe/model/types/measurement-unit';
import { normalizeAmountQuantity } from '@/entities/recipe/lib/format-amount-value';

const QUANTITY_EPSILON = 0.001;

/** Нормализует количество для хранения и сравнения в корзине */
export function normalizeCartQuantity(
  quantity: number,
  unit: Pick<MeasurementUnitView, 'roundToInteger' | 'shortName'>,
): number {
  return normalizeAmountQuantity(quantity, unit);
}

/** Проверяет, что delta практически равна нулю */
export function isCartDeltaZero(delta: number): boolean {
  return Math.abs(delta) < QUANTITY_EPSILON;
}

export { QUANTITY_EPSILON };
