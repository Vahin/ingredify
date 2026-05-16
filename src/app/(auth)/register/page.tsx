import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Регистрация',
};

export default function RegisterPage() {
  return (
    <>
      <h1 className='mb-6 text-2xl font-bold text-foreground'>Регистрация</h1>
      <RegisterForm />
    </>
  );
}
