'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

type CartUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previousQuantity: number;
  nextQuantity: number;
  unitLabel: string;
  onConfirm: () => void;
};

export const CartUpdateDialog = ({
  open,
  onOpenChange,
  previousQuantity,
  nextQuantity,
  unitLabel,
  onConfirm,
}: CartUpdateDialogProps) => {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Обновить корзину?</AlertDialogTitle>
          <AlertDialogDescription>
            Количество изменилось: {previousQuantity} → {nextQuantity}{' '}
            {unitLabel}. Обновить количества ингредиентов в корзине?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Оставить как есть</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Обновить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
