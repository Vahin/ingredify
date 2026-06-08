import type { AddItemsResult } from '@/entities/cart';
import { toast } from 'sonner';

export function showCartAddToasts(
  result: AddItemsResult,
  options?: { emptyMessage?: string },
) {
  if (result.addedItems.length === 0) {
    toast.info(options?.emptyMessage ?? 'Ингредиенты уже в корзине');
    return;
  }

  const count = result.addedItems.length;

  if (count === 1) {
    toast.success('1 ингредиент добавлен в корзину');
    return;
  }

  toast.success(`${count} ингредиентов добавлено в корзину`);
}

export function showCartUpdatedToast(updatedCount: number) {
  if (updatedCount === 0) {
    return;
  }

  toast.success('Количества в корзине обновлены');
}

export function showCartRemovedToast() {
  toast.success('Ингредиент убран из корзины');
}
