'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/shared/ui/button';

type IngredientSelectionBarProps = {
  selectedCount: number;
  onAddSelected: () => void;
};

export const IngredientSelectionBar = ({
  selectedCount,
  onAddSelected,
}: IngredientSelectionBarProps) => {
  return (
    <div className='sticky bottom-0 -mx-[18px] -mb-[18px] mt-4 border-t border-border bg-card/95 px-[18px] py-3 backdrop-blur-sm'>
      <Button
        className='w-full'
        disabled={selectedCount === 0}
        onClick={onAddSelected}
        type='button'
      >
        <ShoppingCart className='size-4' />
        Добавить {selectedCount} в корзину
      </Button>
    </div>
  );
};
