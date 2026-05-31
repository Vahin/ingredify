'use client';

import Link from 'next/link';
import type { RecipeIngredientLine } from '../../model/types/recipe-ingredient-line';
import { IngredientSticker } from '../ingredient-sticker/ingredient-sticker';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';

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
        onClick={(event) => event.stopPropagation()}
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

type IngredientRowProps = {
  line: RecipeIngredientLine;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
};

export const IngredientRow = ({
  line,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
}: IngredientRowProps) => {
  const interactive = isSelectionMode && onToggleSelect;

  return (
    <div
      className={cn(
        'grid items-center gap-3 rounded-[10px] p-2.5 transition-colors',
        isSelectionMode
          ? 'grid-cols-[28px_32px_minmax(0,1fr)_auto] cursor-pointer'
          : 'grid-cols-[32px_minmax(0,1fr)_auto]',
        interactive && 'hover:bg-muted',
        isSelected && 'bg-muted/80',
      )}
      data-ingredient-row-id={line.id}
      onClick={interactive ? onToggleSelect : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onToggleSelect();
              }
            }
          : undefined
      }
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {isSelectionMode ? (
        <Checkbox
          checked={isSelected}
          className='pointer-events-none'
          tabIndex={-1}
        />
      ) : null}
      <div data-ingredient-sticker>
        <IngredientSticker src={line.sticker} />
      </div>
      <IngredientName name={line.name} linkedRecipeId={line.linkedRecipeId} />
      <IngredientAmount
        amountValue={line.amountValue}
        unitLabel={line.unit.label}
      />
    </div>
  );
};
