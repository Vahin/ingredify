'use client';

import Link from 'next/link';
import { CheckIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { RecipeIngredientLine } from '@/entities/ingredient/model/types/recipe-ingredient-line';
import { IngredientSticker } from '@/entities/ingredient';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import {
  INGREDIENT_ROW_ID_ATTRIBUTE,
  INGREDIENT_STICKER_ATTRIBUTE,
} from '../../model/constants/ingredient-sidebar-dom';

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

type IngredientSidebarRowProps = {
  line: RecipeIngredientLine;
  isInCart?: boolean;
  selection?: {
    enabled: boolean;
    isSelected: boolean;
    isLocked: boolean;
    onToggle?: () => void;
  };
};

const SelectionCheckbox = ({
  isSelected,
  isLocked,
}: {
  isSelected: boolean;
  isLocked: boolean;
}) => (
  <Checkbox
    checked={isSelected}
    className='pointer-events-none'
    disabled={isLocked}
    tabIndex={-1}
  />
);

const InCartIndicator = () => (
  <span
    aria-label='В корзине'
    className='flex size-4 items-center justify-center text-accent'
  >
    <CheckIcon className='size-3.5' strokeWidth={2.5} />
  </span>
);

const renderLeadingSlot = ({
  isSelectionMode,
  isSelected,
  isLocked,
  isInCart,
}: {
  isSelectionMode: boolean;
  isSelected: boolean;
  isLocked: boolean;
  isInCart: boolean;
}) => {
  if (isSelectionMode) {
    return (
      <SelectionCheckbox isLocked={isLocked} isSelected={isSelected} />
    );
  }

  if (isInCart) {
    return <InCartIndicator />;
  }

  return null;
};

export const IngredientSidebarRow = ({
  line,
  isInCart = false,
  selection,
}: IngredientSidebarRowProps) => {
  const isSelectionMode = selection?.enabled ?? false;
  const isSelected = selection?.isSelected ?? false;
  const isLocked = selection?.isLocked ?? false;
  const onToggle = selection?.onToggle;
  const interactive = isSelectionMode && Boolean(onToggle) && !isLocked;
  const showLeadingSlot = isSelectionMode || isInCart;
  const rowAnimationAttributes: Record<string, string> = {
    [INGREDIENT_ROW_ID_ATTRIBUTE]: line.id,
  };
  const stickerAnimationAttributes: Record<string, string> = {
    [INGREDIENT_STICKER_ATTRIBUTE]: '',
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onToggle?.();
  };

  return (
    <div
      className={cn(
        'grid items-center gap-3 rounded-[10px] border border-border border-l-[3px] border-l-transparent bg-card py-2.5 pr-3 pl-3.5 shadow-sm transition-colors',
        showLeadingSlot
          ? 'grid-cols-[28px_32px_minmax(0,1fr)_auto]'
          : 'grid-cols-[32px_minmax(0,1fr)_auto]',
        isSelectionMode && 'border-l-accent',
        isSelected && 'bg-accent/6',
        isInCart && !isSelectionMode && 'border-l-accent-hover',
        interactive && 'cursor-pointer',
        interactive && !isSelected && 'hover:bg-muted',
      )}
      {...rowAnimationAttributes}
      aria-pressed={interactive ? isSelected : undefined}
      onClick={interactive ? onToggle : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {showLeadingSlot
        ? renderLeadingSlot({
            isSelectionMode,
            isSelected,
            isLocked,
            isInCart,
          })
        : null}
      <div {...stickerAnimationAttributes}>
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
