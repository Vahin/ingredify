
import { IngredientSticker, type RecipeIngredientLine } from '@/entities/ingredient';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui';
import { IngredientName } from '../ingredient-name/ingredient-name';
import { IngredientAmount } from '../ingredient-amount/ingredient-amount';

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
        'grid items-center gap-2 rounded-[10px] border border-border border-l-[3px] border-l-transparent bg-card py-1.5 px-2 shadow-sm',
        'grid-cols-[32px_minmax(0,1fr)_auto]',
        isSelectionMode && isSelected && 'border-l-accent',
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
      <div className='grid size-8 place-items-center'>
        {isSelectionMode
          ? <Checkbox isLocked={isLocked} isSelected={isSelected} />
          : <IngredientSticker src={line.sticker} />}
      </div>
      <IngredientName name={line.name} linkedRecipeId={line.linkedRecipeId} />
      <IngredientAmount
        amountValue={line.amountValue}
        unitLabel={line.unit.label}
      />
    </div>
  );
};
