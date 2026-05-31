'use client';

import { MoreVertical, ShoppingCart, SquareCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

type IngredientSidebarMenuProps = {
  isSelectionMode: boolean;
  onAddAllToCart: () => void;
  onToggleSelectionMode: () => void;
};

export const IngredientSidebarMenu = ({
  isSelectionMode,
  onAddAllToCart,
  onToggleSelectionMode,
}: IngredientSidebarMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='Действия с ингредиентами'
          className='size-8 shrink-0'
          size='icon-sm'
          type='button'
          variant='ghost'
        >
          <MoreVertical className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={onAddAllToCart}>
          <ShoppingCart className='size-4' />
          В корзину
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleSelectionMode}>
          <SquareCheck className='size-4' />
          {isSelectionMode ? 'Отменить выбор' : 'Выбор'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
