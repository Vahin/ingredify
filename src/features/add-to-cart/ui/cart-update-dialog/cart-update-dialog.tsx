'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';

type CartUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previousQuantity: number;
  nextQuantity: number;
  unitLabel: string;
  onConfirm: () => void;
};

const CART_UPDATE_TOAST_ID = 'cart-update-toast';

export const CartUpdateDialog = ({
  open,
  onOpenChange,
  previousQuantity,
  nextQuantity,
  unitLabel,
  onConfirm,
}: CartUpdateDialogProps) => {
  const onConfirmRef = useRef(onConfirm);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onConfirmRef.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    return () => {
      toast.dismiss(CART_UPDATE_TOAST_ID);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      toast.dismiss(CART_UPDATE_TOAST_ID);
      return;
    }

    const closeToast = () => {
      onOpenChangeRef.current(false);
      toast.dismiss(CART_UPDATE_TOAST_ID);
    };

    toast.custom(
      () => (
        <div className='w-full rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg'>
          <div className='space-y-1.5'>
            <p className='text-sm font-semibold'>Обновить корзину?</p>
            <p className='text-sm leading-5 text-secondary'>
              Количество изменилось: {previousQuantity} → {nextQuantity}{' '}
              {unitLabel}. Обновить количества ингредиентов в корзине?
            </p>
          </div>
          <div className='mt-3 flex flex-wrap justify-end gap-2'>
            <Button
              onClick={closeToast}
              size='sm'
              type='button'
              variant='outline'
            >
              Оставить как есть
            </Button>
            <Button
              onClick={() => {
                closeToast();
                onConfirmRef.current();
              }}
              size='sm'
              type='button'
            >
              Обновить
            </Button>
          </div>
        </div>
      ),
      {
        id: CART_UPDATE_TOAST_ID,
        duration: Infinity,
        dismissible: false,
        position: 'bottom-right',
        unstyled: true,
      },
    );
  }, [nextQuantity, open, previousQuantity, unitLabel]);

  return null;
};
