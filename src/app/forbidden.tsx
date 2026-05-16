import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export default function Forbidden() {
  return (
    <main className='mx-auto flex min-h-[50vh] w-full max-w-[480px] flex-col items-center justify-center px-4 py-16 text-center'>
      <h1 className='text-2xl font-bold text-foreground'>403 — Доступ запрещён</h1>
      <p className='mt-3 text-secondary'>
        Вы не можете редактировать этот рецепт.
      </p>
      <Button asChild variant='outline' className='mt-6'>
        <Link href='/'>На главную</Link>
      </Button>
    </main>
  );
}
