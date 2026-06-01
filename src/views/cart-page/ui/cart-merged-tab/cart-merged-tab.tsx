'use client';

import { mergeCartItems, type CartItemView } from '@/entities/cart';
import { CartItemRow } from '@/entities/cart';
import { Button } from '@/shared/ui/button';

type CartMergedTabProps = {
  items: CartItemView[];
  onRemoveMerged: (sourceItemIds: string[]) => void;
};

export const CartMergedTab = ({ items, onRemoveMerged }: CartMergedTabProps) => {
  const mergedItems = mergeCartItems(items);

  return (
    <div className='flex flex-col gap-2'>
      {mergedItems.map((item) => (
        <CartItemRow
          actions={
            <Button
              onClick={() => onRemoveMerged(item.sourceItemIds)}
              size='xs'
              type='button'
              variant='ghost'
            >
              Удалить
            </Button>
          }
          item={{
            id: item.mergeKey,
            sourceRecipeId: null,
            recipeIngredientId: null,
            name: item.name,
            sticker: item.sticker,
            quantity: item.quantity,
            amountValue: item.amountValue,
            unit: item.unit,
            unitId: item.unitId,
            isSubRecipe: item.isSubRecipe,
          }}
          key={item.mergeKey}
        />
      ))}
    </div>
  );
};
