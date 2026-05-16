import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Вход',
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <>
      <h1 className='mb-6 text-2xl font-bold text-foreground'>Вход</h1>
      <LoginForm next={next} />
    </>
  );
}
