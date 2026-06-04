export const IngredientAmount = ({
  amountValue,
  unitLabel,
}: {
  amountValue: string;
  unitLabel: string;
}) => {
  return (
    <span className='whitespace-nowrap font-mono text-xs tabular-nums text-secondary'>
      <span>{amountValue}</span>
      <span className='ml-1'>{unitLabel}</span>
    </span>
  );
};