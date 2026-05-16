import type { Metadata } from 'next';
import { verifySession } from '@/shared/lib/auth';
import { LogoutButton } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Профиль',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function ProfilePage() {
  const user = await verifySession();

  return (
    <main className='mx-auto w-full max-w-[640px] px-4 py-10 md:px-6'>
      <div className='rounded-2xl border border-border bg-card p-6 md:p-8'>
        <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Профиль</h1>
            <p className='mt-1 text-sm text-secondary'>
              Данные аккаунта (редактирование появится позже)
            </p>
          </div>
          <LogoutButton />
        </div>

        <dl className='grid gap-4'>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wide text-secondary'>
              Имя
            </dt>
            <dd className='mt-1 text-base text-foreground'>{user.name}</dd>
          </div>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wide text-secondary'>
              Email
            </dt>
            <dd className='mt-1 text-base text-foreground'>{user.email}</dd>
          </div>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wide text-secondary'>
              Дата регистрации
            </dt>
            <dd className='mt-1 text-base text-foreground'>
              {formatDate(user.createdAt)}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
