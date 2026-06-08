import { cn } from '@/shared/lib/utils';
import { Button } from '../button';
import { IngredientSticker } from '@/entities/ingredient';
import { Loader2, X } from 'lucide-react';
import { Icon } from '../icon';
import CartIcon from '@/shared/ui/in-cart-indicator/cart.svg';

interface InteractiveStickerProps {
  variant: 'default' | 'adding' | 'removing';
  name: string;
  sticker: string;
  isPending?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const InteractiveSticker = (props: InteractiveStickerProps) => {
  const { variant, sticker, isPending, onClick } = props;

  if (variant === 'default') {
    return (
      <span>
        <IngredientSticker src={sticker} />
      </span>
    );
  }

  if (variant === 'removing') {
    return (
      <span className='group relative grid size-8 place-items-center'>
        <span
          className={cn(
            'transition-opacity',
            isPending
              ? 'opacity-0'
              : 'opacity-100 group-hover:opacity-0 group-focus-within:opacity-0',
          )}
        >
          <IngredientSticker src={sticker} />
        </span>
        <Button
          aria-label={`Убрать ${name} из корзины`}
          className={cn(
            'absolute inset-0 size-8 bg-transparent text-destructive transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100',
            isPending
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
          )}
          disabled={isPending}
          onClick={onClick}
          size='icon-sm'
          title='Убрать из корзины'
          type='button'
          variant='ghost'
        >
          {isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <X className='size-4' />
          )}
        </Button>
      </span>
    );
  }

  if (variant === 'adding') {
    return (
      <span className='group relative grid size-8 place-items-center'>
        <span
          className={cn(
            'transition-opacity',
            isPending
              ? 'opacity-0'
              : 'opacity-100 group-hover:opacity-0 group-focus-within:opacity-0',
          )}
        >
          <IngredientSticker src={sticker} />
        </span>
        <Button
          aria-label={`Добавить ${name} в корзину`}
          className={cn(
            'absolute inset-0 size-8 bg-transparent text-accent-hover transition-opacity hover:bg-accent/10 hover:text-accent-hover focus-visible:opacity-100',
            isPending
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
          )}
          disabled={isPending}
          onClick={onClick}
          size='icon-sm'
          title='Добавить в корзину'
          type='button'
          variant='ghost'
        >
          {isPending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Icon SVG={CartIcon} className='size-5' />
          )}
        </Button>
      </span>
    );
  }
};
