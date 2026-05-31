import type { ApplyCartDeltaResult } from '@/entities/cart';
import { toast } from 'sonner';

export function showCartAddToasts(
  result: ApplyCartDeltaResult,
  options?: { selectionCount?: number },
) {
  if (result.isAlreadySynced) {
    toast.info('Ингредиенты уже в корзине с этим количеством');
    return;
  }

  if (result.changes.length === 0) {
    return;
  }

  const summary = result.changes
    .slice(0, 3)
    .map((change) => {
      const sign = change.delta > 0 ? '+' : '−';
      return `${sign}${change.amountValue} ${change.unitLabel} ${change.name}`;
    })
    .join(', ');

  const suffix =
    result.changes.length > 3 ? ` и ещё ${result.changes.length - 3}` : '';

  if (result.changes.every((change) => change.delta > 0) && result.changes.length > 1) {
    toast.success(
      `${options?.selectionCount ?? result.addedCount} ингредиентов добавлено в корзину`,
    );
    return;
  }

  toast.success(`Обновлено: ${summary}${suffix}`);
}

export function showOutputQuantityChangedToast(
  previousQuantity: number,
  nextQuantity: number,
  unitLabel: string,
) {
  toast.message('Количество изменилось', {
    description: `${previousQuantity} → ${nextQuantity} ${unitLabel}. Нажмите «В корзину», чтобы обновить.`,
  });
}
