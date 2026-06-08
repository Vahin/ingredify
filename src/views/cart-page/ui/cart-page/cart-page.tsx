'use client';

import { useCartStore } from '@/features/add-to-cart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { CartByRecipeTab } from '../cart-by-recipe-tab/cart-by-recipe-tab';
import { CartMergedTab } from '../cart-merged-tab/cart-merged-tab';

export const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const removeItems = useCartStore((state) => state.removeItems);

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
    <Tabs defaultValue='by-recipe'>
      <TabsList>
        <TabsTrigger value='by-recipe'>По рецептам</TabsTrigger>
        <TabsTrigger value='merged'>Общий список</TabsTrigger>
      </TabsList>
      <TabsContent value='by-recipe'>
        <CartByRecipeTab
          cart={cart}
          onRemoveItem={(itemId) => void removeItem(itemId)}
        />
      </TabsContent>
      <TabsContent value='merged'>
        <CartMergedTab
          items={cart.items}
          onRemoveMerged={(itemIds) => void removeItems(itemIds)}
        />
      </TabsContent>
    </Tabs>
  );
};
