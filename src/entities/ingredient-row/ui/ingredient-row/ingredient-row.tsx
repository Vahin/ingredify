
import { IngredientSticker, type RecipeIngredientLine } from '@/entities/ingredient';
import { cn } from '@/shared/lib/utils';
import { Checkbox, InCartIndicator } from '@/shared/ui';
import { CheckIcon } from 'lucide-react';
import { IngredientName } from '../ingredient-name/ingredient-name';
import { IngredientAmount } from '../ingredient-amount/ingredient-amount';
import { LeadingSlot } from '../leading-slot/leading-slot';

type IngredientRowProps = {
  line: RecipeIngredientLine;
  isInCart?: boolean;
  selection?: {
    enabled: boolean;
    isSelected: boolean;
    isLocked: boolean;
    onToggle?: () => void;
  };
};

export const IngredientRow = ({
  line,
  isInCart = false,
  selection,
}: IngredientRowProps) => {
  const isSelectionMode = selection?.enabled ?? false;
  const isSelected = selection?.isSelected ?? false;
  const isLocked = selection?.isLocked ?? false;
  const onToggle = selection?.onToggle;
  const interactive = isSelectionMode && Boolean(onToggle) && !isLocked;
  const showLeadingSlot = isSelectionMode || isInCart;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onToggle?.();
  };

  return (
    <div
      className={cn(
        'grid items-center gap-3 rounded-[10px] border border-border border-l-[3px] border-l-transparent bg-card py-2.5 pr-3 pl-3.5 shadow-sm',
        showLeadingSlot
          ? 'grid-cols-[28px_32px_minmax(0,1fr)_auto]'
          : 'grid-cols-[32px_minmax(0,1fr)_auto]',
        isSelectionMode && 'border-l-accent',
        isSelected && 'bg-accent/6',
        isInCart && !isSelectionMode && 'border-l-accent-hover',
        interactive && 'cursor-pointer',
        interactive && !isSelected && 'hover:bg-muted',
      )}
      aria-pressed={interactive ? isSelected : undefined}
      onClick={interactive ? onToggle : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {showLeadingSlot
        ? <LeadingSlot isSelectionMode={isSelectionMode} isSelected={isSelected} isLocked={isLocked} isInCart={isInCart} />
        : null}
      <div>
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
