import Link from 'next/link';
import type { RecipeIngredientLine } from '@/entities/ingredient/model/types/recipe-ingredient-line';
import { IngredientSticker } from '@/entities/ingredient';

const IngredientName = ({
  name,
  linkedRecipeId,
}: {
  name: string;
  linkedRecipeId?: string;
}) => {
  if (linkedRecipeId) {
    return (
      <Link
        className='min-w-0 text-sm font-semibold text-foreground underline-offset-2 hover:underline'
        href={`/recipes/${linkedRecipeId}`}
      >
        {name}
      </Link>
    );
  }
  return (
    <span className='min-w-0 text-sm font-semibold text-foreground'>
      {name}
    </span>
  );
};

const IngredientAmount = ({
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

export const IngredientRow = ({
  line,
}: {
  line: RecipeIngredientLine;
}) => {
  return (
    <div className='grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] p-2.5 transition-colors hover:bg-muted'>
      <IngredientSticker src={line.sticker} />
      <IngredientName
        name={line.name}
        linkedRecipeId={line.linkedRecipeId}
      />
      <IngredientAmount
        amountValue={line.amountValue}
        unitLabel={line.unit.label}
      />
    </div>
  );
};
