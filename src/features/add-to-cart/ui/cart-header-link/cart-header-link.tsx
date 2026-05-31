'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../model/cart-provider';
import { CART_HEADER_LINK_ID } from '../../model/lib/use-cart-fly-animation';
import { cn } from '@/shared/lib/utils';

export const CartHeaderLink = () => {
  const { itemCount } = useCart();

  return (
    <Link
      aria-label='Открыть корзину'
      className={cn(
        'relative grid size-[38px] place-items-center rounded-full border border-border bg-card text-secondary',
        'transition hover:-translate-y-px hover:bg-muted hover:text-foreground',
      )}
      href='/cart'
      id={CART_HEADER_LINK_ID}
    >
      <ShoppingCart className='size-[18px]' />
      {itemCount > 0 ? (
        <span className='absolute -top-1 -right-1 grid min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white'>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </Link>
  );
};
