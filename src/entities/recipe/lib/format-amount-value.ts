/** Единицы, для которых количество показываем целым (граммы, миллилитры и т.п.) */
const INTEGER_ROUNDABLE_UNIT_SHORT_NAMES = new Set(['г', 'мл']);

export type FormatAmountValueOptions = {
  unitShortName?: string;
};

function shouldRoundToInteger(unitShortName: string | undefined): boolean {
  return (
    unitShortName !== undefined &&
    INTEGER_ROUNDABLE_UNIT_SHORT_NAMES.has(unitShortName)
  );
}

/** Форматирование числовой части количества для UI */
export function formatAmountValue(
  quantity: number,
  options?: FormatAmountValueOptions,
): string {
  if (shouldRoundToInteger(options?.unitShortName)) {
    return String(Math.round(quantity));
  }

  return Number.isInteger(quantity) || quantity % 1 === 0
    ? String(Math.round(quantity))
    : String(Math.round(quantity * 100) / 100);
}
