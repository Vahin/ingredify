'use client';

import { CartItemRow } from '@/entities/cart';
import { useCart } from '@/features/add-to-cart';
import { Button } from '@/shared/ui/button';

export const CartPage = () => {
  const { cart, removeItem } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className='rounded-2xl border border-border bg-card p-8 text-center'>
        <p className='text-base font-semibold text-foreground'>Корзина пуста</p>
        <p className='mt-2 text-sm text-secondary'>
          Добавьте ингредиенты из рецепта через меню в сайдбаре.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {cart.items.map((item) => (
        <CartItemRow
          actions={
            <Button
              onClick={() => void removeItem(item.id)}
              size='xs'
              type='button'
              variant='ghost'
            >
              Удалить
            </Button>
          }
          item={item}
          key={item.id}
        />
      ))}
    </div>
  );
};
