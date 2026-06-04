'use client';

import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import CartIcon from '@/shared/ui/in-cart-indicator/cart.svg';

type IngredientSidebarMenuProps = {
  onAddAllToCart: () => void;
};

export const IngredientSidebarMenu = ({
  onAddAllToCart,
}: IngredientSidebarMenuProps) => {
  return (
    <Button
      aria-label='Добавить все ингредиенты в корзину'
      className='size-8 shrink-0 text-accent-hover hover:bg-accent/10 hover:text-accent-hover'
      onClick={onAddAllToCart}
      size='icon-sm'
      title='Добавить все ингредиенты в корзину'
      type='button'
      variant='ghost'
    >
      <Icon SVG={CartIcon} className='size-5' />
    </Button>
  );
};
