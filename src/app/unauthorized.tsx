import Link from 'next/link';
import { getLoginRedirectPath } from '@/shared/lib/auth';
import { Button } from '@/shared/ui/button';

export default async function Unauthorized() {
  const loginHref = await getLoginRedirectPath();

  return (
    <main className='mx-auto flex min-h-[50vh] w-full max-w-[480px] flex-col items-center justify-center px-4 py-16 text-center'>
      <h1 className='text-2xl font-bold text-foreground'>401 — Нужен вход</h1>
      <p className='mt-3 text-secondary'>
        Войдите в аккаунт, чтобы открыть эту страницу.
      </p>
      <Button asChild className='mt-6'>
        <Link href={loginHref}>Войти</Link>
      </Button>
    </main>
  );
}
