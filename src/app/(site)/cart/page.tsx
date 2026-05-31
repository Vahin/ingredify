import type { Metadata } from 'next';
import { CartPage } from '@/views/cart-page';

export const metadata: Metadata = {
  title: 'Корзина',
};

export default function CartRoutePage() {
  return (
    <main className='mx-auto w-full max-w-[640px] px-4 py-10 md:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-foreground'>Корзина</h1>
        <p className='mt-1 text-sm text-secondary'>
          Список ингредиентов для покупки
        </p>
      </div>
      <CartPage />
    </main>
  );
}
