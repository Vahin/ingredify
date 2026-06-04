'use client';

import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';

type IngredientSelectionBarProps = {
  selectedCount: number;
  onAddSelected: () => void;
  onCancelSelection: () => void;
};

export const IngredientSelectionBar = ({
  selectedCount,
  onAddSelected,
  onCancelSelection,
}: IngredientSelectionBarProps) => {
  return (
    <div className='sticky bottom-0 -mx-[18px] -mb-[18px] mt-4 border-t border-border bg-card/95 px-[18px] py-3 backdrop-blur-sm'>
      <div className='grid grid-cols-[minmax(0,1fr)_auto] gap-2'>
        <Button
          className='w-full'
          disabled={selectedCount === 0}
          onClick={onAddSelected}
          type='button'
        >
          <ShoppingCart className='size-4' />
          Добавить {selectedCount} в корзину
        </Button>
        <Button
          aria-label='Отменить выбор'
          onClick={onCancelSelection}
          size='icon'
          title='Отменить выбор'
          type='button'
          variant='outline'
        >
          <X className='size-4' />
        </Button>
      </div>
    </div>
  );
};
