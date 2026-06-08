import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { INGREDIENT_STICKER_ATTRIBUTE } from '../../model/constants/ingredient-sidebar-dom';
import { IngredientSticker } from '@/entities/ingredient';
import { Loader2, X } from 'lucide-react';
import { Icon } from '@/shared/ui/icon';
import CartIcon from '@/shared/ui/in-cart-indicator/cart.svg';

interface InteractiveStickerProps {
  name: string;
  sticker: string;
  isRemovingFromCart: boolean;
  isAddingToCart?: boolean;
  isInCart?: boolean;
  onAddToCart?: () => void;
  onRemoveFromCart?: () => void;
}

export const InteractiveSticker = (props: InteractiveStickerProps) => {
  const {
    name,
    sticker,
    isRemovingFromCart,
    isAddingToCart,
    isInCart = false,
    onAddToCart,
    onRemoveFromCart,
  } = props;

  const canAddToCart = !isInCart && Boolean(onAddToCart);
  const canRemoveFromCart = isInCart && Boolean(onRemoveFromCart);

  const stickerDataAttributes = { [INGREDIENT_STICKER_ATTRIBUTE]: '' };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAddToCart?.();
  };

  const handleRemoveFromCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemoveFromCart?.();
  };

  return (
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
            <IngredientSticker src={sticker} />
          </span>
          <Button
            aria-label={`Убрать ${name} из корзины`}
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
      ) : canAddToCart ? (
        <span className='group relative grid size-8 place-items-center'>
          <span
            className={cn(
              'transition-opacity',
              isAddingToCart
                ? 'opacity-0'
                : 'opacity-100 group-hover:opacity-0 group-focus-within:opacity-0',
            )}
            {...stickerDataAttributes}
          >
            <IngredientSticker src={sticker} />
          </span>
          <Button
            aria-label={`Добавить ${name} в корзину`}
            className={cn(
              'absolute inset-0 size-8 bg-transparent text-accent-hover transition-opacity hover:bg-accent/10 hover:text-accent-hover focus-visible:opacity-100',
              isAddingToCart
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
            )}
            disabled={isAddingToCart}
            onClick={handleAddToCart}
            size='icon-sm'
            title='Добавить в корзину'
            type='button'
            variant='ghost'
          >
            {isAddingToCart ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Icon SVG={CartIcon} className='size-5' />
            )}
          </Button>
        </span>
      ) : (
        <span {...stickerDataAttributes}>
          <IngredientSticker src={sticker} />
        </span>
      )}
    </div>
  );
};
