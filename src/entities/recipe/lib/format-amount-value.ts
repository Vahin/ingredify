export type FormatAmountValueOptions = {
  roundToInteger?: boolean;
};

/** Форматирование числовой части количества для UI */
export function formatAmountValue(
  quantity: number,
  options?: FormatAmountValueOptions,
): string {
  if (options?.roundToInteger) {
    return String(Math.round(quantity));
  }

  return Number.isInteger(quantity) || quantity % 1 === 0
    ? String(Math.round(quantity))
    : String(Math.round(quantity * 100) / 100);
}
