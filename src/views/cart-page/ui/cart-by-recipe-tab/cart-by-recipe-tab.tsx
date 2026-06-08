'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { CartItemView, SessionCart } from '@/entities/cart';
import { CartItemRow } from '@/entities/cart';
import { Button } from '@/shared/ui/button';

type CartByRecipeTabProps = {
  cart: SessionCart;
  onRemoveItem: (itemId: string) => void;
};

export const CartByRecipeTab = ({ cart, onRemoveItem }: CartByRecipeTabProps) => {
  const groups = useMemo(() => groupItemsByRecipe(cart), [cart]);

  return (
    <div className='flex flex-col gap-4'>
      {groups.map((group) => (
        <section className='flex flex-col gap-2' key={group.recipeId}>
          <div className='flex items-center justify-between gap-3 px-1'>
            <h2 className='truncate text-sm font-semibold text-foreground'>
              {group.recipeTitle}
            </h2>
            <Link
              className='shrink-0 text-xs text-secondary underline-offset-2 hover:underline'
              href={`/recipes/${group.recipeId}`}
            >
              К рецепту
            </Link>
          </div>
          <div className='flex flex-col gap-2'>
            {group.items.map((item) => (
              <CartItemRow
                actions={
                  <Button
                    onClick={() => onRemoveItem(item.id)}
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
        </section>
      ))}
    </div>
  );
};

function groupItemsByRecipe(cart: SessionCart) {
  const recipeMeta = new Map(
    cart.recipeSyncs.map((sync) => [
      sync.recipeId,
      sync.recipeTitle ?? `Рецепт ${sync.recipeId.slice(0, 6)}`,
    ]),
  );

  const grouped = new Map<string, CartItemView[]>();

  for (const item of cart.items) {
    if (!item.sourceRecipeId) {
      continue;
    }

    const existing = grouped.get(item.sourceRecipeId) ?? [];
    existing.push(item);
    grouped.set(item.sourceRecipeId, existing);
  }

  return [...grouped.entries()].map(([recipeId, items]) => ({
    recipeId,
    recipeTitle: recipeMeta.get(recipeId) ?? `Рецепт ${recipeId.slice(0, 6)}`,
    items,
  }));
}
