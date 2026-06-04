import { IngredientSticker, type RecipeIngredientLine } from '@/entities/ingredient';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import { Loader2, X } from 'lucide-react';
import { IngredientName } from '../ingredient-name/ingredient-name';
import { IngredientAmount } from '../ingredient-amount/ingredient-amount';
import {
  INGREDIENT_ROW_ID_ATTRIBUTE,
  INGREDIENT_STICKER_ATTRIBUTE,
} from '../../model/constants/ingredient-sidebar-dom';

type IngredientRowProps = {
  line: RecipeIngredientLine;
  isInCart?: boolean;
  isRemovingFromCart?: boolean;
  onRemoveFromCart?: () => void;
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
  isRemovingFromCart = false,
  onRemoveFromCart,
  selection,
}: IngredientRowProps) => {
  const isSelectionMode = selection?.enabled ?? false;
  const isSelected = selection?.isSelected ?? false;
  const isLocked = selection?.isLocked ?? false;
  const onToggle = selection?.onToggle;
  const interactive = isSelectionMode && Boolean(onToggle) && !isLocked;
  const canRemoveFromCart = isInCart && Boolean(onRemoveFromCart);
  const ingredientHref = isSelectionMode ? undefined : `/ingredients/${line.ingredientId}`;
  const rowDataAttributes = { [INGREDIENT_ROW_ID_ATTRIBUTE]: line.id };
  const stickerDataAttributes = { [INGREDIENT_STICKER_ATTRIBUTE]: '' };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onToggle?.();
  };

  const handleRemoveFromCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemoveFromCart?.();
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
      {...rowDataAttributes}
    >
      <div className='grid size-8 place-items-center'>
        {canRemoveFromCart ? (
          <span className='group relative grid size-8 place-items-center'>
            <span
              className={cn(
                'transition-opacity',
                isRemovingFromCart
                  ? 'opacity-0'
                  : 'opacity-100 group-hover:opacity-0 group-focus-within:opacity-0',
              )}
              {...stickerDataAttributes}
            >
              <IngredientSticker src={line.sticker} />
            </span>
            <Button
              aria-label={`Убрать ${line.name} из корзины`}
              className={cn(
                'absolute inset-0 size-8 bg-transparent text-destructive transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100',
                isRemovingFromCart
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
              )}
              disabled={isRemovingFromCart}
              onClick={handleRemoveFromCart}
              size='icon-sm'
              title='Убрать из корзины'
              type='button'
              variant='ghost'
            >
              {isRemovingFromCart ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <X className='size-4' />
              )}
            </Button>
          </span>
        ) : isSelectionMode ? (
          <Checkbox isLocked={isLocked} isSelected={isSelected} />
        ) : (
          <span {...stickerDataAttributes}>
            <IngredientSticker src={line.sticker} />
          </span>
        )}
      </div>
      <IngredientName href={ingredientHref} name={line.name} />
      <IngredientAmount
        amountValue={line.amountValue}
        unitLabel={line.unit.label}
      />
    </div>
  );
};
