import type { MeasurementUnitView } from '../model/types/measurement-unit';

type AmountUnit = Pick<MeasurementUnitView, 'roundToInteger' | 'shortName'>;

const HALF_STEP_UNIT_SHORT_NAMES = new Set<AmountUnit['shortName']>([
  'ч.л.',
  'ст.л.',
]);
const HALF_STEP_QUANTITY = 0.5;

function roundToStep(quantity: number, step: number): number {
  const rounded = Math.round(quantity / step) * step;

  return Math.round(rounded * 100) / 100;
}

function isHalfStepUnit(unit: AmountUnit): boolean {
  return HALF_STEP_UNIT_SHORT_NAMES.has(unit.shortName);
}

/** Нормализация количества под правила единицы измерения */
export function normalizeAmountQuantity(
  quantity: number,
  unit: AmountUnit,
): number {
  if (isHalfStepUnit(unit)) {
    return Math.max(HALF_STEP_QUANTITY, roundToStep(quantity, HALF_STEP_QUANTITY));
  }

  if (unit.roundToInteger) {
    return Math.round(quantity);
  }

  return Math.round(quantity * 100) / 100;
}

/** Форматирование числовой части количества для UI */
export function formatAmountValue(
  quantity: number,
  unit: AmountUnit,
): string {
  const normalizedQuantity = normalizeAmountQuantity(quantity, unit);

  return Number.isInteger(normalizedQuantity)
    ? String(Math.round(normalizedQuantity))
    : String(normalizedQuantity);
}
