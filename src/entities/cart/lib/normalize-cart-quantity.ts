import type { MeasurementUnitView } from '@/entities/recipe/model/types/measurement-unit';

const QUANTITY_EPSILON = 0.001;

/** Нормализует количество для хранения и сравнения в корзине */
export function normalizeCartQuantity(
  quantity: number,
  unit: Pick<MeasurementUnitView, 'roundToInteger'>,
): number {
  if (unit.roundToInteger) {
    return Math.round(quantity);
  }

  return Math.round(quantity * 100) / 100;
}

/** Проверяет, что delta практически равна нулю */
export function isCartDeltaZero(delta: number): boolean {
  return Math.abs(delta) < QUANTITY_EPSILON;
}

export { QUANTITY_EPSILON };
